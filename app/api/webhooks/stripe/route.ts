import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmationEmail, sendAdminNewOrderNotification } from "@/lib/email";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;

        if (orderId) {
          const order = await prisma.order.update({
            where: { id: orderId },
            data: {
              status: "PAID",
              paymentIntentId: session.payment_intent as string,
            },
            include: {
              user: true,
              items: {
                include: {
                  product: true,
                },
              },
            },
          });

          // Send order confirmation email to customer
          try {
            await sendOrderConfirmationEmail(order.user.email, {
              orderNumber: order.id,
              customerName: order.user.name || 'Customer',
              items: order.items.map(item => ({
                name: item.product.name,
                quantity: item.quantity,
                price: Number(item.price),
              })),
              total: Number(order.total),
              shippingAddress: 'N/A',
            });
          } catch (emailError) {
            console.error('Failed to send order confirmation email:', emailError);
            // Don't fail the webhook if email fails
          }

          // Send admin notification
          try {
            await sendAdminNewOrderNotification({
              orderNumber: order.id,
              customerName: order.user.name || 'Customer',
              customerEmail: order.user.email,
              total: Number(order.total),
              itemCount: order.items.length,
            });
          } catch (emailError) {
            console.error('Failed to send admin notification:', emailError);
          }
        }
        break;
      }

      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        console.log("Payment succeeded:", paymentIntent.id);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        console.log("Payment failed:", paymentIntent.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
