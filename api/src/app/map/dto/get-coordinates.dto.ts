import { IsNotEmpty, IsString } from 'class-validator';

export class GetCoordinatesDto {
  @IsString()
  @IsNotEmpty()
  placeName: string;
}
