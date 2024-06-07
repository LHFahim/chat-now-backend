import { ApiProperty } from '@nestjs/swagger';
import { Prop } from '@typegoose/typegoose';
import { Expose } from 'class-transformer';
import { ObjectID } from 'libraries/serializer/serializer.decorator';
import { Types } from 'mongoose';

export class Document {
  @ObjectID()
  @Expose({ name: 'id' })
  @ApiProperty({ name: 'id', type: String })
  _id?: Types.ObjectId;
}

export class DocumentWithTimeStamps extends Document {
  @Prop({ required: false, type: Date })
  @Expose()
  public createdAt?: Date;

  @Prop({ required: false, type: Date })
  @Expose()
  public updatedAt?: Date;
}
