import amqp from "amqplib";
import { processNotification } from "./sendDataBase";

export async function searchPaymentNotification(url: string) {
  const connection = await amqp.connect(url);
  const channel = await connection.createChannel();

  await channel.assertQueue("payment_results", { durable: true });

  console.log("[RabbitMQ] Escutando fila: payment_results");

  await channel.consume("payment_results", async (msg: any) => {
    if (!msg) return;

    try {
      const notification = JSON.parse(msg.content.toString());
      console.log("[RabbitMQ] Mensagem recebida:", notification);
      processNotification(notification)
      channel.ack(msg);
    } catch (error) {
      console.error("[RabbitMQ] Erro processando Notification:", error);
      channel.nack(msg, false, true);
    }
  });
}
