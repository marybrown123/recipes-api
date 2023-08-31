import { Controller, Get, Param } from '@nestjs/common';
import { VerificationService } from '../verification/verification.service';

@Controller('/verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}
  @Get('/:token')
  async verifyAccount(@Param('token') token: string) {
    await this.verificationService.verifyAccount(token);
  }
}
