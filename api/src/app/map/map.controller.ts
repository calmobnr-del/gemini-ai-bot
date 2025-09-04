import { Body, Controller, Get, Header, Post } from '@nestjs/common';
import { MapService } from './map.service';
import { GetCoordinatesDto } from './dto/get-coordinates.dto';
import { GeminiAiService } from '../gemini/gemini-ai.service';

@Controller('map')
export class MapController {
  constructor(
    private readonly mapService: MapService,
    private readonly geminiAiService: GeminiAiService,
  ) {}

  @Get('style')
  @Header('Content-Type', 'application/json')
  async getMapStyle() {
    return await this.mapService.getMapStyle();
  }

  @Post('coordinates')
  async getCoordinates(@Body() getCoordinatesDto: GetCoordinatesDto) {
    const { placeName } = getCoordinatesDto;

    // This prompt is crucial. It tells the AI exactly what we want.
    const prompt = `
      Find the geographic coordinates (latitude and longitude) for the following place: "${placeName}".

      Please respond with ONLY a raw JSON object in the format:
      {
        "latitude": number,
        "longitude": number
      }
    `;

    // The Gemini service will return the parsed JSON from the AI's response
    return this.geminiAiService.generateText(prompt);
  }
}
