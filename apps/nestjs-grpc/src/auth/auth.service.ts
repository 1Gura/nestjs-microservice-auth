import { Injectable } from '@nestjs/common';
import { RegisterRequest } from '@app/common';

@Injectable()
export class AuthService {
  register(request: RegisterRequest) {
    return 'This action adds a new auth';
  }
}
