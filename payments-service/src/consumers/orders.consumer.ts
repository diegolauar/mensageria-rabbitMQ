import { payments } from '../db/schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

export async function processPayment(order: any) {
  console.log(`Processing payment for order ${order.id}`);

  // Simulate payment processing
  // await new Promise(resolve => setTimeout(resolve, 2000));

  const payment = {
    id: crypto.randomUUID(),
    order_id: order.id,
    total: order.value,
    customer_email: order.customer_email,
    created_at: new Date(),
  };

  try {
    await db.insert(payments).values(payment);
    console.log(`Payment processed for order ${order.id}`);
  } catch (err) {
    console.log(err)
  }

  return {
    order_id: payment.order_id,
    total: payment.total,
    customer_email: payment.customer_email,
    created_at: payment.created_at,
  };
}

