import Fastify from 'fastify';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { orders } from './db/schema';
import { eq } from 'drizzle-orm';
import { sendToPaymentQueue } from './services/rabbitmq';
import dotenv from 'dotenv';

dotenv.config();

const fastify = Fastify({ logger: true });

// Database connection
const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

// RabbitMQ connection
const rabbitUrl = process.env.RABBITMQ_URL!;

// Routes
fastify.post('/orders', async (request, reply) => {
  const { value, customer_name, customer_email } = request.body as any;
  
  const newOrder = {
    id: crypto.randomUUID(),
    status: 'criado' as const,
    value,
    customer_name,
    customer_email,
    created_at: new Date(),
  };
  
  try {
    await db.insert(orders).values(newOrder);
    await sendToPaymentQueue(rabbitUrl, newOrder);
    
    return reply.status(201).send(newOrder);
  } catch (error) {
    fastify.log.error(error);
    return reply.status(500).send({ error: 'Failed to create order' });
  }
});

fastify.get('/orders/:id', async (request, reply) => {
  const { id } = request.params as any;
  
  const order = await db.select().from(orders).where(eq(orders.id, id));
  
  if (order.length === 0) {
    return reply.status(404).send({ error: 'Order not found' });
  }
  
  return reply.send(order[0]);
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('Orders service running on port 3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

process.on('SIGTERM', async () => {
  await fastify.close();
  process.exit(0);
});

start();