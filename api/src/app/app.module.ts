import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { GeminiAiService } from './chat/gemini-ai.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'apps/api/.env' }),
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, GeminiAiService],
})
export class AppModule {}
