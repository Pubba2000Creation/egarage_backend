
import { ApiProperty } from '@nestjs/swagger';

export class CommonResponseDto {
  @ApiProperty({ description: 'Indicates whether the request was successful' })
  success: boolean;

  @ApiProperty({
    description:
      'A message providing additional information about the response',
  })
  message: string;

  @ApiProperty({
    description: 'Optional data returned in the response',
    required: false,
  })
  data?: any;

  constructor(success: boolean, message: string, data?: any) {
    this.success = success;
    this.message = message;
    this.data = data;
  }
}
