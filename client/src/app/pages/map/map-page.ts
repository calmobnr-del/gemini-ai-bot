import { Component, inject, OnInit, signal } from '@angular/core';
import { MapStore } from './store/map.strore';
import { ControlComponent, MapComponent, MarkerComponent, NavigationControlDirective } from '@maplibre/ngx-maplibre-gl';
import { MapService } from './store/map.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { LocationForm, LocationFormValue } from '@gemini-ai-bot/ui';

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

  mapStyle = toSignal(this.mapService.getMapStyle());

  toggleOpenForm() {
    this.openedForm.set(!this.openedForm());
  }

  handleLocationSubmit(formValue: LocationFormValue) {
    this.mapService.getCoordinatesForPlace(formValue.name).subscribe({
      next: (coords) => {
        console.log('Received coordinates from backend:', coords);

        // NEXT STEP: Use these coordinates to update the map!
        // For example, you could set a new center for the map:
        this.initialCenter = [coords.longitude, coords.latitude];
      },
      error: (err) => {
        console.error('Error fetching coordinates:', err);
      },
    });
  }

  ngOnInit() {
    this.mapStore.loadLocations();
  }
}
