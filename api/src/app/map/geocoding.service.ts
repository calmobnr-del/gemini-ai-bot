import { Injectable, BadGatewayException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import axios from 'axios';

@Injectable()
export class GeocodingService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getGeometryForPlace(placeName: string): Promise<any> {
    const apiKey = this.configService.get<string>('GOOGLE_CLOUD_API_KEY');
    const encodedPlaceName = encodeURIComponent(placeName);
    const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedPlaceName}&key=${apiKey}`;

    try {
      const response = await firstValueFrom(this.httpService.get(apiUrl));

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        // The Google API returns a much richer object, including the geometry and a viewport
        return response.data.results[0];
      } else if (response.data.status === 'ZERO_RESULTS') {
        throw new NotFoundException(`No results found for place: "${placeName}"`);
      } else {
        throw new BadGatewayException(`Google Geocoding API error: ${response.data.status} - ${response.data.error_message || ''}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new BadGatewayException('Failed to connect to the Google Geocoding API.');
      }
      throw error; // Re-throw other unexpected errors
    }
  }
}
