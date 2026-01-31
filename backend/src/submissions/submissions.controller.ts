import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from '../storage/pipes/file-validation.pipe';
import { AUDIO_UPLOAD_CONFIG } from '../storage/interfaces/upload-config.interface';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { SubmissionsService } from './submissions.service';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile(new FileValidationPipe(AUDIO_UPLOAD_CONFIG))
    file: Express.Multer.File,
    @Body() body: CreateSubmissionDto,
  ) {
    const result = await this.submissionsService.create(body, file);
    return {
      success: true,
      id: result.id,
    };
  }
}
