import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Serialize } from 'libraries/serializer/serializer.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Routes } from 'src/common/constant/routes';
import { ResourceId } from 'src/common/decorator/params.decorator';
import { UserId } from 'src/common/decorator/user.decorator';
import { APIVersions } from 'src/common/enum/api-versions.enum';
import { ControllersEnum } from 'src/common/enum/controllers.enum';
import { ConversationService } from './conversation.service';
import {
  ConversationPaginatedDto,
  ConversationQuery,
  CreateConversationDto,
} from './dto/conversation.dto';

@ApiTags('Conversation')
@Serialize()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: ControllersEnum.Conversation, version: APIVersions.V1 })
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post(Routes[ControllersEnum.Conversation].createConversation)
  createConversation(
    @UserId() userId: string,
    @Body() body: CreateConversationDto,
  ) {
    return this.conversationService.createConversation(userId, body);
  }

  @Get(Routes[ControllersEnum.Conversation].findAllConversations)
  findAllConversations(
    @UserId() userId: string,
    @Query() query: ConversationQuery,
  ): Promise<ConversationPaginatedDto> {
    return this.conversationService.findAllConversations(userId, query);
  }

  @Get(Routes[ControllersEnum.Conversation].findOneConversation)
  async findOneConversation(
    @UserId() userId: string,
    @ResourceId() id: string,
  ) {
    return this.conversationService.findOneConversation(userId, id);
  }

  @Delete(Routes[ControllersEnum.Conversation].deleteOneConversation)
  deleteOneConversation(@UserId() userId: string, @ResourceId() id: string) {
    return this.conversationService.deleteOneConversation(userId, id);
  }
}
