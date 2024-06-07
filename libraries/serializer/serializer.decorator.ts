import {
  ClassSerializerInterceptor,
  SerializeOptions,
  UseInterceptors,
  applyDecorators,
} from '@nestjs/common';
import { Transform } from 'class-transformer';

export const Serialize = () =>
  applyDecorators(
    UseInterceptors(ClassSerializerInterceptor),
    SerializeOptions({
      strategy: 'exposeAll',
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
      exposeDefaultValues: true,
    }),
  );

export const ObjectID = () => (target: any, propertyKey: string) => {
  Transform((value) => {
    return value.obj[value.key]?.toString() || '';
  })(target, propertyKey);
};
