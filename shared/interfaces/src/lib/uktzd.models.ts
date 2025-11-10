// The JSON object returned by the API
export interface UktzedResponse {
  product_description: string;
  uktzd_code: string;
  code_description: string;
  section: string;
  confidence: 'High' | 'Medium' | 'Low';
  notes: string;
}

// The request body sent to the API
export interface UktzedRequest {
  product_description: string;
}
