import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'api-service-consumer',
  brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9094'],
});

const consumer = kafka.consumer({ groupId: 'file-events-console-logger' });
const TOPIC_NAME = 'file-events';

export async function startConsumer() {
  try {
    await consumer.connect();
    console.log('Kafka consumer connected');

    await consumer.subscribe({
      topic: TOPIC_NAME,
      fromBeginning: true
    });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value?.toString();
        if (value) {
          const event = JSON.parse(value);
          console.log('\n🔔 Received Kafka Event:');
          console.log('Topic:', topic);
          console.log('Partition:', partition);
          console.log('Event:', JSON.stringify(event, null, 2));
          console.log('Timestamp:', new Date(event.timestamp).toLocaleString());
          console.log('----------------------------------------');
        }
      },
    });

    console.log(`Started listening for events on topic: ${TOPIC_NAME}`);
  } catch (error) {
    console.error('Error starting Kafka consumer:', error);
    throw error;
  }
}

export async function stopConsumer() {
  try {
    await consumer.disconnect();
    console.log('Kafka consumer disconnected');
  } catch (error) {
    console.error('Error stopping Kafka consumer:', error);
    throw error;
  }
} 