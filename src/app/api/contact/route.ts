import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize your email service handler via environmental parameters
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, propertyTitle, userLocation } = body;

    // 1. Basic validation check
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing mandatory fields configuration parameters.' },
        { status: 400 }
      );
    }

    // 2. Intelligent Routing Decision Matrix
    // We check the subject header passed down from the client component grid to figure out the right mailbox destinations.
    let targetAdminInbox = 'info@parayscoconsulting.com'; // Default primary fallback
    
    const subjectClean = subject.toLowerCase();
    if (subjectClean.includes('support') || subjectClean.includes('technical') || subjectClean.includes('help')) {
      targetAdminInbox = 'support@parayscoconsulting.com';
    }

    // 3. Construct HTML email layout blueprint
    const emailHtmlPayload = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #1e3a8a; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px; margin-top: 0;">
          New Contact Department Notification
        </h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #4b5563; width: 130px;">Sender Name:</td>
            <td style="padding: 6px 0; color: #111827;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #4b5563;">Sender Email:</td>
            <td style="padding: 6px 0; color: #111827;">
              <a href="mailto:${email}" style="color: #2563eb; text-decoration: none;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #4b5563;">Phone Connection:</td>
            <td style="padding: 6px 0; color: #111827;">${phone || 'Not provided'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #4b5563;">Geographic Origin:</td>
            <td style="padding: 6px 0; color: #111827;">${userLocation || 'Undetected'}</td>
          </tr>
          ${propertyTitle ? `
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #b45309;">Linked Listing:</td>
            <td style="padding: 6px 0; color: #b45309; font-weight: 500;">${propertyTitle}</td>
          </tr>` : ''}
        </table>

        <div style="margin-top: 20px; padding: 15px; bg-color: #f9fafb; border-radius: 8px; border: 1px solid #f3f4f6;">
          <h4 style="margin: 0 0 8px 0; color: #374151;">Client Message Summary:</h4>
          <p style="margin: 0; color: #4b5563; line-height: 1.6; white-space: pre-wrap;">${message}</p>
        </div>
        
        <div style="margin-top: 25px; padding-t: 15px; border-t: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; text-align: center;">
          Sent securely via Paraysco Consulting Infrastructure Ecosystem.
        </div>
      </div>
    `;

    // 4. Send Transaction Outbound Command
    // CRUCIAL: "from" matches your actual domain verification profile, while "reply_to" targets the customer!
    const transactionResult = await resend.emails.send({
      from: 'Paraysco Portal <notifications@parayscoconsulting.com>',
      to: targetAdminInbox,
      replyTo: email, 
      subject: `[Portal Update] ${subject}`,
      html: emailHtmlPayload,
    });

    if (transactionResult.error) {
      console.error('Mail system driver runtime error response:', transactionResult.error);
      return NextResponse.json({ error: 'Outbound relay failure.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, messageId: transactionResult.data?.id });

  } catch (error) {
    console.error('Global API boundary validation exception:', error);
    return NextResponse.json({ error: 'Internal system fault.' }, { status: 500 });
  }
}
