import dotenv from 'dotenv';
import * as amqp from 'amqplib';

dotenv.config();

(async () => {
  const exchange = 'tasks';
  const data = process.argv.slice(2).join(' ') || 'default test task';
  let connection;

  try {
    connection = await amqp.connect(
      `amqp://${process.env.RABBIT_USER}:${process.env.RABBIT_PASSWORD}@${process.env.RABBIT_HOST}`
    );
    const channel = await connection.createChannel();

    await channel.assertExchange(exchange, 'fanout', { durable: true });

    // I am creating queue in producer for simplicity, but this is not the best.
    // Consumer and Producer should be decoupled, producer should only know about exchange.
    // And consumer should only know about queue. This introduces problem,
    // if queue doesn't exist when producer tries to publish message it will be lost.
    // To solve this problem we can create infrastructure using Management Plugin or the Management CLI.
    // This can easily be scripted and automated as part of a deployment pipeline.
    // https://gigi.nullneuron.net/gigilabs/rabbitmq-who-creates-the-queues-and-exchanges/
    await channel.assertQueue('taskq1', { durable: true });
    await channel.assertQueue('taskq2', { durable: true });
    await channel.bindQueue('taskq1', exchange, '');
    await channel.bindQueue('taskq2', exchange, '');

    channel.publish(exchange, '', Buffer.from(data), { persistent: true });
    await channel.close();

    console.log(" [✔️] Sent '%s'", data);
  } catch (err) {
    console.warn(err);
  } finally {
    if (connection) {
      await connection.close();
    }
  }
})();
