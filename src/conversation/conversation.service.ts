import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { SerializeService } from 'libraries/serializer/serialize';
import { InjectModel } from 'nestjs-typegoose';
import {
  ConversationDto,
  CreateConversationDto,
  UpdateConversationDto,
} from './dto/conversation.dto';
import {
  ConversationEntity,
  ConversationTypeEnum,
} from './entities/conversation.entity';

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
    body.participants.push(userId);

    const privateConversation =
      body.participants.length === 2
        ? ConversationTypeEnum.PRIVATE
        : ConversationTypeEnum.GROUP;

    if (privateConversation) {
      const foundConversation = await this.conversationModel.findOne({
        participants: {
          $all: body.participants,
          $size: body.participants.length,
        },
        type: privateConversation,
      });

      const resData = {
        id: foundConversation._id.toString(),
        type: foundConversation.type,
        participants: body.participants,
        createdBy: foundConversation.createdBy.toString(),
        isActive: foundConversation.isActive,
        isDeleted: foundConversation.isDeleted,
        createdAt: foundConversation.createdAt,
        updatedAt: foundConversation.updatedAt,
      };

      return this.toJSON(resData, ConversationDto);
    }

    const conversation = await this.conversationModel.create({
      participants: body.participants.map((id) => id.toString()),
      type: privateConversation,
      createdBy: userId,
    });

    const resData = {
      id: conversation._id.toString(),
      type: conversation.type,
      participants: body.participants,
      createdBy: userId,
      isActive: conversation.isActive,
      isDeleted: conversation.isDeleted,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };

    return this.toJSON(resData, ConversationDto);
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
