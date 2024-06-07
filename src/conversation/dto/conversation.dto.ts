import { PartialType } from '@nestjs/swagger';

export class CreateConversationDto {}

export class UpdateConversationDto extends PartialType(CreateConversationDto) {}
