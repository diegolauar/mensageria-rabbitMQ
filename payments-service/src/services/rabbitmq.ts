import amqp from "amqplib";
import { processPayment } from "../consumers/orders.consumer";

export async function searchOrdersPayment(url: string) {
  const connection = await amqp.connect(url);
  const channel = await connection.createChannel();

  // Filas
  await channel.assertQueue("orders_send", { durable: true });
  await channel.assertQueue("payment_results", { durable: true });

  console.log("[RabbitMQ] Escutando fila: orders_send");

  await channel.consume("orders_send", async (msg: any) => {
    if (!msg) return;

    try {
      const order = JSON.parse(msg.content.toString());
      console.log("[RabbitMQ] Mensagem recebida:", order);

      // Processa pagamento
      const paymentResult = await processPayment(order);

      // Envia resultado para outra fila
      const payload = {
        order_id: order.id,
        content: paymentResult.total,
        email: paymentResult.customer_email,
        created_at: paymentResult.created_at,
      };

      channel.sendToQueue(
        "payment_results",
        Buffer.from(JSON.stringify(payload)),
        { persistent: true }
      );

      channel.ack(msg);
    } catch (error) {
      console.error("[RabbitMQ] Erro processando pagamento:", error);
      channel.nack(msg, false, true);
    }
  });
}
