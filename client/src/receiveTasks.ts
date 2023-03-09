import dotenv from 'dotenv';
import * as amqp from 'amqplib';
import yesno from 'yesno';

dotenv.config();

(async () => {
  const [queue] = process.argv.slice(2) || ['taskq1'];

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

    await channel.prefetch(1);
    await channel.consume(
      queue,
      async (message) => {
        if (message) {
          // Do some work, save to DB etc.
          // If work is successful, acknowledge message.

          console.log("Received '%s'", message.content.toString());

          // Example for testing via cli.
          const ok = await yesno({
            question: 'Do you want to ack the message?',
          });

          if (ok) {
            channel.ack(message);
            console.log(" [✔️] Acked '%s'", message.content.toString());
          } else {
            // Third parameter true means that the message will be requeued.
            // If its set false message is discarded or dead-lettered.
            // When a message is requeued, it will be placed to its original position in its queue, if possible.
            // If not the message will be requeued to a position closer to queue head
            channel.nack(message, false, true);
            console.log(" [❌] Nacked '%s'", message.content.toString());
          }
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
