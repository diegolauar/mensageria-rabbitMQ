import amqp from "amqplib";


export async function sendToPaymentQueue(url: string, order: any) {

  const connection = await amqp.connect(url);
  const channel = await connection.createChannel();



  await channel.assertExchange("orders", "direct", { durable: true });
  await channel.assertQueue("orders_send", { durable: true });
  await channel.bindQueue("orders_send", "orders", "payment_to_process");
  

  channel.publish("orders", "payment_to_process", Buffer.from(JSON.stringify(order)));
  console.log(`Order ${order.id} sent to payment queue`);

  await channel.close();
  await connection.close();
}


