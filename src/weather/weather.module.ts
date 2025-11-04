import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Weather, WeatherSchema } from 'src/entity/weather.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: Weather.name,schema: WeatherSchema}])],
  controllers: [WeatherController],
  providers: [WeatherService]
})
export class WeatherModule {}
