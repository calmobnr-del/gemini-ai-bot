import { Controller, Post, Body } from '@nestjs/common';
import { UktzedService } from './uktzd.service';
import { UktzedRequest } from '@gemini-ai-bot/interfaces';

@Controller('uktzed')
export class UktzedController {
  constructor(private readonly uktzedService: UktzedService) {}

  @Post()
  async getCode(@Body() body: UktzedRequest) {
    return this.uktzedService.getUktzedCode(body.product_description);
  }
}
