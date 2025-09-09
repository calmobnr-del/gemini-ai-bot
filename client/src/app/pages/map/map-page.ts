import { Component, inject, OnInit, signal } from '@angular/core';
import { MapStore } from './store/map.strore';
import {
  ControlComponent, GeoJSONSourceComponent, LayerComponent,
  MapComponent,
  MarkerComponent,
  NavigationControlDirective,
} from '@maplibre/ngx-maplibre-gl';
import { MapService } from './store/map.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { LocationForm } from '@gemini-ai-bot/ui';
import { LngLatBounds, LngLatBoundsLike, Map } from 'maplibre-gl';
import { CoordinatesResponse, GeoJsonFeature, LocationFormValue } from '@gemini-ai-bot/interfaces';

@Component({
  selector: 'app-bot-map-page',
  imports: [
    MapComponent,
    ControlComponent,
    MarkerComponent,
    NavigationControlDirective,
    LocationForm,
    GeoJSONSourceComponent,
    LayerComponent,
  ],
  templateUrl: './map-page.html',
  styleUrl: './map-page.css',
  providers: [MapStore],
})
export class MapPage implements OnInit {
  readonly mapStore = inject(MapStore);
  readonly mapService = inject(MapService);

  openedForm = signal<boolean>(false);

  initialCenter: [number, number] = [30.5234, 50.4501];

  markerPosition = signal<[number, number] | undefined>(undefined);

  geometryData = signal<any | undefined>(undefined);

  mapStyle = toSignal(this.mapService.getMapStyle());

  onMapLoad(mapInstance: Map) {
    this.mapService.setMap(mapInstance);
  }

  ngOnInit() {
    this.mapStore.loadLocations();
  }

  toggleOpenForm() {
    this.openedForm.set(!this.openedForm());
  }

  handleLocationSubmit(formValue: LocationFormValue) {
    this.mapService.getCoordinatesForPlace(formValue).subscribe({
      next: (response) => {

        if (isGeoJsonFeature(response)) {
          // --- HANDLE GEOMETRY RESPONSE ---
          // Clear the single marker and set the geometry data
          this.markerPosition.set(undefined);
          this.geometryData.set(response);

          const coordinates = response.geometry.coordinates[0];
          const bounds = new LngLatBounds();
          // @ts-ignore
          coordinates.forEach((coord: [number, number]) => {
            bounds.extend(coord);
          });
          this.mapService.fitBounds(bounds, 40);
        } else if (response.latitude) {
          // --- HANDLE COORDINATES RESPONSE ---
          // Clear any old geometry and set the single marker
          this.geometryData.set(undefined);
          this.markerPosition.set([response.longitude, response.latitude]);
          this.mapService.flyTo([response.longitude, response.latitude], 15);
        }
      },
      error: (err) => {
        console.error('Error fetching location data:', err);
      },
    });
  }
}


function isGeoJsonFeature(
  response: CoordinatesResponse | GeoJsonFeature,
): response is GeoJsonFeature {
  return (response as GeoJsonFeature).type === 'Feature';
}
