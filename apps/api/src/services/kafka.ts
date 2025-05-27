import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'api-service',
  brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9094'],
});

const producer = kafka.producer();
const admin = kafka.admin();

const TOPIC_NAME = 'file-events';

export async function initializeKafka() {
  try {
    // Connect both admin and producer
    await Promise.all([
      admin.connect(),
      producer.connect()
    ]);

    // Get list of existing topics
    const topics = await admin.listTopics();
    
    // Create topic if it doesn't exist
    if (!topics.includes(TOPIC_NAME)) {
      console.log(`Creating Kafka topic: ${TOPIC_NAME}`);
      await admin.createTopics({
        topics: [{
          topic: TOPIC_NAME,
          numPartitions: 1,
          replicationFactor: 1,
          configEntries: [
            {
              name: 'cleanup.policy',
              value: 'delete'
            },
            {
              name: 'retention.ms',
              value: '604800000' // 7 days
            }
          ]
        }]
      });
      console.log(`Successfully created topic: ${TOPIC_NAME}`);
    } else {
      console.log(`Topic ${TOPIC_NAME} already exists`);
    }

    console.log('Successfully connected to Kafka');
  } catch (error) {
    console.error('Failed to initialize Kafka:', error);
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
      topic: TOPIC_NAME,
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
    await Promise.all([
      producer.disconnect(),
      admin.disconnect()
    ]);
    console.log('Successfully disconnected from Kafka');
  } catch (error) {
    console.error('Failed to disconnect from Kafka:', error);
    throw error;
  }
} 