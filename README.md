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

###  diobInstance.goTo(pX, pY, pDiagonal, pNearest, pExclude)  
   - `pX`: The xCoordinate to move to `integer`  
   - `pY`: The yCoordinate to move to `integer`  
   - `pDiagonal`: Whether or not the pathfinder allow diagonal moves `boolean`  
   - `pNearest`: Whether or not the path will find the nearest path if the provided coordinates are blocked `boolean`  
   - `pExclude`: An array of diobs that will be ignored when calculating the path `array`  
   - `desc`: Moves this `diobInstance` to the provided coordinates. Returns a `pathID` if a path is generated  

###  diobInstance.cancelMove()  
   - `desc`: Cancels the current path if there is one  

###  diobInstance.onPathComplete(pPathID) `event`  
   - `pPathID`: The ID of the path that was completed `string`  
   - `desc`: This event function is called when this instance has arrived at its destination  

###  diobInstance.onPathStuck(pPathID) `event`  
   - `pPathID`: The ID of the path that was completed `string`
   - `desc`: This event function is called when this instance has become stuck somewhere along its path  
