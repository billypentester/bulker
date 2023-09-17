import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Post()
  uploadBulk(@Body() body : any) {
    return this.userService.uploadBulk(body);
  }
  
}
