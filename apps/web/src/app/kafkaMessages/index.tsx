const { Kafka } = require('kafkajs')

export default async function KafkaMessages() {
  // Create the client with the broker list
  const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9094']
  })

  const consumer = kafka.consumer({ groupId: 'test-group' })

  // Consuming
  await consumer.connect()
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log('kafka>>>>', {
        partition,
        offset: message.offset,
        value: message.value.toString(),
      })
    },
  })

  return (
    <div>
      <p>KafkaMessages!!</p>
    </div>
  );
}