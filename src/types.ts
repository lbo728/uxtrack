export type TouchMode = "visualization" | "production";

export interface StorageConfig {
  storageKey?: string;
  touchLogKey?: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  distance: number;
}

export interface Observer {
  onPointsUpdated?(points: Point[]): void;
  onLinesUpdated?(lines: Line[]): void;
  onTotalDistanceUpdated?(totalDistance: number): void;
}
