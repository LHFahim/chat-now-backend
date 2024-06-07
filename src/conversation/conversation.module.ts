import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserEntity } from 'src/user/entities/user.entity';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { ConversationEntity } from './entities/conversation.entity';

@Module({
  imports: [TypegooseModule.forFeature([UserEntity, ConversationEntity])],
  controllers: [ConversationController],
  providers: [ConversationService],
})
export class ConversationModule {}
