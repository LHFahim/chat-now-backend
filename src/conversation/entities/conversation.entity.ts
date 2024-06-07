import { ApiProperty } from '@nestjs/swagger';
import { Prop, Ref } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';
import { IsEnum, IsMongoId } from 'class-validator';
import { Model } from 'libraries/mongodb/modelOptions';
import { DocumentWithTimeStamps } from 'src/common/classes/documentWithTimeStamps';
import { UserEntity } from 'src/user/entities/user.entity';

export enum ConversationTypeEnum {
  PRIVATE = 'PRIVATE',
  GROUP = 'GROUP',
}

@Model('conversations', true)
export class ConversationEntity extends DocumentWithTimeStamps {
  @Expose()
  @Type(() => UserEntity)
  @ApiProperty({ required: false })
  @Prop({ required: false, type: UserEntity, ref: () => UserEntity })
  participants: Ref<UserEntity>[];

  @Expose()
  @IsEnum(ConversationTypeEnum)
  @ApiProperty({ required: true, enum: ConversationTypeEnum })
  @Prop({ required: true, enum: ConversationTypeEnum })
  type: ConversationTypeEnum;

  @Expose()
  @IsMongoId()
  @Type(() => UserEntity)
  @ApiProperty({ required: true, type: UserEntity })
  @Prop({ required: true, ref: () => UserEntity })
  createdBy: Ref<UserEntity>;

  // if i want to send messages in response, nothing in db
  content?: any;

  @Expose()
  @Prop({ required: false, type: Boolean, default: true })
  isActive: boolean;

  @Expose()
  @Prop({ required: false, type: Boolean, default: false })
  isDeleted: boolean;
}
