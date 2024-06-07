import { ControllersEnum } from '../enum/controllers.enum';

export const Routes = {
  [ControllersEnum.Auth]: {
    login: 'login/email',
    registerByEmail: 'register/email',
    refreshJwtToken: 'refresh-token',
  },
  [ControllersEnum.Users]: {
    findAll: '',
    findOne: ':id',
    updateOne: ':id',
    deleteOne: ':id',
  },
  [ControllersEnum.Profile]: {
    findMyProfile: '',
    updateMyProfile: '',
    deleteMyProfile: '',
  },
  [ControllersEnum.Conversation]: {
    createConversation: '',
    findAllConversations: '',
    findOneConversation: ':id',
    updateOneConversation: ':id',
    deleteOneConversation: ':id',
  },
  [ControllersEnum.Messages]: {
    addMessage: '',
    findAllMessages: '',
    findOneMessage: ':id',
    updateOneMessage: ':id',
    deleteOneMessage: ':id',
  },
} as const;
