# Pathway
A module that will enable pathfinding functionality in the Vylocity Game Engine   

Uses [easystar](https://github.com/prettymuchbryce/easystarjs) under the hood.


# ES Module
```js
// Importing as an ES module
import { Pathway } from './pathway.mjs';
```

# IIFE (Immediately Invoked Function Expression)
```js
<!-- Including the IIFE bundle in an HTML file -->
<script src="pathway.js"></script>

// ...
window.PathwayBundle.Pathway
```

# CommonJS (CJS) Module

```js
// Importing as a CommonJS module (Node.js)
const { Pathway } = require('./pathway.cjs.js');
```

## API   

###  instance.pathwayWeight   
   - `type`: `number`  
   - `desc`: The weight of this instance in the pathfinder system, higher values will try to make the pathfinder generate paths that do not include this instance. A weight of `0` is converying that is is passable. A weight of `-1` means it is impassable. Weights are optional!       

###  Pathway.to(pInstance, pDestination, pOptions) 
   - `pInstance`: The instance to move. `object`
   - `pDestination.x`: The xCoordinate to move to `integer`  
   - `pDestination.y`: The yCoordinate to move to `integer`  
   - `pOptions.diagonal`: Whether or not the pathfinder allows diagonal moves `boolean`  
   - `pOptions.mode`: How this instance will move. `collision` for moving with collisions in mind (movePos). `position` for moving with no collisions in mind (setPos). `string` 
   - `pOptions.pixelsPerSecond`: The speed in pixels this instance moves per second. This setting only works when `pOptions.mode` is set to `position`.`number`   
   - `pOptions.exclude`: An array of diobs that will be excluded when calculating the path `array`  
   - `pOptions.minDistance`: The minimum distance this pathway system will use to calculate if you have reached the (next) node. `number`  
   - `pOptions.maxStuckCounter`: The maximum amount of ticks of pInstance being in the same position as the last tick before its considered stuck. `number`  
	- `pOptions.onPathComplete`: Callback for when pInstance makes it to the `function`  
	- `pOptions.onPathFound`: Callback for when pInstance finds a path. The first parameter is the path that was generated. `function`  
	- `pOptions.onPathStuck`: Callback for when pInstance gets stuck on a path. `function`  
	- `pOptions.onPathNotFound`: Callback for when no path is found. `function`  
   - `desc`: Moves `pInstance` to the provided coordinates by walking along a generated path free of obstacles.

###  Pathway.end(pInstance)  
   - `pInstance`: The instance to end the pathfinding on.
   - `desc`: Cancels the current path if there is one and stops this instance from moving    
   
### Pathway.setTileSize(pTileSize)
  - `pTileSize`: The size of the tileset. `number` | `object` `pTileSize.width` and `pTileSize.height` when using an object.  
  - `desc`: Sets the tile size internally for this pathway system to reference. This is how pathway will determine node positions.

This module expects the `VYLO` variable to be exposed globally.