import webpush from 'web-push';
import { NextResponse } from 'next/server';

// Conditionally set VAPID details only if keys are available
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:jakero0828@gmail.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

export async function POST(request: Request) {
  try {
    // Check if VAPID keys are configured
    if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
      return NextResponse.json({ error: 'Push notifications not configured' }, { status: 503 });
    }

    const { subscription, title, message } = await request.json();

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription object is required' }, { status: 400 });
    }

    // Send push notification
    const payload = {
      title: title || 'Student Ticket App',
      body: message || ''
    };

    await webpush.sendNotification(subscription, JSON.stringify(payload));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending push notification:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send notification' }, 
      { status: 500 }
    );
  }
} 