import { Resend } from 'resend';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const FROM_NAME = process.env.RESEND_FROM_NAME || 'E-Commerce Store';

// Order confirmation email
export async function sendOrderConfirmationEmail(
  to: string,
  orderData: {
    orderNumber: string;
    customerName: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
    shippingAddress: string;
  }
) {
  try {
    const itemsHtml = orderData.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
        </tr>
      `
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Order Confirmed! 🎉</h1>
        </div>
        <div style="padding: 30px;">
          <p>Hi ${orderData.customerName},</p>
          <p>Thank you for your order!</p>
          <h2>Order #${orderData.orderNumber}</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 15px; text-align: right; font-weight: bold;">Total:</td>
                <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px;">$${orderData.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          <h3>Shipping Address</h3>
          <p>${orderData.shippingAddress}</p>
        </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to,
      subject: `Order Confirmation - #${orderData.orderNumber}`,
      html,
    });

    if (error) throw error;
    console.log(`✅ Order confirmation email sent to ${to}`);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Failed to send order confirmation email:', error);
    throw error;
  }
}

// Order shipped email
export async function sendOrderShippedEmail(
  to: string,
  orderData: {
    orderNumber: string;
    customerName: string;
    trackingNumber?: string;
  }
) {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #4caf50; padding: 30px; text-align: center;">
          <h1 style="color: white;">📦 Your Order Has Shipped!</h1>
        </div>
        <div style="padding: 30px;">
          <p>Hi ${orderData.customerName},</p>
          <p>Your order #${orderData.orderNumber} is on its way!</p>
          ${orderData.trackingNumber ? `<p><strong>Tracking:</strong> ${orderData.trackingNumber}</p>` : ''}
        </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to,
      subject: `Your Order Has Shipped! - #${orderData.orderNumber}`,
      html,
    });

    if (error) throw error;
    console.log(`✅ Order shipped email sent to ${to}`);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Failed to send order shipped email:', error);
    throw error;
  }
}

// Welcome email
export async function sendWelcomeEmail(to: string, name: string) {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white;">Welcome to ${FROM_NAME}! 🎉</h1>
        </div>
        <div style="padding: 30px;">
          <p>Hi ${name},</p>
          <p>Thank you for creating an account with us!</p>
          <p>Start exploring our products and enjoy shopping.</p>
        </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to,
      subject: `Welcome to ${FROM_NAME}!`,
      html,
    });

    if (error) throw error;
    console.log(`✅ Welcome email sent to ${to}`);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    throw error;
  }
}

// Admin notification for new order
export async function sendAdminNewOrderNotification(
  orderData: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    total: number;
    itemCount: number;
  }
) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) {
      console.warn('⚠️ ADMIN_EMAIL not configured');
      return { success: false };
    }

    const html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ff9800; padding: 20px; text-align: center;">
          <h1 style="color: white;">🛒 New Order!</h1>
        </div>
        <div style="padding: 30px;">
          <h2>Order #${orderData.orderNumber}</h2>
          <p><strong>Customer:</strong> ${orderData.customerName}</p>
          <p><strong>Email:</strong> ${orderData.customerEmail}</p>
          <p><strong>Items:</strong> ${orderData.itemCount}</p>
          <p><strong>Total:</strong> $${orderData.total.toFixed(2)}</p>
        </div>
      </body>
      </html>
    `;

    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: adminEmail,
      subject: `New Order #${orderData.orderNumber} - $${orderData.total.toFixed(2)}`,
      html,
    });

    if (error) throw error;
    console.log(`✅ Admin notification sent`);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Failed to send admin notification:', error);
    throw error;
  }
}
