import { Module } from '@nestjs/common'
import { ExampleService } from '../services/example.service'
import { ExampleController } from '../controllers/example.controller'
import { AuthModule } from './auth.module'

@Module({
    imports: [AuthModule],
    providers: [ExampleService],
    exports: [ExampleService],
    controllers: [ExampleController],
})
export class ExampleModule {}
