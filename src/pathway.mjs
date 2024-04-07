import { Utils } from './vendor/utils.min.mjs';
import { Logger } from './vendor/logger.min.mjs';
import { EasyStar } from './vendor/easystar-0.4.4.min.js';

/**
 * @todo Test on server
 * @todo Make debugging class
 * @todo Add tweakable stuck data. Allowing devs to change the stuck counter and etc.
 */

class PathwaySingleton {
	/**
	 * The maximum amount of ticks an instance can be in the same position before the pathfinder deems it "stuck". The user will be able to tweak values up to this max value.
	 * @private
	 * @type {number}
	 */
	static MAX_STUCK_COUNTER = 1000;
	/**
	 * The maximum amount of tiles to search from the end tile.
	 * @private
	 * @type {number}
	 */
	static MAX_NEAREST_TILE_SEARCH = 6;
	/**
	 * The max amount of delta time between ticks. If this limit is passed, it will be clamped.
	 * @private
	 * @type {number}
	 */
	static MAX_DELTA_TIME = 0.03333333333;
	/**
	 * The clamped delta time to use when the delta time grows past MAX_DELTA_TIME.
	 * @private
	 * @type {number}
	 */
	static CLAMPED_DELTA_TIME = 0.01666666666;
	/**
	 * A static weight to be applied when a tile should be considered trickier to travel on.
	 * @private
	 * @type {number}
	 */
	static AVERSION_WEIGHT = 10;
	/**
	 * A static weight to be applied when a tile should be not be traveled to at all.
	 * @private
	 * @type {number}
	 */
	static NO_TRAVEL_WEIGHT = 999999999;
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
	 * @property {boolean} pOptions.diagonal - Whether or not the pathfinder allows diagonal moves.
	 * @property {boolean} pOptions.center - Whether the position of this sprite is based in the center. If set to true, the center of the sprite will be used as the position. If no icon is found then the center of the geometrical bounds will be used as the center.
	 * @property {boolean} pOptions.nearest - Whether or not the path will find the nearest path if the provided coordinates are blocked.
	 * @property {Array} pOptions.ignore - An array of diobs that will be ignored when calculating the path.
	 * @property {string} pOptions.mode - How this instance will move. `collision` for moving with collisions in mind (movePos). `position` for moving with no collisions in mind (setPos). 
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
			// If there is no options object passed return.
			if (typeof(pOptions) !== 'object') {
				this.logger.prefix('Pathway-Module').error('Invalid type passed for pOptions. Expecting an object.');
				return;
			}
			// Get the instance data for this instance
			let instanceData = this.instanceWeakMap.get(pInstance);
			// If there is no instance data
			if (!instanceData) {
				const mode = (pOptions.mode === 'collision' ? 'collision' : 'position');
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
					pathID: null, // ID of the path that was generated. Used to cancel the path.
					path: null,
					positionFromCenter: pOptions.center,
					moving: null,
					mode: mode,
					easystar: new EasyStar.js()
				};
				// If you have a large grid, then it is possible that these calculations could slow down the browser. 
				// For this reason, it might be a good idea to give EasyStar a smaller iterationsPerCalculation
				// https://github.com/prettymuchbryce/easystarjs
				instanceData.easystar.setIterationsPerCalculation(1000);
				// Assign the instance data
				this.instanceWeakMap.set(pInstance, instanceData);
			}

			// If this instance is currently pathfinding then end it, as it will start a new pathfinding objective.
			this.end(pInstance);

			// Grab the pos of the instance so we can locate the starting tile its on.
			// This is also used as the startingNode position.
			const instancePosition = this.getPositionFromInstance(pInstance);
			// Get the origin tile the instance is on.
			const originTile = VYLO.Map.getLocByPos(instancePosition.x, instancePosition.y, pInstance.mapName);

			/**
			 * An exclusion list of tiles.
			 * @type {Array}
			 */
			let ignoreList;
		
			if (Array.isArray(pOptions.ignore)) {
				ignoreList = [...pOptions.ignore];
				// We add the starting tile to the ignore list so that it is ignored.
				// We also add the instance to the ignore list so that it is ignored.
				if (!ignoreList.includes(originTile)) {	
					ignoreList.push(originTile);
					ignoreList.push(pInstance);
				}
			}

			// Enable diagonals if found in passed options.
			if (pOptions.diagonal) {
				// Enables diagonals
				instanceData.easystar.enableDiagonals();
				instanceData.easystar.enableCornerCutting();
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

			// Get the end nodes position so we can get the endTile
			const endNodeX = Utils.clamp(Utils.clamp(pDestination.x - 1, 0, mapSize.x) * this.tileSize.width + this.tileSize.width / 2, 0, mapSize.xPos - this.tileSize.width);
			const endNodeY = Utils.clamp(Utils.clamp(pDestination.y - 1, 0, mapSize.y) * this.tileSize.height + this.tileSize.height / 2, 0, mapSize.yPos - this.tileSize.height);
			// Get the end time tile
			const endTile = VYLO.Map.getLocByPos(endNodeX, endNodeY, pInstance.mapName);
			// Get the start node from the originTile
			let startNode = this.tileToNode(originTile);
			// Get the end node from the endTile
			let endNode = this.tileToNode(endTile);
			
			// Debug mode to visualize the end tile
			if (this.debugging) {
				const endTileOverlay = VYLO.newDiob();
				endTileOverlay.atlasName = '';
				endTileOverlay.width = this.tileSize.width;
				endTileOverlay.height = this.tileSize.height;
				endTileOverlay.tint = 0xFFFFFF;
				endTileOverlay.alpha = 0.7;
				endTileOverlay.plane = 0;
				endTileOverlay.touchOpacity = 0;
				endTileOverlay.touchOpacity = 0;
				endTileOverlay.setTransition({ alpha: 0 }, -1, debuggerDuration);
				endTile.addOverlay(endTileOverlay);
				setTimeout(() => {
					endTile.removeOverlay(endTileOverlay);
				}, debuggerDuration);
			}

			// If the origin tile is invalid to be walked on.
			if (this.isTileInvalid(originTile)) {
				/**
				 * The axis that are blocked.
				 * @type {Object}
				 */
				let blockedAxis = { 
					west: false, 
					east: false, 
					north: false, 
					south: false 
				};
				// Whether or not the path will find the nearest path if the provided coordinates are blocked.
				if (pOptions.nearest) {
					// Loop through the origin tile's contents
					for (const tileContentInstance of originTile.getContents()) {
						// If the origin tile has a instance on it that is dense
						if (tileContentInstance.density) {
							// Get the blocked sides from every instance in the origin tile's contents.
							const blockedSides = this.getBlockingSides(tileContentInstance, instancePosition.x, instancePosition.y, endNodeX, endNodeY);
							// Store the blocked axis for referencing later.
							if (blockedSides.west) blockedAxis.west = true;
							if (blockedSides.east) blockedAxis.east = true;
							if (blockedSides.north) blockedAxis.north = true;
							if (blockedSides.south) blockedAxis.south = true;
						}
					}
					
					// Get the nearest node
					let nearestNode = this.getNearestNode(pInstance, startNode, instancePosition.x, instancePosition.y, blockedAxis, true);
					
					// If the west axis is blocked.
					if (blockedAxis.west) {
						// Get the tile to the east of the instance
						const tileRight = VYLO.Map.getLocByPos(instancePosition.x + this.tileSize.width / 2, instancePosition.y, pInstance.mapName);
						// If the tile to the east is invalid then we shift to the next node.
						if (this.isTileInvalid(tileRight)) {
							nearestNode.x++;
						}
					}
					// If the east axis is blocked.
					if (blockedAxis.east) {
						// Get the tile to the west of the instance
						const tileLeft = VYLO.Map.getLocByPos(instancePosition.x - this.tileSize.width / 2, instancePosition.y, pInstance.mapName);
						// If the tile to the west is invalid then we shift to the next node.
						if (this.isTileInvalid(tileLeft)) {
							nearestNode.x--;
						}
					}
					// If the north axis is blocked.
					if (blockedAxis.north) {
						// Get the tile to the north of the instance
						const tileUp = VYLO.Map.getLocByPos(instancePosition.x, instancePosition.y + this.tileSize.height / 2, pInstance.mapName);
						// If the tile to the north is invalid then we shift to the next node.
						if (this.isTileInvalid(tileUp)) {
							nearestNode.y++;
						}
					}
					// If the south axis is blocked.
					if (blockedAxis.south) {
						// Get the tile to the south of the instance
						const tileDown = VYLO.Map.getLocByPos(instancePosition.x, instancePosition.y - this.tileSize.height / 2, pInstance.mapName);
						if (this.isTileInvalid(tileDown)) {
							nearestNode.y--;
						}
					}
					// Update the start node position based on the blocked axis.
					startNode = nearestNode;
				}
				const allAxisBlocked = (blockedAxis.west && blockedAxis.east && blockedAxis.north && blockedAxis.south);
				// If the options isn't set to nearest, or if all axis are blocked. We return that no path has been found.
				if (!pOptions.nearest || allAxisBlocked) {
					if (this.debugging) {
						const startTileOverlay = VYLO.newDiob();
						startTileOverlay.atlasName = '';
						startTileOverlay.width = this.tileSize.width;
						startTileOverlay.height = this.tileSize.height;
						startTileOverlay.tint = 0xFF0000;
						startTileOverlay.alpha = 0.7;
						startTileOverlay.plane = 0;
						startTileOverlay.touchOpacity = 0;
						startTileOverlay.touchOpacity = 0;
						startTileOverlay.setTransition({ alpha: 0 }, -1, debuggerDuration);
						startTile.addOverlay(startTileOverlay);
						setTimeout(() => {
							endTile.removeOverlay(startTileOverlay);
						}, debuggerDuration);
					}
					// No path was found because all axis are blocked or the option to find the nearest valid path is not toggled on.
					// So fire the path not found event.	
					if (typeof(self.onPathNotFound) === 'function') {
						self.onPathNotFound();
					}
					this.end(pInstance);
					return;
				}
			}
	
			// If the end tile is invalid to be walked on.
			/**
			 * @todo Create a closest to path instead.
			 */
			if (this.isTileInvalid(endTile)) {
				if (pOptions.nearest) {
					const nearestNode = this.getNearestNode(pInstance, endNode, endNodeX, endNodeY);
					endNode = nearestNode;
				} else {
					// No path was found due to tend tile not being walkable and
					if (typeof(self.onPathNotFound) === 'function') {
						self.onPathNotFound();
					}
					if (this.debugging) {
						endTile.getOverlays().filter((pElement) => { 
							pElement.tint = 0xFF0000; 
						});
					}
					this.end(pInstance);
					return;
				}
			}
			// Generate the path for the player
			const generatedPath = this.getPath({x: startNode.x, y: startNode.y }, { x: endNode.x, y: endNode.y });
			// Store the path
			instanceData.path = generatedPath.path;
			// Store the pathID
			instanceData.pathID = generatedPath.pathID;
			// When a path is found, fire the event function.
			if (generatedPath.path) {
				if (typeof(self.onPathFound) === 'function') {
					self.onPathFound();
				}
			// If no path was found, fire the event function.
			} else {
				if (typeof(self.onPathNotFound) === 'function') {
					self.onPathNotFound();
				}
				// If no path is found then we end the pathfinding on this instance.
				this.end(pInstance);
			}
		} else {
			this.logger.prefix('Pathway-Module').error('Invalid type passed for pInstance. Expecting an object.');
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
			// Reset posiiton origin.
			instanceData.positionFromCenter = false;
			// Reset trajectory data
			instanceData.trajectory.x = 0;
			instanceData.trajectory.y = 0;
			instanceData.trajectory.angle = 0;
			instanceData.trajectory.nextNodePos = null;
			// Reset stuck counter
			instanceData.stuckCounter = 0;
			// Empty path(s) array
			instanceData.path.length = 0;
			// Reset it to not being moved.
			instanceData.moving = false;
			// Reset the mode
			instanceData.mode = 'collision';
			// Stop instance from moving via VYLO API.
			pInstance.move();
		} else {
			this.logger.prefix('Pathway-Module').error('No instance data found from pInstance. This instance is not engaged in pathfinding.');
		}
	}
	getNearestNode(pInstance, pNode, pNodeX, pNodeY, pBlockedAxis = { west: false, east: false, north: false, south: false }, pStart) {
		const instancePosition = this.getPositionFromInstance(pInstance);
		if (pNode) {
			/**
			 * Object holding nearest tiles.
			 */
			let nearestTiles = {};
			/**
			 * Object holding rejected tiles.
			 */
			let rejectedTiles = {};
			// The nearest node to use to travel to.
			let nodeToUse;
			for (let i = 1; i <= PathwaySingleton.MAX_NEAREST_TILE_SEARCH; i++) {
				const tileLeft = VYLO.Map.getLocByPos(pNodeX - (i * this.tileSize.width / 2), pNodeY, pInstance.mapName);
				const tileRight = VYLO.Map.getLocByPos(pNodeX + (i * this.tileSize.width / 2), pNodeY, pInstance.mapName);
				const tileUp = VYLO.Map.getLocByPos(pNodeX, pNodeY - (i * this.tileSize.height / 2), pInstance.mapName);
				const tileDown = VYLO.Map.getLocByPos(pNodeX, pNodeY + (i * this.tileSize.height / 2), pInstance.mapName);

				if (tileLeft && !pBlockedAxis.west && !(((tileLeft.density && !ignoreList.includes(tileLeft)) || tileLeft.getContents().filter((pElement) => {
					// Only use this if pStart is true
					const withinYAxis = !pStart ? true : Utils.within(instancePosition.y, pElement.y + pElement.yOrigin, pElement.yOrigin + pElement.height);
					if (pElement.density && !ignoreList.includes(pElement) && withinYAxis) {
						return pElement.density;
					}
					}).length)))
				{
					nearestTiles[tileLeft.id] = tileLeft;
				} else {
					if (tileLeft) rejectedTiles[tileLeft.id] = tileLeft;
					// Only block this direction if it's a direct route from the current tile
					if (i <= 1) pBlockedAxis.west = true;
				}

				if (tileRight && !pBlockedAxis.east && !(((tileRight.density && !ignoreList.includes(tileRight)) || tileRight.getContents().filter((pElement) => {
					// Only use this if pStart is true
					const withinYAxis = !pStart ? true : Utils.within(instancePosition.y, pElement.y + pElement.yOrigin, pElement.yOrigin + pElement.height);
					if (pElement.density && !ignoreList.includes(pElement) && withinYAxis) {
						return pElement.density;
					}
					}).length)))
				{
					nearestTiles[tileRight.id] = tileRight;
				} else {
					if (tileRight) rejectedTiles[tileRight.id] = tileRight;
					// Only block this direction if it's a direct route from the current tile
					if (i <= 1) pBlockedAxis.east = true;
				}

				if (tileUp && !pBlockedAxis.north && !(((tileUp.density && !ignoreList.includes(tileUp)) || tileUp.getContents().filter((pElement) => {
					// Only use this if pStart is true
					const withinXAxis = !pStart ? true : Utils.within(instancePosition.x, pElement.x + pElement.xOrigin, pElement.xOrigin + pElement.width);
					if (pElement.density && !ignoreList.includes(pElement) && withinXAxis) {
						return pElement.density;
					}
					}).length))) 
				{
					nearestTiles[tileUp.id] = tileUp;
				} else {
					if (tileUp) rejectedTiles[tileUp.id] = tileUp;
					// Only block this direction if it's a direct route from the current tile
					if (i <= 1) pBlockedAxis.north = true;
				}

				if (tileDown && !pBlockedAxis.south && !(((tileDown.density && !ignoreList.includes(tileDown)) || tileDown.getContents().filter((pElement) => {
					// Only use this if pStart is true
					const withinXAxis = !pStart ? true : Utils.within(instancePosition.x, pElement.x + pElement.xOrigin, pElement.xOrigin + pElement.width);
					if (pElement.density && !ignoreList.includes(pElement) && withinXAxis) {
						return pElement.density;
					}
					}).length))) 
				{
					nearestTiles[tileDown.id] = tileDown;
				} else {
					if (tileDown) rejectedTiles[tileDown.id] = tileDown;
					// Only block this direction if it's a direct route from the current tile
					if (i <= 1) pBlockedAxis.south = true;
				}
			}

			let nearestNode;
			
			if (this.debugging) {
				for (const rT in rejectedTiles) {
					const overlay = VYLO.newDiob();
					overlay.tint = 0xFF0000;
					overlay.atlasName = '';
					overlay.width = this.tileSize.width;
					overlay.height = this.tileSize.height;
					// red and orange signify a tile that is unreachable
					overlay.tint = (pStart ? 0xffa500 : 0xFF0000);
					overlay.alpha = 0.3;
					overlay.plane = 0;
					overlay.mouseOpacity = 0;
					overlay.touchOpacity = 0;
					overlay.setTransition({ alpha: 0 }, -1, debuggerDuration);
					rejectedTiles[rT].addOverlay(overlay);
					setTimeout(() => {
						rejectedTiles[rT].removeOverlay(overlay);
					}, debuggerDuration);
				}
			}

			for (const nT in nearestTiles) {
				if (this.debugging) {
					const overlay = VYLO.newDiob();
					overlay.tint = 0xFF0000;
					overlay.atlasName = '';
					overlay.width = this.tileSize.width;
					overlay.height = this.tileSize.height;
					// blue and green signify a tile that is reachable
					overlay.tint = (pStart ? 0x87ceeb : 0x00ff00);
					overlay.alpha = 0.3;
					overlay.plane = 0;
					overlay.mouseOpacity = 0;
					overlay.touchOpacity = 0;
					overlay.setTransition({ alpha: 0 }, -1, debuggerDuration);
					nearestTiles[nT].addOverlay(overlay);
					setTimeout(() => {
						nearestTiles[nT].removeOverlay(overlay);
					}, debuggerDuration);
				}

				const node = this.tileToNode(nearestTiles[nT]);
				if (nearestNode) {
					const nearestNodeDistance = Utils.getDistance(pNode, nearestNode);
					const distance = Utils.getDistance(pNode, node);
					// This means the nearest node has been changed now, since we found one with a closer distance
					if (distance < nearestNodeDistance) {
						nearestNode = node;
					}
				} else {
					nearestNode = node;
				}
			}
			nodeToUse = nearestNode ? nearestNode : pNode;
			return nodeToUse;
		}
	}

	getBlockingSides(pInstance, pStartNodeX, pStartNodeY, pEndNodeX, pEndNodeY) {
		const instancePosition = this.getPositionFromInstance(pInstance);
		const obstacleBlockingLeft = (pEndNodeX <= instancePosition.x && pStartNodeX >= instancePosition.x);
		const obstacleBlockingRight = (pEndNodeX >= instancePosition.x && pStartNodeX <= instancePosition.x);
		const obstacleBlockingUp = (pEndNodeY <= instancePosition.y && pStartNodeY >= instancePosition.y);
		const obstacleBlockingDown = (pEndNodeY >= instancePosition.y && pStartNodeY <= instancePosition.y);
		return { 
			west: obstacleBlockingLeft, 
			east: obstacleBlockingRight, 
			north: obstacleBlockingUp, 
			south: obstacleBlockingDown 
		};
	}
	/**
	 * Gets the position from the instance based on the pathfinding info. Centered position from the icon, or geometrical or from top left origin.
	 * @param {Object} pInstance - The instance to get the position from.
	 * @private
	 * @returns {Object} - The position of the instance.
	 */
	getPositionFromInstance(pInstance) {
		const instanceData = this.instanceWeakMap.get(pInstance);
		if (instanceData) {
			// If the position is acquired from the center.
			if (instanceData.positionFromCenter) {
				// Get the center position from the center of the icon bounds.
				if (pInstance.icon.width && pInstance.icon.height) {
					instanceData.currentPosition.x = Math.floor(pInstance.x + pInstance.icon.width / 2);
					instanceData.currentPosition.y = Math.floor(pInstance.y + pInstance.icon.height / 2);
				// Grab the center position from the center of the geometrical bounds.
				} else {
					instanceData.currentPosition.x = Math.floor(pInstance.x + pInstance.xOrigin + pInstance.width / 2);
					instanceData.currentPosition.y = Math.floor(pInstance.y + pInstance.yOrigin + pInstance.height / 2);
				}
			} else {
				instanceData.currentPosition.x = pInstance.x;
				instanceData.currentPosition.y = pInstance.y;
			}
			return instanceData.currentPosition;
		}
	}
	/**
	 * Updates active instances on the pathfinder.
	 * @returns 
	 */
	update() {
		const instance = null;
		// Get the instance data for this instance
		const instanceData = this.instanceWeakMap.get(instance);
		if (instanceData) {
			// Get current timestamp
			const now = Date.now();
			// Get the elapsed ms from the last tick
			this.elapsedMS = now - this.lastTime;
			// Get the delta time between the last tick
			this.deltaTime = (this.elapsedMS / 1000);
			// If the delta time grows too large, we clamp it
			if (this.deltaTime >= PathwaySingleton.MAX_DELTA_TIME) {
				this.deltaTime = PathwaySingleton.CLAMPED_DELTA_TIME;
			}
			
			// Calculate the path
			instanceData.easystar.calculate();

			// If this instance is being moved
			if (instanceData.path.length || instanceData.moving) {
				// Get the position of the instance
				const instancePosition = this.getPositionFromInstance(instance);
				// If the instance is not moving
				if (!instanceData.moving) {
					// Get the next node to travel to.
					const node = instanceData.path.shift();
					// Get the position of that node in real world coordinates.
					const nodePos = { x: (node.x * this.tileSize.width) - this.tileSize.width / 2, y: (node.y * this.tileSize.height) - this.tileSize.height / 2 };
					// Debug mode to visualize the next node
					if (this.debugging) {
						const nextTile = VYLO.Map.getLocByPos(nodePos.x, nodePos.y, instance.mapName);
						const nextPathInTileVisual = VYLO.newDiob();
						nextPathInTileVisual.atlasName = '';
						nextPathInTileVisual.width = this.tileSize.width;
						nextPathInTileVisual.height = this.tileSize.height;
						nextPathInTileVisual.tint = 0x005aff;
						nextPathInTileVisual.alpha = 0.8;
						nextPathInTileVisual.plane = 0;
						nextPathInTileVisual.mouseOpacity = 0;
						nextPathInTileVisual.touchOpacity = 0;
						nextPathInTileVisual.setTransition({ alpha: 0 }, -1, debuggerDuration);
						nextTile.addOverlay(nextPathInTileVisual);
						setTimeout(() => {
							nextTile.removeOverlay(nextPathInTileVisual);
						}, debuggerDuration);
					}
					
					// Update the trajectory of the instance to be moved in.
					instanceData.trajectory.angle = Utils.getAngle2(instancePosition, nodePos);
					// Store the next node position
					instanceData.trajectory.nextNodePos = nodePos;
					// Get the trajectory of where to move the instance
					instanceData.trajectory.x = Math.cos(instanceData.trajectory.angle);
					instanceData.trajectory.y = -Math.sin(instanceData.trajectory.angle);
					// Update the direction of the instance.
					instance.dir = Utils.getDirection(instanceData.trajectory.angle);
					// Move the instance with collision mode or positional mode
					if (instanceData.mode === 'collision') {
						instance.movePos(instanceData.trajectory.x, instanceData.trajectory.y);
					} else if (instanceData.mode === 'position') {
						instance.setPos(instanceData.trajectory.x, instanceData.trajectory.y, instance.mapName);
					}
					instanceData.moving = true;

					// Debug mode to visualize the angle to move in
					if (this.debugging) {
						const pathAngle = VYLO.newDiob();
						pathAngle.atlasName = '';
						pathAngle.tint = 0xFFFFFF;
						pathAngle.width = this.tileSize.width;
						pathAngle.height = 5;
						pathAngle.anchor = 0;
						pathAngle.plane = 0;
						pathAngle.mouseOpacity = 0;
						pathAngle.touchOpacity = 0;
						pathAngle.density = 0;
						pathAngle.angle = instanceData.trajectory.angle;
						pathAngle.setPos(instancePosition.x, instancePosition.y, self.mapName);
						pathAngle.setTransition({ alpha: 0 }, -1, debuggerDuration);
						setTimeout(() => {
							VYLO.delDiob(pathAngle);
						}, debuggerDuration);
					}
				} else {
					// Get the distance from the instance's position to the next node's position.
					const distance = Math.floor(Utils.getDistance(instancePosition, instanceData.trajectory.nextNodePos));
					// Stop moving when you are this close distance.
					if (distance <= instance.moveSettings.stepSize) {
						// Stop moving
						instanceData.moving = false;
						// Reset stuck counter when moving has "stopped".
						instanceData.stuckCounter = 0;
						// If there is no more nodes left in the path
						if (!instanceData.path.length) {
							// You have completed the path. Call the event function if supplied.
							if (typeof(self.onPathComplete) === 'function') {
								// Passes the ID so that the developer can use it for tracking
								self.onPathComplete(instanceData.pathID);
							}
							this.end(instance);
						}
					} else {
						instanceData.trajectory.angle = Utils.getAngle2(instancePosition, instanceData.trajectory.nextNodePos);
						instanceData.trajectory.x = Math.cos(instanceData.trajectory.angle);
						instanceData.trajectory.y = -Math.sin(instanceData.trajectory.angle);
						instance.dir = Utils.getDireciton(instanceData.trajectory.angle);
						instance.movePos(instanceData.trajectory.x, instanceData.trajectory.y);
						instanceData.moving = true;
					}
				}
				// If the instance's position is in the same spot it was in the last tick
				if (instancePosition.x === instanceData.previousPosition.x && instancePosition.y === instanceData.previousPosition.y) {
					// Increment the stuck counter
					instanceData.stuckCounter++;
					// Chekck if the stuck counter is greater or equal to the max stuck counter
					if (instanceData.stuckCounter >= PathwaySingleton.MAX_STUCK_COUNTER) {
						// End this pathfinding.
						this.end(instance);
						// Call the stuck event if defined.
						if (typeof(self.onPathStuck) === 'function') {
							self.onPathStuck();
							return;
						}
					}
				}
				// Store the previous position as the position of this tick
				instanceData.previousPosition = instancePosition;
			}
			// Store this tick's time
			this.lastTime = now;
		}
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
	 * @param {Object} pTile - The tile to check the validity of.
	 * @returns {boolean} - If this tile is valid or invalid.
	 */
	isTileInvalid(pTile) {
		// If this tile in invalid as its dense and not on the ignored list.
		const invalidTile = pTile.density && !ignoreList.includes(pTile);
		// We check to see if there are any instances that exist on this tile that would "block" the instance from moving onto it and potentially making it stuck.
		const invalidInstacesOnTile = pTile.getContents().filter((pElement) => { 
			if (pElement.density && !ignoreList.includes(pElement)) {
				return pElement.density;
			}
		});
		// If this tile is invalid.
		return (pTile && (invalidTile || invalidInstacesOnTile.length));
	}
	/**
	 * 
	 * @param {Object} pOrigin - An object containing the start x and y position. 
	 * @property {number} pOrigin.x - The start x coordinate.
	 * @property {number} pOrigin.y -The start y coordinate.
	 * @param {Object} pDestination - An object containing the end x and y position to travel to.
	 * @property {number} pDestination.x - The end x coordinate.
	 * @property {number} pDestination.y - The end y coordinate.
	 * @returns {Array} An array containing the path from the start position to the end position.
	 */
	async getPath(pOrigin, pDestination) {
		return new Promise((pResolve) => {
			// Find the path
			const pathID = this.easystar.findPath(pOrigin.x, pOrigin.y, pDestination.x, pDestination.y, (pPath) => {
				// Check if the path is valid.
				if (Array.isArray(pPath) && pPath.length) {
					// Offset the nodes by 1, because VYLO xCoord and yCoord start at 1.
					pPath = pPath.map((pElement) => {
						++pElement.x;
						++pElement.y;
						return pElement;
					});
					// Remove the node you start on.
					pPath.shift();
					// Resolve with the path and pathID
					pResolve({
						path: pPath,
						pathID: pathID
					});
				// If no path was found or it was an empty path
				} else if (!Array.isArray(pPath) || !pPath.length) {
					// Resolve with the an empty path and no pathID
					pResolve({
						path: null,
						pathID: null
					});
				}
			});
		});
	}
	/**
	 * Converts an array to an 2D array.
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
	 * @param {string} pMapName - The mapname where the tile should come from.
	 * @param {Array} pIgnoreList - The ignore list to use for this grid.
	 * @returns {Object|undefined} An object containing the grid created, an array of tiles that are to be accepted in the pathfinding system, and the weights of each tile.
	 */
	mapTilesToGrid(pMapName, pIgnoreList) {
		if (typeof(pMapName) === 'string') {
			if (Array.isArray(pIgnoreList)) {
				// We check if this is a valid mapname found in VYLO.
				if (VYLO.Map.getMaps().includes(pMapName)) {
					let tilesArray;
					// An array of accepted tiles to be walked on.
					const acceptedTiles = [0];
					// An array holding the weights of tiles.
					const weights = [];
					// Get the dimensions of the map that was passed.
					const mapSize = VYLO.Map.getMapSize(pMapName);

					// We check if we have stored tiles from this map before. If so we cache them.
					if (PathwaySingleton.storedMapTiles[pMapName]) {
						// We get the tile array from memory and clone it.
						tilesArray = [...PathwaySingleton.storedMapTiles[pMapName].tiles];
					} else {
						tilesArray = VYLO.Map.getTiles(pMapName);
						// We store a copy of this array, because that array gets manipulated
						PathwaySingleton.storedMapTiles[pMapName] = { tiles: [...tilesArray], tiles2d: this.toTwoDimensionalArray([...tilesArray], mapSize.x) };
					}

					// Loop through the tiles array to build weights and accepted tile lists.
					tilesArray.map((pTile) => {
						let weight = typeof(pTile.pathwayWeight) === 'number' ? pTile.pathwayWeight : 0;

						// Check if the tile or any of its contents are dense
						if (pTile.density || pTile.getContents().some(instance => instance.density && !pIgnoreList.includes(instance))) {
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
						if (weight !== PathwaySingleton.NO_TRAVEL_WEIGHT) {
							if (!acceptedTiles.includes(weight)) acceptedTiles.push(weight);
							if (!weights.includes(weight)) weights.push(weight);
						}

						return weight;
					});

					return { 
						'acceptedTiles': acceptedTiles, 
						'grid': this.toTwoDimensionalArray(tilesArray, mapSize.x), 
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

export const Pathway = new PathwaySingleton();