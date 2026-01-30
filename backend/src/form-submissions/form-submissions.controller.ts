import { Body, Controller, Post } from '@nestjs/common';
import { FormSubmissionsService } from './form-submissions.service';
import { CreateFormSubmissionDto } from './dto/create-form-submission.dto';

@Controller('contact-submissions')
export class FormSubmissionsController {
  constructor(
    private readonly formSubmissionsService: FormSubmissionsService,
  ) {}

  @Post()
  async create(@Body() dto: CreateFormSubmissionDto) {
    const submission = await this.formSubmissionsService.create(dto);

    // Return a minimal payload; no need to expose internal IDs
    return {
      success: true,
      createdAt: submission.createdAt,
    };
  }
}

