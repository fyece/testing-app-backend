import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TestsModule } from './tests/tests.module';
import { GroupsModule } from './groups/groups.module';
import { QuestionsModule } from './questions/questions.module';

@Module({
  imports: [AuthModule, UsersModule, TestsModule, GroupsModule, QuestionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
