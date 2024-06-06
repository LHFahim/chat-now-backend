import { Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { SerializeService } from 'libraries/serializer/serialize';
import { InjectModel } from 'nestjs-typegoose';
import { RegisterByEmailDto, UserProfileDto } from 'src/auth/dto/auth.dto';
import { AuthProvider, PanelType } from 'src/common/enum/auth.enum';
import {
  UpdateUserDto,
  UserDto,
  UserPaginatedDto,
  UserQueryDto,
} from './dto/user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService extends SerializeService<UserEntity> {
  constructor(
    @InjectModel(UserEntity)
    private readonly userModel: ReturnModelType<typeof UserEntity>,
  ) {
    super(UserEntity);
  }

  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async createUser(body: RegisterByEmailDto) {
    const createdUser = await this.userModel.create({
      ...body,

      avatarURL: '',
      authProvider: AuthProvider.EMAIL,
      isEmailVerified: true,

      panelType: PanelType.CLIENT,

      lastLogin: null,

      isActive: true,
      isDeleted: false,
    });

    return this.toJSON(createdUser, UserDto);
  }

  async findAll(query: UserQueryDto): Promise<UserPaginatedDto> {
    const docs = await this.userModel
      .find()
      .sort({ [query.sortBy]: query.sort })
      .limit(query.pageSize)
      .skip((query.page - 1) * query.pageSize);

    const docsCount = await this.userModel
      .countDocuments()
      .sort({ [query.sortBy]: query.sort })
      .limit(query.pageSize)
      .skip((query.page - 1) * query.pageSize);

    return {
      items: this.toJSONs(docs, UserDto),
      pagination: {
        total: docsCount,
        current: query.page,
        previous: query.page === 1 ? 1 : query.page - 1,
        next:
          docsCount > query.page * query.pageSize ? query.page + 1 : query.page,
      },
    };
  }

  async findUserById(_id: string) {
    return await this.userModel.findById(_id);
  }

  async findOne(_id: string) {
    const user = await this.userModel.findOne({ _id });
    if (!user) throw new NotFoundException('User not found');

    return this.toJSON(user, UserProfileDto);
  }

  async update(userId: string, id: string, body: UpdateUserDto) {
    const user = await this.userModel.findOneAndUpdate(
      { _id: id },
      { ...body },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');

    return this.toJSON(user, UserDto);
  }

  async remove(userId: string, id: string) {
    const user = await this.userModel.findOneAndUpdate(
      { _id: id },
      { isActive: false, isDeleted: true },
      { new: true },
    );
    if (!user) throw new NotFoundException('User not found');

    return this.toJSON(user, UserDto);
  }
}
