import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [MailerModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
