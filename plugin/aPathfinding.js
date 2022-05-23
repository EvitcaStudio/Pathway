(() => {
	// https://github.com/prettymuchbryce/easystarjs
	/*!
	* @license
	* The MIT License (MIT)
	* 
	* Copyright (c) 2012-2020 Bryce Neal
	* 
	* Permission is hereby granted, free of charge, to any person obtaining a copy
	* of this software and associated documentation files (the "Software"), to deal
	* in the Software without restriction, including without limitation the rights
	* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	* copies of the Software, and to permit persons to whom the Software is
	* furnished to do so, subject to the following conditions:
	* 
	* The above copyright notice and this permission notice shall be included in
	* all copies or substantial portions of the Software.
	* 
	* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	* THE SOFTWARE.
	*/
	var EasyStar=function(e){var o={};function r(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=e,r.c=o,r.d=function(t,n,e){r.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:e})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(n,t){if(1&t&&(n=r(n)),8&t)return n;if(4&t&&"object"==typeof n&&n&&n.__esModule)return n;var e=Object.create(null);if(r.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:n}),2&t&&"string"!=typeof n)for(var o in n)r.d(e,o,function(t){return n[t]}.bind(null,o));return e},r.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(n,"a",n),n},r.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},r.p="/bin/",r(r.s=0)}([function(t,n,e){var P={},M=e(1),_=e(2),A=e(3);t.exports=P;var E=1;P.js=function(){var c,i,f,s=1.4,p=!1,u={},o={},r={},l={},a=!0,h={},d=[],y=Number.MAX_VALUE,v=!1;this.setAcceptableTiles=function(t){t instanceof Array?f=t:!isNaN(parseFloat(t))&&isFinite(t)&&(f=[t])},this.enableSync=function(){p=!0},this.disableSync=function(){p=!1},this.enableDiagonals=function(){v=!0},this.disableDiagonals=function(){v=!1},this.setGrid=function(t){c=t;for(var n=0;n<c.length;n++)for(var e=0;e<c[0].length;e++)o[c[n][e]]||(o[c[n][e]]=1)},this.setTileCost=function(t,n){o[t]=n},this.setAdditionalPointCost=function(t,n,e){void 0===r[n]&&(r[n]={}),r[n][t]=e},this.removeAdditionalPointCost=function(t,n){void 0!==r[n]&&delete r[n][t]},this.removeAllAdditionalPointCosts=function(){r={}},this.setDirectionalCondition=function(t,n,e){void 0===l[n]&&(l[n]={}),l[n][t]=e},this.removeAllDirectionalConditions=function(){l={}},this.setIterationsPerCalculation=function(t){y=t},this.avoidAdditionalPoint=function(t,n){void 0===u[n]&&(u[n]={}),u[n][t]=1},this.stopAvoidingAdditionalPoint=function(t,n){void 0!==u[n]&&delete u[n][t]},this.enableCornerCutting=function(){a=!0},this.disableCornerCutting=function(){a=!1},this.stopAvoidingAllAdditionalPoints=function(){u={}},this.findPath=function(t,n,e,o,r){function i(t){p?r(t):setTimeout(function(){r(t)})}if(void 0===f)throw new Error("You can't set a path without first calling setAcceptableTiles() on EasyStar.");if(void 0===c)throw new Error("You can't set a path without first calling setGrid() on EasyStar.");if(t<0||n<0||e<0||o<0||t>c[0].length-1||n>c.length-1||e>c[0].length-1||o>c.length-1)throw new Error("Your start or end point is outside the scope of your grid.");if(t!==e||n!==o){for(var s=c[o][e],u=!1,l=0;l<f.length;l++)if(s===f[l]){u=!0;break}if(!1!==u){var a=new M;a.openList=new A(function(t,n){return t.bestGuessDistance()-n.bestGuessDistance()}),a.isDoneCalculating=!1,a.nodeHash={},a.startX=t,a.startY=n,a.endX=e,a.endY=o,a.callback=i,a.openList.push(O(a,a.startX,a.startY,null,1));o=E++;return h[o]=a,d.push(o),o}i(null)}else i([])},this.cancelPath=function(t){return t in h&&(delete h[t],!0)},this.calculate=function(){if(0!==d.length&&void 0!==c&&void 0!==f)for(i=0;i<y;i++){if(0===d.length)return;p&&(i=0);var t=d[0],n=h[t];if(void 0!==n)if(0!==n.openList.size()){var e=n.openList.pop();if(n.endX!==e.x||n.endY!==e.y)(e.list=0)<e.y&&T(n,e,0,-1,+b(e.x,e.y-1)),e.x<c[0].length-1&&T(n,e,1,0,+b(e.x+1,e.y)),e.y<c.length-1&&T(n,e,0,1,+b(e.x,e.y+1)),0<e.x&&T(n,e,-1,0,+b(e.x-1,e.y)),v&&(0<e.x&&0<e.y&&(a||g(c,f,e.x,e.y-1,e)&&g(c,f,e.x-1,e.y,e))&&T(n,e,-1,-1,s*b(e.x-1,e.y-1)),e.x<c[0].length-1&&e.y<c.length-1&&(a||g(c,f,e.x,e.y+1,e)&&g(c,f,e.x+1,e.y,e))&&T(n,e,1,1,s*b(e.x+1,e.y+1)),e.x<c[0].length-1&&0<e.y&&(a||g(c,f,e.x,e.y-1,e)&&g(c,f,e.x+1,e.y,e))&&T(n,e,1,-1,s*b(e.x+1,e.y-1)),0<e.x&&e.y<c.length-1&&(a||g(c,f,e.x,e.y+1,e)&&g(c,f,e.x-1,e.y,e))&&T(n,e,-1,1,s*b(e.x-1,e.y+1)));else{var o=[];o.push({x:e.x,y:e.y});for(var r=e.parent;null!=r;)o.push({x:r.x,y:r.y}),r=r.parent;o.reverse(),n.callback(o),delete h[t],d.shift()}}else n.callback(null),delete h[t],d.shift();else d.shift()}};var T=function(t,n,e,o,r){e=n.x+e,o=n.y+o;void 0!==u[o]&&void 0!==u[o][e]||!g(c,f,e,o,n)||(void 0===(o=O(t,e,o,n,r)).list?(o.list=1,t.openList.push(o)):n.costSoFar+r<o.costSoFar&&(o.costSoFar=n.costSoFar+r,o.parent=n,t.openList.updateItem(o)))},g=function(t,n,e,o,r){var i=l[o]&&l[o][e];if(i){var s=x(r.x-e,r.y-o);if(!function(){for(var t=0;t<i.length;t++)if(i[t]===s)return!0;return!1}())return!1}for(var u=0;u<n.length;u++)if(t[o][e]===n[u])return!0;return!1},x=function(t,n){if(0===t&&-1===n)return P.TOP;if(1===t&&-1===n)return P.TOP_RIGHT;if(1===t&&0===n)return P.RIGHT;if(1===t&&1===n)return P.BOTTOM_RIGHT;if(0===t&&1===n)return P.BOTTOM;if(-1===t&&1===n)return P.BOTTOM_LEFT;if(-1===t&&0===n)return P.LEFT;if(-1===t&&-1===n)return P.TOP_LEFT;throw new Error("These differences are not valid: "+t+", "+n)},b=function(t,n){return r[n]&&r[n][t]||o[c[n][t]]},O=function(t,n,e,o,r){if(void 0!==t.nodeHash[e]){if(void 0!==t.nodeHash[e][n])return t.nodeHash[e][n]}else t.nodeHash[e]={};var i=m(n,e,t.endX,t.endY),r=null!==o?o.costSoFar+r:0,i=new _(o,n,e,r,i);return t.nodeHash[e][n]=i},m=function(t,n,e,o){var r,i;return v?(r=Math.abs(t-e))<(i=Math.abs(n-o))?s*r+(i-r):s*i+(r=i):(r=Math.abs(t-e))+(i=Math.abs(n-o))}},P.TOP="TOP",P.TOP_RIGHT="TOP_RIGHT",P.RIGHT="RIGHT",P.BOTTOM_RIGHT="BOTTOM_RIGHT",P.BOTTOM="BOTTOM",P.BOTTOM_LEFT="BOTTOM_LEFT",P.LEFT="LEFT",P.TOP_LEFT="TOP_LEFT"},function(t,n){t.exports=function(){this.pointsToAvoid={},this.startX,this.callback,this.startY,this.endX,this.endY,this.nodeHash={},this.openList}},function(t,n){t.exports=function(t,n,e,o,r){this.parent=t,this.x=n,this.y=e,this.costSoFar=o,this.simpleDistanceToTarget=r,this.bestGuessDistance=function(){return this.costSoFar+this.simpleDistanceToTarget}}},function(t,n,e){t.exports=e(4)},function(u,T,t){var g,x;(function(){var t,p,l,h,d,n,a,e,y,v,o,r,i,c,f;function s(t){this.cmp=null!=t?t:p,this.nodes=[]}l=Math.floor,v=Math.min,p=function(t,n){return t<n?-1:n<t?1:0},y=function(t,n,e,o,r){var i;if(null==e&&(e=0),null==r&&(r=p),e<0)throw new Error("lo must be non-negative");for(null==o&&(o=t.length);e<o;)r(n,t[i=l((e+o)/2)])<0?o=i:e=i+1;return[].splice.apply(t,[e,e-e].concat(n)),n},n=function(t,n,e){return null==e&&(e=p),t.push(n),c(t,0,t.length-1,e)},d=function(t,n){var e,o;return null==n&&(n=p),e=t.pop(),t.length?(o=t[0],t[0]=e,f(t,0,n)):o=e,o},e=function(t,n,e){var o;return null==e&&(e=p),o=t[0],t[0]=n,f(t,0,e),o},a=function(t,n,e){var o;return null==e&&(e=p),t.length&&e(t[0],n)<0&&(n=(o=[t[0],n])[0],t[0]=o[1],f(t,0,e)),n},h=function(e,t){var n,o,r,i,s,u;for(null==t&&(t=p),s=[],o=0,r=(i=function(){u=[];for(var t=0,n=l(e.length/2);0<=n?t<n:n<t;0<=n?t++:t--)u.push(t);return u}.apply(this).reverse()).length;o<r;o++)n=i[o],s.push(f(e,n,t));return s},i=function(t,n,e){if(null==e&&(e=p),-1!==(n=t.indexOf(n)))return c(t,0,n,e),f(t,n,e)},o=function(t,n,e){var o,r,i,s,u;if(null==e&&(e=p),!(r=t.slice(0,n)).length)return r;for(h(r,e),i=0,s=(u=t.slice(n)).length;i<s;i++)o=u[i],a(r,o,e);return r.sort(e).reverse()},r=function(t,n,e){var o,r,i,s,u,l,a,c,f;if(null==e&&(e=p),10*n<=t.length){if(!(i=t.slice(0,n).sort(e)).length)return i;for(r=i[i.length-1],s=0,l=(a=t.slice(n)).length;s<l;s++)e(o=a[s],r)<0&&(y(i,o,0,null,e),i.pop(),r=i[i.length-1]);return i}for(h(t,e),f=[],u=0,c=v(n,t.length);0<=c?u<c:c<u;0<=c?++u:--u)f.push(d(t,e));return f},c=function(t,n,e,o){var r,i,s;for(null==o&&(o=p),r=t[e];n<e&&o(r,i=t[s=e-1>>1])<0;)t[e]=i,e=s;return t[e]=r},f=function(t,n,e){var o,r,i,s,u;for(null==e&&(e=p),r=t.length,i=t[u=n],o=2*n+1;o<r;)(s=o+1)<r&&!(e(t[o],t[s])<0)&&(o=s),t[n]=t[o],o=2*(n=o)+1;return t[n]=i,c(t,u,n,e)},s.push=n,s.pop=d,s.replace=e,s.pushpop=a,s.heapify=h,s.updateItem=i,s.nlargest=o,s.nsmallest=r,s.prototype.push=function(t){return n(this.nodes,t,this.cmp)},s.prototype.pop=function(){return d(this.nodes,this.cmp)},s.prototype.peek=function(){return this.nodes[0]},s.prototype.contains=function(t){return-1!==this.nodes.indexOf(t)},s.prototype.replace=function(t){return e(this.nodes,t,this.cmp)},s.prototype.pushpop=function(t){return a(this.nodes,t,this.cmp)},s.prototype.heapify=function(){return h(this.nodes,this.cmp)},s.prototype.updateItem=function(t){return i(this.nodes,t,this.cmp)},s.prototype.clear=function(){return this.nodes=[]},s.prototype.empty=function(){return 0===this.nodes.length},s.prototype.size=function(){return this.nodes.length},s.prototype.clone=function(){var t=new s;return t.nodes=this.nodes.slice(0),t},s.prototype.toArray=function(){return this.nodes.slice(0)},s.prototype.insert=s.prototype.push,s.prototype.top=s.prototype.peek,s.prototype.front=s.prototype.peek,s.prototype.has=s.prototype.contains,s.prototype.copy=s.prototype.clone,t=s,g=[],void 0===(x="function"==typeof(x=function(){return t})?x.apply(T,g):x)||(u.exports=x)}).call(this)}]);
	const engineWaitId = setInterval(() => {
		if (((VS.World.getCodeType() === 'local' || VS.World.getCodeType() === 'client') && VS.Client) || VS.World) {
			clearInterval(engineWaitId);
			buildPathfinding();
		}
	});

	const buildPathfinding = () => {
		const aPathfinder = {};
		const codeType = VS.World.getCodeType();
		const TILE_SIZE = VS.World.getTileSize();

		if ((codeType === 'local' || codeType === 'client') && VS.Client) {
			VS.Client.aPathfinder = aPathfinder;

			if (VS.Client.timeScale === undefined) {
				VS.Client.timeScale = 1;
			}
		}

		VS.global.aPathfinder = aPathfinder;

		const prototypeDiob = VS.newDiob();

		prototypeDiob.constructor.prototype.cancelMove = function() {
			if (this.aPathfinderID && this.easystar) {
				this.easystar.cancelPath(this.aPathfinderID);
				this.easystar.collisionGrid = undefined;
				this.aPathfinderID = null;
			}

			if (!this.aPathfinderTrajectory) {
				this.aPathfinderTrajectory = { angle: 0, x: 0, y: 0, nextNodePos: null, lastTime: 0, deltaTime: 0, elapsedMS: 0 };
			} else {
				this.aPathfinderTrajectory.x = 0;
				this.aPathfinderTrajectory.y = 0;
				this.aPathfinderTrajectory.angle = 0;
				this.aPathfinderTrajectory.lastTime = 0;
				this.aPathfinderTrajectory.deltaTime = 0;
				this.aPathfinderTrajectory.elapsedMS = 0;
				this.aPathfinderTrajectory.nextNodePos = null;
			}

			this.aPathfinderPath = [];
			this.aPathfinderPathReversed = [];
			this.aPathfinderMoving = false;

			if (this.moveSettings) {
				this.moveSettings.stepSlide = false;
				this.moveSettings = this.moveSettings;
			}

			// Restore the original stepSize
			if (this.aPathfinderOriginalStepSize) this.moveSettings.stepSize = this.aPathfinderOriginalStepSize;

			this.move();
			clearInterval(this.aPathfinderTrajectory.interval);
		}

		prototypeDiob.constructor.prototype.goTo = function(pX, pY, pDiagonal = false, pNearest = false, pExclude = []) {
			// pNearest will only search the closest MAX_NEAREST_TILE_SEARCH tiles or so to find a near tile. If no near tile is found, no path is returned.
			if (this && this.mapName && this.xPos !== 10000 && this.yPos !== 10000) {
				const TILE_SIZE = VS.World.getTileSize();
				const TICK_FPS = VS.Client.maxFPS ? (1000 / VS.Client.maxFPS) : 16.67;
				const MAX_ELAPSED_MS = TICK_FPS * 4;
				const TIME_SCALE = (VS.Client.timeScale ? VS.Client.timeScale : 1);
				const MAX_NEAREST_TILE_SEARCH = 6;
				const STUCK_MAX_COUNTER = 100;
				const mapSize = VS.Map.getMapSize(this.mapName);
				const debuggerDuration = 3000;
				const self = this;
				let stuckCounter = 0;
				let storedCoords = { x: 0, y: 0 };

				if (!this.easystar) {
					this.easystar = new EasyStar.js();
					this.easystar.setIterationsPerCalculation(1000);
				}
				
				const currentTile = VS.Map.getLocByPos(Math.round(this.xPos + this.xOrigin + this.width / 2), Math.round(this.yPos + this.yOrigin + this.height / 2), this.mapName);

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
				this.aPathfinderOriginalStepSize = this.moveSettings.stepSize;
				
				this.aPathfinderTrajectory.interval = setInterval(() => {
					const now = Date.now();
					if (now > this.aPathfinderTrajectory.lastTime) {
						this.aPathfinderTrajectory.elapsedMS = now - this.aPathfinderTrajectory.lastTime;
						if (this.aPathfinderTrajectory.elapsedMS > MAX_ELAPSED_MS) {
							// check here, if warnings are showing up about setInterval taking too long
							this.aPathfinderTrajectory.elapsedMS = MAX_ELAPSED_MS;
						}

						this.aPathfinderTrajectory.deltaTime = (this.aPathfinderTrajectory.elapsedMS / TICK_FPS) * TIME_SCALE;
						this.aPathfinderTrajectory.elapsedMS *= TIME_SCALE;
					}

					// Get the stepSize multiplied by delta time to get the correct size movement
					this.moveSettings.stepSize = this.aPathfinderOriginalStepSize * this.aPathfinderTrajectory.deltaTime;

					self.easystar.calculate();
					if ((self.aPathfinderPath && self.aPathfinderPath.length) || self.aPathfinderMoving) {
						const coords = { x: Math.round(self.xPos + self.xOrigin + self.width / 2), y: Math.round(self.yPos + self.yOrigin + self.height / 2) };
						if (!this.aPathfinderMoving) {
							const node = self.aPathfinderPath.shift();
							const nodePos = { x: (node.x * TILE_SIZE.width) - TILE_SIZE.width / 2, y: (node.y * TILE_SIZE.height) - TILE_SIZE.height / 2 };
							// Show the next tile in the path to move to
							if (VS.global.aPathfinder.debugging) {
								const nextTile = VS.Map.getLocByPos(nodePos.x, nodePos.y, self.mapName);
								const nextPathInTileVisual = VS.newDiob('Overlay');
								nextPathInTileVisual.atlasName = '';
								nextPathInTileVisual.width = TILE_SIZE.width;
								nextPathInTileVisual.height = TILE_SIZE.height;
								nextPathInTileVisual.color = { tint: 0x005aff };
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

							self.aPathfinderTrajectory.angle = VS.global.aPathfinder.getAngle(coords, nodePos);
							self.aPathfinderTrajectory.nextNodePos = nodePos;
							self.aPathfinderTrajectory.x = Math.cos(self.aPathfinderTrajectory.angle); // This is already multiplied by stepSize when using movePos
							self.aPathfinderTrajectory.y = Math.sin(self.aPathfinderTrajectory.angle); // This is already multiplied by stepSize when using movePos
							self.dir = VS.global.aPathfinder.getDirFromAngle(-self.aPathfinderTrajectory.angle);
							self.movePos(self.aPathfinderTrajectory.x, self.aPathfinderTrajectory.y);
							self.aPathfinderMoving = true;

							// Show the angle to move in
							if (VS.global.aPathfinder.debugging) {
								const pathAngle = VS.newDiob();
								pathAngle.atlasName = '';
								pathAngle.color = { tint: 0xFFFFFF };
								pathAngle.width = TILE_SIZE.width;
								pathAngle.height = 5;
								pathAngle.anchor = 0;
								pathAngle.plane = 0;
								pathAngle.mouseOpacity = 0;
								pathAngle.touchOpacity = 0;
								pathAngle.density = 0;
								pathAngle.angle = -self.aPathfinderTrajectory.angle;
								pathAngle.setPos(coords.x, coords.y, self.mapName);
								pathAngle.setTransition({ alpha: 0 }, -1, debuggerDuration);
								setTimeout(() => {
									VS.delDiob(pathAngle);
								}, debuggerDuration);
							}
						} else {
							const distance = Math.round(VS.global.aPathfinder.getDistance(coords, self.aPathfinderTrajectory.nextNodePos));
							if (distance <= self.aPathfinderOriginalStepSize) {
								self.aPathfinderMoving = false;
								stuckCounter = 0;
								if (!self.aPathfinderPath.length) {
									if (self.onPathComplete && typeof(self.onPathComplete) === 'function') {
										// Passes the ID so that the developer can use it for tracking
										self.onPathComplete(self.aPathfinderID);
									}
									self.cancelMove();
								}
							} else {
								self.aPathfinderTrajectory.angle = VS.global.aPathfinder.getAngle(coords, self.aPathfinderTrajectory.nextNodePos);
								self.aPathfinderTrajectory.x = Math.cos(self.aPathfinderTrajectory.angle); // This is already multiplied by stepSize when using movePos
								self.aPathfinderTrajectory.y = Math.sin(self.aPathfinderTrajectory.angle); // This is already multiplied by stepSize when using movePos
								self.dir = VS.global.aPathfinder.getDirFromAngle(-self.aPathfinderTrajectory.angle);
								self.movePos(self.aPathfinderTrajectory.x, self.aPathfinderTrajectory.y);
								self.aPathfinderMoving = true;
							}
						}
						if (coords.x === storedCoords.x && coords.y === storedCoords.y) {
							stuckCounter++;
							if (stuckCounter >= STUCK_MAX_COUNTER) {
								self.cancelMove();
								if (self.onPathStuck && typeof(self.onPathStuck) === 'function') {
									self.onPathStuck();
									return;
								}
							}
						}
						storedCoords = coords;
					}
					this.aPathfinderTrajectory.lastTime = Date.now();
				}, 16);

				// Reset the walkable tiles
				this.easystar.setAcceptableTiles([0]);
				// Disable diagonals in the event they were enabled in a previous call
				this.easystar.disableDiagonals();
				// Disable corner cutting in the event it was enabled in a previous call
				this.easystar.disableCornerCutting();
				// Reset the grid
				this.easystar.setGrid([[]]);

				// Enable diagonals if the developer wants diagonal
				if (pDiagonal) {
					this.easystar.enableDiagonals();
					// This can only be used with diagonals enabled
					this.easystar.enableCornerCutting();
				}

				// Build the 2d array grid that represents the map, the pathfinder is passed along so it can determine the weight of the tiles on the map
				const gridInfo = VS.global.aPathfinder.mapTilesToGrid(this.mapName, pExclude);
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

				const startNodeX = Math.round(this.xPos + this.xOrigin + this.width / 2);
				const startNodeY = Math.round(this.yPos + this.yOrigin + this.height / 2);
				const endNodeX = VS.global.aPathfinder.clamp(Math.round(VS.global.aPathfinder.clamp(pX - 1, 0, mapSize.x)) * TILE_SIZE.width + TILE_SIZE.width / 2, 0, mapSize.xPos - TILE_SIZE.width);
				const endNodeY = VS.global.aPathfinder.clamp(Math.round(VS.global.aPathfinder.clamp(pY - 1, 0, mapSize.y)) * TILE_SIZE.height + TILE_SIZE.height / 2, 0, mapSize.yPos - TILE_SIZE.height);
				const startTile = VS.Map.getLocByPos(startNodeX, startNodeY, this.mapName);
				// This end tile is based on the position you bounds are on (this can be a different tile)
				const endTile = VS.Map.getLocByPos(endNodeX, endNodeY, this.mapName);
				let startNode = VS.global.aPathfinder.tileToNode(startTile);
				let endNode = VS.global.aPathfinder.tileToNode(endTile);
				
				if (VS.global.aPathfinder.debugging) {
					const endTileOverlay = VS.newDiob('Overlay');
					endTileOverlay.atlasName = '';
					endTileOverlay.width = TILE_SIZE.width;
					endTileOverlay.height = TILE_SIZE.height;
					endTileOverlay.color = { tint: 0xFFFFFF };
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
							const tileLeft = VS.Map.getLocByPos(pNodeX - (i * TILE_SIZE.width / 2), pNodeY, self.mapName);
							const tileRight = VS.Map.getLocByPos(pNodeX + (i * TILE_SIZE.width / 2), pNodeY, self.mapName);
							const tileUp = VS.Map.getLocByPos(pNodeX, pNodeY - (i * TILE_SIZE.height / 2), self.mapName);
							const tileDown = VS.Map.getLocByPos(pNodeX, pNodeY + (i * TILE_SIZE.height / 2), self.mapName);

							if (tileLeft && !pBlockingDirections['left'] && !(((tileLeft.density && !pExclude.includes(tileLeft)) || tileLeft.getContents().filter((pElement) => {
								// Only use this if pStart is true
								const withinYAxis = !pStart ? true : VS.global.aPathfinder.within(self.yPos + self.yOrigin + self.height, pElement.yPos + pElement.yOrigin, pElement.yOrigin + pElement.height);
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
								const withinYAxis = !pStart ? true : VS.global.aPathfinder.within(self.yPos + self.yOrigin + self.height, pElement.yPos + pElement.yOrigin, pElement.yOrigin + pElement.height);
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
								const withinXAxis = !pStart ? true : VS.global.aPathfinder.within(self.xPos + self.xOrigin + self.width, pElement.xPos + pElement.xOrigin, pElement.xOrigin + pElement.width);
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
								const withinXAxis = !pStart ? true : VS.global.aPathfinder.within(self.xPos + self.xOrigin + self.width, pElement.xPos + pElement.xOrigin, pElement.xOrigin + pElement.width);
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
						
						if (VS.global.aPathfinder.debugging) {
							for (const rT in rejectedTiles) {
								const overlay = VS.newDiob('Overlay');
								overlay.color = { tint: 0xFF0000 };
								overlay.atlasName = '';
								overlay.width = TILE_SIZE.width;
								overlay.height = TILE_SIZE.height;
								// red and orange signify a tile that is unreachable
								overlay.color = { tint: (pStart ? 0xffa500 : 0xFF0000) };
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
							if (VS.global.aPathfinder.debugging) {
								const overlay = VS.newDiob('Overlay');
								overlay.color = { tint: 0xFF0000 };
								overlay.atlasName = '';
								overlay.width = TILE_SIZE.width;
								overlay.height = TILE_SIZE.height;
								// blue and green signify a tile that is reachable
								overlay.color = { tint: (pStart ? 0x87ceeb : 0x00ff00) };
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

							const node = VS.global.aPathfinder.tileToNode(nearestTiles[nT]);
							if (nearestNode) {
								const nearestNodeDistance = VS.global.aPathfinder.getDistance(pNode, nearestNode);
								const distance = VS.global.aPathfinder.getDistance(pNode, node);
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
					const diobTruePos = { x: pDiob.xPos + pDiob.xOrigin + pDiob.width / 2, y: pDiob.yPos + pDiob.yOrigin + pDiob.height / 2};
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
							const tileRight = VS.Map.getLocByPos(startNodeX + TILE_SIZE.width / 2, startNodeY, self.mapName);
							if ((tileRight && ((tileRight.density && !pExclude.includes(tileRight)) || tileRight.getContents().filter((pElement) => { if (pElement.density && !pExclude.includes(pElement)) return pElement.density }).length))) {
								nearestNode.x++;
							}
						}
						if (blockingDirections.right) {
							const tileLeft = VS.Map.getLocByPos(startNodeX - TILE_SIZE.width / 2, startNodeY, self.mapName);
							if ((tileLeft && ((tileLeft.density && !pExclude.includes(tileLeft)) || tileLeft.getContents().filter((pElement) => { if (pElement.density && !pExclude.includes(pElement)) return pElement.density }).length))) {
								nearestNode.x--;
							}
						}
						if (blockingDirections.up) {
							const tileDown = VS.Map.getLocByPos(startNodeX, startNodeY + TILE_SIZE.height / 2, self.mapName);
							if ((tileDown && ((tileDown.density && !pExclude.includes(tileDown)) || tileDown.getContents().filter((pElement) => { if (pElement.density && !pExclude.includes(pElement)) return pElement.density }).length))) {
								nearestNode.y++;
							}
						}
						if (blockingDirections.down) {
							const tileUp = VS.Map.getLocByPos(startNodeX, startNodeY - TILE_SIZE.height / 2, self.mapName);
							if ((tileUp && ((tileUp.density && !pExclude.includes(tileUp)) || tileUp.getContents().filter((pElement) => { if (pElement.density && !pExclude.includes(pElement)) return pElement.density }).length))) {
								nearestNode.y--;
							}
						}

						startNode = nearestNode;
					}
					
					if (!pNearest || blockingDirections.left && blockingDirections.right && blockingDirections.up && blockingDirections.down) {
						if (VS.global.aPathfinder.debugging) {
							const startTileOverlay = VS.newDiob('Overlay');
							startTileOverlay.atlasName = '';
							startTileOverlay.width = TILE_SIZE.width;
							startTileOverlay.height = TILE_SIZE.height;
							startTileOverlay.color = { tint: 0xFF0000 };
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
						if (self.onPathNotFound && typeof(self.onPathNotFound) === 'function') {
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
						if (self.onPathNotFound && typeof(self.onPathNotFound) === 'function') {
							self.onPathNotFound(endTile);
						}
						if (VS.global.aPathfinder.debugging) {
							endTile.getOverlays().filter((pElement) => { pElement.color = { tint: 0xFF0000 }; });
						}
						self.cancelMove();
						return;
					}
				}

				// Find the path
				this.aPathfinderID = this.easystar.findPath(startNode.x, startNode.y, endNode.x, endNode.y, (pPath) => {
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
						self.aPathfinderPath = pPath;
						self.aPathfinderPathReversed = reversedPath;
						if (self.onPathFound && typeof(self.onPathFound) === 'function') {
							self.onPathFound([...pPath], [...reversedPath]);
						}
					} else if (!pPath || !pPath.length) {
						if (self.onPathNotFound && typeof(self.onPathNotFound) === 'function') {
							self.onPathNotFound();
						}
						self.cancelMove();
					}
					// get the 2d array out of memory. Since there will be a easystar instance per diob that uses pathfinding
					self.easystar.collisionGrid = undefined;
				});

			} else {
				console.error('aPathfinder: No mapName was found on this diob.');
				return;
			}
			return this.aPathfinderID;
		};

		// a object that stores the map tiles in normal format and in 2d format
		aPathfinder.storedMapTiles = {};
		// a object that stores the icon sizes of icons used in this library
		aPathfinder.cachedResourcesInfo = {};

		aPathfinder.clamp = (pVal, pMin, pMax) => {
			return Math.max(pMin, Math.min(pVal, pMax));
		}

		aPathfinder.within = function (pVal, pMin, pMax) {
  			return pVal >= pMin && pVal <= pMax;
		}

		aPathfinder.getAngle = function (pStartPoint, pEndPoint) {
			const y = (pStartPoint.y - pEndPoint.y);
			const x = (pStartPoint.x - pEndPoint.x);
			return Math.atan2(y, x) - Math.PI;
		}

		aPathfinder.getDistance = (pStartPoint, pEndPoint) => {
			const y = (pStartPoint.y - pEndPoint.y);
			const x = (pStartPoint.x - pEndPoint.x);
			return Math.sqrt(x * x + y * y);
		}

		aPathfinder.getDirFromAngle = function (pAngle) {
			const degree = Math.floor(((pAngle * (180 / Math.PI)) / 45) + 0.5);
			const compassDirections = ['east', 'northeast', 'north', 'northwest', 'west', 'southwest', 'south', 'southeast'];
			return compassDirections[(degree % 8)];
		}

		aPathfinder.toTwoDimensionalArray = function(pArray, pLengthOfSubArray) {
			let i = 0;
			const result = [];
			while (i < pArray.length) {
				result.push(pArray.slice(i, i+= pLengthOfSubArray));
			}
			return result;
		}

		aPathfinder.mapTilesToGrid = function(pMapName, pExclude) {
			if (pMapName) {
				if (VS.Map.getMaps().includes(pMapName)) {
					let tilesArray;
					const acceptedTiles = [0];
					const weights = [];
					const mapSize = VS.Map.getMapSize(pMapName);

					if (!this.storedMapTiles[pMapName]) {
						tilesArray = VS.Map.getTiles(pMapName);
						// We store a copy of this array, because that array gets manipulated
						this.storedMapTiles[pMapName] = { tiles: [...tilesArray], tiles2d: this.toTwoDimensionalArray([...tilesArray], mapSize.x) };
					} else {
						tilesArray = [...this.storedMapTiles[pMapName].tiles];
					}

					tilesArray.forEach((pElement, pIndex) => {
						const tile = pElement;
						// a weight of 0 indicates it is impassable.
						let weight = (((tile.aPathfindingWeight || tile.aPathfindingWeight === 0) && typeof(tile.aPathfindingWeight) === 'number') ? tile.aPathfindingWeight : 0);

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
							if (diob.aPathfindingWeight && typeof(diob.aPathfindingWeight) === 'number') {
								weight += diob.aPathfindingWeight;
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
					console.error('aPathfinder: That mapname was not found.');
					return;
				}
			} else {
				console.error('aPathfinder: No mapname was passed.');
			}
		}

		aPathfinder.getIndexOf2DArray = function(pArray, pValue) {
			for (let i = 0; i < pArray.length; i++) {
				let index = pArray[i].indexOf(pValue);
				if (index > -1) {
					return [i, index];
				}
			}
		}

		aPathfinder.tileToNode = function(pTile) {
			if (pTile && pTile.mapName) {
				if (this.storedMapTiles[pTile.mapName]) {
					const index = this.getIndexOf2DArray(this.storedMapTiles[pTile.mapName].tiles2d, pTile);
					const node = { 'x': index[1], 'y': index[0] };
					return node;
				} else {
					console.error('aPathfinder: There is no stored grid for the map this tile belongs to.');
				}
			}
		}

		aPathfinder.nodeToTile = function(pMapName, pNode) {
			return VS.Map.getLoc(pNode.x + 1, pNode.y + 1, pMapName);
		}

		aPathfinder.toggleDebug = function() {
			this.debugging = !this.debugging;
		}
	}

})();
