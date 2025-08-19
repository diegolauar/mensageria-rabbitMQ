import amqp from "amqplib";

export async function searchPaymentNotification(url: string) {
  const connection = await amqp.connect(url);
  const channel = await connection.createChannel();

  // Filas
  await channel.assertQueue("payment_results", { durable: true });

  console.log("[RabbitMQ] Escutando fila: payment_results");

  await channel.consume("payment_results", async (msg: any) => {
    if (!msg) return;

    try {
      const payment = JSON.parse(msg.content.toString());
      console.log("[RabbitMQ] Mensagem recebida:", payment);



      channel.ack(msg);
    } catch (error) {
      console.error("[RabbitMQ] Erro processando pagamento:", error);
      channel.nack(msg, false, true);
    }
  });
}
