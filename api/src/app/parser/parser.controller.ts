
import { Controller, Post, Body } from '@nestjs/common';
import { ParserService } from './parser.service';
import { ParseTextDto } from './dto/parser.dto';

@Controller('parser')
export class ParserController {
  constructor(private readonly parserService: ParserService) {}

  @Post()
  parseText(@Body() parseTextDto: ParseTextDto) {
    return this.parserService.parse(parseTextDto.text);
  }
}
