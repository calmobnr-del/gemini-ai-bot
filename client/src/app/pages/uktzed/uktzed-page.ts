import { Component, inject, signal } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { UktzedService } from './uktzed.service';
import { UktzedResponse } from '@gemini-ai-bot/interfaces';

// An interface for our component's local state
interface UktzedState {
  loading: boolean;
  error: string | null;
  result: UktzedResponse | null;
}

@Component({
  selector: 'app-bot-uktzed',
  standalone: true,
  // Add CommonModule and NgClass for our new template
  imports: [CommonModule, NgClass],
  templateUrl: './uktzed-page.html',
  styleUrl: './uktzed-page.css',
  // Provide the service to this component
  providers: [UktzedService],
})
export class UktzedPage {
  private uktzedService = inject(UktzedService);

  // A signal to hold the component's state
  public state = signal<UktzedState>({
    loading: false,
    error: null,
    result: null,
  });

  onSubmit(description: string) {
    if (!description.trim()) {
      return;
    }

    // 1. Set loading state
    this.state.set({ loading: true, error: null, result: null });

    // 2. Call the service
    this.uktzedService.getCode(description).subscribe({
      next: (response) => {
        // 3. Set success state with the result

        console.log(response);
        this.state.set({ loading: false, error: null, result: response });
      },
      error: (err) => {
        // 4. Set error state
        this.state.set({
          loading: false,
          error: err.error?.message || err.message || 'An unknown error occurred',
          result: null,
        });
      },
    });
  }
}
