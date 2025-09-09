import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocationFormValue } from '@gemini-ai-bot/interfaces';



@Component({
  selector: 'lib-bot-location-form',
  imports: [ReactiveFormsModule],
  templateUrl: './location-form.html',
  styleUrl: './location-form.css',
})
export class LocationForm {
  private fb = inject(FormBuilder);

  locationSubmit = output<LocationFormValue>();

  // Define the form structure with a single, required 'name' field
  locationForm = this.fb.group({
    placeName: ['', [Validators.required, Validators.minLength(3)]],
    getGeometry: false,
  });

  // When submitted, just log the form's current value to the console
  onSubmit() {
    if (this.locationForm.valid) {
      // 3. Emit the form value and then reset the form
      this.locationSubmit.emit(this.locationForm.value as LocationFormValue);
      this.locationForm.reset();
    } else {
      console.error('Form is invalid.');
    }
  }
}
