import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather } from '../entity/weather.schema';

@Controller()
export class WeatherKafkaListener {
  private readonly logger = new Logger(WeatherKafkaListener.name);

  constructor(
    @InjectModel(Weather.name)
    private readonly weatherModel: Model<Weather>,
  ) {}

  @EventPattern('weather_updates')
  async handleKafkaUpdate(@Payload() data: any) {

    
    this.logger.log(`Kafka Received update for ${data.weatherName}`);

    await this.weatherModel.findByIdAndUpdate(data.weatherId, {
      lastWeather: {
        temperature: data.temperature,
        humidity: data.humidity,
        pressure: data.pressure,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`Kafka Weather data saved for ${data.weatherName}`);
  }
}
