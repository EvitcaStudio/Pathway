import { Utils } from './vendor/utils.min.mjs';
import { Logger } from './vendor/logger.min.mjs';
import { EasyStar } from './vendor/easystar-0.4.4.min.js';

/**
 * @todo Remove adding overlays
 * @todo Remove prototyping
 * @todo condense into Pathway class
 * @todo remove EPathfinder prefix
 * @todo Add weakmaps to reference data and not mutate
 * @todo Test on server
 * @todo Remove tick / delta time ?? Move the instance in PPS (pixels per second) stop storing original step size and only allow player to input speed, or read from move settings.
 * @todo remove stepSlide ?? Figure out why its used.
 * @todo reuse references and stop recreating objects per tick. This gets intensive for no reason.
 * @todo allow path to be returned without traveling it.
 * @todo add utils module for API, get rid of additional angle and etc API
 * @todo make debugging class
 * @todo Add in README that this is expecting VYLO variable to be global.
 * @todo storedMapTiles variable should be cached on a "global" level. As a static func on the pathway class. To get cached info.
 * @todo cachedResourcesInfo variable should be cached on a "global" level. As a static func on the pathway class.
 * @todo Add tweakable stuck data. Allowing devs to change the stuck counter and etc.
 * @todo Allow devs to "pass" data to the pathway class. Such as assigning the tile size. Pathway.setTileSize(32) The default will be 32. This will be used in calculations.
 * @todo Create a "rectangle" between start and end nodes. That way you won't need to process the entire map grid when moving small distances.
 * @todo Easy way to use reversed path.
 * @todo Use icon width to get center when applicable.
 * @todo JSDOC annotations
 * @todo Look into better method for getting index of 2D array lol.
 */


const protoDiob = VYLO.newDiob();
protoDiob.__proto__.constructor.prototype.cancelMove = function() {
	if (this.EPathfinderID && this.easystar) {
		this.easystar.cancelPath(this.EPathfinderID);
		this.EPathfinderID = null;
	}

	if (!this.EPathfinderTrajectory) {
		this.EPathfinderTrajectory = { angle: 0, x: 0, y: 0, nextNodePos: null, lastTime: 0, deltaTime: 0, elapsedMS: 0 };
	} else {
		this.EPathfinderTrajectory.x = 0;
		this.EPathfinderTrajectory.y = 0;
		this.EPathfinderTrajectory.angle = 0;
		this.EPathfinderTrajectory.lastTime = 0;
		this.EPathfinderTrajectory.deltaTime = 0;
		this.EPathfinderTrajectory.elapsedMS = 0;
		this.EPathfinderTrajectory.nextNodePos = null;
	}

	this.EPathfinderPath = [];
	this.EPathfinderPathReversed = [];
	this.EPathfinderMoving = false;

	if (this.moveSettings) {
		this.moveSettings.stepSlide = false;
		this.moveSettings = this.moveSettings;
	}

	// Restore the original stepSize
	if (this.EPathfinderOriginalStepSize) this.moveSettings.stepSize = this.EPathfinderOriginalStepSize;

	this.move();
	clearInterval(this.EPathfinderTrajectory.interval);
}


protoDiob.__proto__.constructor.prototype.goTo = function(pX, pY, pDiagonal = false, pNearest = false, pExclude = []) {
	// pNearest will only search the closest MAX_NEAREST_TILE_SEARCH tiles or so to find a near tile. If no near tile is found, no path is returned.
	if (this && this.mapName && this.x !== 10000 && this.y !== 10000) {
		const TILE_SIZE = VYLO.World.getTileSize();
		const TICK_FPS = 16.67;
		const MAX_ELAPSED_MS = TICK_FPS * 4;
		const MAX_NEAREST_TILE_SEARCH = 6;
		const STUCK_MAX_COUNTER = 100;
		const mapSize = VYLO.Map.getMapSize(this.mapName);
		const debuggerDuration = 3000;
		const self = this;
		let stuckCounter = 0;
		let storedCoords = { x: 0, y: 0 };

		if (!this.easystar) {
			this.easystar = new EasyStar.js();
			this.easystar.setIterationsPerCalculation(1000);
		}
		
		const currentTile = VYLO.Map.getLocByPos(Math.round(this.x + this.xOrigin + this.width / 2), Math.round(this.y + this.yOrigin + this.height / 2), this.mapName);

		if (!pExclude.includes(currentTile)) {	
			pExclude.push(currentTile);
			pExclude.push(this);
		}

		this.cancelMove();

		if (this.moveSettings) {
			this.moveSettings.stepSlide = true;
			this.moveSettings.stepGlide = true;
			this.moveSettings = this.moveSettings;
		} else {
			this.moveSettings = { stepSlide: true, stepGlide: true, stepSize: 2 };
		}

		// Store the original stepsize because it will be changed via delta time calculations, and we will reset it after the path is done
		this.EPathfinderOriginalStepSize = this.moveSettings.stepSize;
		
		this.EPathfinderTrajectory.interval = setInterval(() => {
			const now = Date.now();
			if (now > this.EPathfinderTrajectory.lastTime) {
				this.EPathfinderTrajectory.elapsedMS = now - this.EPathfinderTrajectory.lastTime;
				if (this.EPathfinderTrajectory.elapsedMS > MAX_ELAPSED_MS) {
					// check here, if warnings are showing up about setInterval taking too long
					this.EPathfinderTrajectory.elapsedMS = MAX_ELAPSED_MS;
				}

				this.EPathfinderTrajectory.deltaTime = (this.EPathfinderTrajectory.elapsedMS / TICK_FPS);
			}

			// Get the stepSize multiplied by delta time to get the correct size movement
			this.moveSettings.stepSize = this.EPathfinderOriginalStepSize * this.EPathfinderTrajectory.deltaTime;

			self.easystar.calculate();

			if ((self.EPathfinderPath && self.EPathfinderPath.length) || self.EPathfinderMoving) {
				const coords = { x: Math.round(self.x + self.xOrigin + self.width / 2), y: Math.round(self.y + self.yOrigin + self.height / 2) };
				if (!this.EPathfinderMoving) {
					const node = self.EPathfinderPath.shift();
					const nodePos = { x: (node.x * TILE_SIZE.width) - TILE_SIZE.width / 2, y: (node.y * TILE_SIZE.height) - TILE_SIZE.height / 2 };
					// Show the next tile in the path to move to
					if (EPathfinder.debugging) {
						const nextTile = VYLO.Map.getLocByPos(nodePos.x, nodePos.y, self.mapName);
						const nextPathInTileVisual = VYLO.newDiob('Overlay');
						nextPathInTileVisual.atlasName = '';
						nextPathInTileVisual.width = TILE_SIZE.width;
						nextPathInTileVisual.height = TILE_SIZE.height;
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

					self.EPathfinderTrajectory.angle = EPathfinder.getAngle(coords, nodePos);
					self.EPathfinderTrajectory.nextNodePos = nodePos;
					self.EPathfinderTrajectory.x = Math.cos(self.EPathfinderTrajectory.angle); // This is already multiplied by stepSize when using movePos
					self.EPathfinderTrajectory.y = Math.sin(self.EPathfinderTrajectory.angle); // This is already multiplied by stepSize when using movePos
					self.dir = EPathfinder.getDirFromAngle(-self.EPathfinderTrajectory.angle);
					self.movePos(self.EPathfinderTrajectory.x, self.EPathfinderTrajectory.y);
					self.EPathfinderMoving = true;

					// Show the angle to move in
					if (EPathfinder.debugging) {
						const pathAngle = VYLO.newDiob();
						pathAngle.atlasName = '';
						pathAngle.tint = 0xFFFFFF;
						pathAngle.width = TILE_SIZE.width;
						pathAngle.height = 5;
						pathAngle.anchor = 0;
						pathAngle.plane = 0;
						pathAngle.mouseOpacity = 0;
						pathAngle.touchOpacity = 0;
						pathAngle.density = 0;
						pathAngle.angle = -self.EPathfinderTrajectory.angle;
						pathAngle.setPos(coords.x, coords.y, self.mapName);
						pathAngle.setTransition({ alpha: 0 }, -1, debuggerDuration);
						setTimeout(() => {
							VYLO.delDiob(pathAngle);
						}, debuggerDuration);
					}
				} else {
					const distance = Math.round(EPathfinder.getDistance(coords, self.EPathfinderTrajectory.nextNodePos));
					if (distance <= self.EPathfinderOriginalStepSize) {
						self.EPathfinderMoving = false;
						stuckCounter = 0;
						if (!self.EPathfinderPath.length) {
							if (typeof(self.onPathComplete) === 'function') {
								// Passes the ID so that the developer can use it for tracking
								self.onPathComplete(self.EPathfinderID);
							}
							self.cancelMove();
						}
					} else {
						self.EPathfinderTrajectory.angle = EPathfinder.getAngle(coords, self.EPathfinderTrajectory.nextNodePos);
						self.EPathfinderTrajectory.x = Math.cos(self.EPathfinderTrajectory.angle); // This is already multiplied by stepSize when using movePos
						self.EPathfinderTrajectory.y = Math.sin(self.EPathfinderTrajectory.angle); // This is already multiplied by stepSize when using movePos
						self.dir = EPathfinder.getDirFromAngle(-self.EPathfinderTrajectory.angle);
						self.movePos(self.EPathfinderTrajectory.x, self.EPathfinderTrajectory.y);
						self.EPathfinderMoving = true;
					}
				}
				if (coords.x === storedCoords.x && coords.y === storedCoords.y) {
					stuckCounter++;
					if (stuckCounter >= STUCK_MAX_COUNTER) {
						self.cancelMove();
						if (typeof(self.onPathStuck) === 'function') {
							self.onPathStuck();
							return;
						}
					}
				}
				storedCoords = coords;
			}
			this.EPathfinderTrajectory.lastTime = Date.now();
		}, 16);

		// Disable diagonals in the event they were enabled in a previous call
		this.easystar.disableDiagonals();
		// Disable corner cutting in the event it was enabled in a previous call
		this.easystar.disableCornerCutting();

		// Enable diagonals if the developer wants diagonal
		if (pDiagonal) {
			this.easystar.enableDiagonals();
			// This can only be used with diagonals enabled
			this.easystar.enableCornerCutting();
		}

		// Build the 2d array grid that represents the map, the pathfinder is passed along so it can determine the weight of the tiles on the map
		const gridInfo = EPathfinder.mapTilesToGrid(this.mapName, pExclude);
		const grid = gridInfo.grid;
		const acceptedTiles = gridInfo.acceptedTiles;
		const weights = gridInfo.weights;

		// Assign the map to the pathfinder
		this.easystar.setGrid(grid);
		// Assign the weight of each tile
		weights.forEach((pWeight) => {
			self.easystar.setTileCost(pWeight, pWeight);
		});
		// Assign what tiles can be used
		this.easystar.setAcceptableTiles(acceptedTiles);

		const startNodeX = Math.round(this.x + this.xOrigin + this.width / 2);
		const startNodeY = Math.round(this.y + this.yOrigin + this.height / 2);
		const endNodeX = EPathfinder.clamp(Math.round(EPathfinder.clamp(pX - 1, 0, mapSize.x)) * TILE_SIZE.width + TILE_SIZE.width / 2, 0, mapSize.xPos - TILE_SIZE.width);
		const endNodeY = EPathfinder.clamp(Math.round(EPathfinder.clamp(pY - 1, 0, mapSize.y)) * TILE_SIZE.height + TILE_SIZE.height / 2, 0, mapSize.yPos - TILE_SIZE.height);
		const startTile = VYLO.Map.getLocByPos(startNodeX, startNodeY, this.mapName);
		// This end tile is based on the position you bounds are on (this can be a different tile)
		const endTile = VYLO.Map.getLocByPos(endNodeX, endNodeY, this.mapName);
		let startNode = EPathfinder.tileToNode(startTile);
		let endNode = EPathfinder.tileToNode(endTile);
		
		if (EPathfinder.debugging) {
			const endTileOverlay = VYLO.newDiob('Overlay');
			endTileOverlay.atlasName = '';
			endTileOverlay.width = TILE_SIZE.width;
			endTileOverlay.height = TILE_SIZE.height;
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

		const getNearestNode = function(pNode, pNodeX, pNodeY, pBlockingDirections = { left: false, right: false, up: false, down: false }, pStart) {
			if (pNode) {
				let nearestTiles = {};
				let rejectedTiles = {};
				let nodeToUse;
				for (let i = 1; i < MAX_NEAREST_TILE_SEARCH + 1; i++) {
					const tileLeft = VYLO.Map.getLocByPos(pNodeX - (i * TILE_SIZE.width / 2), pNodeY, self.mapName);
					const tileRight = VYLO.Map.getLocByPos(pNodeX + (i * TILE_SIZE.width / 2), pNodeY, self.mapName);
					const tileUp = VYLO.Map.getLocByPos(pNodeX, pNodeY - (i * TILE_SIZE.height / 2), self.mapName);
					const tileDown = VYLO.Map.getLocByPos(pNodeX, pNodeY + (i * TILE_SIZE.height / 2), self.mapName);

					if (tileLeft && !pBlockingDirections['left'] && !(((tileLeft.density && !pExclude.includes(tileLeft)) || tileLeft.getContents().filter((pElement) => {
						// Only use this if pStart is true
						const withinYAxis = !pStart ? true : EPathfinder.within(self.y + self.yOrigin + self.height, pElement.y + pElement.yOrigin, pElement.yOrigin + pElement.height);
						if (pElement.density && !pExclude.includes(pElement) && withinYAxis) {
							return pElement.density;
						}
						}).length)))
					{
						nearestTiles[tileLeft.id] = tileLeft;
					} else {
						if (tileLeft) rejectedTiles[tileLeft.id] = tileLeft;
						// Only block this direction if it's a direct route from the current tile
						if (i <= 1) pBlockingDirections['left'] = true;
					}

					if (tileRight && !pBlockingDirections['right'] && !(((tileRight.density && !pExclude.includes(tileRight)) || tileRight.getContents().filter((pElement) => {
						// Only use this if pStart is true
						const withinYAxis = !pStart ? true : EPathfinder.within(self.y + self.yOrigin + self.height, pElement.y + pElement.yOrigin, pElement.yOrigin + pElement.height);
						if (pElement.density && !pExclude.includes(pElement) && withinYAxis) {
							return pElement.density;
						}
						}).length)))
					{
						nearestTiles[tileRight.id] = tileRight;
					} else {
						if (tileRight) rejectedTiles[tileRight.id] = tileRight;
						// Only block this direction if it's a direct route from the current tile
						if (i <= 1) pBlockingDirections['right'] = true;
					}

					if (tileUp && !pBlockingDirections['up'] && !(((tileUp.density && !pExclude.includes(tileUp)) || tileUp.getContents().filter((pElement) => {
						// Only use this if pStart is true
						const withinXAxis = !pStart ? true : EPathfinder.within(self.x + self.xOrigin + self.width, pElement.x + pElement.xOrigin, pElement.xOrigin + pElement.width);
						if (pElement.density && !pExclude.includes(pElement) && withinXAxis) {
							return pElement.density;
						}
						}).length))) 
					{
						nearestTiles[tileUp.id] = tileUp;
					} else {
						if (tileUp) rejectedTiles[tileUp.id] = tileUp;
						// Only block this direction if it's a direct route from the current tile
						if (i <= 1) pBlockingDirections['up'] = true;
					}

					if (tileDown && !pBlockingDirections['down'] && !(((tileDown.density && !pExclude.includes(tileDown)) || tileDown.getContents().filter((pElement) => {
						// Only use this if pStart is true
						const withinXAxis = !pStart ? true : EPathfinder.within(self.x + self.xOrigin + self.width, pElement.x + pElement.xOrigin, pElement.xOrigin + pElement.width);
						if (pElement.density && !pExclude.includes(pElement) && withinXAxis) {
							return pElement.density;
						}
						}).length))) 
					{
						nearestTiles[tileDown.id] = tileDown;
					} else {
						if (tileDown) rejectedTiles[tileDown.id] = tileDown;
						// Only block this direction if it's a direct route from the current tile
						if (i <= 1) pBlockingDirections['down'] = true;
					}
				}

				let nearestNode;
				
				if (EPathfinder.debugging) {
					for (const rT in rejectedTiles) {
						const overlay = VYLO.newDiob('Overlay');
						overlay.tint = 0xFF0000;
						overlay.atlasName = '';
						overlay.width = TILE_SIZE.width;
						overlay.height = TILE_SIZE.height;
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
					if (EPathfinder.debugging) {
						const overlay = VYLO.newDiob('Overlay');
						overlay.tint = 0xFF0000;
						overlay.atlasName = '';
						overlay.width = TILE_SIZE.width;
						overlay.height = TILE_SIZE.height;
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

					const node = EPathfinder.tileToNode(nearestTiles[nT]);
					if (nearestNode) {
						const nearestNodeDistance = EPathfinder.getDistance(pNode, nearestNode);
						const distance = EPathfinder.getDistance(pNode, node);
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

		const getBlockingSides = function(pDiob, pStartNodeX, pStartNodeY, pEndNodeX, pEndNodeY) {
			const diobTruePos = { x: pDiob.x + pDiob.xOrigin + pDiob.width / 2, y: pDiob.y + pDiob.yOrigin + pDiob.height / 2};
			const obstacleBlockingLeft = (pEndNodeX <= diobTruePos.x && pStartNodeX >= diobTruePos.x);
			const obstacleBlockingRight = (pEndNodeX >= diobTruePos.x && pStartNodeX <= diobTruePos.x);
			const obstacleBlockingUp = (pEndNodeY <= diobTruePos.y && pStartNodeY >= diobTruePos.y);
			const obstacleBlockingDown = (pEndNodeY >= diobTruePos.y && pStartNodeY <= diobTruePos.y);
			return { left: obstacleBlockingLeft, right: obstacleBlockingRight, up: obstacleBlockingUp, down: obstacleBlockingDown };
		}

		if (startTile && ((startTile.density && !pExclude.includes(startTile)) || startTile.getContents().filter((pElement) => { if (pElement.density && !pExclude.includes(pElement)) return pElement.density }).length)) {
			let blockedSides;
			let blockingDirections = { left: false, right: false, up: false, down: false };					
			if (pNearest) {
				for (const diob of startTile.getContents()) {
					if (diob.density) {
						// This returns whether you can safely move to a new start position, and also changes the start position if you can.
						blockedSides = getBlockingSides(diob, startNodeX, startNodeY, endNodeX, endNodeY);
						if (blockedSides.left) blockingDirections.left = true;
						if (blockedSides.right) blockingDirections.right = true;
						if (blockedSides.up) blockingDirections.up = true;
						if (blockedSides.down) blockingDirections.down = true;
					}
				}

				let nearestNode = getNearestNode(startNode, startNodeX, startNodeY, blockingDirections, true);

				if (blockingDirections.left) {
					const tileRight = VYLO.Map.getLocByPos(startNodeX + TILE_SIZE.width / 2, startNodeY, self.mapName);
					if ((tileRight && ((tileRight.density && !pExclude.includes(tileRight)) || tileRight.getContents().filter((pElement) => { if (pElement.density && !pExclude.includes(pElement)) return pElement.density }).length))) {
						nearestNode.x++;
					}
				}
				if (blockingDirections.right) {
					const tileLeft = VYLO.Map.getLocByPos(startNodeX - TILE_SIZE.width / 2, startNodeY, self.mapName);
					if ((tileLeft && ((tileLeft.density && !pExclude.includes(tileLeft)) || tileLeft.getContents().filter((pElement) => { if (pElement.density && !pExclude.includes(pElement)) return pElement.density }).length))) {
						nearestNode.x--;
					}
				}
				if (blockingDirections.up) {
					const tileDown = VYLO.Map.getLocByPos(startNodeX, startNodeY + TILE_SIZE.height / 2, self.mapName);
					if ((tileDown && ((tileDown.density && !pExclude.includes(tileDown)) || tileDown.getContents().filter((pElement) => { if (pElement.density && !pExclude.includes(pElement)) return pElement.density }).length))) {
						nearestNode.y++;
					}
				}
				if (blockingDirections.down) {
					const tileUp = VYLO.Map.getLocByPos(startNodeX, startNodeY - TILE_SIZE.height / 2, self.mapName);
					if ((tileUp && ((tileUp.density && !pExclude.includes(tileUp)) || tileUp.getContents().filter((pElement) => { if (pElement.density && !pExclude.includes(pElement)) return pElement.density }).length))) {
						nearestNode.y--;
					}
				}

				startNode = nearestNode;
			}
			
			if (!pNearest || blockingDirections.left && blockingDirections.right && blockingDirections.up && blockingDirections.down) {
				if (EPathfinder.debugging) {
					const startTileOverlay = VYLO.newDiob('Overlay');
					startTileOverlay.atlasName = '';
					startTileOverlay.width = TILE_SIZE.width;
					startTileOverlay.height = TILE_SIZE.height;
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
				if (typeof(self.onPathNotFound) === 'function') {
					self.onPathNotFound(startTile);
				}
				self.cancelMove();
				return;
			}
		}

		// If the end tile is dense and it is not on the exclusion list then it cannot be traveled to. And no path is generated.
		// Possibly create a closest to path instead. Future update*
		if (endTile && ((endTile.density && !pExclude.includes(endTile)) || endTile.getContents().filter((pElement) => { if (pElement.density && !pExclude.includes(pElement)) return pElement.density }).length)) {
			let nearestNode;
			if (pNearest) {
				nearestNode = getNearestNode(endNode, endNodeX, endNodeY);
				endNode = nearestNode;
			}

			if (!pNearest) {
				if (typeof(self.onPathNotFound) === 'function') {
					self.onPathNotFound(endTile);
				}
				if (EPathfinder.debugging) {
					endTile.getOverlays().filter((pElement) => { 
						pElement.tint = 0xFF0000; 
					});
				}
				self.cancelMove();
				return;
			}
		}

		// Find the path
		this.EPathfinderID = this.easystar.findPath(startNode.x, startNode.y, endNode.x, endNode.y, (pPath) => {
			if (pPath && pPath.length) {
				pPath = pPath.map((pElement) => {
					++pElement.x;
					++pElement.y;
					return pElement;
				});
				// Before we remove the start node, we assign the reversed path WITH the start node included. Otherwise the pathfind would never go back to the original location
				const reversedPath = [...pPath].reverse();
				// This gets rid of the node you are already on. Makes no sense to travel to the node you already are on.
				pPath.shift();
				self.EPathfinderPath = pPath;
				self.EPathfinderPathReversed = reversedPath;
				if (typeof(self.onPathFound) === 'function') {
					self.onPathFound([...pPath], [...reversedPath]);
				}
			} else if (!pPath || !pPath.length) {
				if (typeof(self.onPathNotFound) === 'function') {
					self.onPathNotFound();
				}
				self.cancelMove();
			}
		});

	} else {
		console.error('EPathfinder: No mapName was found on this diob.');
		return;
	}
	return this.EPathfinderID;
};
VYLO.delDiob(protoDiob);


class Pathway {

}

class EPathfinderManager {
	constructor() {
		// a object that stores the map tiles in normal format and in 2d format
		this.storedMapTiles = {};
		// a object that stores the icon sizes of icons used in this library
		this.cachedResourcesInfo = {};
	}

	clamp(pVal, pMin, pMax) {
		return Math.max(pMin, Math.min(pVal, pMax));
	}

	within(pVal, pMin, pMax) {
		return pVal >= pMin && pVal <= pMax;
	}

	getAngle(pStartPoint, pEndPoint) {
		const y = (pStartPoint.y - pEndPoint.y);
		const x = (pStartPoint.x - pEndPoint.x);
		return Math.atan2(y, x) - Math.PI;
	}

	getDistance(pStartPoint, pEndPoint) {
		const y = (pStartPoint.y - pEndPoint.y);
		const x = (pStartPoint.x - pEndPoint.x);
		return Math.sqrt(x * x + y * y);
	}

	getDirFromAngle(pAngle) {
		const degree = Math.floor(((pAngle * (180 / Math.PI)) / 45) + 0.5);
		const compassDirections = ['east', 'northeast', 'north', 'northwest', 'west', 'southwest', 'south', 'southeast'];
		return compassDirections[(degree % 8)];
	}

	toTwoDimensionalArray(pArray, pLengthOfSubArray) {
		let i = 0;
		const result = [];
		while (i < pArray.length) {
			result.push(pArray.slice(i, i+= pLengthOfSubArray));
		}
		return result;
	}

	mapTilesToGrid(pMapName, pExclude) {
		if (pMapName) {
			if (VYLO.Map.getMaps().includes(pMapName)) {
				let tilesArray;
				const acceptedTiles = [0];
				const weights = [];
				const mapSize = VYLO.Map.getMapSize(pMapName);

				if (!this.storedMapTiles[pMapName]) {
					tilesArray = VYLO.Map.getTiles(pMapName);
					// We store a copy of this array, because that array gets manipulated
					this.storedMapTiles[pMapName] = { tiles: [...tilesArray], tiles2d: this.toTwoDimensionalArray([...tilesArray], mapSize.x) };
				} else {
					tilesArray = [...this.storedMapTiles[pMapName].tiles];
				}

				tilesArray.forEach((pElement, pIndex) => {
					const tile = pElement;
					// a weight of 0 indicates it is impassable.
					let weight = (((tile.EPathfinderWeight || tile.EPathfinderWeight === 0) && typeof(tile.EPathfinderWeight) === 'number') ? tile.EPathfinderWeight : 0);

					if (pExclude.includes(tile)) {
						// assign the previous assigned weight or just let it be passable
						weight = (weight ? weight : 0);
					}

					// if the tile itself is dense, then it is treated as a wall and it's weight does not matter however if this tile is in a excluded list then it will not be counted as a wall
					if (tile.density && !pExclude.includes(tile)) {
						weight = 1;
					}
					
					for (const diob of tile.getContents()) {
						// If something in this tile is dense, then it is treated as a wall if it is not in the exclusion list
						if (diob.density && !pExclude.includes(diob)) {
							weight = 1;
							break;
						}
						// This can be used to turn a tile that has a dense diob in it into a passable tile, if you deem that diob safe to pass. THIS CAN BREAK PATHFINDING. USE AT YOUR OWN DISCRETION
						if (typeof(diob.EPathfinderWeight) === 'number') {
							weight += diob.EPathfinderWeight;
						}
					}
					
					if (!acceptedTiles.includes(weight) && weight !== 1) {
						// This adds this weight to the tiles that are walkable in the easystar system
						acceptedTiles.push(weight);
						// Store the weight so we can assign it to tile in the grid
						weights.push(weight);
					}
					
					tilesArray[pIndex] = weight;
				});
				return { 'acceptedTiles': acceptedTiles, 'grid': this.toTwoDimensionalArray(tilesArray, mapSize.x), 'weights': weights };
			} else {
				console.error('EPathfinder: That mapname was not found.');
				return;
			}
		} else {
			console.error('EPathfinder: No mapname was passed.');
		}
	}

	getIndexOf2DArray(pArray, pValue) {
		for (let i = 0; i < pArray.length; i++) {
			let index = pArray[i].indexOf(pValue);
			if (index > -1) {
				return [i, index];
			}
		}
	}

	tileToNode(pTile) {
		if (pTile && pTile.mapName) {
			if (this.storedMapTiles[pTile.mapName]) {
				const index = this.getIndexOf2DArray(this.storedMapTiles[pTile.mapName].tiles2d, pTile);
				const node = { 'x': index[1], 'y': index[0] };
				return node;
			} else {
				console.error('EPathfinder: There is no stored grid for the map this tile belongs to.');
			}
		}
	}

	nodeToTile(pMapName, pNode) {
		return VYLO.Map.getLoc(pNode.x + 1, pNode.y + 1, pMapName);
	}

	toggleDebug() {
		this.debugging = !this.debugging;
	}
}

(typeof(window) !== 'undefined' ? window : global).EPathfinder = new EPathfinderManager();
