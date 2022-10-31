(() => {
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
	var EasyStar=
	/******/function(modules){// webpackBootstrap
	/******/ // The module cache
	/******/var installedModules={};
	/******/
	/******/ // The require function
	/******/function __webpack_require__(moduleId){
	/******/
	/******/ // Check if module is in cache
	/******/if(installedModules[moduleId])
	/******/return installedModules[moduleId].exports;
	/******/
	/******/ // Create a new module (and put it into the cache)
	/******/var module=installedModules[moduleId]={
	/******/i:moduleId,
	/******/l:!1,
	/******/exports:{}
	/******/};
	/******/
	/******/ // Execute the module function
	/******/
	/******/
	/******/ // Return the exports of the module
	/******/return modules[moduleId].call(module.exports,module,module.exports,__webpack_require__),
	/******/
	/******/ // Flag the module as loaded
	/******/module.l=!0,module.exports;
	/******/}
	/******/
	/******/
	/******/ // expose the modules object (__webpack_modules__)
	/******/
	/******/
	/******/
	/******/ // Load entry module and return exports
	/******/return __webpack_require__.m=modules,
	/******/
	/******/ // expose the module cache
	/******/__webpack_require__.c=installedModules,
	/******/
	/******/ // define getter function for harmony exports
	/******/__webpack_require__.d=function(exports,name,getter){
	/******/__webpack_require__.o(exports,name)||
	/******/Object.defineProperty(exports,name,{enumerable:!0,get:getter})
	/******/},
	/******/
	/******/ // define __esModule on exports
	/******/__webpack_require__.r=function(exports){
	/******/"undefined"!=typeof Symbol&&Symbol.toStringTag&&
	/******/Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"})
	/******/,Object.defineProperty(exports,"__esModule",{value:!0})},
	/******/
	/******/ // create a fake namespace object
	/******/ // mode & 1: value is a module id, require it
	/******/ // mode & 2: merge all properties of value into the ns
	/******/ // mode & 4: return value when already ns object
	/******/ // mode & 8|1: behave like require
	/******/__webpack_require__.t=function(value,mode){
	/******/if(
	/******/1&mode&&(value=__webpack_require__(value)),8&mode)return value;
	/******/if(4&mode&&"object"==typeof value&&value&&value.__esModule)return value;
	/******/var ns=Object.create(null);
	/******/
	/******/if(__webpack_require__.r(ns),
	/******/Object.defineProperty(ns,"default",{enumerable:!0,value:value}),2&mode&&"string"!=typeof value)for(var key in value)__webpack_require__.d(ns,key,function(key){return value[key]}.bind(null,key));
	/******/return ns;
	/******/},
	/******/
	/******/ // getDefaultExport function for compatibility with non-harmony modules
	/******/__webpack_require__.n=function(module){
	/******/var getter=module&&module.__esModule?
	/******/function(){return module.default}:
	/******/function(){return module};
	/******/
	/******/return __webpack_require__.d(getter,"a",getter),getter;
	/******/},
	/******/
	/******/ // Object.prototype.hasOwnProperty.call
	/******/__webpack_require__.o=function(object,property){return Object.prototype.hasOwnProperty.call(object,property)},
	/******/
	/******/ // __webpack_public_path__
	/******/__webpack_require__.p="/bin/",__webpack_require__(__webpack_require__.s=0);
	/******/}
	/************************************************************************/
	/******/([
	/* 0 */
	/***/function(module,exports,__webpack_require__){
	/**
	*   EasyStar.js
	*   github.com/prettymuchbryce/EasyStarJS
	*   Licensed under the MIT license.
	*
	*   Implementation By Bryce Neal (@prettymuchbryce)
	**/
	var EasyStar={},Instance=__webpack_require__(1),Node=__webpack_require__(2),Heap=__webpack_require__(3);module.exports=EasyStar;var nextInstanceId=1;EasyStar.js=function(){var collisionGrid,iterationsSoFar,acceptableTiles,syncEnabled=!1,pointsToAvoid={},costMap={},pointsToCost={},directionalConditions={},allowCornerCutting=!0,instances={},instanceQueue=[],iterationsPerCalculation=Number.MAX_VALUE,diagonalsEnabled=!1;
	this.setAcceptableTiles=function(tiles){tiles instanceof Array?
	// Array
	acceptableTiles=tiles:!isNaN(parseFloat(tiles))&&isFinite(tiles)&&(
	// Number
	acceptableTiles=[tiles])},
	/**
	 * Enables sync mode for this EasyStar instance..
	 * if you're into that sort of thing.
	 **/
	this.enableSync=function(){syncEnabled=!0},
	/**
	 * Disables sync mode for this EasyStar instance.
	 **/
	this.disableSync=function(){syncEnabled=!1},
	/**
	 * Enable diagonal pathfinding.
	 */
	this.enableDiagonals=function(){diagonalsEnabled=!0},
	/**
	 * Disable diagonal pathfinding.
	 */
	this.disableDiagonals=function(){diagonalsEnabled=!1},
	/**
	 * Sets the collision grid that EasyStar uses.
	 *
	 * @param {Array} grid The collision grid that this EasyStar instance will read from.
	 * This should be a 2D Array of Numbers.
	 **/
	this.setGrid=function(grid){collisionGrid=grid;//Setup cost map
	for(var y=0;y<collisionGrid.length;y++)for(var x=0;x<collisionGrid[0].length;x++)costMap[collisionGrid[y][x]]||(costMap[collisionGrid[y][x]]=1)},
	/**
	 * Sets the tile cost for a particular tile type.
	 *
	 * @param {Number} The tile type to set the cost for.
	 * @param {Number} The multiplicative cost associated with the given tile.
	 **/
	this.setTileCost=function(tileType,cost){costMap[tileType]=cost},
	/**
	 * Sets the an additional cost for a particular point.
	 * Overrides the cost from setTileCost.
	 *
	 * @param {Number} x The x value of the point to cost.
	 * @param {Number} y The y value of the point to cost.
	 * @param {Number} The multiplicative cost associated with the given point.
	 **/
	this.setAdditionalPointCost=function(x,y,cost){void 0===pointsToCost[y]&&(pointsToCost[y]={}),pointsToCost[y][x]=cost},
	/**
	 * Remove the additional cost for a particular point.
	 *
	 * @param {Number} x The x value of the point to stop costing.
	 * @param {Number} y The y value of the point to stop costing.
	 **/
	this.removeAdditionalPointCost=function(x,y){void 0!==pointsToCost[y]&&delete pointsToCost[y][x]},
	/**
	 * Remove all additional point costs.
	 **/
	this.removeAllAdditionalPointCosts=function(){pointsToCost={}},
	/**
	 * Sets a directional condition on a tile
	 *
	 * @param {Number} x The x value of the point.
	 * @param {Number} y The y value of the point.
	 * @param {Array.<String>} allowedDirections A list of all the allowed directions that can access
	 * the tile.
	 **/
	this.setDirectionalCondition=function(x,y,allowedDirections){void 0===directionalConditions[y]&&(directionalConditions[y]={}),directionalConditions[y][x]=allowedDirections},
	/**
	 * Remove all directional conditions
	 **/
	this.removeAllDirectionalConditions=function(){directionalConditions={}},
	/**
	 * Sets the number of search iterations per calculation.
	 * A lower number provides a slower result, but more practical if you
	 * have a large tile-map and don't want to block your thread while
	 * finding a path.
	 *
	 * @param {Number} iterations The number of searches to prefrom per calculate() call.
	 **/
	this.setIterationsPerCalculation=function(iterations){iterationsPerCalculation=iterations},
	/**
	 * Avoid a particular point on the grid,
	 * regardless of whether or not it is an acceptable tile.
	 *
	 * @param {Number} x The x value of the point to avoid.
	 * @param {Number} y The y value of the point to avoid.
	 **/
	this.avoidAdditionalPoint=function(x,y){void 0===pointsToAvoid[y]&&(pointsToAvoid[y]={}),pointsToAvoid[y][x]=1},
	/**
	 * Stop avoiding a particular point on the grid.
	 *
	 * @param {Number} x The x value of the point to stop avoiding.
	 * @param {Number} y The y value of the point to stop avoiding.
	 **/
	this.stopAvoidingAdditionalPoint=function(x,y){void 0!==pointsToAvoid[y]&&delete pointsToAvoid[y][x]},
	/**
	 * Enables corner cutting in diagonal movement.
	 **/
	this.enableCornerCutting=function(){allowCornerCutting=!0},
	/**
	 * Disables corner cutting in diagonal movement.
	 **/
	this.disableCornerCutting=function(){allowCornerCutting=!1},
	/**
	 * Stop avoiding all additional points on the grid.
	 **/
	this.stopAvoidingAllAdditionalPoints=function(){pointsToAvoid={}},
	/**
	 * Find a path.
	 *
	 * @param {Number} startX The X position of the starting point.
	 * @param {Number} startY The Y position of the starting point.
	 * @param {Number} endX The X position of the ending point.
	 * @param {Number} endY The Y position of the ending point.
	 * @param {Function} callback A function that is called when your path
	 * is found, or no path is found.
	 * @return {Number} A numeric, non-zero value which identifies the created instance. This value can be passed to cancelPath to cancel the path calculation.
	 *
	 **/
	this.findPath=function(startX,startY,endX,endY,callback){
	// Wraps the callback for sync vs async logic
	var callbackWrapper=function(result){syncEnabled?callback(result):setTimeout((function(){callback(result)}))};// No acceptable tiles were set
	if(void 0===acceptableTiles)throw new Error("You can't set a path without first calling setAcceptableTiles() on EasyStar.");// No grid was set
	if(void 0===collisionGrid)throw new Error("You can't set a path without first calling setGrid() on EasyStar.");// Start or endpoint outside of scope.
	if(startX<0||startY<0||endX<0||endY<0||startX>collisionGrid[0].length-1||startY>collisionGrid.length-1||endX>collisionGrid[0].length-1||endY>collisionGrid.length-1)throw new Error("Your start or end point is outside the scope of your grid.");// Start and end are the same tile.
	if(startX!==endX||startY!==endY){for(// End point is not an acceptable tile.
	var endTile=collisionGrid[endY][endX],isAcceptable=!1,i=0;i<acceptableTiles.length;i++)if(endTile===acceptableTiles[i]){isAcceptable=!0;break}if(!1!==isAcceptable){// Create the instance
	var instance=new Instance;instance.openList=new Heap((function(nodeA,nodeB){return nodeA.bestGuessDistance()-nodeB.bestGuessDistance()})),instance.isDoneCalculating=!1,instance.nodeHash={},instance.startX=startX,instance.startY=startY,instance.endX=endX,instance.endY=endY,instance.callback=callbackWrapper,instance.openList.push(coordinateToNode(instance,instance.startX,instance.startY,null,1));var instanceId=nextInstanceId++;return instances[instanceId]=instance,instanceQueue.push(instanceId),instanceId}callbackWrapper(null)}else callbackWrapper([])},
	/**
	 * Cancel a path calculation.
	 *
	 * @param {Number} instanceId The instance ID of the path being calculated
	 * @return {Boolean} True if an instance was found and cancelled.
	 *
	 **/
	this.cancelPath=function(instanceId){return instanceId in instances&&(delete instances[instanceId],!0)},
	/**
	 * This method steps through the A* Algorithm in an attempt to
	 * find your path(s). It will search 4-8 tiles (depending on diagonals) for every calculation.
	 * You can change the number of calculations done in a call by using
	 * easystar.setIteratonsPerCalculation().
	 **/
	this.calculate=function(){if(0!==instanceQueue.length&&void 0!==collisionGrid&&void 0!==acceptableTiles)for(iterationsSoFar=0;iterationsSoFar<iterationsPerCalculation;iterationsSoFar++){if(0===instanceQueue.length)return;syncEnabled&&(
	// If this is a sync instance, we want to make sure that it calculates synchronously.
	iterationsSoFar=0);var instanceId=instanceQueue[0],instance=instances[instanceId];if(void 0!==instance)// Couldn't find a path.
	if(0!==instance.openList.size()){var searchNode=instance.openList.pop();// Handles the case where we have found the destination
	if(instance.endX!==searchNode.x||instance.endY!==searchNode.y)searchNode.list=0,searchNode.y>0&&checkAdjacentNode(instance,searchNode,0,-1,1*getTileCost(searchNode.x,searchNode.y-1)),searchNode.x<collisionGrid[0].length-1&&checkAdjacentNode(instance,searchNode,1,0,1*getTileCost(searchNode.x+1,searchNode.y)),searchNode.y<collisionGrid.length-1&&checkAdjacentNode(instance,searchNode,0,1,1*getTileCost(searchNode.x,searchNode.y+1)),searchNode.x>0&&checkAdjacentNode(instance,searchNode,-1,0,1*getTileCost(searchNode.x-1,searchNode.y)),diagonalsEnabled&&(searchNode.x>0&&searchNode.y>0&&(allowCornerCutting||isTileWalkable(collisionGrid,acceptableTiles,searchNode.x,searchNode.y-1,searchNode)&&isTileWalkable(collisionGrid,acceptableTiles,searchNode.x-1,searchNode.y,searchNode))&&checkAdjacentNode(instance,searchNode,-1,-1,1.4*getTileCost(searchNode.x-1,searchNode.y-1)),searchNode.x<collisionGrid[0].length-1&&searchNode.y<collisionGrid.length-1&&(allowCornerCutting||isTileWalkable(collisionGrid,acceptableTiles,searchNode.x,searchNode.y+1,searchNode)&&isTileWalkable(collisionGrid,acceptableTiles,searchNode.x+1,searchNode.y,searchNode))&&checkAdjacentNode(instance,searchNode,1,1,1.4*getTileCost(searchNode.x+1,searchNode.y+1)),searchNode.x<collisionGrid[0].length-1&&searchNode.y>0&&(allowCornerCutting||isTileWalkable(collisionGrid,acceptableTiles,searchNode.x,searchNode.y-1,searchNode)&&isTileWalkable(collisionGrid,acceptableTiles,searchNode.x+1,searchNode.y,searchNode))&&checkAdjacentNode(instance,searchNode,1,-1,1.4*getTileCost(searchNode.x+1,searchNode.y-1)),searchNode.x>0&&searchNode.y<collisionGrid.length-1&&(allowCornerCutting||isTileWalkable(collisionGrid,acceptableTiles,searchNode.x,searchNode.y+1,searchNode)&&isTileWalkable(collisionGrid,acceptableTiles,searchNode.x-1,searchNode.y,searchNode))&&checkAdjacentNode(instance,searchNode,-1,1,1.4*getTileCost(searchNode.x-1,searchNode.y+1)));else{var path=[];path.push({x:searchNode.x,y:searchNode.y});for(var parent=searchNode.parent;null!=parent;)path.push({x:parent.x,y:parent.y}),parent=parent.parent;path.reverse();var ip=path;instance.callback(ip),delete instances[instanceId],instanceQueue.shift()}}else instance.callback(null),delete instances[instanceId],instanceQueue.shift();else
	// This instance was cancelled
	instanceQueue.shift()}};// Private methods follow
	var checkAdjacentNode=function(instance,searchNode,x,y,cost){var adjacentCoordinateX=searchNode.x+x,adjacentCoordinateY=searchNode.y+y;if((void 0===pointsToAvoid[adjacentCoordinateY]||void 0===pointsToAvoid[adjacentCoordinateY][adjacentCoordinateX])&&isTileWalkable(collisionGrid,acceptableTiles,adjacentCoordinateX,adjacentCoordinateY,searchNode)){var node=coordinateToNode(instance,adjacentCoordinateX,adjacentCoordinateY,searchNode,cost);void 0===node.list?(node.list=1,instance.openList.push(node)):searchNode.costSoFar+cost<node.costSoFar&&(node.costSoFar=searchNode.costSoFar+cost,node.parent=searchNode,instance.openList.updateItem(node))}},isTileWalkable=function(collisionGrid,acceptableTiles,x,y,sourceNode){var directionalCondition=directionalConditions[y]&&directionalConditions[y][x];if(directionalCondition){var direction=calculateDirection(sourceNode.x-x,sourceNode.y-y);if(!function(){for(var i=0;i<directionalCondition.length;i++)if(directionalCondition[i]===direction)return!0;return!1}())return!1}for(var i=0;i<acceptableTiles.length;i++)if(collisionGrid[y][x]===acceptableTiles[i])return!0;return!1},calculateDirection=function(diffX,diffY){if(0===diffX&&-1===diffY)return EasyStar.TOP;if(1===diffX&&-1===diffY)return EasyStar.TOP_RIGHT;if(1===diffX&&0===diffY)return EasyStar.RIGHT;if(1===diffX&&1===diffY)return EasyStar.BOTTOM_RIGHT;if(0===diffX&&1===diffY)return EasyStar.BOTTOM;if(-1===diffX&&1===diffY)return EasyStar.BOTTOM_LEFT;if(-1===diffX&&0===diffY)return EasyStar.LEFT;if(-1===diffX&&-1===diffY)return EasyStar.TOP_LEFT;throw new Error("These differences are not valid: "+diffX+", "+diffY)},getTileCost=function(x,y){return pointsToCost[y]&&pointsToCost[y][x]||costMap[collisionGrid[y][x]]},coordinateToNode=function(instance,x,y,parent,cost){if(void 0!==instance.nodeHash[y]){if(void 0!==instance.nodeHash[y][x])return instance.nodeHash[y][x]}else instance.nodeHash[y]={};var simpleDistanceToTarget=getDistance(x,y,instance.endX,instance.endY);if(null!==parent)var costSoFar=parent.costSoFar+cost;else costSoFar=0;var node=new Node(parent,x,y,costSoFar,simpleDistanceToTarget);return instance.nodeHash[y][x]=node,node},getDistance=function(x1,y1,x2,y2){
	// Octile distance
	var dx,dy;return diagonalsEnabled?(dx=Math.abs(x1-x2))<(dy=Math.abs(y1-y2))?1.4*dx+dy:1.4*dy+dx:(dx=Math.abs(x1-x2))+(dy=Math.abs(y1-y2))};// Helpers
	},EasyStar.TOP="TOP",EasyStar.TOP_RIGHT="TOP_RIGHT",EasyStar.RIGHT="RIGHT",EasyStar.BOTTOM_RIGHT="BOTTOM_RIGHT",EasyStar.BOTTOM="BOTTOM",EasyStar.BOTTOM_LEFT="BOTTOM_LEFT",EasyStar.LEFT="LEFT",EasyStar.TOP_LEFT="TOP_LEFT"},
	/* 1 */
	/***/function(module,exports){
	/**
	 * Represents a single instance of EasyStar.
	 * A path that is in the queue to eventually be found.
	 */
	module.exports=function(){this.pointsToAvoid={},this.startX = undefined,this.callback = undefined,this.startY = undefined,this.endX = undefined,this.endY = undefined,this.nodeHash={},this.openList = undefined};
	/***/},
	/* 2 */
	/***/function(module,exports){
	/**
	* A simple Node that represents a single tile on the grid.
	* @param {Object} parent The parent node.
	* @param {Number} x The x position on the grid.
	* @param {Number} y The y position on the grid.
	* @param {Number} costSoFar How far this node is in moves*cost from the start.
	* @param {Number} simpleDistanceToTarget Manhatten distance to the end point.
	**/
	module.exports=function(parent,x,y,costSoFar,simpleDistanceToTarget){this.parent=parent,this.x=x,this.y=y,this.costSoFar=costSoFar,this.simpleDistanceToTarget=simpleDistanceToTarget,
	/**
	 * @return {Number} Best guess distance of a cost using this node.
	 **/
	this.bestGuessDistance=function(){return this.costSoFar+this.simpleDistanceToTarget}};
	/***/},
	/* 3 */
	/***/function(module,exports,__webpack_require__){module.exports=__webpack_require__(4);
	/***/},
	/* 4 */
	/***/function(module,exports,__webpack_require__){var __WEBPACK_AMD_DEFINE_FACTORY__,__WEBPACK_AMD_DEFINE_ARRAY__,__WEBPACK_AMD_DEFINE_RESULT__;// Generated by CoffeeScript 1.8.0
	(function(){var Heap,defaultCmp,floor,heapify,heappop,heappush,heappushpop,heapreplace,insort,min,nlargest,nsmallest,updateItem,_siftdown,_siftup;floor=Math.floor,min=Math.min,
	/*
	Default comparison function to be used
	*/
	defaultCmp=function(x,y){return x<y?-1:x>y?1:0},
	/*
	Insert item x in list a, and keep it sorted assuming a is sorted.
	
	If x is already in a, insert it to the right of the rightmost x.
	
	Optional args lo (default 0) and hi (default a.length) bound the slice
	of a to be searched.
	*/
	insort=function(a,x,lo,hi,cmp){var mid;if(null==lo&&(lo=0),null==cmp&&(cmp=defaultCmp),lo<0)throw new Error("lo must be non-negative");for(null==hi&&(hi=a.length);lo<hi;)cmp(x,a[mid=floor((lo+hi)/2)])<0?hi=mid:lo=mid+1;return[].splice.apply(a,[lo,lo-lo].concat(x)),x},
	/*
	Push item onto heap, maintaining the heap invariant.
	*/
	heappush=function(array,item,cmp){return null==cmp&&(cmp=defaultCmp),array.push(item),_siftdown(array,0,array.length-1,cmp)},
	/*
	Pop the smallest item off the heap, maintaining the heap invariant.
	*/
	heappop=function(array,cmp){var lastelt,returnitem;return null==cmp&&(cmp=defaultCmp),lastelt=array.pop(),array.length?(returnitem=array[0],array[0]=lastelt,_siftup(array,0,cmp)):returnitem=lastelt,returnitem},
	/*
	Pop and return the current smallest value, and add the new item.
	
	This is more efficient than heappop() followed by heappush(), and can be
	more appropriate when using a fixed size heap. Note that the value
	returned may be larger than item! That constrains reasonable use of
	this routine unless written as part of a conditional replacement:
		if item > array[0]
			item = heapreplace(array, item)
	*/
	heapreplace=function(array,item,cmp){var returnitem;return null==cmp&&(cmp=defaultCmp),returnitem=array[0],array[0]=item,_siftup(array,0,cmp),returnitem},
	/*
	Fast version of a heappush followed by a heappop.
	*/
	heappushpop=function(array,item,cmp){var _ref;return null==cmp&&(cmp=defaultCmp),array.length&&cmp(array[0],item)<0&&(item=(_ref=[array[0],item])[0],array[0]=_ref[1],_siftup(array,0,cmp)),item},
	/*
	Transform list into a heap, in-place, in O(array.length) time.
	*/
	heapify=function(array,cmp){var i,_i,_len,_ref1,_results,_results1;for(null==cmp&&(cmp=defaultCmp),_results=[],_i=0,_len=(_ref1=function(){_results1=[];for(var _j=0,_ref=floor(array.length/2);0<=_ref?_j<_ref:_j>_ref;0<=_ref?_j++:_j--)_results1.push(_j);return _results1}.apply(this).reverse()).length;_i<_len;_i++)i=_ref1[_i],_results.push(_siftup(array,i,cmp));return _results},
	/*
	Update the position of the given item in the heap.
	This function should be called every time the item is being modified.
	*/
	updateItem=function(array,item,cmp){var pos;if(null==cmp&&(cmp=defaultCmp),-1!==(pos=array.indexOf(item)))return _siftdown(array,0,pos,cmp),_siftup(array,pos,cmp)},
	/*
	Find the n largest elements in a dataset.
	*/
	nlargest=function(array,n,cmp){var elem,result,_i,_len,_ref;if(null==cmp&&(cmp=defaultCmp),!(result=array.slice(0,n)).length)return result;for(heapify(result,cmp),_i=0,_len=(_ref=array.slice(n)).length;_i<_len;_i++)elem=_ref[_i],heappushpop(result,elem,cmp);return result.sort(cmp).reverse()},
	/*
	Find the n smallest elements in a dataset.
	*/
	nsmallest=function(array,n,cmp){var elem,los,result,_i,_j,_len,_ref,_ref1,_results;if(null==cmp&&(cmp=defaultCmp),10*n<=array.length){if(!(result=array.slice(0,n).sort(cmp)).length)return result;for(los=result[result.length-1],_i=0,_len=(_ref=array.slice(n)).length;_i<_len;_i++)cmp(elem=_ref[_i],los)<0&&(insort(result,elem,0,null,cmp),result.pop(),los=result[result.length-1]);return result}for(heapify(array,cmp),_results=[],_j=0,_ref1=min(n,array.length);0<=_ref1?_j<_ref1:_j>_ref1;0<=_ref1?++_j:--_j)_results.push(heappop(array,cmp));return _results},_siftdown=function(array,startpos,pos,cmp){var newitem,parent,parentpos;for(null==cmp&&(cmp=defaultCmp),newitem=array[pos];pos>startpos&&cmp(newitem,parent=array[parentpos=pos-1>>1])<0;)array[pos]=parent,pos=parentpos;return array[pos]=newitem},_siftup=function(array,pos,cmp){var childpos,endpos,newitem,rightpos,startpos;for(null==cmp&&(cmp=defaultCmp),endpos=array.length,startpos=pos,newitem=array[pos],childpos=2*pos+1;childpos<endpos;)(rightpos=childpos+1)<endpos&&!(cmp(array[childpos],array[rightpos])<0)&&(childpos=rightpos),array[pos]=array[childpos],childpos=2*(pos=childpos)+1;return array[pos]=newitem,_siftdown(array,startpos,pos,cmp)},Heap=function(){function Heap(cmp){this.cmp=null!=cmp?cmp:defaultCmp,this.nodes=[]}return Heap.push=heappush,Heap.pop=heappop,Heap.replace=heapreplace,Heap.pushpop=heappushpop,Heap.heapify=heapify,Heap.updateItem=updateItem,Heap.nlargest=nlargest,Heap.nsmallest=nsmallest,Heap.prototype.push=function(x){return heappush(this.nodes,x,this.cmp)},Heap.prototype.pop=function(){return heappop(this.nodes,this.cmp)},Heap.prototype.peek=function(){return this.nodes[0]},Heap.prototype.contains=function(x){return-1!==this.nodes.indexOf(x)},Heap.prototype.replace=function(x){return heapreplace(this.nodes,x,this.cmp)},Heap.prototype.pushpop=function(x){return heappushpop(this.nodes,x,this.cmp)},Heap.prototype.heapify=function(){return heapify(this.nodes,this.cmp)},Heap.prototype.updateItem=function(x){return updateItem(this.nodes,x,this.cmp)},Heap.prototype.clear=function(){return this.nodes=[]},Heap.prototype.empty=function(){return 0===this.nodes.length},Heap.prototype.size=function(){return this.nodes.length},Heap.prototype.clone=function(){var heap;return(heap=new Heap).nodes=this.nodes.slice(0),heap},Heap.prototype.toArray=function(){return this.nodes.slice(0)},Heap.prototype.insert=Heap.prototype.push,Heap.prototype.top=Heap.prototype.peek,Heap.prototype.front=Heap.prototype.peek,Heap.prototype.has=Heap.prototype.contains,Heap.prototype.copy=Heap.prototype.clone,Heap}(),__WEBPACK_AMD_DEFINE_ARRAY__=[],void 0===(__WEBPACK_AMD_DEFINE_RESULT__="function"==typeof(__WEBPACK_AMD_DEFINE_FACTORY__=function(){return Heap})?__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports,__WEBPACK_AMD_DEFINE_ARRAY__):__WEBPACK_AMD_DEFINE_FACTORY__)||(module.exports=__WEBPACK_AMD_DEFINE_RESULT__)}).call(this)}
	/******/]);

	/* 
	@license
	aPathfinding is free software, available under the terms of a MIT style License.

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
	
	Neither the name “EvitcaStudio” or "aPathfinding" nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE. 
	*/
		
	const aPathfinder = {};
	VYLO.global.aPathfinder = aPathfinder;

	Diob.prototype.cancelMove = function() {
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

	Diob.prototype.goTo = function(pX, pY, pDiagonal = false, pNearest = false, pExclude = []) {
		// pNearest will only search the closest MAX_NEAREST_TILE_SEARCH tiles or so to find a near tile. If no near tile is found, no path is returned.
		if (this && this.mapName && this.xPos !== 10000 && this.yPos !== 10000) {
			const TILE_SIZE = VYLO.World.getTileSize();
			const TICK_FPS = VYLO.Client.maxFPS ? (1000 / VYLO.Client.maxFPS) : 16.67;
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
			
			const currentTile = VYLO.Map.getLocByPos(Math.round(this.xPos + this.xOrigin + this.width / 2), Math.round(this.yPos + this.yOrigin + this.height / 2), this.mapName);

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

					this.aPathfinderTrajectory.deltaTime = (this.aPathfinderTrajectory.elapsedMS / TICK_FPS);
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
						if (VYLO.global.aPathfinder.debugging) {
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

						self.aPathfinderTrajectory.angle = VYLO.global.aPathfinder.getAngle(coords, nodePos);
						self.aPathfinderTrajectory.nextNodePos = nodePos;
						self.aPathfinderTrajectory.x = Math.cos(self.aPathfinderTrajectory.angle); // This is already multiplied by stepSize when using movePos
						self.aPathfinderTrajectory.y = Math.sin(self.aPathfinderTrajectory.angle); // This is already multiplied by stepSize when using movePos
						self.dir = VYLO.global.aPathfinder.getDirFromAngle(-self.aPathfinderTrajectory.angle);
						self.movePos(self.aPathfinderTrajectory.x, self.aPathfinderTrajectory.y);
						self.aPathfinderMoving = true;

						// Show the angle to move in
						if (VYLO.global.aPathfinder.debugging) {
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
							pathAngle.angle = -self.aPathfinderTrajectory.angle;
							pathAngle.setPos(coords.x, coords.y, self.mapName);
							pathAngle.setTransition({ alpha: 0 }, -1, debuggerDuration);
							setTimeout(() => {
								VYLO.delDiob(pathAngle);
							}, debuggerDuration);
						}
					} else {
						const distance = Math.round(VYLO.global.aPathfinder.getDistance(coords, self.aPathfinderTrajectory.nextNodePos));
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
							self.aPathfinderTrajectory.angle = VYLO.global.aPathfinder.getAngle(coords, self.aPathfinderTrajectory.nextNodePos);
							self.aPathfinderTrajectory.x = Math.cos(self.aPathfinderTrajectory.angle); // This is already multiplied by stepSize when using movePos
							self.aPathfinderTrajectory.y = Math.sin(self.aPathfinderTrajectory.angle); // This is already multiplied by stepSize when using movePos
							self.dir = VYLO.global.aPathfinder.getDirFromAngle(-self.aPathfinderTrajectory.angle);
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
			const gridInfo = VYLO.global.aPathfinder.mapTilesToGrid(this.mapName, pExclude);
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
			const endNodeX = VYLO.global.aPathfinder.clamp(Math.round(VYLO.global.aPathfinder.clamp(pX - 1, 0, mapSize.x)) * TILE_SIZE.width + TILE_SIZE.width / 2, 0, mapSize.xPos - TILE_SIZE.width);
			const endNodeY = VYLO.global.aPathfinder.clamp(Math.round(VYLO.global.aPathfinder.clamp(pY - 1, 0, mapSize.y)) * TILE_SIZE.height + TILE_SIZE.height / 2, 0, mapSize.yPos - TILE_SIZE.height);
			const startTile = VYLO.Map.getLocByPos(startNodeX, startNodeY, this.mapName);
			// This end tile is based on the position you bounds are on (this can be a different tile)
			const endTile = VYLO.Map.getLocByPos(endNodeX, endNodeY, this.mapName);
			let startNode = VYLO.global.aPathfinder.tileToNode(startTile);
			let endNode = VYLO.global.aPathfinder.tileToNode(endTile);
			
			if (VYLO.global.aPathfinder.debugging) {
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
							const withinYAxis = !pStart ? true : VYLO.global.aPathfinder.within(self.yPos + self.yOrigin + self.height, pElement.yPos + pElement.yOrigin, pElement.yOrigin + pElement.height);
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
							const withinYAxis = !pStart ? true : VYLO.global.aPathfinder.within(self.yPos + self.yOrigin + self.height, pElement.yPos + pElement.yOrigin, pElement.yOrigin + pElement.height);
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
							const withinXAxis = !pStart ? true : VYLO.global.aPathfinder.within(self.xPos + self.xOrigin + self.width, pElement.xPos + pElement.xOrigin, pElement.xOrigin + pElement.width);
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
							const withinXAxis = !pStart ? true : VYLO.global.aPathfinder.within(self.xPos + self.xOrigin + self.width, pElement.xPos + pElement.xOrigin, pElement.xOrigin + pElement.width);
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
					
					if (VYLO.global.aPathfinder.debugging) {
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
						if (VYLO.global.aPathfinder.debugging) {
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

						const node = VYLO.global.aPathfinder.tileToNode(nearestTiles[nT]);
						if (nearestNode) {
							const nearestNodeDistance = VYLO.global.aPathfinder.getDistance(pNode, nearestNode);
							const distance = VYLO.global.aPathfinder.getDistance(pNode, node);
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
					if (VYLO.global.aPathfinder.debugging) {
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
					if (VYLO.global.aPathfinder.debugging) {
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
		return VYLO.Map.getLoc(pNode.x + 1, pNode.y + 1, pMapName);
	}

	aPathfinder.toggleDebug = function() {
		this.debugging = !this.debugging;
	}

})();