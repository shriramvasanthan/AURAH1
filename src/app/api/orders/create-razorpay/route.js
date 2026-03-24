import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { amount, currency = 'INR', items, name, phone, email, address, userId } = body;

    if (!amount || !items?.length || !name || !phone || !address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount),
      currency,
      receipt: `receipt_${Date.now()}`,
    });

    // Save pending order to DB
    const dbOrder = await prisma.order.create({
      data: {
        customerName: name,
        email: email || '',
        phone,
        address,
        total: amount / 100,
        status: 'pending',
        userId: userId || null,
        upiIdUsed: razorpayOrder.id,
        items: {
          create: items.map((i) => ({
            productId: i.id,
            quantity: i.quantity,
            price: i.price,
          })),
        },
      },
    });

    return NextResponse.json({
      razorpayOrder,
      dbOrderId: dbOrder.id,
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order', details: error.message },
      { status: 500 }
    );
  }
}