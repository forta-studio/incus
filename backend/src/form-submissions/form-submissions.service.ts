import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { EmailService } from '../email/email.service';
import { CreateFormSubmissionDto } from './dto/create-form-submission.dto';

@Injectable()
export class FormSubmissionsService {
  private readonly logger = new Logger(FormSubmissionsService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly emailService: EmailService,
  ) {}

  async create(dto: CreateFormSubmissionDto) {
    const { name, email, message, sendCopy = false, mailingList = false } = dto;

    const submission = await this.db.formSubmission.create({
      data: {
        name,
        email,
        message: message ?? null,
        sendCopy,
        mailingList,
      },
    });

    // Fire and forget emails; log failures but don't block the response
    this.sendNotificationEmails(submission).catch((error) => {
      this.logger.error(
        `Failed to send one or more emails for form submission ${submission.id}`,
        error,
      );
    });

    return submission;
  }

  private async sendNotificationEmails(submission: {
    id: string;
    name: string;
    email: string;
    message: string | null;
    sendCopy: boolean;
    mailingList: boolean;
    createdAt: Date;
  }) {
    const ownerEmail = process.env.CONTACT_FORM_RECIPIENT || 'tom@ashton88.dev';

    const createdAt = submission.createdAt.toISOString();

    // Email to site owner
    await this.emailService.sendEmail({
      to: ownerEmail,
      subject: 'New Incus coming-soon contact submission',
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#05050a; color:#f5f5f5; padding:24px;">
            <div style="max-width:640px;margin:0 auto;background:#0b0b14;border-radius:12px;padding:24px;border:1px solid #26263a;">
              <h1 style="margin-top:0;margin-bottom:12px;font-size:20px;">New Incus contact submission</h1>
              <p style="margin:0 0 16px 0;font-size:13px;color:#b3b3c2;">
                A new message was sent from the coming soon page.
              </p>

              <div style="background:#05050a;border-radius:8px;padding:16px;margin-bottom:16px;border:1px solid #26263a;">
                <p style="margin:0 0 4px 0;font-size:13px;"><strong>Name:</strong> ${submission.name}</p>
                <p style="margin:0 0 4px 0;font-size:13px;"><strong>Email:</strong> ${submission.email}</p>
                <p style="margin:0 0 4px 0;font-size:13px;"><strong>Send copy:</strong> ${
                  submission.sendCopy ? 'Yes' : 'No'
                }</p>
                <p style="margin:0 0 4px 0;font-size:13px;"><strong>Mailing list:</strong> ${
                  submission.mailingList ? 'Yes' : 'No'
                }</p>
                <p style="margin:0;font-size:12px;color:#8a8aa4;"><strong>Received at:</strong> ${createdAt}</p>
              </div>

              ${
                submission.message
                  ? `<div style="background:#05050a;border-radius:8px;padding:16px;border:1px solid #26263a;">
                      <p style="margin:0 0 8px 0;font-size:13px;"><strong>Message</strong></p>
                      <p style="margin:0;font-size:13px;white-space:pre-wrap;line-height:1.5;">${submission.message}</p>
                    </div>`
                  : ''
              }

              <p style="margin-top:20px;font-size:11px;color:#7a7a8c;">
                This email was generated automatically from the Incus coming-soon contact form.
              </p>
            </div>
          </body>
        </html>
      `,
      text: `
New Incus contact submission

Name: ${submission.name}
Email: ${submission.email}
Send copy: ${submission.sendCopy ? 'Yes' : 'No'}
Mailing list: ${submission.mailingList ? 'Yes' : 'No'}
Received at: ${createdAt}

${submission.message ? `Message:\n${submission.message}\n` : ''}
      `,
    });

    // Optional copy to user
    if (submission.sendCopy) {
      await this.emailService.sendEmail({
        to: submission.email,
        subject: 'Copy of your message to Incus',
        html: `
          <!DOCTYPE html>
          <html>
            <body style="font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#05050a; color:#f5f5f5; padding:24px;">
              <div style="max-width:640px;margin:0 auto;background:#0b0b14;border-radius:12px;padding:24px;border:1px solid #26263a;">
                <h1 style="margin-top:0;margin-bottom:12px;font-size:20px;">Thanks for reaching out to Incus</h1>
                <p style="margin:0 0 12px 0;font-size:13px;color:#b3b3c2;">
                  This is a copy of the message you sent via the coming soon page.
                </p>

                <div style="background:#05050a;border-radius:8px;padding:16px;border:1px solid #26263a;margin-bottom:12px;">
                  <p style="margin:0 0 4px 0;font-size:13px;"><strong>Name:</strong> ${submission.name}</p>
                  <p style="margin:0 0 4px 0;font-size:13px;"><strong>Email:</strong> ${submission.email}</p>
                  <p style="margin:0 0 4px 0;font-size:13px;"><strong>Mailing list:</strong> ${
                    submission.mailingList ? 'Yes' : 'No'
                  }</p>
                  <p style="margin:0;font-size:12px;color:#8a8aa4;"><strong>Sent at:</strong> ${createdAt}</p>
                </div>

                ${
                  submission.message
                    ? `<div style="background:#05050a;border-radius:8px;padding:16px;border:1px solid #26263a;">
                        <p style="margin:0 0 8px 0;font-size:13px;"><strong>Your message</strong></p>
                        <p style="margin:0;font-size:13px;white-space:pre-wrap;line-height:1.5;">${submission.message}</p>
                      </div>`
                    : ''
                }

                <p style="margin-top:20px;font-size:11px;color:#7a7a8c;">
                  We&apos;ll read this and get back to you if a reply is needed.
                </p>
              </div>
            </body>
          </html>
        `,
        text: `
Thanks for reaching out to Incus

This is a copy of the message you sent via the coming soon page.

Name: ${submission.name}
Email: ${submission.email}
Mailing list: ${submission.mailingList ? 'Yes' : 'No'}
Sent at: ${createdAt}

${submission.message ? `Your message:\n${submission.message}\n` : ''}
        `,
      });
    }
  }
}
