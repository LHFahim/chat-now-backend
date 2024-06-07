import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
import { CreateMessageDto, MessageQuery } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageService } from './message.service';

@ApiTags('Message')
@Serialize()
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: ControllersEnum.Message, version: APIVersions.V1 })
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post(Routes[ControllersEnum.Message].addMessage)
  addMessage(
    @UserId() userId: string,
    @ResourceId('conversationId') conversationId: string,
    @Body() body: CreateMessageDto,
  ) {
    return this.messageService.addMessage(userId, conversationId, body);
  }

  @Get(Routes[ControllersEnum.Message].findAllMessages)
  findAllMessages(@UserId() userId: string, @Query() query: MessageQuery) {
    return this.messageService.findAllMessages(userId, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.messageService.update(+id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}
