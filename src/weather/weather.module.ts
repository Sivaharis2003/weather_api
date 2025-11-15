import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Weather, WeatherSchema } from 'src/entity/weather.schema';
import { weatherListener } from './weather.listener';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';
import { KafkaModule } from 'src/kafka/kafka.module';
import { WeatherKafkaListener } from './weather.kafka.listener';

@Module({
  imports: [KafkaModule,RabbitMQModule,MongooseModule.forFeature([{name: Weather.name,schema: WeatherSchema}])],
  controllers: [WeatherController,weatherListener, WeatherKafkaListener],
  providers: [WeatherService]
})
export class WeatherModule {}
