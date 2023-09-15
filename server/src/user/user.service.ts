import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async processCSV(filePath: string, body: any): Promise<any> {
    const results = [];
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => {
          results.push({
            name: body.name,
            email: body.email,
            phone: body.phone,
            gender: body.gender,
            coupon: data.coupon,
          })
        })
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  async uploadFile(file, body)
  {
    const transform = body.coupon.map((coupon) => {
      return {
        name: body.name,
        email: body.email,
        phone: body.phone,
        gender: body.gender,
        coupon: coupon,
      }
    })
    const data = await this.userRepository.save(transform)
    if(data)
    {
      return {
        status: 200,
        message: 'Data has been saved'
      }
    }
    else
    {
      return {
        status: 400,
        message: 'Unsupported File Format or Duplicate Data'
      }
    }
  }
  
}
