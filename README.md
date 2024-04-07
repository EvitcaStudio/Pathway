# Pathway
A module that will enable pathfinding functionality in the Vylocity Game Engine   

## Implementation 

```js
import {Pathway} from 'pathway/src/pathway.mjs';
```

## API   

###  instance.pathwayWeight   
   - `desc`: The weight of this instance in the pathfinder system, higher values will try to make the pathfinder generate paths that do not include this instance  

###  Pathway.to(pInstance, pDestination, pOptions) 
   - `pInstance`: The instance to move. `object`
   - `pDestination.x`: The xCoordinate to move to `integer`  
   - `pDestination.y`: The yCoordinate to move to `integer`  
   - `pOptions.diagonal`: Whether or not the pathfinder allows diagonal moves `boolean`  
   - `pOptions.center` Whether the position of this sprite is based in the center. If set to true, the center of the sprite will be used as the position. If no icon is found then the center of the geometrical bounds will be used as the center. `boolean`
   - `pOptions.mode` How this instance will move. `collision` for moving with collisions in mind (movePos). `position` for moving with no collisions in mind (setPos). `string`
   - `pOptions.nearest`: Whether or not the path will find the nearest path if the provided coordinates are blocked `boolean`  
   - `pOptions.ignore`: An array of diobs that will be ignored when calculating the path `array`  
   - `desc`: Moves this `diobInstance` to the provided coordinates by walking along a generated path free of obstacles. Returns a `pathID` if a path is generated  

###  Pathway.end(pInstance)  
   - `pInstance`: The instance to end the pathfinding on.
   - `desc`: Cancels the current path if there is one and stops this instance from moving    

This module expects the `VYLO` variable to be exposed globally.

### Events coming soon!
### More API coming soon!