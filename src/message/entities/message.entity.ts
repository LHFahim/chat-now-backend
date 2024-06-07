import { ApiProperty } from '@nestjs/swagger';
import { Prop, Ref } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';
import { IsEnum, IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Model } from 'libraries/mongodb/modelOptions';
import { DocumentWithTimeStamps } from 'src/common/classes/documentWithTimeStamps';
import { ConversationEntity } from 'src/conversation/entities/conversation.entity';
import { UserEntity } from 'src/user/entities/user.entity';

export enum MessageTypeEnum {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
}

@Model('messages', true)
export class MessageEntity extends DocumentWithTimeStamps {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  @Prop({ required: true, trim: true })
  message: string;

  @Expose()
  @IsEnum(MessageTypeEnum)
  @ApiProperty({ required: true, enum: MessageTypeEnum })
  @Prop({ required: true, enum: MessageTypeEnum })
  type: MessageTypeEnum;

  @Expose()
  @IsMongoId()
  @Type(() => ConversationEntity)
  @ApiProperty({ required: true, type: [ConversationEntity] })
  @Prop({ required: true, ref: () => ConversationEntity })
  conversation: Ref<ConversationEntity>;

  @Expose()
  @IsMongoId()
  @Type(() => UserEntity)
  @ApiProperty({ required: true, type: [UserEntity] })
  @Prop({ required: true, ref: () => UserEntity })
  user: Ref<UserEntity>;

  @Expose()
  @Prop({ required: false, type: Boolean, default: true })
  isActive: boolean;

  @Expose()
  @Prop({ required: false, type: Boolean, default: false })
  isDeleted: boolean;
}
