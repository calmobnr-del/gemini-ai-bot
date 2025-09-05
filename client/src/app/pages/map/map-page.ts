import { Component, inject, OnInit, signal } from '@angular/core';
import { MapStore } from './store/map.strore';
import {
  ControlComponent,
  MapComponent,
  MarkerComponent,
  NavigationControlDirective,
} from '@maplibre/ngx-maplibre-gl';
import { MapService } from './store/map.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { LocationForm, LocationFormValue } from '@gemini-ai-bot/ui';
import { Map } from 'maplibre-gl';

@Component({
  selector: 'app-bot-map-page',
  imports: [
    MapComponent,
    ControlComponent,
    MarkerComponent,
    NavigationControlDirective,
    LocationForm,
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

  mapStyle = toSignal(this.mapService.getMapStyle());

  onMapLoad(mapInstance: Map) {
    this.mapService.setMap(mapInstance);
  }

  constructor() {}

  ngOnInit() {
    this.mapStore.loadLocations();
  }

  toggleOpenForm() {
    this.openedForm.set(!this.openedForm());
  }

  handleLocationSubmit(formValue: LocationFormValue) {
    this.mapService.getCoordinatesForPlace(formValue.name).subscribe({
      next: (coords) => {

        this.markerPosition.set([coords.longitude, coords.latitude]);
        this.mapService.flyTo([coords.longitude, coords.latitude], 15);
      },
      error: (err) => {
        console.error('Error fetching coordinates:', err);
      },
    });
  }
}
