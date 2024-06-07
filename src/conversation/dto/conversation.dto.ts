import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray } from 'class-validator';
import { ConversationEntity } from '../entities/conversation.entity';

export class CreateConversationDto extends PickType(ConversationEntity, []) {
  @Expose()
  @IsArray()
  @ApiProperty({ required: true })
  participants: string[];
}

export class UpdateConversationDto extends PartialType(CreateConversationDto) {}

export class ConversationDto extends OmitType(ConversationEntity, [
  'participants',
]) {
  @Expose()
  participants: string[];
}
