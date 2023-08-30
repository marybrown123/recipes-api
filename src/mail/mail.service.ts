import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendMail(
    recipient: string,
    sender: string,
    subject: string,
    text: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: recipient,
      from: sender,
      subject: subject,
      text: text,
      html: `<b>${text}</b>`,
    });
  }
}
