import { Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { SerializeService } from 'libraries/serializer/serialize';
import { InjectModel } from 'nestjs-typegoose';
import {
  ConversationDto,
  ConversationQuery,
  CreateConversationDto,
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

  async findAllConversations(userId: string, query: ConversationQuery) {
    const docs = await this.conversationModel
      .find({
        participants: { $in: [userId] },
      })
      .sort({ [query.sortBy]: query.sort })
      .limit(query.pageSize)
      .skip((query.page - 1) * query.pageSize);

    const docsCount = await this.conversationModel
      .countDocuments()
      .sort({ [query.sortBy]: query.sort })
      .limit(query.pageSize)
      .skip((query.page - 1) * query.pageSize);

    return {
      items: this.toJSONs(docs, ConversationDto),
      pagination: {
        total: docsCount,
        current: query.page,
        previous: query.page === 1 ? 1 : query.page - 1,
        next:
          docsCount > query.page * query.pageSize ? query.page + 1 : query.page,
      },
    };
  }

  async findOneConversation(userId: string, id: string) {
    const doc = await this.conversationModel.findOne({
      _id: id,
      participants: { $in: [userId] },
    });
    if (!doc) throw new NotFoundException('Conversation is not found');

    return this.toJSON(doc, ConversationDto);
  }

  async deleteOneConversation(userId: string, _id: string) {
    const doc = await this.conversationModel.findOneAndUpdate(
      {
        _id,
        participants: { $in: [userId] },
      },
      { isDeleted: true },
      { new: true },
    );
    if (!doc) throw new NotFoundException('Conversation is not found');

    return true;
  }
}
