import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { patchState, signalState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';

// Define a type for our location data
export interface Location {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

// Define the state shape
interface MapState {
  locations: Location[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MapState = {
  locations: [],
  isLoading: false,
  error: null,
};

@Injectable()
export class MapStore {
  private readonly http = inject(HttpClient);
  // Create the signalState
  readonly state = signalState(initialState);

  // Expose selectors as computed signals
  readonly locations = computed(() => this.state.locations());
  readonly isLoading = computed(() => this.state.isLoading());

  // Method to trigger fetching locations
  readonly loadLocations = rxMethod<void>(
    pipe(
      tap(() => patchState(this.state, { isLoading: true })),
      switchMap(() => {
        return this.http.get<Location[]>('/api/locations').pipe(
          tap({
            next: (locations) => patchState(this.state, { locations, isLoading: false }),
            error: (err) => patchState(this.state, { error: err.message, isLoading: false }),
          })
        );
      })
    )
  );
}
