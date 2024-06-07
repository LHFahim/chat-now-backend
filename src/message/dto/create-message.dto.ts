import { ApiProperty, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { MessageEntity } from '../entities/message.entity';

export class CreateMessageDto extends PickType(MessageEntity, [
  'message',
  'type',
]) {}

export class MessageDto extends MessageEntity {}

export class MessageQuery extends PaginationQueryDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  // @ValidateIf((o) => o.conversationId)
  @ApiProperty({ required: true })
  conversationId: string;
}
export class MessagePaginatedDto {
  @Expose()
  items: MessageDto[];

  @Expose()
  pagination: PaginationDto;
}
