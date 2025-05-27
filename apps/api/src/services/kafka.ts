import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'api-service',
  brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
});

const producer = kafka.producer();

export async function initializeKafka() {
  try {
    await producer.connect();
    console.log('Successfully connected to Kafka');
  } catch (error) {
    console.error('Failed to connect to Kafka:', error);
    throw error;
  }
}

export async function publishFileUploadedEvent(fileData: {
  filename: string;
  path: string;
  size: number;
  mimetype: string;
}) {
  try {
    await producer.send({
      topic: 'file-events',
      messages: [
        {
          key: 'file-uploaded',
          value: JSON.stringify({
            event: 'file_uploaded',
            timestamp: new Date().toISOString(),
            data: fileData,
          }),
        },
      ],
    });
  } catch (error) {
    console.error('Failed to publish file uploaded event:', error);
    throw error;
  }
}

export async function shutdownKafka() {
  try {
    await producer.disconnect();
    console.log('Successfully disconnected from Kafka');
  } catch (error) {
    console.error('Failed to disconnect from Kafka:', error);
    throw error;
  }
} 