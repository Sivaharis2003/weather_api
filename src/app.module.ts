import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WeatherModule } from './weather/weather.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { ConfigModule } from '@nestjs/config';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  
  imports: [ ConfigModule.forRoot({isGlobal:true,}),
             WeatherModule, MongooseModule.forRoot('mongodb://localhost/weather'), RabbitMQModule,KafkaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
