import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail, sendContactNotification } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    // Verify API key for security
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.EMAIL_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let result;
    switch (type) {
      case 'verification':
        if (!data.email || !data.token) {
          return NextResponse.json({ error: 'Email and token required' }, { status: 400 });
        }
        result = await sendVerificationEmail(data.email, data.token);
        break;
      
      case 'password_reset':
        if (!data.email || !data.token) {
          return NextResponse.json({ error: 'Email and token required' }, { status: 400 });
        }
        result = await sendPasswordResetEmail(data.email, data.token);
        break;
      
      case 'welcome':
        if (!data.email || !data.name) {
          return NextResponse.json({ error: 'Email and name required' }, { status: 400 });
        }
        result = await sendWelcomeEmail(data.email, data.name);
        break;
      
      case 'contact':
        if (!data.name || !data.email || !data.subject || !data.message) {
          return NextResponse.json({ error: 'Name, email, subject, and message required' }, { status: 400 });
        }
        result = await sendContactNotification(data.name, data.email, data.subject, data.message);
        break;
      
      default:
        return NextResponse.json({ error: 'Invalid email type' }, { status: 400 });
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error: any) {
    console.error('Email API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
