# aPathfinding
A plugin that will enable pathfinding functionality.  

## Implementation 

### `CLIENT-SIDE`  
#### #INCLUDE SCRIPT aPathfinding.js  
### `SERVER-SIDE` 
#### #INCLUDE SERSCRIPT aPathfinding.js  

## How to reference  
### `Javascript`
#### aPathfinder  
  
### `VyScript`  
#### aPathfinder

## API   

###  aPathfinder.toggleDebug()
   - `desc`: Turn on/off the debugging mode of this plugin, which throws additional logs/warnings. Will also show the paths as the instance moves along it. Should be turned off in production code.  

###  diobInstance.aPathfinderWeight   
   - `desc`: The weight of this diob in the pathfinder system, higher values will try to make the pathfinder generate paths that do not include this instance  

###  diobInstance.goTo(pX, pY, pDiagonal, pNearest, pExclude)  
   - `pX`: The xCoordinate to move to `integer`  
   - `pY`: The yCoordinate to move to `integer`  
   - `pDiagonal`: Whether or not the pathfinder allows diagonal moves `boolean`  
   - `pNearest`: Whether or not the path will find the nearest path if the provided coordinates are blocked `boolean`  
   - `pExclude`: An array of diobs that will be ignored when calculating the path `array`  
   - `desc`: Moves this `diobInstance` to the provided coordinates. Returns a `pathID` if a path is generated  

###  diobInstance.cancelPath()  
   - `desc`: Cancels the current path if there is one  

###  diobInstance.onPathFound(pPath, pPathReversed) `event`  
   - `pPath`: The path that was calculated `array` 
   - `pPathReversed`: The reversed path that was calculated `array`  
   - `desc`: This event function is called when a path has been found after calling `this.goTo`    

###  diobInstance.onPathNotFound() `event`  
   - `desc`: This event function is called when no path was found after calling `this.goTo`    

###  diobInstance.onPathComplete(pPathID) `event`  
   - `pPathID`: The ID of the path that was completed `string`  
   - `desc`: This event function is called when this instance has arrived at its destination  

###  diobInstance.onPathStuck(pPathID) `event`  
   - `pPathID`: The ID of the path that was completed `string`
   - `desc`: This event function is called when this instance has become stuck somewhere along its path  
