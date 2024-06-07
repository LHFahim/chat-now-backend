import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConversationEntity } from '../entities/conversation.entity';

export class CreateConversationDto extends PickType(ConversationEntity, []) {
  @Expose()
  @IsArray()
  @ApiProperty({ required: true })
  participants: string[];
}

export class UpdateConversationDto extends PartialType(CreateConversationDto) {}

export class ConversationDto extends OmitType(ConversationEntity, []) {}

export class ConversationQuery extends PaginationQueryDto {}
export class ConversationPaginatedDto {
  @Expose()
  items: ConversationDto[];

  @Expose()
  pagination: PaginationDto;
}
