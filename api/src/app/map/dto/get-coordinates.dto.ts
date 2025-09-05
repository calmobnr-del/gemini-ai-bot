import { IsNotEmpty, IsString } from 'class-validator';

export class GetCoordinatesDto {
  @IsString()
  @IsNotEmpty()
  placeName: string;
}


export class CoordinatesResponseDto {
  latitude: number;
  longitude: number;
}
