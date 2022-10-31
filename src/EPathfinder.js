/*
@license
The MIT License (MIT)

Copyright (c) 2012-2020 Bryce Neal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
'use strict';var EasyStar=function(y){function p(g){if(v[g])return v[g].exports;var n=v[g]={i:g,l:!1,exports:{}};return y[g].call(n.exports,n,n.exports,p),n.l=!0,n.exports}var v={};return p.m=y,p.c=v,p.d=function(g,n,w){p.o(g,n)||Object.defineProperty(g,n,{enumerable:!0,get:w})},p.r=function(g){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(g,Symbol.toStringTag,{value:"Module"});Object.defineProperty(g,"__esModule",{value:!0})},p.t=function(g,n){if((1&n&&(g=p(g)),8&n)||4&n&&
"object"==typeof g&&g&&g.__esModule)return g;var w=Object.create(null);if(p.r(w),Object.defineProperty(w,"default",{enumerable:!0,value:g}),2&n&&"string"!=typeof g)for(var B in g)p.d(w,B,function(M){return g[M]}.bind(null,B));return w},p.n=function(g){var n=g&&g.__esModule?function(){return g.default}:function(){return g};return p.d(n,"a",n),n},p.o=function(g,n){return Object.prototype.hasOwnProperty.call(g,n)},p.p="/bin/",p(p.s=0)}([function(y,p,v){var g={},n=v(1),w=v(2),B=v(3);y.exports=g;var M=
1;g.js=function(){var l,J,t,D=!1,z={},E={},x={},C={},F=!0,G={},A=[],H=Number.MAX_VALUE,K=!1;this.setAcceptableTiles=function(c){c instanceof Array?t=c:!isNaN(parseFloat(c))&&isFinite(c)&&(t=[c])};this.enableSync=function(){D=!0};this.disableSync=function(){D=!1};this.enableDiagonals=function(){K=!0};this.disableDiagonals=function(){K=!1};this.setGrid=function(c){l=c;for(c=0;c<l.length;c++)for(var d=0;d<l[0].length;d++)E[l[c][d]]||(E[l[c][d]]=1)};this.setTileCost=function(c,d){E[c]=d};this.setAdditionalPointCost=
function(c,d,a){void 0===x[d]&&(x[d]={});x[d][c]=a};this.removeAdditionalPointCost=function(c,d){void 0!==x[d]&&delete x[d][c]};this.removeAllAdditionalPointCosts=function(){x={}};this.setDirectionalCondition=function(c,d,a){void 0===C[d]&&(C[d]={});C[d][c]=a};this.removeAllDirectionalConditions=function(){C={}};this.setIterationsPerCalculation=function(c){H=c};this.avoidAdditionalPoint=function(c,d){void 0===z[d]&&(z[d]={});z[d][c]=1};this.stopAvoidingAdditionalPoint=function(c,d){void 0!==z[d]&&
delete z[d][c]};this.enableCornerCutting=function(){F=!0};this.disableCornerCutting=function(){F=!1};this.stopAvoidingAllAdditionalPoints=function(){z={}};this.findPath=function(c,d,a,k,u){var r=function(N){D?u(N):setTimeout(function(){u(N)})};if(void 0===t)throw Error("You can't set a path without first calling setAcceptableTiles() on EasyStar.");if(void 0===l)throw Error("You can't set a path without first calling setGrid() on EasyStar.");if(0>c||0>d||0>a||0>k||c>l[0].length-1||d>l.length-1||a>
l[0].length-1||k>l.length-1)throw Error("Your start or end point is outside the scope of your grid.");if(c!==a||d!==k){for(var q=l[k][a],L=!1,I=0;I<t.length;I++)if(q===t[I]){L=!0;break}if(!1!==L)return q=new n,q.openList=new B(function(N,O){return N.bestGuessDistance()-O.bestGuessDistance()}),q.isDoneCalculating=!1,q.nodeHash={},q.startX=c,q.startY=d,q.endX=a,q.endY=k,q.callback=r,q.openList.push(m(q,q.startX,q.startY,null,1)),c=M++,G[c]=q,A.push(c),c;r(null)}else r([])};this.cancelPath=function(c){return c in
G&&(delete G[c],!0)};this.calculate=function(){if(0!==A.length&&void 0!==l&&void 0!==t)for(J=0;J<H&&0!==A.length;J++){D&&(J=0);var c=A[0],d=G[c];if(void 0!==d)if(0!==d.openList.size()){var a=d.openList.pop();if(d.endX!==a.x||d.endY!==a.y)a.list=0,0<a.y&&b(d,a,0,-1,1*h(a.x,a.y-1)),a.x<l[0].length-1&&b(d,a,1,0,1*h(a.x+1,a.y)),a.y<l.length-1&&b(d,a,0,1,1*h(a.x,a.y+1)),0<a.x&&b(d,a,-1,0,1*h(a.x-1,a.y)),K&&(0<a.x&&0<a.y&&(F||e(l,t,a.x,a.y-1,a)&&e(l,t,a.x-1,a.y,a))&&b(d,a,-1,-1,1.4*h(a.x-1,a.y-1)),a.x<
l[0].length-1&&a.y<l.length-1&&(F||e(l,t,a.x,a.y+1,a)&&e(l,t,a.x+1,a.y,a))&&b(d,a,1,1,1.4*h(a.x+1,a.y+1)),a.x<l[0].length-1&&0<a.y&&(F||e(l,t,a.x,a.y-1,a)&&e(l,t,a.x+1,a.y,a))&&b(d,a,1,-1,1.4*h(a.x+1,a.y-1)),0<a.x&&a.y<l.length-1&&(F||e(l,t,a.x,a.y+1,a)&&e(l,t,a.x-1,a.y,a))&&b(d,a,-1,1,1.4*h(a.x-1,a.y+1)));else{var k=[];k.push({x:a.x,y:a.y});for(a=a.parent;null!=a;)k.push({x:a.x,y:a.y}),a=a.parent;k.reverse();d.callback(k);delete G[c];A.shift()}}else d.callback(null),delete G[c],A.shift();else A.shift()}};
var b=function(c,d,a,k,u){a=d.x+a;k=d.y+k;void 0!==z[k]&&void 0!==z[k][a]||!e(l,t,a,k,d)||(k=m(c,a,k,d,u),void 0===k.list?(k.list=1,c.openList.push(k)):d.costSoFar+u<k.costSoFar&&(k.costSoFar=d.costSoFar+u,k.parent=d,c.openList.updateItem(k)))},e=function(c,d,a,k,u){var r=C[k]&&C[k][a];if(r){u=f(u.x-a,u.y-k);a:{for(var q=0;q<r.length;q++)if(r[q]===u){r=!0;break a}r=!1}if(!r)return!1}for(r=0;r<d.length;r++)if(c[k][a]===d[r])return!0;return!1},f=function(c,d){if(0===c&&-1===d)return g.TOP;if(1===c&&
-1===d)return g.TOP_RIGHT;if(1===c&&0===d)return g.RIGHT;if(1===c&&1===d)return g.BOTTOM_RIGHT;if(0===c&&1===d)return g.BOTTOM;if(-1===c&&1===d)return g.BOTTOM_LEFT;if(-1===c&&0===d)return g.LEFT;if(-1===c&&-1===d)return g.TOP_LEFT;throw Error("These differences are not valid: "+c+", "+d);},h=function(c,d){return x[d]&&x[d][c]||E[l[d][c]]},m=function(c,d,a,k,u){if(void 0!==c.nodeHash[a]){if(void 0!==c.nodeHash[a][d])return c.nodeHash[a][d]}else c.nodeHash[a]={};var r=c.endX;var q=c.endY,L,I;r=K?(L=
Math.abs(d-r))<(I=Math.abs(a-q))?1.4*L+I:1.4*I+L:Math.abs(d-r)+Math.abs(a-q);k=new w(k,d,a,null!==k?k.costSoFar+u:0,r);return c.nodeHash[a][d]=k,k}};g.TOP="TOP";g.TOP_RIGHT="TOP_RIGHT";g.RIGHT="RIGHT";g.BOTTOM_RIGHT="BOTTOM_RIGHT";g.BOTTOM="BOTTOM";g.BOTTOM_LEFT="BOTTOM_LEFT";g.LEFT="LEFT";g.TOP_LEFT="TOP_LEFT"},function(y,p){y.exports=function(){this.pointsToAvoid={};this.endY=this.endX=this.startY=this.callback=this.startX=void 0;this.nodeHash={};this.openList=void 0}},function(y,p){y.exports=function(v,
g,n,w,B){this.parent=v;this.x=g;this.y=n;this.costSoFar=w;this.simpleDistanceToTarget=B;this.bestGuessDistance=function(){return this.costSoFar+this.simpleDistanceToTarget}}},function(y,p,v){y.exports=v(4)},function(y,p,v){var g,n,w;(function(){var B=Math.floor;var M=Math.min;var l=function(b,e){return b<e?-1:b>e?1:0};var J=function(b,e,f,h,m){var c;if(null==f&&(f=0),null==m&&(m=l),0>f)throw Error("lo must be non-negative");for(null==h&&(h=b.length);f<h;)0>m(e,b[c=B((f+h)/2)])?h=c:f=c+1;return[].splice.apply(b,
[f,f-f].concat(e)),e};var t=function(b,e,f){return null==f&&(f=l),b.push(e),A(b,0,b.length-1,f)};var D=function(b,e){var f,h;return null==e&&(e=l),f=b.pop(),b.length?(h=b[0],b[0]=f,H(b,0,e)):h=f,h};var z=function(b,e,f){var h;return null==f&&(f=l),h=b[0],b[0]=e,H(b,0,f),h};var E=function(b,e,f){var h;return null==f&&(f=l),b.length&&0>f(b[0],e)&&(e=(h=[b[0],e])[0],b[0]=h[1],H(b,0,f)),e};var x=function(b,e){var f,h,m;null==e&&(e=l);var c=[];var d=0;for(f=(h=function(){m=[];for(var k=0,u=B(b.length/
2);0<=u?k<u:k>u;0<=u?k++:k--)m.push(k);return m}.apply(this).reverse()).length;d<f;d++){var a=h[d];c.push(H(b,a,e))}return c};var C=function(b,e,f){if(null==f&&(f=l),-1!==(e=b.indexOf(e)))return A(b,0,e,f),H(b,e,f)};var F=function(b,e,f){var h,m;if(null==f&&(f=l),!(h=b.slice(0,e)).length)return h;x(h,f);var c=0;for(e=(m=b.slice(e)).length;c<e;c++)b=m[c],E(h,b,f);return h.sort(f).reverse()};var G=function(b,e,f){var h,m;if(null==f&&(f=l),10*e<=b.length){if(!(m=b.slice(0,e).sort(f)).length)return m;
var c=m[m.length-1];var d=0;for(b=(e=b.slice(e)).length;d<b;d++)0>f(h=e[d],c)&&(J(m,h,0,null,f),m.pop(),c=m[m.length-1]);return m}x(b,f);c=[];h=0;for(e=M(e,b.length);0<=e?h<e:h>e;0<=e?++h:--h)c.push(D(b,f));return c};var A=function(b,e,f,h){var m,c,d;null==h&&(h=l);for(m=b[f];f>e&&0>h(m,c=b[d=f-1>>1]);)b[f]=c,f=d;return b[f]=m};var H=function(b,e,f){var h,m;null==f&&(f=l);var c=b.length;var d=e;var a=b[e];for(h=2*e+1;h<c;)(m=h+1)<c&&!(0>f(b[h],b[m]))&&(h=m),b[e]=b[h],h=2*(e=h)+1;return b[e]=a,A(b,
d,e,f)};var K=function(){function b(e){this.cmp=null!=e?e:l;this.nodes=[]}return b.push=t,b.pop=D,b.replace=z,b.pushpop=E,b.heapify=x,b.updateItem=C,b.nlargest=F,b.nsmallest=G,b.prototype.push=function(e){return t(this.nodes,e,this.cmp)},b.prototype.pop=function(){return D(this.nodes,this.cmp)},b.prototype.peek=function(){return this.nodes[0]},b.prototype.contains=function(e){return-1!==this.nodes.indexOf(e)},b.prototype.replace=function(e){return z(this.nodes,e,this.cmp)},b.prototype.pushpop=function(e){return E(this.nodes,
e,this.cmp)},b.prototype.heapify=function(){return x(this.nodes,this.cmp)},b.prototype.updateItem=function(e){return C(this.nodes,e,this.cmp)},b.prototype.clear=function(){return this.nodes=[]},b.prototype.empty=function(){return 0===this.nodes.length},b.prototype.size=function(){return this.nodes.length},b.prototype.clone=function(){var e;return(e=new b).nodes=this.nodes.slice(0),e},b.prototype.toArray=function(){return this.nodes.slice(0)},b.prototype.insert=b.prototype.push,b.prototype.top=b.prototype.peek,
b.prototype.front=b.prototype.peek,b.prototype.has=b.prototype.contains,b.prototype.copy=b.prototype.clone,b}();n=[];void 0===(w="function"==typeof(g=function(){return K})?g.apply(p,n):g)||(y.exports=w)}).call(this)}]);

/* 
@license
EPathfinding is free software, available under the terms of a MIT style License.

Copyright (c) 2022 Evitca Studio

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

This software cannot be sold by itself. It must be used in a project and the project itself can be sold. In the case it is not, you the "user" of this software are breaking the license and agreeing to forfeit its usage.

Neither the name “EvitcaStudio” or "EPathfinding" nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. 
*/

Diob.prototype.cancelMove = function() {
	if (this.EPathfinderID && this.easystar) {
		this.easystar.cancelPath(this.EPathfinderID);
		this.easystar.collisionGrid = undefined;
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

Diob.prototype.goTo = function(pX, pY, pDiagonal = false, pNearest = false, pExclude = []) {
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
						pathAngle.color = { tint: 0xFFFFFF };
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
							if (self.onPathComplete && typeof(self.onPathComplete) === 'function') {
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
						if (self.onPathStuck && typeof(self.onPathStuck) === 'function') {
							self.onPathStuck();
							return;
						}
					}
				}
				storedCoords = coords;
			}
			this.EPathfinderTrajectory.lastTime = Date.now();
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
					if (EPathfinder.debugging) {
						const overlay = VYLO.newDiob('Overlay');
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
				if (EPathfinder.debugging) {
					endTile.getOverlays().filter((pElement) => { pElement.color = { tint: 0xFF0000 }; });
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
		console.error('EPathfinder: No mapName was found on this diob.');
		return;
	}
	return this.EPathfinderID;
};

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
						if (diob.EPathfinderWeight && typeof(diob.EPathfinderWeight) === 'number') {
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
