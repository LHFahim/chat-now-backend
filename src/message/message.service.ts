import { Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { SerializeService } from 'libraries/serializer/serialize';
import { InjectModel } from 'nestjs-typegoose';
import { ConversationEntity } from 'src/conversation/entities/conversation.entity';
import {
  CreateMessageDto,
  MessageDto,
  MessageQuery,
} from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageEntity } from './entities/message.entity';

@Injectable()
export class MessageService extends SerializeService<MessageEntity> {
  constructor(
    @InjectModel(MessageEntity)
    private readonly messageModel: ReturnModelType<typeof MessageEntity>,
    @InjectModel(ConversationEntity)
    private readonly conversationModel: ReturnModelType<
      typeof ConversationEntity
    >,
  ) {
    super(MessageEntity);
  }

  async addMessage(
    userId: string,
    conversationId: string,
    body: CreateMessageDto,
  ) {
    const doc = await this.messageModel.create({
      ...body,
      conversationId,
      sentBy: userId,
    });

    return this.toJSON(doc, MessageDto);
  }

  async findAllMessages(userId: string, query: MessageQuery) {
    const connversationCheck = await this.conversationModel.findOne({
      _id: query.conversationId,
      participants: { $in: [userId] },
    });
    if (!connversationCheck)
      throw new NotFoundException('You cannot view this conversation');

    const docs = await this.messageModel
      .find({
        // participants: { $in: [userId] },
        conversationId: query.conversationId,
      })
      .sort({ [query.sortBy]: query.sort })
      .limit(query.pageSize)
      .skip((query.page - 1) * query.pageSize);

    const docsCount = await this.messageModel
      .countDocuments()
      .sort({ [query.sortBy]: query.sort })
      .limit(query.pageSize)
      .skip((query.page - 1) * query.pageSize);

    return {
      items: this.toJSONs(docs, MessageDto),
      pagination: {
        total: docsCount,
        current: query.page,
        previous: query.page === 1 ? 1 : query.page - 1,
        next:
          docsCount > query.page * query.pageSize ? query.page + 1 : query.page,
      },
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
