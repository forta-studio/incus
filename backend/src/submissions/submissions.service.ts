import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { StorageService } from '../storage/storage.service';
import { EmailService } from '../email/email.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';

@Injectable()
export class SubmissionsService {
  private readonly logger = new Logger(SubmissionsService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly storageService: StorageService,
    private readonly emailService: EmailService,
  ) {}

  async create(
    dto: CreateSubmissionDto,
    file: Express.Multer.File,
  ): Promise<{ id: string }> {
    // Upload audio file to storage (submissions folder in audio bucket)
    const upload = await this.storageService.uploadSubmissionAudio(file);

    const submission = await this.db.submission.create({
      data: {
        name: dto.name,
        email: dto.email,
        message: dto.message,
        type: dto.type,
        audioFileId: upload.id,
      },
      include: {
        audioFile: true,
      },
    });

    this.sendNotificationEmail(submission).catch((error) => {
      this.logger.error(
        `Failed to send notification email for submission ${submission.id}`,
        error,
      );
    });

    return { id: submission.id };
  }

  private async sendNotificationEmail(submission: {
    id: string;
    name: string;
    email: string;
    message: string | null;
    type: string;
    createdAt: Date;
    audioFile: {
      originalName: string;
      mimeType: string;
      filesize: number;
      url: string;
    };
  }) {
    const ownerEmail = process.env.CONTACT_FORM_RECIPIENT || 'tom@ashton88.dev';

    const createdAt = submission.createdAt.toISOString();
    const typeLabel =
      submission.type === 'RADIO' ? 'Radio submission' : 'Demo submission';
    const sizeMb = (submission.audioFile.filesize / (1024 * 1024)).toFixed(1);

    await this.emailService.sendEmail({
      to: ownerEmail,
      subject: `New Incus ${typeLabel}`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#05050a; color:#f5f5f5; padding:24px;">
            <div style="max-width:640px;margin:0 auto;background:#0b0b14;border-radius:12px;padding:24px;border:1px solid #26263a;">
              <h1 style="margin-top:0;margin-bottom:12px;font-size:20px;">New ${typeLabel}</h1>
              <p style="margin:0 0 16px 0;font-size:13px;color:#b3b3c2;">
                A new ${typeLabel.toLowerCase()} was submitted from the coming soon page.
              </p>

              <div style="background:#05050a;border-radius:8px;padding:16px;margin-bottom:16px;border:1px solid #26263a;">
                <p style="margin:0 0 4px 0;font-size:13px;"><strong>Name:</strong> ${submission.name}</p>
                <p style="margin:0 0 4px 0;font-size:13px;"><strong>Email:</strong> ${submission.email}</p>
                <p style="margin:0 0 4px 0;font-size:13px;"><strong>Type:</strong> ${typeLabel}</p>
                <p style="margin:0 0 4px 0;font-size:13px;"><strong>Submitted at:</strong> ${createdAt}</p>
              </div>

              <div style="background:#05050a;border-radius:8px;padding:16px;margin-bottom:16px;border:1px solid #26263a;">
                <p style="margin:0 0 8px 0;font-size:13px;"><strong>Audio file</strong></p>
                <p style="margin:0 0 4px 0;font-size:13px;"><strong>Original name:</strong> ${
                  submission.audioFile.originalName
                }</p>
                <p style="margin:0 0 4px 0;font-size:13px;"><strong>Type:</strong> ${
                  submission.audioFile.mimeType
                }</p>
                <p style="margin:0 0 8px 0;font-size:13px;"><strong>Size:</strong> ${sizeMb} MB</p>
                <p style="margin:0;font-size:13px;">
                  <a href="${submission.audioFile.url}" style="color:#57CFAF; text-decoration:underline;">Open audio file</a>
                </p>
              </div>

              ${
                submission.message
                  ? `<div style="background:#05050a;border-radius:8px;padding:16px;border:1px solid #26263a;">
                      <p style="margin:0 0 8px 0;font-size:13px;"><strong>Notes</strong></p>
                      <p style="margin:0;font-size:13px;white-space:pre-wrap;line-height:1.5;">${submission.message}</p>
                    </div>`
                  : ''
              }

              <p style="margin-top:20px;font-size:11px;color:#7a7a8c;">
                This email was generated automatically from the Incus demo/radio submissions form.
              </p>
            </div>
          </body>
        </html>
      `,
      text: `
New ${typeLabel}

Name: ${submission.name}
Email: ${submission.email}
Type: ${typeLabel}
Submitted at: ${createdAt}

Audio file:
- Original name: ${submission.audioFile.originalName}
- Type: ${submission.audioFile.mimeType}
- Size: ${sizeMb} MB
- URL: ${submission.audioFile.url}

${submission.message ? `Notes:\n${submission.message}\n` : ''}
      `,
    });
  }
}

