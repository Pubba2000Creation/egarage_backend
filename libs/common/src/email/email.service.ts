import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process'; // For accessing the root directory

@Injectable()
export class EmailService {
  private readonly transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false, // For STARTTLS
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
  }


private loadTemplate(templateName: string, variables: Record<string, string>): string {
  // Determine the base directory based on environment (development or production)
  const isProduction = process.env.NODE_ENV === 'production';
  const baseDir = isProduction
    ? path.join(process.cwd(), 'dist/libs/common/src/email/template/')  // Production path
    : path.join(process.cwd(), 'libs/common/src/email/template');  // Development path

  // Construct the full path to the template
  const templatePath = path.join(baseDir, `${templateName}.html`);
  console.log('Resolved Template Path:', templatePath); // Log for debugging

  // Check if the template exists
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template ${templateName} not found at ${templatePath}`);
  }

  // Read and process the template
  let template = fs.readFileSync(templatePath, 'utf8');
  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    template = template.replace(regex, value);
  }
  return template;
}





  async sendEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_FROM'),
        to,
        subject,
        text,
        html,
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  }

  async sendOTP(to: string, otp: number): Promise<void> {
    const subject = 'Your OTP Code';
    const html = this.loadTemplate('otp', { otp: otp.toString() });
    await this.sendEmail(to, subject, `Your OTP is: ${otp}`, html);
  }

  async resetPassword(to: string, resetLink: string): Promise<void> {
    const subject = 'Reset Your Password';
    const html = this.loadTemplate('reset-password', { resetLink });
    await this.sendEmail(to, subject, 'Reset your password using the link provided.', html);
  }

  async forgotPassword(to: string, conformationcode: number): Promise<void> {
    const subject = 'Forgot Password Assistance';
    const html = this.loadTemplate('forgot-password', { conformationcode:conformationcode.toString() });
    await this.sendEmail(to, subject, 'Reset your password using the link provided.', html);
  }

  // Method to send a verification email
    async sendVerificationEmail(to: string, verificationCode: number): Promise<void> {
        const subject = 'Welcome to Our Platform';
        
        // Load the 'welcome' template and replace {{verificationCode}} with the actual code
        const html = this.loadTemplate('welcome', { verificationCode: verificationCode.toString() });

        // Call the sendEmail method with the email content
        await this.sendEmail(to, subject, 'Welcome to our platform!', html);
    }

}
