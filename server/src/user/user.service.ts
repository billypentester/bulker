import { ConflictException, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csvParser from 'csv-parser';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

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

  async uploadBulk(body)
  {
    try{
      const existingCoupons =  await this.userRepository.find({ where: { coupon: In(body.coupon) }, order: { coupon: 'ASC' } });
      if(existingCoupons.length > 0){
        throw new ConflictException(existingCoupons);
      }
      else
      {
        const transform = body.coupon.map((coupon: Object) => {
          return {
            name: body.name,
            email: body.email,
            phone: body.phone,
            gender: body.gender,
            coupon: coupon,
          }
        })
        const data = await this.userRepository.save(transform);
        return data;
      }
    }
    catch(error){
      throw new ConflictException(error);
    }
  }
  
}
