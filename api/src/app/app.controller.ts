
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor( ) {}

  @Get()
  getStatus(): { status: string } {
    return { status: 'API is running' };
  }
}
