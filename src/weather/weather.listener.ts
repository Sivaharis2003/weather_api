import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather } from 'src/entity/weather.schema';
import { WeatherUpdateDto } from './dto/weatherupdates.dto';

@Controller()
export class weatherListener {
  private readonly logger = new Logger(weatherListener.name);

  constructor(@InjectModel(Weather.name) private weatherModel: Model<Weather>) {}

  @EventPattern('weather_updates')
  async handleWeatherUpdate(@Payload() data: WeatherUpdateDto) {
    this.logger.log(`RabbitMQ Received weather update for ${data.weatherName}`);

    await this.weatherModel.findByIdAndUpdate(data.weatherId, {
      lastWeather: {
        temperature: data.temperature,
        humidity: data.humidity,
        description: data.weather_description,
        updatedAt: new Date(),
      },
    });

    this.logger.log(`RabbitMQ Weather data saved for ${data.weatherName}`);
  }
}