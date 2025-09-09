// Input from the Angular form
export interface LocationFormValue {
  placeName: string;
  getGeometry: boolean;
}

// Response from the /coordinates endpoint
export interface CoordinatesResponse {
  latitude: number;
  longitude: number;
}

// --- Interfaces for the GeoJSON Response ---

// Describes the shape (e.g., a Polygon)
export interface GeoJsonGeometry {
  type: 'Polygon' | 'MultiPolygon';
  coordinates: number[][][]; // Array of rings, which are arrays of points
}

// The main GeoJSON object structure
export interface GeoJsonFeature {
  type: 'Feature';
  geometry: GeoJsonGeometry;
  properties: Record<string, any>;
}
