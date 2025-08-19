import { Injectable, computed } from '@angular/core';
import { patchState, signalState } from '@ngrx/signals';

// 1. Define the shape of the state
export interface CounterState {
  count: number;
}

@Injectable({ providedIn: 'root' })
export class CounterServiceStore {
  // 2. Create the state object
  readonly state = signalState<CounterState>({ count: 0 });

  // 3. Create computed signals manually
  readonly double = computed(() => this.state.count() * 2);

  // 4. Define methods to update the state
  increment() {
    patchState(this.state, { count: this.state.count() + 1 });
  }

  decrement() {
    patchState(this.state, { count: this.state.count() - 1 });
  }
}
