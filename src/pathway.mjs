import { Utils } from './vendor/utils.min.mjs';
import { Logger } from './vendor/logger.min.mjs';
import { EasyStar } from './vendor/easystar-0.4.4.min.js';

/**
 * @todo Test on server
 * @todo Make debugging class
 * @private
 */
class PathwaySingleton {
	/**
	 * The maximum amount of ticks an instance can be in the same position before the pathfinder deems it "stuck". The user will be able to tweak values up to this max value.
	 * @private
	 * @type {number}
	 */
	static MAX_STUCK_COUNTER = 100;
	/**
	 * The max amount of delta time between ticks. If this limit is passed, it will be clamped.
	 * @private
	 * @type {number}
	 */
	static MAX_DELTA_TIME = 0.03333333333;
	/**
	 * The weight that indicates that this tile is walkable. This is used as the default weight of every instance unless otherwise stated.
	 * @private
	 * @type {number}
	 */
	static PASSABLE_WEIGHT = 0;
	/**
	 * A static weight to be applied when a tile should be not be traveled to at all.
	 * @private
	 * @type {number}
	 */
	static IMPASSABLE_WEIGHT = -1;
	/**
	 * The default amount of pixels per second to move the instance when using `position` mode.
	 * @private
	 * @type {number}
	 */
	static DEFAULT_PIXELS_PER_SECOND = 120;
	/**
	 * The default step size for this instance to use on the path.
	 * @private
	 * @type {number}
	 */
	static DEFAULT_STEP_SIZE = 2;
	/**
	 * The default step pixels per second to use.
	 * @private
	 * @type {number}
	 */
	static DEFAULT_STEP_PIXELS_PER_SECOND = 120;
	/**
	 * The base FPS to base calculations from.
	 * @private
	 * @type {number}
	 */
	static DEFAULT_BASE_FPS = 60;
	/**
	 * The minimum distance away from a node before this system determines it has made it to that node.
	 * @private
	 * @type {number}
	 */
	static DEFAULT_MINIMUM_DISTANCE = 2;
	/**
	 * The default mode this pathway system uses.
	 * @private
	 * @type {string}
	 */
	static DEFAULT_MODE = 'collision';
	/**
	 * An object that stores the map tiles in normal format and in 2D format.
	 * @private
	 * @type {Object}
	 */
	static storedMapTiles = {};
	/**
	 * The tile size to use if no tile size has been assigned.
	 * @private
	 * @type {number}
	 */
	static DEFAULT_TILE_SIZE = { width: 32, height: 32 };
	/**
	 * The tile size to use for this system.
	 * @private
	 * @type {Object}
	 */
	tileSize = { ...PathwaySingleton.DEFAULT_TILE_SIZE };
	/**
	 * The version of the module.
	 */
	version = "VERSION_REPLACE_ME";
	/**
	 * A weakmap storing the data of instances used in this pathfinder.
	 * @private
	 * @type {WeakMap}
	 */
	instanceWeakMap = new WeakMap();
	/**
	 * The last tracked time in the ticker.
	 * @private
	 * @type {number}
	 */
	lastTime = 0;
	/**
	 * The delta time between the current and last tick.
	 * @private
	 * @type {number}
	 */
	deltaTime = 0;
	/**
	 * The time in ms between the current and last tick.
	 * @private
	 * @type {number}
	 */
	elapsedMS = 0;
	/**
	 * An array of active instances that are currently pathfinding.
	 * @private
	 * @type {Array}
	 */
	activeInstances = [];
	/**
	 * @private
	 */
	constructor() {
        // Create a logger
        /** The logger module this module uses to log errors / logs
         * @private
         * @type {Object}
         */
        this.logger = new Logger();
        this.logger.registerType('Pathway-Module', '#ff6600');
	}
	/**
	 * Moves pInstance to the destination position with pOptions in mind.
	 * @param {Object} pInstance - The instance to move to the destination. The origin position will be retrived from this instance as well.
	 * @param {Object} pDestination - The end position to travel to.
	 * @property {number} pDestination.x - The end x coordinate.
	 * @property {number} pDestination.y - The end y coordinate.
	 * @param {Object} pOptions - An object of settings on how to move pInstance to pDestination.
	 * @property {boolean} [pOptions.diagonal = false] - Whether or not the pathfinder allows diagonal moves.
	 * @property {Array} pOptions.exclude - An array of diobs that will be excluded when calculating the path.
	 * @property {number} [pOptions.minDistance = 2] = The minimum distance this pathway system will use to calculate if you have reached the (next) node. This option should be considered for advanced users only. Use with caution as this can cause issues.   
	 * @property {number} [pOptions.maxStuckCounter = 100] - The maximum amount of ticks of pInstance being in the same position as the last tick before its considered stuck.
	 * @property {string} [pOptions.mode = 'collision'] - How this instance will move. `collision` for moving with collisions in mind (stepPos). `position` for moving with no collisions in mind (setPos) Must use pOptions.pixelsPerSecond when using `position` mode.  
	 * @property {string} [pOptions.pixelsPerSecond = 120] - The speed in pixels this instance moves per second. This setting only works when pOptions.mode is set to `position`.   
	 * @property {Function} pOptions.onPathComplete - Callback for when pInstance makes it to the destination node.
	 * @property {Function} pOptions.onPathFound - Callback for when pInstance finds a path.
	 * @property {Function} pOptions.onPathStuck - Callback for when pInstance gets stuck on a path.
	 * @property {Function} pOptions.onPathNotFound - Callback for when no path is found.
	 */
	to(pInstance, pDestination, pOptions) {
		if (typeof(pInstance) === 'object') {
			// If this instance is not on a map.
			if (!pInstance.mapName) {
				this.logger.prefix('Pathway-Module').error('Cannot generate a path. pInstance is not on a map.');
				return;
			}

			// If there is no destination object passed return.
			if (typeof(pDestination) !== 'object') {
				this.logger.prefix('Pathway-Module').error('Invalid type passed for pDestination. Expecting an object.');
				return;
			}

			// Get the instance data for this instance
			let instanceData = this.instanceWeakMap.get(pInstance);

			if (!instanceData) {
				// Set the instance data
				instanceData = {
					trajectory: { 
						angle: 0, 
						x: 0, 
						y: 0, 
						nextNodePos: null,
					},
					// The current position of the instance.
					currentPosition: { x: 0, y: 0 },
					// The previous position of the instance in the tick before.
					previousPosition: { x: 0, y: 0 },
					// The stuck counter of this instance. When this instance is in the same position for multiple ticks, this value is added onto up until -
					// the max stuck counter is reached and the `stuck` event is called.
					stuckCounter: 0,
					maxStuckCounter: PathwaySingleton.MAX_STUCK_COUNTER,
					pathID: null, // ID of the path that was generated. Used to cancel the path.
					path: [],
					moving: null,
					mode: PathwaySingleton.DEFAULT_MODE,
					pixelsPerSecond: PathwaySingleton.DEFAULT_PIXELS_PER_SECOND,
					stepPixelsPerSecond: PathwaySingleton.DEFAULT_STEP_PIXELS_PER_SECOND,
					minDistance: PathwaySingleton.DEFAULT_MINIMUM_DISTANCE,
					events: {
						onPathStuck: null,
						onPathComplete: null,
						onPathFound: null,
						onPathNotFound: null,
					},
					easystar: new EasyStar.js()
				};
				// If you have a large grid, then it is possible that these calculations could slow down the browser. 
				// For this reason, it might be a good idea to give EasyStar a smaller iterationsPerCalculation
				// https://github.com/prettymuchbryce/easystarjs
				instanceData.easystar.setIterationsPerCalculation(1000);
				// Assign the instance data
				this.instanceWeakMap.set(pInstance, instanceData);
			} else {
				// If this instance has data already, we reset it
				this.end(pInstance);
			}

			/**
			 * An exclusion list of instances and tiles.
			 * @type {Array}
			 */
			let excludeList = [];

			// If there are options passed. Parse them.
			if (typeof(pOptions) === 'object') {
				// If max stuck counter is found in options, set it.
				if (typeof(pOptions.maxStuckCounter) === 'number') {
					instanceData.maxStuckCounter = pOptions.maxStuckCounter;
				}

				// Enable diagonals if found in passed options.
				// This can cause some "issues" such as trying to cut through corners.
				if (pOptions.diagonal) {
					instanceData.easystar.enableDiagonals();
					instanceData.easystar.enableCornerCutting();
				}

				// Set the positioning mode
				if (pOptions.mode) {
					// Get the mode, if an invalid mode is passed, we default to the default mode.
					const mode = (pOptions.mode === 'collision' || pOptions.mode === 'position') ? pOptions.mode : PathwaySingleton.DEFAULT_MODE;
					instanceData.mode = mode;
				}

				// Assign pixels per second 
				if (typeof(pOptions.pixelsPerSecond) === 'number') {
					instanceData.pixelsPerSecond = pOptions.pixelsPerSecond;
				}

				// Assign stepSize
				if (instanceData.mode === 'collision') {
					// If the stepSize is set we use it
					if (typeof(pInstance.moveSettings.stepSize) === 'number') {
						instanceData.stepSize = pInstance.moveSettings.stepSize;
					} else {
						instanceData.stepSize = PathwaySingleton.DEFAULT_STEP_SIZE;
					}
					// We get the pixels in seconds for the step size
					instanceData.stepPixelsPerSecond = instanceData.stepSize * PathwaySingleton.DEFAULT_BASE_FPS;
				}

				// Assign the min distance
				if (typeof(pOptions.minDistance) === 'number') {
					instanceData.minDistance = pOptions.minDistance;
				} else {
					// If no min distance was passed we check if a stepSize was passed and we use that. If the mode is position, we calculate a minDistance
					// Using the stepSize for minDistance is the best way to prevent the instance from "spiraling" on the path. 
					// Getting stuck briefly between nodes and "spirals". Rare but it does happen sometimes due to overshooting the minDistance by the stepSize.
					if (instanceData.mode === 'collision') {
						if (instanceData.stepSize) {
							instanceData.minDistance = instanceData.stepSize;
						}
					} else if (instanceData.mode === 'position') {
						if (instanceData.pixelsPerSecond) {
							// Get the step size and use it as the min distance.
							const stepSize = instanceData.pixelsPerSecond / PathwaySingleton.DEFAULT_BASE_FPS;
							instanceData.minDistance = stepSize;
						}
					}
				}

				// Reset events from previous call.
				// This is reset here and not in `end` because events call after `end` is called.
				// This is to ensure that calling `to` in an event works properly.
				instanceData.events.onPathStuck = null;
				instanceData.events.onPathComplete = null;
				instanceData.events.onPathFound = null;
				instanceData.events.onPathNotFound = null;

				// Assign events
				if (typeof(pOptions.onPathComplete) === 'function') {
					instanceData.events.onPathComplete = pOptions.onPathComplete;
				}

				if (typeof(pOptions.onPathFound) === 'function') {
					instanceData.events.onPathFound = pOptions.onPathFound;
				}

				if (typeof(pOptions.onPathNotFound) === 'function') {
					instanceData.events.onPathNotFound = pOptions.onPathNotFound;
				}

				if (typeof(pOptions.onPathStuck) === 'function') {
					instanceData.events.onPathStuck = pOptions.onPathStuck;
				}

				// Copy the contents of the exclude array to the exclude array we manage.
				if (Array.isArray(pOptions.exclude)) {
					excludeList.push(...pOptions.exclude);
				}
			}

			// We add the instance to the exclude array so that it is excluded.
			if (!excludeList.includes(pInstance)) {
				excludeList.push(pInstance);
			}

			// Build the 2D array grid that represents the map
			const gridInfo = this.mapTilesToGrid(pInstance.mapName, excludeList);
			
			// Assign the grid to easystar
			instanceData.easystar.setGrid(gridInfo.grid);
			
			// Assign the weight of each tile
			gridInfo.weights.forEach((pWeight) => {
				instanceData.easystar.setTileCost(pWeight, pWeight);
			});

			// Assign what tiles can be used
			instanceData.easystar.setAcceptableTiles(gridInfo.acceptedTiles);

			// Grab the pos of the instance so we can locate the starting tile its on.
			// This is also used as the startingNode position.
			const instancePosition = this.getPositionFromInstance(pInstance);
			// Get the origin tile the instance is on.
			const originTile = VYLO.Map.getLocByPos(instancePosition.x, instancePosition.y, pInstance.mapName);
			// Get the dimensions of the map that was passed.
			const mapSize = VYLO.Map.getMapSize(pInstance.mapName);

			// Get the end nodes position so we can get the destinationTile
			const endNodeX = Utils.clamp(Utils.clamp(pDestination.x, 0, mapSize.x) * this.tileSize.width + this.tileSize.width / 2, 0, mapSize.xPos - this.tileSize.width);
			const endNodeY = Utils.clamp(Utils.clamp(pDestination.y, 0, mapSize.y) * this.tileSize.height + this.tileSize.height / 2, 0, mapSize.yPos - this.tileSize.height);
			// Get the end tile
			const destinationTile = VYLO.Map.getLocByPos(endNodeX, endNodeY, pInstance.mapName);
			
			// Make sure these have resolved to actual tiles.
			if (originTile && destinationTile) {
				// Check if the origin and end tile are accessible
				if (this.isTileAccessible(originTile, excludeList) && this.isTileAccessible(destinationTile, excludeList)) {
					// Get the start node from the originTile
					let startNode = this.tileToNode(originTile);
					
					// Get the end node from the destinationTile
					let endNode = this.tileToNode(destinationTile);

					// Generate the path for the player
					this.getPath(pInstance, { x: startNode.x, y: startNode.y }, { x: endNode.x, y: endNode.y });				
				// If the origin tile or end tile is not accessible to be walked on then return no path found.
				} else {
					this.end(pInstance);
					// So fire the path not found event.	
					if (typeof(instanceData.events.onPathNotFound) === 'function') {
						instanceData.events.onPathNotFound();
					}
				}
			} else {
				this.logger.prefix('Pathway-Module').error('Origin tile or destination tile cannot be found.');
			}
		} else {
			this.logger.prefix('Pathway-Module').error('Invalid type passed for pInstance. Expecting an object.');
		}
	}
	/**
	 * Tracks this instance as active.
	 * @private
	 * @param {Object} pInstance - The instance to track.
	 */
	track(pInstance) {
		// Add this instance to being tracked.
		if (!this.activeInstances.includes(pInstance)) {
			this.activeInstances.push(pInstance);
		}
	}
	/**
	 * Untracks this instance. It is no longer considered active.
	 * @private
	 * @param {Object} pInstance - The instance to untrack.
	 */
	untrack(pInstance) {
		// Remove this instance from being tracked.
		if (this.activeInstances.includes(pInstance)) {
			this.activeInstances.splice(this.activeInstances.indexOf(pInstance), 1);
		}
	}
	/**
	 * Ends the current pathfinding for pInstance.
	 * @param {Object} pInstance - The instance to terminate pathfinding on.
	 */
	end(pInstance) {
		// Get the instance data for this instance
		const instanceData = this.instanceWeakMap.get(pInstance);
		if (instanceData) {
			// We are ending the pathfinding. So we get the path ID so we can cancel calculations being made for this path.
			if (instanceData.pathID) {
				instanceData.easystar.cancelPath(instanceData.pathID);
				instanceData.pathID = null;
			}
			// Remove the moving iconState. Reset it back to just the direction.
			pInstance.iconState = pInstance.iconState.replace('move_', '');
			// Disable diagonals in the event they were enabled in a previous call
			instanceData.easystar.disableDiagonals();
			// Disable corner cutting in the event it was enabled in a previous call
			instanceData.easystar.disableCornerCutting();
			// Reset trajectory data
			instanceData.trajectory.x = 0;
			instanceData.trajectory.y = 0;
			instanceData.trajectory.angle = 0;
			instanceData.trajectory.nextNodePos = null;
			// Reset stuck counter
			instanceData.stuckCounter = 0;
			// Reset the max stuck counter
			instanceData.maxStuckCounter = PathwaySingleton.MAX_STUCK_COUNTER;
			// Empty path array
			instanceData.path.length = 0;
			// Reset it to not being moved.
			instanceData.moving = false;
			// Reset the mode
			instanceData.mode = 'collision';
			// Reset the stepSize
			instanceData.stepSize = PathwaySingleton.DEFAULT_STEP_SIZE;
			// Reset the stepPixels per second
			instanceData.stepPixelsPerSecond = PathwaySingleton.DEFAULT_STEP_PIXELS_PER_SECOND;
			// Reset the pixels per second.
			instanceData.pixelsPerSecond = PathwaySingleton.DEFAULT_PIXELS_PER_SECOND;
			// Reset the min distance
			instanceData.minDistance = PathwaySingleton.DEFAULT_MINIMUM_DISTANCE;
			// Stop instance from moving via VYLO API.
			pInstance.move();
			// Untrack pInstance as an active instance.
			this.untrack(pInstance);
		} else {
			this.logger.prefix('Pathway-Module').error('No instance data found from pInstance. This instance is not engaged in pathfinding.');
		}
	}
	/**
	 * Gets the position from the instance based on the pathfinding info. Centered position from the geometrical.
	 * @private
	 * @param {Object} pInstance - The instance to get the position from.
	 * @returns {Object} - The position of the instance.
	 */
	getPositionFromInstance(pInstance) {
		const instanceData = this.instanceWeakMap.get(pInstance);
		if (instanceData) {
			instanceData.currentPosition.x = Math.floor(pInstance.x + pInstance.xOrigin + pInstance.width / 2);
			instanceData.currentPosition.y = Math.floor(pInstance.y + pInstance.yOrigin + pInstance.height / 2);
			return instanceData.currentPosition;
		}
	}
	/**
	 * Moves the specified instance to the next node.
	 * @private
	 * @param {Object} pInstance - The instance to move.
	 * @param {Object} pInstanceData - The instance data for this instance.
	 * @param {Object} pInstancePosition - The position of the instance.
	 */
	moveInstance(pInstance, pInstanceData, pInstancePosition) {
		// Get the angle from the instance's position to the next node
		pInstanceData.trajectory.angle = Utils.getAngle2(pInstancePosition, pInstanceData.trajectory.nextNodePos);
		// Get the trajectory of where to move the instance based on the angle
		pInstanceData.trajectory.x = Math.cos(pInstanceData.trajectory.angle);
		pInstanceData.trajectory.y = -Math.sin(pInstanceData.trajectory.angle);
		// Get the direction of the instance based on the angle to the next node
		const direction = Utils.getDirection(pInstanceData.trajectory.angle);

		if (pInstanceData.mode === 'collision') {
			const oldStepSizeInPixels = pInstanceData.stepPixelsPerSecond;
			// Get the current step size as it may have changed
			const currentStepSizeInPixels = pInstance.moveSettings.stepSize * PathwaySingleton.DEFAULT_BASE_FPS;
			// Store the current step pixels per second.
			pInstance.stepPixelsPerSecond = currentStepSizeInPixels;
			// Calculate interpolation factor (0 to 1)
			// Currently it "jumps" directly to the change value.
			const interpolationFactor = 1 - Math.pow(0, this.deltaTime);
			// Smoothly interpolate between oldStepSizeInPixels and currentStepSizeInPixels using lerp
			const speed = Utils.lerp(oldStepSizeInPixels, currentStepSizeInPixels, interpolationFactor) * this.deltaTime;
			pInstance.stepPos(pInstanceData.trajectory.x * speed, pInstanceData.trajectory.y * speed, true, false);
		} else if (pInstanceData.mode === 'position') {
			const speed = pInstanceData.pixelsPerSecond * this.deltaTime; 
			pInstance.setPos(pInstance.x + speed * pInstanceData.trajectory.x, pInstance.y + speed * pInstanceData.trajectory.y, pInstance.mapName);
		}
		// Set moving to true
		pInstanceData.moving = true;
		const moveIconState = `move_${direction}`;
		if (pInstance.iconState !== moveIconState) {
			pInstance.iconState = moveIconState;
		}
	}
	/**
	 * Updates active instances on the pathfinder.
	 * @private
	 */
	update() {
		// Get current timestamp
		const now = Date.now();
		// Get the elapsed ms from the last tick
		this.elapsedMS = now - this.lastTime;
		// Get the delta time between the last tick
		this.deltaTime = (this.elapsedMS / 1000);
		// If the delta time grows too large, we clamp it
		if (this.deltaTime >= PathwaySingleton.MAX_DELTA_TIME) {
			this.deltaTime = PathwaySingleton.MAX_DELTA_TIME;
		}
		// Loop active instances and update.
		this.activeInstances.forEach((pInstance) => {
			// Get the instance data for this instance
			const instanceData = this.instanceWeakMap.get(pInstance);
			if (instanceData) {
				// Calculate the path
				instanceData.easystar.calculate();
				// If this instance is being moved
				if (Array.isArray(instanceData.path) && (instanceData.path.length || instanceData.moving)) {
					// Get the position of the instance
					const instancePosition = this.getPositionFromInstance(pInstance);
					// If the instance is not moving
					if (!instanceData.moving) {
						// Get the next node to travel to.
						const node = instanceData.path.shift();
						// Get the position of that node in real world coordinates. We subtract half of the tileSize to get the center of the node's posiiton.
						const nodePos = { 
							x: (node.x * this.tileSize.width) - this.tileSize.width / 2, 
							y: (node.y * this.tileSize.height) - this.tileSize.height / 2 
						};
						// Store the next node position
						instanceData.trajectory.nextNodePos = nodePos;
						// Move the instance
						this.moveInstance(pInstance, instanceData, instancePosition);
					} else {
						// Get the distance from the instance's position to the next node's position.
						const distance = Utils.getDistance(instancePosition, instanceData.trajectory.nextNodePos);
						// Stop moving when you are this close distance.
						if (distance <= instanceData.minDistance) {
							// Stop moving
							instanceData.moving = false;
							// Reset stuck counter when moving has "stopped".
							instanceData.stuckCounter = 0;
							// If there is no more nodes left in the path
							if (!instanceData.path.length) {
								this.end(pInstance);
								// You have completed the path. Call the event function if supplied.
								if (typeof(instanceData.events.onPathComplete) === 'function') {
									instanceData.events.onPathComplete();
								}
							}
						} else {
							// Move the instance
							this.moveInstance(pInstance, instanceData, instancePosition);
						}
					}
					// If the instance's position is in the same spot it was in the last tick
					if (instancePosition.x === instanceData.previousPosition.x && instancePosition.y === instanceData.previousPosition.y) {
						// Increment the stuck counter
						instanceData.stuckCounter++;
						// Chekck if the stuck counter is greater or equal to the max stuck counter
						if (instanceData.stuckCounter >= instanceData.maxStuckCounter) {
							// End this pathfinding.
							this.end(pInstance);
							// Call the stuck event if defined.
							if (typeof(instanceData.events.onPathStuck) === 'function') {
								instanceData.events.onPathStuck();
							}
						}
					}
					// Store the previous position as the position of this tick
					instanceData.previousPosition = instancePosition;
				}
			}
		});
		// Store this tick's time
		this.lastTime = now;
	}
	/**
	 * Sets the tilesize of this system.
	 * @param {number} pTileSize - The tilesize of the game.
	 */
	setTileSize(pTileSize) {
		if (typeof(pTileSize) === 'number') {
			this.tileSize = { width: pTileSize, height: pTileSize };
		} else if(typeof(pTileSize) === 'object') {
			const width = pTileSize.width;
			const height = pTileSize.height;
			// Assign the tilesize width
			if (typeof(width) === 'number') {
				this.tileSize.width = width;
			}
			// Assign the tilesize height
			if (typeof(height) === 'number') {
				this.tileSize.height = height;
			}
		} else {
			this.logger.prefix('Pathway-Module').error('Invalid type used for pTileSize');
		}
	}
	/**
	 * Checks to see if pTile is accessible for movement.
	 * @private
	 * @param {Object} pTile - The tile to check the validity of.
	 * @param {Array} pExclusionList - The list of excluded tiles/instances.
	 * @returns {boolean} - If this tile is accessible.
	 */
	isTileAccessible(pTile, pExclusionList) {
		// If the tile is in the exclude list, we simply say it is accessible. This prevents the tile's contents from being searched. 
		// There is a possibility it could actually be an obstacle on this tile blocking movement from being completed. Use with caution.
		const isExcluded = (pInstance) => pExclusionList.includes(pInstance);
		// This instance is impassible because it is dense and has no pathwayWeight, or it was explicitely set to be impassable.
		const isImpassable = (pInstance) => (pInstance.pathwayWeight === PathwaySingleton.IMPASSABLE_WEIGHT) || pInstance.density && (!pInstance.pathwayWeight && pInstance.pathwayWeight !== PathwaySingleton.PASSABLE_WEIGHT);
		// If this tile has dense instances that are not being excluded, doesn't have a pathwayWeight set, or are explicitely set to be impassable.
		const hasImpassableContent = (pInstance) => pInstance.getContents().some((pInstance) => {
			return isImpassable(pInstance) && !isExcluded(pInstance);
		});
		return isExcluded(pTile) || (!isImpassable(pTile) && !hasImpassableContent(pTile));
	}
	/**
	 * Generates a path from the origin point to the end point with obstacles in mind.
	 * @private
	 * @param {Object} pInstance - The instance to grab data from.
	 * @param {Object} pOrigin - An object containing the start x and y position. 
	 * @property {number} pOrigin.x - The start x coordinate.
	 * @property {number} pOrigin.y -The start y coordinate.
	 * @param {Object} pDestination - An object containing the end x and y position to travel to.
	 * @property {number} pDestination.x - The end x coordinate.
	 * @property {number} pDestination.y - The end y coordinate.
	 */
	getPath(pInstance, pOrigin, pDestination) {
		// Get the instance data
		const instanceData = this.instanceWeakMap.get(pInstance);
		if (!instanceData) {
			this.logger.prefix('Pathway-Module').error('Instance data not found!');
			return;
		}
		
		// Find the path
		const pathID = instanceData.easystar.findPath(pOrigin.x, pOrigin.y, pDestination.x, pDestination.y, (pPath) => {
			// Check if the path is valid.
			if (Array.isArray(pPath) && pPath.length) {
				/**
				 * The path generated.
				 * @private
				 * @type {Array}
				 */
				let path;
				// Offset the nodes by 1, because VYLO xCoord and yCoord start at 1.
				path = pPath.map((pElement) => ({
					x: ++pElement.x,
					y: ++pElement.y
				}));
				// Remove the node you start on.
				path.shift();
				// Store the path
				instanceData.path = path;
				// Store the pathID
				instanceData.pathID = pathID;
				// Call event when path is found
				if (typeof(instanceData.events.onPathFound) === 'function') {
					instanceData.events.onPathFound([...path]);
				}
			} else {
				// If no path is found then we end the pathfinding on this instance.
				this.end(pInstance);
				// Call event when no path is found
				if (typeof(instanceData.events.onPathNotFound) === 'function') {
					instanceData.events.onPathNotFound();
				}
			}
		});
		// Track pInstance as an active instance.
		this.track(pInstance);
	}
	/**
	 * Converts an array to an 2D array.
	 * @private
	 * @param {Array} pArray - The array to convert to a 2D array.
	 * @param {number} pLengthOfSubArray - The length of the subarray.
	 * @returns {Array} The 2D array.
	 */
	toTwoDimensionalArray(pArray, pLengthOfSubArray) {
		let i = 0;
		const result = [];
		while (i < pArray.length) {
			result.push(pArray.slice(i, i+= pLengthOfSubArray));
		}
		return result;
	}
	/**
	 * Converts a tile to a node position.
	 * @private
	 * @param {Object}} pTile - The tile to convert into a node position.
	 * @returns {Object} The node.
	 */
	tileToNode(pTile) {
		if (typeof(pTile.mapName) === 'string') {
			if (PathwaySingleton.storedMapTiles[pTile.mapName]) {
				const index = this.getIndexOf2DArray(PathwaySingleton.storedMapTiles[pTile.mapName].tiles2d, pTile);
				const node = { x: index[1], y: index[0] };
				return node;
			} else {
				this.logger.prefix('Pathway-Module').error('There is no stored grid for the map this tile belongs to.');
			}
		} else {
			this.logger.prefix('Pathway-Module').error('Invalid mapname found on pTile');
		}
	}
	/**
	 * Converts a node to a tile.
	 * @private
	 * @param {string} pMapName - The mapname where the tile should come from.
	 * @param {Object} pNode - The node to convert into a tile.
	 * @returns {Object} The tile.
	 */
	nodeToTile(pMapName, pNode) {
		// We add 1 to the node because in VYLO xCoord and yCoord start at 1.
		return VYLO.Map.getLoc(pNode.x + 1, pNode.y + 1, pMapName);
	}
	/**
	 * Finds the index of a value in a 2D array.
	 * @private
	 * @param {Array} pArray - The 2D array to search in.
	 * @param {any} pValue - The value to find in the 2D array.
	 * @returns {Array<number>} Returns an array containing the row and column indices of the found value, or undefined if not found.
	 */
	getIndexOf2DArray(pArray, pValue) {
		for (let i = 0; i < pArray.length; i++) {
			let index = pArray[i].indexOf(pValue);
			if (index > -1) {
				return [i, index];
			}
		}
	}
	/**
	 * Converts map tiles to grids.
	 * @private
	 * @param {string} pMapName - The mapname where the tile should come from.
	 * @param {Array} pExclusionList - The exclude list to use for this grid.
	 * @returns {Object|undefined} An object containing the grid created, an array of tiles that are to be accepted in the pathfinding system, and the weights of each tile.
	 */
	mapTilesToGrid(pMapName, pExclusionList) {
		if (typeof(pMapName) === 'string') {
			if (Array.isArray(pExclusionList)) {
				// We check if this is a valid mapname found in VYLO.
				if (VYLO.Map.getMaps().includes(pMapName)) {
					// An array of tiles that we get from the map
					let tilesArray;
					// An array of accepted tiles to be walked on.
					const acceptedTiles = [0];
					// An array holding the weights of tiles.
					const weights = [];
					// Get the dimensions of the map that was passed.
					const mapSize = VYLO.Map.getMapSize(pMapName);

					// We check if we have stored tiles from this map before. If so we cache them.
					if (PathwaySingleton.storedMapTiles[pMapName]) {
						// We get the tile array from memory.
						tilesArray = PathwaySingleton.storedMapTiles[pMapName].tiles;
					} else {
						tilesArray = VYLO.Map.getTiles(pMapName);
						// We store this tiles array
						PathwaySingleton.storedMapTiles[pMapName] = { tiles: tilesArray, tiles2d: this.toTwoDimensionalArray(tilesArray, mapSize.x) };
					}

					// This instance is impassible because it is dense and has no pathwayWeight, or it was explicitely set to be impassable.
					const isImpassable = (pInstance) => (pInstance.pathwayWeight === PathwaySingleton.IMPASSABLE_WEIGHT) || pInstance.density && (!pInstance.pathwayWeight && pInstance.pathwayWeight !== PathwaySingleton.PASSABLE_WEIGHT);
					
					// Loop through the tiles array to build weights and accepted tile lists.
					const grid = tilesArray.map((pTile) => {
						// If the tile is in the exclude list, we simply say it is passable. This prevents the tile's contents from being searched. 
						// There is a possibility it could actually be an obstacle on this tile blocking movement from being completed. Use with caution.
						if (pExclusionList.includes(pTile)) return PathwaySingleton.PASSABLE_WEIGHT;

						// A weight of PathwaySingleton.PASSABLE_WEIGHT indicates no weight.
						let weight = typeof(pTile.pathwayWeight) === 'number' ? pTile.pathwayWeight : PathwaySingleton.PASSABLE_WEIGHT;
						
						// If this tile is not accessible, we cannot pass it, so we skip this tile.
						if (!this.isTileAccessible(pTile, pExclusionList)) {
							return PathwaySingleton.IMPASSABLE_WEIGHT;
						}

						// Accumulate weights of instances on the tile
						for (const instance of pTile.getContents()) {
							// If this instance is to be excluded. We don't calculate its weight.
							if (pExclusionList.includes(instance)) continue;

							// If this instance is impassable we skip this tile.
							if (isImpassable(instance)) {
								return PathwaySingleton.IMPASSABLE_WEIGHT;
							} else {
								// We accumulate the weight of instances
								if (typeof(instance.pathwayWeight) === 'number') {
									weight += instance.pathwayWeight;
								}
							}
						}

						// Add weight to acceptedTiles if not already present
						if (weight !== PathwaySingleton.IMPASSABLE_WEIGHT && weight !== PathwaySingleton.PASSABLE_WEIGHT) {
							if (!acceptedTiles.includes(weight)) acceptedTiles.push(weight);
							if (!weights.includes(weight)) weights.push(weight);
						}

						return weight;
					});

					return { 
						'acceptedTiles': acceptedTiles, 
						'grid': this.toTwoDimensionalArray(grid, mapSize.x), 
						'weights': weights 
					};
				} else {
					this.logger.prefix('Pathway-Module').error('pMapName was not found in VYLO.');
					return;
				}
			} else {
				this.logger.prefix('Pathway-Module').error('Invalid type for pExclusionList.');
			}
		} else {
			this.logger.prefix('Pathway-Module').error('Invalid type for pMapName.');
		}
	}
}
/**
 * The module instantiated for use.
 * @type {PathwaySingleton}
 */
const Pathway = new PathwaySingleton();
/**
 * Check if this is a server environment
 * @ignore
 */
const server = (typeof(window) === 'undefined');
/**
 * Update API bound to Pathway
 * @ignore
 */
const update = Pathway.update.bind(Pathway);

// If on the server we use an interval
if (server) {
	// Update interval
	const updateInterval = setInterval(update, 16);
// Otherwise we use raf
} else {
	const updateLoop = () => {
		update();
		requestAnimationFrame(updateLoop);
	}
	requestAnimationFrame(updateLoop);
}

export { Pathway };