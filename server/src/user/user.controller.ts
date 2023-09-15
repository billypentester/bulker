import { Controller, Post, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadConfig } from 'utils/uploadConfig';

@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file' , fileUploadConfig))
  uploadFile(@UploadedFile() file : any, @Body() body : any) {
    return this.userService.uploadFile(file, body);
  }
}
