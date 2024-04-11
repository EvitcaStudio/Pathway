# Pathway Module

The Pathway module smoothly integrates pathfinding into the Vylocity Game Engine, allowing map instances to navigate environments more efficiently.

Uses [easystar](https://github.com/prettymuchbryce/easystarjs) under the hood.

## Installation

### ES Module

```js
import { Pathway } from './pathway.mjs';
```

### IIFE (Immediately Invoked Function Expression)

```js
<script src="pathway.js"></script>;
// ...
window.PathwayBundle.Pathway;
```

### CommonJS (CJS) Module

```js
const { Pathway } = require('./pathway.cjs.js');
```

## API

### MapInstance Properties

#### `pathwayWeight`

- **Type**: `number`
- **Description**: Represents the importance of an element in pathfinding. Higher values indicate that paths should avoid this element. A weight of `0` means it's easy to traverse, while `-1` indicates an impassable obstacle. This property is optional.

### Methods

#### `Pathway.to(pInstance, pDestination, pOptions)`

- **Parameters**:
  - `pInstance`: The moving element.
  - `pDestination.x`: The destination's x-coordinate.
  - `pDestination.y`: The destination's y-coordinate.
  - `pOptions.diagonal`: Whether diagonal movement is allowed.
  - `pOptions.mode`: Movement style (`collision` considers obstacles, `position` ignores obstacles).
  - `pOptions.pixelsPerSecond`: Speed of movement in pixels per second (applies only in `position` mode).
  - `pOptions.exclude`: An array of obstacles to avoid when planning the path.
  - `pOptions.minDistance`: Minimum distance to determine node proximity.
  - `pOptions.maxStuckCounter`: Maximum consecutive ticks without movement before considering the instance stuck.
  - `pOptions.onPathComplete`: Callback executed when the element reaches its destination.
  - `pOptions.onPathFound`: Callback executed when a viable path is found.
  - `pOptions.onPathStuck`: Callback executed when an element gets stuck on its path.
  - `pOptions.onPathNotFound`: Callback executed when no path is found.
- **Description**: Guides an element to a destination along a clear path, avoiding obstacles as necessary.

#### `Pathway.end(pInstance)`

- **Parameters**:
  - `pInstance`: The element to stop pathfinding for.
- **Description**: Halts the current path and stops the element's movement.

#### `Pathway.setTileSize(pTileSize)`

- **Parameters**:
  - `pTileSize`: The dimensions of the tileset.
- **Description**: Sets the size of tiles for the pathway system to reference.

### Global Dependency

Pathway relies on the `VYLO` variable being globally accessible.
