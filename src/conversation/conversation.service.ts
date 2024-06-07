import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { SerializeService } from 'libraries/serializer/serialize';
import { InjectModel } from 'nestjs-typegoose';
import {
  CreateConversationDto,
  UpdateConversationDto,
} from './dto/conversation.dto';
import { ConversationEntity } from './entities/conversation.entity';

@Injectable()
export class ConversationService extends SerializeService<ConversationEntity> {
  constructor(
    @InjectModel(ConversationEntity)
    private readonly conversationModel: ReturnModelType<
      typeof ConversationEntity
    >,
  ) {
    super(ConversationEntity);
  }

  async createConversation(userId: string, body: CreateConversationDto) {
    const conversation = await this.conversationModel.create({
      ...body,
      createdBy: userId,
    });
  }

  findAll() {
    return `This action returns all conversation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} conversation`;
  }

  update(id: number, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }
}
