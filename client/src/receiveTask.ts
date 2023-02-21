import dotenv from 'dotenv';
import * as amqp from 'amqplib';

dotenv.config();

(async () => {
  const queue = 'tasks';

  try {
    const connection = await amqp.connect(
      `amqp://${process.env.RABBIT_USER}:${process.env.RABBIT_PASSWORD}@${process.env.RABBIT_HOST}`
    );
    const channel = await connection.createChannel();

    process.once('SIGINT', async () => {
      await channel.close();
      await connection.close();
    });

    console.log(' [*] Waiting for messages. To exit press CTRL+C');

    // Durable true means that RabbitMQ will never lose our queue if a crash occurs.
    await channel.assertQueue(queue, { durable: true });
    // This tells RabbitMQ not to give more than one message to a worker at a time.
    // Or, in other words, don't dispatch a new message to a worker until it has
    // processed and acknowledged the previous one. Instead, it will dispatch it to
    // the next worker that is not still busy.
    await channel.prefetch(1);
    await channel.consume(
      queue,
      (message) => {
        if (message) {
          // Do some work, save to DB etc.
          // If work is successful, acknowledge message.
          channel.ack(message);
          console.log(" [✔️] Received '%s'", message.content.toString());
        }
      },
      {
        // See https://www.rabbitmq.com/confirms.html for details.
        // Manual acknowledgment mode.
        noAck: false,
      }
    );
  } catch (err) {
    console.warn(err);
  }
})();
