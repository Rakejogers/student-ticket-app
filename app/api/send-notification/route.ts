import webpush from 'web-push';
import { NextResponse } from 'next/server';

webpush.setVapidDetails(
  'mailto:jakero0828@gmail.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: Request) {
  try {
    const { subscription, title, message } = await request.json();

    if (!subscription) {
      return NextResponse.json({ error: 'Subscription object is required' }, { status: 400 });
    }

    // Send push notification
    const payload = JSON.stringify({
      title: title || 'Test Notification',
      body: message || 'This is a test notification!',
    });

    await webpush.sendNotification(subscription, payload);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending push notification:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send notification' }, 
      { status: 500 }
    );
  }
} 