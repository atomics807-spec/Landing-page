import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY) 
  : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Paraysco Consulting <noreply@paraysco.com>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  if (!resend) {
    console.warn('Resend not configured - email not sent');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (e: any) {
    console.error('Email send error:', e);
    return { success: false, error: e.message };
  }
}

export async function sendVerificationEmail(email: string, confirmationUrl: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">PARAYSCO CONSULTING INC</h1>
      </div>
      
      <div style="background: white; padding: 40px 30px; border: 1px solid #e0e0e0; border-top: none;">
        <h2 style="color: #1e3a5f; margin-top: 0;">Verify Your Email Address</h2>
        
        <p style="margin-bottom: 20px;">Thank you for registering with Paraysco Consulting. Please verify your email address by clicking the button below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmationUrl}" style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Verify Email Address</a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-bottom: 20px;">Or copy and paste this link into your browser:</p>
        <p style="background: #f5f5f5; padding: 12px; border-radius: 6px; word-break: break-all; font-size: 12px; color: #333;">${confirmationUrl}</p>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">This link will expire in 24 hours. If you didn't create an account with Paraysco Consulting, you can safely ignore this email.</p>
      </div>
      
      <div style="background: #f5f5f5; padding: 20px 30px; border-radius: 0 0 12px 12px; border: 1px solid #e0e0e0; border-top: none; text-align: center;">
        <p style="margin: 0; color: #666; font-size: 12px;">© ${new Date().getFullYear()} Paraysco Consulting. All rights reserved.</p>
        <p style="margin: 10px 0 0; color: #999; font-size: 11px;">
          <a href="${APP_URL}" style="color: #2d5a87;">Website</a> • 
          <a href="${APP_URL}/privacy" style="color: #2d5a87;">Privacy Policy</a>
        </p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Verify your Paraysco Consulting account',
    html,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${APP_URL}/auth/reset-password?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Paraysco Consulting</h1>
      </div>
      
      <div style="background: white; padding: 40px 30px; border: 1px solid #e0e0e0; border-top: none;">
        <h2 style="color: #1e3a5f; margin-top: 0;">Reset Your Password</h2>
        
        <p style="margin-bottom: 20px;">We received a request to reset your password. Click the button below to create a new password:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Reset Password</a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-bottom: 20px;">Or copy and paste this link into your browser:</p>
        <p style="background: #f5f5f5; padding: 12px; border-radius: 6px; word-break: break-all; font-size: 12px; color: #333;">${resetUrl}</p>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px; background: #fff3cd; padding: 12px; border-radius: 6px; border-left: 4px solid #ffc107;">⚠️ This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
      </div>
      
      <div style="background: #f5f5f5; padding: 20px 30px; border-radius: 0 0 12px 12px; border: 1px solid #e0e0e0; border-top: none; text-align: center;">
        <p style="margin: 0; color: #666; font-size: 12px;">© ${new Date().getFullYear()} Paraysco Consulting. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Reset your Paraysco Consulting password',
    html,
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">Paraysco Consulting</h1>
      </div>
      
      <div style="background: white; padding: 40px 30px; border: 1px solid #e0e0e0; border-top: none;">
        <h2 style="color: #1e3a5f; margin-top: 0;">Welcome to Paraysco Consulting, ${name}!</h2>
        
        <p style="margin-bottom: 20px;">Your account has been successfully created. You can now:</p>
        
        <ul style="color: #333; margin-bottom: 20px;">
          <li style="margin-bottom: 10px;">📝 Access your profile settings</li>
          <li style="margin-bottom: 10px;">🔒 Manage your account security</li>
          <li style="margin-bottom: 10px;">📧 Contact our team</li>
          <li style="margin-bottom: 10px;">💼 Explore our services</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${APP_URL}" style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">Get Started</a>
        </div>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">If you have any questions, feel free to contact our support team.</p>
      </div>
      
      <div style="background: #f5f5f5; padding: 20px 30px; border-radius: 0 0 12px 12px; border: 1px solid #e0e0e0; border-top: none; text-align: center;">
        <p style="margin: 0; color: #666; font-size: 12px;">© ${new Date().getFullYear()} Paraysco Consulting. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to Paraysco Consulting!',
    html,
  });
}

// Send contact form notification
export async function sendContactNotification(
  name: string, 
  email: string, 
  subject: string, 
  message: string
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
      </div>
      
      <div style="background: white; padding: 40px 30px; border: 1px solid #e0e0e0; border-top: none;">
        <h2 style="color: #1e3a5f; margin-top: 0;">Contact Details</h2>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600; width: 120px;">Name:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600;">Email:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600;">Subject:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${subject}</td>
          </tr>
        </table>
        
        <div style="margin-top: 30px;">
          <h3 style="color: #1e3a5f; margin-bottom: 10px;">Message:</h3>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; white-space: pre-wrap;">${message}</div>
        </div>
      </div>
      
      <div style="background: #f5f5f5; padding: 20px 30px; border-radius: 0 0 12px 12px; border: 1px solid #e0e0e0; border-top: none; text-align: center;">
        <p style="margin: 0; color: #666; font-size: 12px;">This notification was sent from the Paraysco Consulting website contact form.</p>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: process.env.CONTACT_NOTIFICATION_EMAIL || 'contact@paraysco.com',
    subject: `[Website Contact] ${subject} - from ${name}`,
    html,
  });
}
