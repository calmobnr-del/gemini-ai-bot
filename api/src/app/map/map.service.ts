import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { GeminiAiService } from '../gemini/gemini-ai.service'; // Import the service
import { CoordinatesResponseDto } from './dto/get-coordinates.dto';

@Injectable()
export class MapService {
  // It only needs to inject the GeminiAiService
  constructor(private readonly geminiAiService: GeminiAiService) {}

  async getMapStyle(): Promise<any> {
    try {
      const filePath = path.join(process.cwd(), 'dist/api/assets/style.json');
      const fileContents = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(fileContents);
    } catch (error) {
      console.error('Error reading map style:', error);
      throw new InternalServerErrorException('Could not load map style configuration.');
    }
  }

  // New method to create the prompt and delegate to GeminiAiService
  async getCoordinatesForPlace(placeName: string): Promise<CoordinatesResponseDto> {
    const prompt = `
      Find the geographic coordinates (latitude and longitude) for the following place: "${placeName}".
      Please respond with ONLY a raw JSON object in the format: {"latitude": number, "longitude": number}
    `;
    return this.geminiAiService.getCoordinates(prompt);
  }

  // New method to create the prompt and delegate to GeminiAiService
  async getGeometryForPlace(placeName: string): Promise<any> {
    const prompt = `
    Generate a detailed, high-resolution GeoJSON Feature object representing the accurate boundary of the following place: "${placeName}".
    The 'geometry' must be a Polygon or MultiPolygon, NOT a simple rectangular bounding box. Use a 10-15 number of coordinate points to more accurately represent the real-world shape.
    The 'properties' property should be an empty object.
    Respond with ONLY the raw, minified JSON for the GeoJSON Feature object.
  `;
    return this.geminiAiService.getGeometry(prompt);
  }
}
