/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MailService } from '../../../mail/mail.service';

export class MailServiceMock implements Required<MailService> {
  async sendMail(
    _recipient: string,
    _sender: string,
    _subject: string,
    _text: string,
  ): Promise<void> {}
}
