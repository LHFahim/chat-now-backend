import { ApiProperty } from '@nestjs/swagger';
import { Prop, Ref } from '@typegoose/typegoose';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsMongoId } from 'class-validator';
import { Model } from 'libraries/mongodb/modelOptions';
import { DocumentWithTimeStamps } from 'src/common/classes/documentWithTimeStamps';
import { UserEntity } from 'src/user/entities/user.entity';

@Model('conversations', true)
export class ConversationEntity extends DocumentWithTimeStamps {
  @Expose()
  @Type(() => UserEntity)
  @IsMongoId({ each: true })
  @ApiProperty({ required: false, type: [UserEntity] })
  @Prop({ required: false, default: [], ref: () => UserEntity })
  @IsArray({ message: 'Participants must be an array', each: true })
  participants: Ref<UserEntity>[];

  @Expose()
  @IsMongoId()
  @Type(() => UserEntity)
  @ApiProperty({ required: true, type: [UserEntity] })
  @Prop({ required: true, ref: () => UserEntity })
  createdBy: Ref<UserEntity>;

  // if i want to send messages in response
  content?: any;

  @Expose()
  @Prop({ required: false, type: Boolean, default: true })
  isActive: boolean;

  @Expose()
  @Prop({ required: false, type: Boolean, default: false })
  isDeleted: boolean;
}
