import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Weather, WeatherSchema } from 'src/entity/weather.schema';
import { weatherListener } from './weather.listener';
import { RabbitMQModule } from 'src/rabbitmq/rabbitmq.module';

@Module({
  imports: [RabbitMQModule,MongooseModule.forFeature([{name: Weather.name,schema: WeatherSchema}])],
  controllers: [WeatherController,weatherListener],
  providers: [WeatherService]
})
export class WeatherModule {}
