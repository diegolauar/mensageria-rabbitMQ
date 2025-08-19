import { notifications } from '../db/schema';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

export async function processNotification(order: any) {
  console.log(`Processing notification for payment ${order.id}`);


  const notification = {
    id: crypto.randomUUID(),
    content: order.content,
    email: order.email,
    created_at: new Date(),
  };

  try {
    await db.insert(notifications).values(notification);
  } catch (err) {
    console.log(err)
  }

}

