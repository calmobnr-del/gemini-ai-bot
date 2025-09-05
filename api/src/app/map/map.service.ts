import { Injectable, InternalServerErrorException, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as fs from 'fs/promises';
import * as path from 'path';
import axios from 'axios';

@Injectable()
export class MapService {
  constructor(private readonly httpService: HttpService) {}

  async getMapStyle(): Promise<any> {
    try {
      // This path correctly finds the file in the 'assets' folder
      // const filePath = path.join(__dirname, '..', '..', 'assets', 'style.json');
      const filePath = path.join(process.cwd(), 'dist/api/assets/style.json');
      const fileContents = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(fileContents);
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
