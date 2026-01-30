import { Module } from '@nestjs/common';
import { FormSubmissionsController } from './form-submissions.controller';
import { FormSubmissionsService } from './form-submissions.service';
import { DatabaseModule } from '../database/database.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [DatabaseModule, EmailModule],
  controllers: [FormSubmissionsController],
  providers: [FormSubmissionsService],
})
export class FormSubmissionsModule {}

