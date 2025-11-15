import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL as string],
      queue: process.env.RABBITMQ_QUEUE,
      queueOptions: {
        durable: true,
      },
    },
  });



  app.connectMicroservice({
  transport: Transport.KAFKA,
  options: {
    client: {
      brokers: ['localhost:9092'],
    },
    consumer: {
      groupId: 'weather-consumer-group',
    },
  },
});





  await app.startAllMicroservices();
   console.log('RabbitMQ Microservice connected successfully!');
  
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
 console.log(`Server running on http://localhost:${port}`);
}
bootstrap();
