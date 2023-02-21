import dotenv from 'dotenv';
import * as amqp from 'amqplib';

dotenv.config();

(async () => {
  const queue = 'tasks';
  const data = process.argv.slice(2).join(' ') || 'default test task';
  let connection;

  try {
    connection = await amqp.connect(
      `amqp://${process.env.RABBIT_USER}:${process.env.RABBIT_PASSWORD}@${process.env.RABBIT_HOST}`
    );
    const channel = await connection.createChannel();

    // Durable true means that RabbitMQ will never lose our queue if a crash occurs.
    await channel.assertQueue(queue, { durable: true });
    // Marking messages as persistent doesn't fully guarantee that a message won't be lost.
    // Although it tells RabbitMQ to save the message to disk, there is still a short
    // time window when RabbitMQ has accepted a message and hasn't saved it yet.
    // Also, RabbitMQ doesn't do fsync(2) for every message -- it may be just saved to
    // cache and not really written to the disk. The persistence guarantees aren't strong,
    // but it's more than enough for our simple task queue. If you need a stronger guarantee
    // then you can use publisher confirms. https://www.rabbitmq.com/confirms.html
    channel.sendToQueue(queue, Buffer.from(data), { persistent: true });
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
