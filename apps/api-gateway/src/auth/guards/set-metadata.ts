import { SetMetadata } from '@nestjs/common';

export const AuthMetadata = (key: string, value: any) => {
  return SetMetadata(key, value);
};
