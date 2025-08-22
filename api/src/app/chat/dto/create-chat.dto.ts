import { ApiProperty } from '@nestjs/swagger';

export class CreateChatDto {
  @ApiProperty({
    example: 'Tell me a fun fact about the Amazon river.',
    description: 'The message from the user.',
  })
  message: string;

  @ApiProperty({
    required: false,
    description: 'The ID of an existing session. Omit this field to start a new chat.',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  })
  sessionId?: string;
}
