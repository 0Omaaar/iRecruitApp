/* eslint-disable prettier/prettier */
import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as Brevo from '@getbrevo/brevo';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  private apiInstance: Brevo.TransactionalEmailsApi;
  private readonly logger = new Logger(MailerService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('BREVO_API_KEY')?.trim();

    this.apiInstance = new Brevo.TransactionalEmailsApi();

    if (!apiKey) {
      this.logger.error('BREVO_API_KEY is missing from server configuration.');
      return;
    }

    // Configure API key authorization: api-key
    this.apiInstance.setApiKey(
      Brevo.TransactionalEmailsApiApiKeys.apiKey,
      apiKey,
    );
  }

  /**
   * Generic method to send an email using Brevo
   * @param to Recipient email address
   * @param subject Email subject
   * @param htmlContent HTML content of the email
   */
  async sendEmail(to: string, subject: string, htmlContent: string) {
    const apiKey = this.configService.get<string>('BREVO_API_KEY')?.trim();

    if (!apiKey) {
      throw new InternalServerErrorException(
        'Email service is not configured. Missing BREVO_API_KEY.',
      );
    }

    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;
    sendSmtpEmail.sender = {
      name: this.configService.get<string>('BREVO_SENDER_NAME') || 'iRecruit Team',
      email: this.configService.get<string>('BREVO_SENDER_EMAIL') || 'noreply@irecruit.com',
    };
    sendSmtpEmail.to = [{ email: to }];

    try {
      const data = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      this.logger.log(
        `Email sent successfully to ${to}. Message ID: ${data.body.messageId}`,
      );
      return data;
    } catch (error) {
      const status = error?.response?.status || error?.status;
      const providerMessage =
        error?.response?.body?.message ||
        error?.response?.data?.message ||
        error?.body?.message ||
        error?.message;

      this.logger.error(
        `Error sending email to ${to}:`,
        providerMessage,
      );

      if (status === 401) {
        throw new BadGatewayException(
          'Brevo rejected the email request. Check BREVO_API_KEY.',
        );
      }

      throw new BadGatewayException(
        providerMessage || 'Email provider failed to send the email.',
      );
    }
  }

  /**
   * Sends a verification email to the user
   * @param to User's email address
   * @param verificationLink The link to verify the email
   */
  async sendVerificationEmail(to: string, verificationLink: string) {
    const subject = 'Verify your email address - iRecruit';
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to iRecruit!</h2>
        <p>Thank you for signing up. Please confirm your email address to get started.</p>
        <div style="margin: 20px 0;">
          <a href="${verificationLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email Address</a>
        </div>
        <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
        <p style="color: #666; font-size: 14px;">${verificationLink}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #999; font-size: 12px;">If you did not create an account, no further action is required.</p>
      </div>
    `;
    return this.sendEmail(to, subject, htmlContent);
  }
}
