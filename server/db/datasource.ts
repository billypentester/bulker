import { DataSource, DataSourceOptions } from 'typeorm'

import { User } from 'src/user/entities/user.entity'

export const dataSourceOptions : DataSourceOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '8080',
    database: 'bulker',
    synchronize: false,
    entities: [User],
    logging: true
}


export const dataSource = new DataSource(dataSourceOptions)


