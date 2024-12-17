# UXTrack / TouchDistanceTracker

<img width="1200" alt="TouchDistanceTracker Thumb" src="https://github.com/user-attachments/assets/c107fabe-6e7f-4373-a6b1-b3da04b17a9d" />

![Bundle Size](https://img.shields.io/bundlephobia/minzip/uxtrack-touch-distance?cache-bust&color=black)![Version](https://img.shields.io/npm/v/uxtrack-touch-distance?cache-bust&color=black)![Downloads](https://img.shields.io/npm/dm/uxtrack-touch-distance?cache-bust&color=black)

## Overview

`TouchDistanceTracker` is a TypeScript library for `tracking and measuring touch/pointer movement distances` across different modes.

<br>

## Installation

```bash
npm i uxtrack-touch-distance
```

<br>

## Usage

### Initialization

```ts
// Default initialization (production mode)
const tracker = new TouchDistanceTracker();

// Custom configuration
const tracker = new TouchDistanceTracker({
  mode: "visualization",
  dpi: 227,
  storageConfig: {
    storageKey: "custom-distance-key",
    touchLogKey: "custom-touch-log-key",
  },
});
```

<br>

## Usage Examples

### 1. Visualization Mode

This mode is used when you want to 'visually' check the distance traveled between operations.

<br>

> ##### How It Works
>
> 1. **Touch Tracking**: When a touch event (`pointerdown`) occurs, the `TouchDistanceTracker` records the coordinates (`touchLog`) to calculate the total distance moved (`totalDistance`).
> 2. **Visualization**:
>    - `Points`: Each touch point is indicated by a blue circle.
>    - `Lines`: A line is drawn connecting the two points, and the distance (mm) is displayed in between.
> 3. **Storage Management**: Touch data is stored in `localStorage` and can be initialized by pressing the `Clear Local Storage` button.

<br>

#### Vue 3 Componets

> ##### Stack
>
> - `Vue`: ^3.5.13
> - `TypeScript`: ~5.6.3
> - `Build Tool`: `Vite`

```ts
<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

import TouchDistanceTracker, {
  type Line,
  type Point,
} from 'touch-distance-tracker'

const tracker = new TouchDistanceTracker({ mode: 'visualization' })
const points = ref<Point[]>([])
const lines = ref<Line[]>([])

const observer = {
  onPointsUpdated(updatedPoints: Point[]) {
    points.value = updatedPoints
  },
  onLinesUpdated(updatedLines: Line[]) {
    lines.value = updatedLines
  },
}

const handleTouch = (event: PointerEvent) => {
  tracker.handleTouch(event)
}

const removeLocalStorage = () => {
  tracker.removeStorage()
  tracker.reset()
  points.value = []
  lines.value = []
}

onMounted(() => {
  tracker.addObserver(observer)
})

onUnmounted(() => {
  tracker.removeObserver(observer)
})
</script>

<template>
  <div class="touch-container" @pointerdown="handleTouch">
    <svg class="line-container">
      <circle
        v-for="(point, index) in points"
        :key="'circle-' + index"
        :cx="point.x"
        :cy="point.y"
        r="15"
        fill="blue"
      />

      <line
        v-for="(line, index) in lines"
        :key="'line-' + index"
        :x1="line.x1"
        :y1="line.y1"
        :x2="line.x2"
        :y2="line.y2"
        stroke="black"
        stroke-width="2"
      />

      <text
        v-for="(line, index) in lines"
        :key="'text-' + index"
        :x="(line.x1 + line.x2) / 2"
        :y="(line.y1 + line.y2) / 2"
        fill="black"
        font-size="14"
      >
        {{ line.distance.toFixed(2) }} mm
      </text>

      <text
        v-for="(point, index) in points"
        :key="'number-' + index"
        :x="point.x"
        :y="point.y"
        fill="white"
        font-size="14"
        text-anchor="middle"
        dominant-baseline="middle"
      >
        {{ index + 1 }}
      </text>
    </svg>

    <button class="clear-button" @click="removeLocalStorage" @pointerdown.stop>
      Clear Local Storage
    </button>
  </div>
</template>

<style scoped>
.touch-container {
  position: relative;
  height: 100vh;
}

.line-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.output {
  position: absolute;
  left: 50%;
  top: 50%;
  font-size: 18px;
  font-weight: bold;
}

circle {
  fill: blue;
}

line {
  stroke: black;
  stroke-width: 2;
}

text {
  font-family: Arial, sans-serif;
}

.clear-button {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 10px 20px;
  background-color: #ff5555;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.clear-button:hover {
  background-color: #ff3333;
}
</style>


```

<br>

#### React Component

> ##### Stack
>
> - `React`: ^18.2.0
> - `TypeScript`: ~5.6.3
> - `Build Tool`: `Vite`

```tsx
import React, { useEffect, useRef, useState } from "react";
import TouchDistanceTracker, { Line, Point } from "touch-distance-tracker";

const VisualizationMode: React.FC = () => {
  const tracker = useRef(new TouchDistanceTracker({ mode: "visualization" }));
  const [points, setPoints] = useState<Point[]>([]);
  const [lines, setLines] = useState<Line[]>([]);

  const observer = {
    onPointsUpdated: (updatedPoints: Point[]) => setPoints(updatedPoints),
    onLinesUpdated: (updatedLines: Line[]) => setLines(updatedLines),
  };

  useEffect(() => {
    tracker.current.addObserver(observer);
    return () => {
      tracker.current.removeObserver(observer);
    };
  }, []);

  const handleTouch = (event: React.PointerEvent) => {
    tracker.current.handleTouch(event.nativeEvent);
  };

  const removeLocalStorage = () => {
    tracker.current.removeStorage();
    tracker.current.reset();
    setPoints([]);
    setLines([]);
  };

  return (
    <div className="touch-container" onPointerDown={handleTouch}>
      <svg className="line-container">
        {points.map((point, index) => (
          <circle key={`circle-${index}`} cx={point.x} cy={point.y} r="15" fill="blue" />
        ))}

        {lines.map((line, index) => (
          <>
            <line
              key={`line-${index}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="black"
              strokeWidth="2"
            />
            <text
              key={`text-${index}`}
              x={(line.x1 + line.x2) / 2}
              y={(line.y1 + line.y2) / 2}
              fill="black"
              fontSize="14"
            >
              {line.distance.toFixed(2)} mm
            </text>
          </>
        ))}

        {points.map((point, index) => (
          <text
            key={`number-${index}`}
            x={point.x}
            y={point.y}
            fill="white"
            fontSize="14"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {index + 1}
          </text>
        ))}
      </svg>

      <button className="clear-button" onClick={removeLocalStorage}>
        Clear Local Storage
      </button>
    </div>
  );
};

export default VisualizationMode;
```

<br>

##### CSS

```css
.touch-container {
  position: relative;
  height: 100vh;
}

.line-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.clear-button {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 10px 20px;
  background-color: #ff5555;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.clear-button:hover {
  background-color: #ff3333;
}
```

<br>

#### Vanilla JS

> ##### Stack
>
> - `Vanilla JS`: ES6+
> - `Build Tool`: `Vite` (Optional)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Visualization Mode</title>
    <script type="module">
      import TouchDistanceTracker from "touch-distance-tracker";

      const tracker = new TouchDistanceTracker({ mode: "visualization" });
      const points = [];
      const lines = [];

      const touchContainer = document.querySelector(".touch-container");
      const svgContainer = document.querySelector(".line-container");

      const observer = {
        onPointsUpdated(updatedPoints) {
          points.splice(0, points.length, ...updatedPoints);
          render();
        },
        onLinesUpdated(updatedLines) {
          lines.splice(0, lines.length, ...updatedLines);
          render();
        },
      };

      tracker.addObserver(observer);

      touchContainer.addEventListener("pointerdown", (event) => {
        tracker.handleTouch(event);
      });

      const render = () => {
        svgContainer.innerHTML = "";

        points.forEach((point, index) => {
          svgContainer.innerHTML += `<circle cx="${point.x}" cy="${point.y}" r="15" fill="blue"></circle>
            <text x="${point.x}" y="${
            point.y
          }" fill="white" font-size="14" text-anchor="middle" dominant-baseline="middle">${index + 1}</text>`;
        });

        lines.forEach((line) => {
          svgContainer.innerHTML += `<line x1="${line.x1}" y1="${line.y1}" x2="${line.x2}" y2="${
            line.y2
          }" stroke="black" stroke-width="2"></line>
            <text x="${(line.x1 + line.x2) / 2}" y="${
            (line.y1 + line.y2) / 2
          }" fill="black" font-size="14">${line.distance.toFixed(2)} mm</text>`;
        });
      };

      document.querySelector(".clear-button").addEventListener("click", () => {
        tracker.removeStorage();
        tracker.reset();
        render();
      });
    </script>
    <style>
      .touch-container {
        position: relative;
        height: 100vh;
      }

      .line-container {
        position: absolute;
        width: 100%;
        height: 100%;
      }

      .clear-button {
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 10px 20px;
        background-color: #ff5555;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }

      .clear-button:hover {
        background-color: #ff3333;
      }
    </style>
  </head>
  <body>
    <div class="touch-container">
      <svg class="line-container"></svg>
      <button class="clear-button">Clear Local Storage</button>
    </div>
  </body>
</html>
```

<br>
<br>

### 2. Production Mode

This mode `sets` only the movement distance data between operations for use in actual production.

<br>

> ###### How It Works
>
> 1. **Touch Tracking**: When a touch event (`pointerdown`) occurs, `TouchDistanceTracker` records the coordinates (`touchLog`) and calculates the total distance moved (`totalDistance`).
> 2. **Storage Management**: Touch data is stored in `localStorage` and can be initialized by pressing the `Clear Local Storage` button.

<br>

#### Vue 3

> ##### Stack
>
> - Vue: ^3.5.13
> - TypeScript: ~5.6.3
> - Build Tool: Vite

```js
<script lang="ts" setup>
import TouchDistanceTracker from 'touch-distance-tracker'

const tracker = new TouchDistanceTracker({ mode: 'production' })


const handleTouch = (event: PointerEvent) => {
  tracker.handleTouch(event)
}

const removeLocalStorage = () => {
  tracker.removeStorage()
  tracker.reset()
}

</script>

<template>
  <div class="touch-container" @pointerdown="handleTouch">
    <button class="clear-button" @click="removeLocalStorage" @pointerdown.stop>
      Clear Local Storage
    </button>
  </div>
</template>

<style scoped></style>


```

<br>

#### React Component

> ##### Stack
>
> - `React`: ^18.2.0
> - `TypeScript`: ~5.6.3
> - `Build Tool`: `Vite`

```tsx
import React, { useRef } from "react";
import TouchDistanceTracker from "touch-distance-tracker";

const ProductionMode: React.FC = () => {
  const tracker = useRef(new TouchDistanceTracker({ mode: "production" }));

  const handleTouch = (event: React.PointerEvent) => {
    tracker.current.handleTouch(event.nativeEvent);
  };

  const removeLocalStorage = () => {
    tracker.current.removeStorage();
    tracker.current.reset();
  };

  return (
    <div className="touch-container" onPointerDown={handleTouch}>
      <button className="clear-button" onClick={removeLocalStorage}>
        Clear Local Storage
      </button>
    </div>
  );
};

export default ProductionMode;
```

<br>

#### Vanila Javascript

> ##### Stack
>
> - `Vanilla JS`: ES6+
> - `Build Tool`: `Vite` (Optional)

```js
<script type="module">
  import TouchDistanceTracker from 'touch-distance-tracker'

  const tracker = new TouchDistanceTracker({ mode: 'production' })

  document.querySelector('.touch-container').addEventListener('pointerdown', (event) => {
    tracker.handleTouch(event)
  })

  document.querySelector('.clear-button').addEventListener('click', () => {
    tracker.removeStorage()
    tracker.reset()
  })
</script>
```

<br>
<br>

## Core Methods

### `handleTouch(event: PointerEvent)`

Processes touch events and calculates distance

<br>

### `addObserver(observer: Observer)`

Adds an observer to track changes (only in visualization mode)

```ts
const observer = {
  onPointsUpdated(points) { ... },
  onLinesUpdated(lines) { ... },
  onTotalDistanceUpdated(distance) { ... }
}
tracker.addObserver(observer)

```

<br>

## All Methods

| Method             | Description                                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------------------- |
| `addObserver`      | Adds an `observer` to receive notifications on state changes.                                             |
| `removeObserver`   | Removes a previously added `observer`.                                                                    |
| `handleTouch`      | Handles a touch event, calculates the distance moved, updates the total distance, and notifies observers. |
| `reset`            | Resets the tracker state, clears all data, removes items from local storage, and notifies observers.      |
| `getTotalDistance` | Returns the total accumulated distance.                                                                   |
| `getPoints`        | Returns a list of all the tracked touch points.                                                           |
| `getLines`         | Returns a list of all the lines between touch points.                                                     |
| `getTouchLog`      | Returns the touch log (an array of touch data with `x`, `y` coordinates and timestamp).                   |
| `removeStorage`    | Removes all items from local storage related to this tracker (total distance and touch logs).             |

<br>

## Browser Compatibility

Requires browser support for:

- `localStorage`
- `PointerEvent`

<br>

## License

MIT License
