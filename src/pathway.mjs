import { Utils } from './vendor/utils.min.mjs';
import { Logger } from './vendor/logger.min.mjs';
import { EasyStar } from './vendor/easystar-0.4.4.min.js';

/**
 * @todo Test on server
 * @todo Make debugging class
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
	 * A static weight to be applied when a tile should be considered trickier to travel on.
	 * @private
	 * @type {number}
	 */
	static AVERSION_WEIGHT = 10;
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
	static NO_TRAVEL_WEIGHT = -1;
	/**
	 * The default amount of pixels per second to move the instance when using `position` mode.
	 * @private
	 * @type {number}
	 */
	static DEFAULT_PIXELS_PER_SECOND = 120;
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
	 * @property {Array} pOptions.ignore - An array of diobs that will be ignored when calculating the path.
	 * @property {number} [pOptions.minDistance = 2] = The minimum distance this pathway system will use to calculate if you have reached the (next) node.  
	 * @property {number} [pOptions.maxStuckCounter = 100] - The maximum amount of ticks of pInstance being in the same position as the last tick before its considered stuck.
	 * @property {string} [pOptions.mode = 'collision'] - How this instance will move. `collision` for moving with collisions in mind (movePos). `position` for moving with no collisions in mind (setPos) Must use pOptions.pixelsPerSecond when using `position` mode. 
	 * @property {string} [pOptions.pixelsPerSecond = 120] - The speed in pixels this instance moves per second. This setting only works when pOptions.mode is set to `position`.   
	 * @property {Function} pOptions.onPathComplete - Callback for when pInstance makes it to the destination node.
	 * @property {Function} pOptions.onPathFound - Callback for when pInstance finds a path.
	 * @property {Function} pOptions.onPathStuck - Callback for when pInstance gets stuck on a path.
	 * @property {Function} pOptions.onPathNotFound - Callback for when no path is found.
	 */
	async to(pInstance, pDestination, pOptions) {
		if (typeof(pInstance) === 'object') {
			// If this instance is not on a mapname.
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
			 * An exclusion list of tiles.
			 * @type {Array}
			 */
			let ignoreList = [];

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

				// Assign the min distance
				if (typeof(pOptions.minDistance) === 'number') {
					instanceData.minDistance = pOptions.minDistance;
				}

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

				// Copy the contents of the ignore array to the ignore list we manage.
				if (Array.isArray(pOptions.ignore)) {
					ignoreList.push(...pOptions.ignore);
				}
			}

			// Grab the pos of the instance so we can locate the starting tile its on.
			// This is also used as the startingNode position.
			const instancePosition = this.getPositionFromInstance(pInstance);
			// Get the origin tile the instance is on.
			const originTile = VYLO.Map.getLocByPos(instancePosition.x, instancePosition.y, pInstance.mapName);

			// We add the starting tile to the ignore list so that it is ignored.
			if (!ignoreList.includes(originTile)) {	
				ignoreList.push(originTile);
			}
			// We also add the instance to the ignore list so that it is ignored.
			if (!ignoreList.includes(pInstance)) {
				ignoreList.push(pInstance);
			}

			// Build the 2D array grid that represents the map
			const gridInfo = this.mapTilesToGrid(pInstance.mapName, ignoreList);
			
			// Assign the grid to easystar
			instanceData.easystar.setGrid(gridInfo.grid);
			
			// Assign the weight of each tile
			gridInfo.weights.forEach((pWeight) => {
				instanceData.easystar.setTileCost(pWeight, pWeight);
			});

			// Assign what tiles can be used
			instanceData.easystar.setAcceptableTiles(gridInfo.acceptedTiles);

			// Get the dimensions of the map that was passed.
			const mapSize = VYLO.Map.getMapSize(pInstance.mapName);

			// Get the end nodes position so we can get the destinationTile
			const endNodeX = Utils.clamp(Utils.clamp(pDestination.x, 0, mapSize.x) * this.tileSize.width + this.tileSize.width / 2, 0, mapSize.xPos - this.tileSize.width);
			const endNodeY = Utils.clamp(Utils.clamp(pDestination.y, 0, mapSize.y) * this.tileSize.height + this.tileSize.height / 2, 0, mapSize.yPos - this.tileSize.height);
			// Get the end time tile
			const destinationTile = VYLO.Map.getLocByPos(endNodeX, endNodeY, pInstance.mapName);
			
			// Get the start node from the originTile
			let startNode = this.tileToNode(originTile);
			
			// Get the end node from the destinationTile
			let endNode = this.tileToNode(destinationTile);

			// If the origin tile or end tile is invalid to be walked on then return no path found.
			if (this.isTileInvalid(originTile, ignoreList) || this.isTileInvalid(destinationTile, ignoreList)) {
				// So fire the path not found event.	
				if (typeof(instanceData.events.onPathNotFound) === 'function') {
					instanceData.events.onPathNotFound();
				}
				this.end(pInstance);
				return;
			}
			// Generate the path for the player
			this.getPath(pInstance, { x: startNode.x, y: startNode.y }, { x: endNode.x, y: endNode.y });
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
			// Disable diagonals in the event they were enabled in a previous call
			instanceData.easystar.disableDiagonals();
			// Disable corner cutting in the event it was enabled in a previous call
			instanceData.easystar.disableCornerCutting();
			// Reset trajectory data
			instanceData.trajectory.x = 0;
			instanceData.trajectory.y = 0;
			instanceData.trajectory.angle = 0;
			instanceData.trajectory.nextNodePos = null;
			// Reset events
			instanceData.events.onPathStuck = null;
			instanceData.events.onPathComplete = null;
			instanceData.events.onPathFound = null;
			instanceData.events.onPathNotFound = null;
			// Reset stuck counter
			instanceData.stuckCounter = 0;
			// Reset the max stuck counter
			instanceData.maxStuckCounter = PathwaySingleton.MAX_STUCK_COUNTER;
			// Empty path(s) array
			instanceData.path.length = 0;
			// Reset it to not being moved.
			instanceData.moving = false;
			// Reset the mode
			instanceData.mode = 'collision';
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
						// Get the angle from the instance's position to the next node
						instanceData.trajectory.angle = Utils.getAngle2(instancePosition, instanceData.trajectory.nextNodePos);
						// Get the trajectory of where to move the instance based on the angle
						instanceData.trajectory.x = Math.cos(instanceData.trajectory.angle);
						instanceData.trajectory.y = -Math.sin(instanceData.trajectory.angle);
						// Update the direction of the instance based on the angle to the next node
						pInstance.dir = Utils.getDirection(instanceData.trajectory.angle);
						// Move the instance with collision mode or positional mode
						if (instanceData.mode === 'collision') {
							pInstance.movePos(instanceData.trajectory.x, instanceData.trajectory.y);
						} else if (instanceData.mode === 'position') {
							const speed = instanceData.pixelsPerSecond * this.deltaTime;
							pInstance.setPos(pInstance.x + speed * instanceData.trajectory.x, pInstance.y + speed * instanceData.trajectory.y, pInstance.mapName);
						}
						instanceData.moving = true;
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
								// You have completed the path. Call the event function if supplied.
								if (typeof(instanceData.events.onPathComplete) === 'function') {
									instanceData.events.onPathComplete();
								}
								this.end(pInstance);
							}
						} else {
							instanceData.trajectory.angle = Utils.getAngle2(instancePosition, instanceData.trajectory.nextNodePos);
							instanceData.trajectory.x = Math.cos(instanceData.trajectory.angle);
							instanceData.trajectory.y = -Math.sin(instanceData.trajectory.angle);
							pInstance.dir = Utils.getDirection(instanceData.trajectory.angle);
							// Move the instance with collision mode or positional mode
							if (instanceData.mode === 'collision') {
								pInstance.movePos(instanceData.trajectory.x, instanceData.trajectory.y);
							} else if (instanceData.mode === 'position') {
								const speed = instanceData.pixelsPerSecond * this.deltaTime;
								pInstance.setPos(pInstance.x + speed * instanceData.trajectory.x, pInstance.y + speed * instanceData.trajectory.y, pInstance.mapName);
							}
							instanceData.moving = true;
						}
					}
					// If the instance's position is in the same spot it was in the last tick
					if (instancePosition.x === instanceData.previousPosition.x && instancePosition.y === instanceData.previousPosition.y) {
						// Increment the stuck counter
						instanceData.stuckCounter++;
						// Chekck if the stuck counter is greater or equal to the max stuck counter
						if (instanceData.stuckCounter >= instanceData.maxStuckCounter) {
							// Call the stuck event if defined.
							if (typeof(instanceData.events.onPathStuck) === 'function') {
								instanceData.events.onPathStuck();
							}
							// End this pathfinding.
							this.end(pInstance);
							return;
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
	 * Checks to see if pTile is invalid for movement.
	 * @private
	 * @param {Object} pTile - The tile to check the validity of.
	 * @param {Array} pIgnoreList - The list of ignored tiles/instances.
	 * @returns {boolean} - If this tile is valid or invalid.
	 */
	isTileInvalid(pTile, pIgnoreList) {
		// If this tile is dense and not on the ignored list, it's invalid.
		const invalidTile = pTile.density && !pIgnoreList.includes(pTile);
	
		// Check if there are any dense instances on this tile that are not on the ignore list. A instance can be on the tile and dense as long as it has a pathwayWeight. This is allowing the pathway system to determine if its worth traveling that tile while that dense instance exists on it.
		const invalidInstancesOnTile = pTile.getContents().some(pElement => pElement.density && !pElement.pathwayWeight && !pIgnoreList.includes(pElement));
	
		// If this tile is invalid.
		return invalidTile || invalidInstancesOnTile;
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
	 * @returns {Promise} A promise that resolves with an object containing the path from the start position to the end position.
	 */
	getPath(pInstance, pOrigin, pDestination) {
		return new Promise((pResolve, pReject) => {
			// Get the instance data
			const instanceData = this.instanceWeakMap.get(pInstance);
			if (!instanceData) {
				this.logger.prefix('Pathway-Module').error('Instance data not found!');
				pReject();
				return;
			}
			
			/**
			 * The path generated.
			 * @private
			 * @type {Array}
			 */
			let path;
			
			// Find the path
			const pathID = instanceData.easystar.findPath(pOrigin.x, pOrigin.y, pDestination.x, pDestination.y, (pPath) => {
				// Check if the path is valid.
				if (Array.isArray(pPath) && pPath.length) {
					// // // Offset the nodes by 1, because VYLO xCoord and yCoord start at 1.
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
						instanceData.events.onPathFound(path);
					}
				} else {
					// Call event when no path is found
					if (typeof(instanceData.events.onPathNotFound) === 'function') {
						instanceData.events.onPathNotFound();
					}
					// If no path is found then we end the pathfinding on this instance.
					this.end(pInstance);
				}
			});
			// Track pInstance as an active instance.
			this.track(pInstance);
		});
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
	 * @param {Array} pIgnoreList - The ignore list to use for this grid.
	 * @returns {Object|undefined} An object containing the grid created, an array of tiles that are to be accepted in the pathfinding system, and the weights of each tile.
	 */
	mapTilesToGrid(pMapName, pIgnoreList) {
		if (typeof(pMapName) === 'string') {
			if (Array.isArray(pIgnoreList)) {
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

					// Loop through the tiles array to build weights and accepted tile lists.
					const grid = tilesArray.map((pTile) => {
						// A weight of PathwaySingleton.PASSABLE_WEIGHT indicates no weight.
						let weight = typeof(pTile.pathwayWeight) === 'number' ? pTile.pathwayWeight : PathwaySingleton.PASSABLE_WEIGHT;

						// Check if the tile or any of its contents are dense and have no pathwayWeight. As if it has a pathway weight, this tile is travelable. Just less desirable.
						if (pTile.density || pTile.getContents().some(instance => instance.density && !instance.pathwayWeight && !pIgnoreList.includes(instance))) {
							weight = PathwaySingleton.NO_TRAVEL_WEIGHT;
						} else {
							// Accumulate weights of instances on the tile
							for (const instance of pTile.getContents()) {
								if (typeof(instance.pathwayWeight) === 'number') {
									weight += instance.pathwayWeight;
								}
							}
						}

						// Add weight to acceptedTiles if not already present
						// If the weight is PathwaySingleton.PASSABLE_WEIGHT, then it means its already accepted to be walked on.
						// If the weight is NO_TRAVEL_WEIGHT this means it cant be walked on.
						if (weight !== PathwaySingleton.NO_TRAVEL_WEIGHT && weight !== PathwaySingleton.PASSABLE_WEIGHT) {
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
				this.logger.prefix('Pathway-Module').error('Invalid type for pIgnoreList.');
			}
		} else {
			this.logger.prefix('Pathway-Module').error('Invalid type for pMapName.');
		}
	}
}
const Pathway = new PathwaySingleton();
// Check if this is a server environment
const server = (typeof(window) === 'undefined');
// Update API bound to Pathway
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