import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from './weather/weather.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  
  imports: [ ConfigModule.forRoot({isGlobal:true,}),
             WeatherModule, MongooseModule.forRoot('mongodb://localhost/weather'), RabbitMQModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
