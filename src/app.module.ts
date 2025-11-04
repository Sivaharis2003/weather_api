import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from './weather/weather.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  
  imports: [WeatherModule, MongooseModule.forRoot('mongodb://localhost/weather')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
