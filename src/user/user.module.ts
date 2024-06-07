import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypegooseModule } from 'nestjs-typegoose';
import { UserEntity } from './entities/user.entity';
import { ProfileController } from './profile.controller';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [TypegooseModule.forFeature([UserEntity])],
  controllers: [UserController, ProfileController],
  providers: [UserService, JwtService],
  exports: [UserService],
})
export class UserModule {}
