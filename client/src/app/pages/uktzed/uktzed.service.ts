import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UktzedRequest, UktzedResponse } from '@gemini-ai-bot/interfaces';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UktzedService {
  private http = inject(HttpClient);
  private apiUrl = environment.uktzedApiUrl;

  /**
   * Sends a product description to the backend to get a UKTZED code.
   * @param description The product description from the user.
   * @returns An Observable of the UktzedResponse.
   */
  getCode(description: string): Observable<UktzedResponse> {
    // 1. Create the request body object
    const payload: UktzedRequest = {
      product_description: description,
    };

    // 2. Make the POST request
    return this.http.post<UktzedResponse>(this.apiUrl, payload);
  }
}
