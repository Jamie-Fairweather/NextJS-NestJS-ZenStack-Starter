import { Module } from '@nestjs/common'
import { CrudController } from 'src/controllers/crud.controller'
import { AuthModule } from './auth.module'

@Module({
    imports: [AuthModule],
    controllers: [CrudController],
})
export class CrudModule {}
