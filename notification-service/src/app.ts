import Fastify from 'fastify';
import dotenv from 'dotenv';
import { searchPaymentNotification } from './services/rabbitmq';

dotenv.config();


const fastify = Fastify({ logger: true });


// RabbitMQ connection
const rabbitUrl = process.env.RABBITMQ_URL!;


const start = async () => {
  try {
    await fastify.listen({ port: 3002, host: '0.0.0.0' });
    await searchPaymentNotification(rabbitUrl);
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