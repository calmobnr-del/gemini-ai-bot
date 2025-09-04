import { Injectable, InternalServerErrorException, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import axios from 'axios';

@Injectable()
export class MapService {
  constructor(private readonly httpService: HttpService) {}

  async getMapStyle(): Promise<any> {
    const styleUrl = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
    try {
      const response = await firstValueFrom(
        this.httpService.get(styleUrl)
      );
      return response.data;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  private handleHttpError(error: unknown): never {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const message = `Failed to fetch map style: External service returned status ${status}`;

      if (status === 404) {
        throw new NotFoundException(message);
      }
      if (status >= 500) {
        throw new ServiceUnavailableException(message);
      }
    }

    // For any other errors, throw a generic server error
    throw new InternalServerErrorException('An unexpected error occurred while fetching the map style.');
  }
}
