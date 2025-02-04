import webpush from 'web-push';
import { NextResponse } from 'next/server';
import pb from '@/app/pocketbase';

webpush.setVapidDetails(
  'mailto:jakero0828@gmail.com', // Replace with your email
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: Request) {
  try {
    const { userId, title, message } = await request.json();

    // Get user from PocketBase
    const user = await pb.collection('users').getOne(userId);
    
    if (!user.pushSubscription) {
      return NextResponse.json({ error: 'User not subscribed to push notifications' }, { status: 400 });
    }

    const subscription = JSON.parse(user.pushSubscription);

    // Send push notification
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title,
        body: message,
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending push notification:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
} 