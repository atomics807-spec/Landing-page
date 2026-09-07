import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    // Require an authenticated session (contact page is login-gated)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, phone, subject, message, propertyTitle, userLocation } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'parayscoconsulting@gmail.com';
    const resendApiKey = process.env.RESEND_API_KEY;

    // Prepare email content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Message</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0;">Paraysco Consulting Website</p>
        </div>
        
        <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                <strong style="color: #374151;">Name:</strong>
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                <span style="color: #111827;">${escapeHtml(name)}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                <strong style="color: #374151;">Email:</strong>
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                <a href="mailto:${escapeHtml(email)}" style="color: #0d9488;">${escapeHtml(email)}</a>
              </td>
            </tr>
            ${phone ? `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                <strong style="color: #374151;">Phone:</strong>
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                <a href="tel:${escapeHtml(phone)}" style="color: #0d9488;">${escapeHtml(phone)}</a>
              </td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                <strong style="color: #374151;">Subject:</strong>
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                <span style="color: #111827;">${escapeHtml(subject)}</span>
              </td>
            </tr>
            ${userLocation && userLocation !== 'Unknown' ? `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                <strong style="color: #374151;">Location:</strong>
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                <span style="color: #6b7280;">${escapeHtml(userLocation)}</span>
              </td>
            </tr>
            ` : ''}
            ${propertyTitle ? `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                <strong style="color: #374151;">Property Inquiry:</strong>
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                <span style="color: #0d9488;">${escapeHtml(propertyTitle)}</span>
              </td>
            </tr>
            ` : ''}
          </table>
          
          <div style="margin-top: 24px; padding: 16px; background: white; border-radius: 6px; border: 1px solid #e5e7eb;">
            <h3 style="margin: 0 0 12px 0; color: #374151; font-size: 16px;">Message:</h3>
            <p style="margin: 0; color: #111827; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>
          
          <div style="margin-top: 24px; text-align: center;">
            <a href="mailto:${escapeHtml(email)}?subject=Re: ${escapeHtml(subject)}" 
               style="display: inline-block; background: #0d9488; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">
              Reply to ${escapeHtml(name)}
            </a>
          </div>
        </div>
        
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 16px;">
          This message was sent from the Paraysco Consulting website contact form.
        </p>
      </div>
    `;

    // Send email using Resend API
    if (resendApiKey) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Paraysco Contact <onboarding@resend.dev>',
          to: [adminEmail],
          reply_to: email,
          subject: `[Paraysco] New Contact: ${subject}`,
          html: emailHtml,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Resend API error:', errorData);
        return NextResponse.json(
          { error: 'Failed to send email' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    } else {
      // Development mode - log the email
      console.log('📧 Email notification (no RESEND_API_KEY configured):');
      console.log('To:', adminEmail);
      console.log('From:', email);
      console.log('Subject:', subject);
      console.log('Message:', message);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Email logged (configure RESEND_API_KEY for actual sending)' 
      });
    }
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
