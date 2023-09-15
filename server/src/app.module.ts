import { Module} from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/datasource';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

