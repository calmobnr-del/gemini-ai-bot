import { Body, Controller, Get, Header, Post } from '@nestjs/common';
import { MapService } from './map.service';
import { GetCoordinatesDto } from './dto/get-coordinates.dto';

@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {} // Only needs MapService

  @Get('style')
  async getMapStyle() {
    return this.mapService.getMapStyle();
  }

  @Post('coordinates')
  async getCoordinates(@Body() getCoordinatesDto: GetCoordinatesDto) {
    return this.mapService.getCoordinatesForPlace(getCoordinatesDto.placeName);
  }

  @Post('geometry')
  async getGeometry(@Body() getCoordinatesDto: GetCoordinatesDto) {
    return this.mapService.getGeometryForPlace(getCoordinatesDto.placeName);
  }
}
