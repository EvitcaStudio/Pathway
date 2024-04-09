# Pathway
A module that will enable pathfinding functionality in the Vylocity Game Engine   

## Implementation 

```js
import { Pathway } from './pathway.min.mjs';
```

## API   

###  instance.pathwayWeight   
   - `desc`: The weight of this instance in the pathfinder system, higher values will try to make the pathfinder generate paths that do not include this instance  

###  Pathway.to(pInstance, pDestination, pOptions) 
   - `pInstance`: The instance to move. `object`
   - `pDestination.x`: The xCoordinate to move to `integer`  
   - `pDestination.y`: The yCoordinate to move to `integer`  
   - `pOptions.diagonal`: Whether or not the pathfinder allows diagonal moves `boolean`  
   - `pOptions.mode`: How this instance will move. `collision` for moving with collisions in mind (movePos). `position` for moving with no collisions in mind (setPos). `string` 
   - `pOptions.pixelsPerSecond`: The speed in pixels this instance moves per second. This setting only works when `pOptions.mode` is set to `position`.`number`   
   - `pOptions.ignore`: An array of diobs that will be ignored when calculating the path `array`  
   - `pOptions.minDistance`: The minimum distance this pathway system will use to calculate if you have reached the (next) node. `number`   
   - `pOptions.maxStuckCounter`: The maximum amount of ticks of pInstance being in the same position as the last tick before its considered stuck. `number`  
	- `pOptions.onPathComplete`: - Callback for when pInstance makes it to the `function`  
	- `pOptions.onPathFound`: - Callback for when pInstance finds a path. The first parameter is the path that was generated. `function`  
	- `pOptions.onPathStuck`: - Callback for when pInstance gets stuck on a path. `function`   
	- `pOptions.onPathNotFound`: - Callback for when no path is found. `function`  
   - `desc`: Moves `pInstance` to the provided coordinates by walking along a generated path free of obstacles. Returns a `pathID` if a path is generated  

###  Pathway.end(pInstance)  
   - `pInstance`: The instance to end the pathfinding on.
   - `desc`: Cancels the current path if there is one and stops this instance from moving    
   
### Pathway.setTileSize(pTileSize)
  - `pTileSize`: The size of the tileset. `number` | `object`
  - `desc`: Sets the tile size internally for this pathway system to reference. This is how pathway will determine node positions.

This module expects the `VYLO` variable to be exposed globally.