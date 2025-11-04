import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { WeatherService } from './weather.service';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { Weather } from 'src/entity/weather.schema';
import { UpdateWeatherDto } from './dto/update-weather.dto';

@Controller('weather')
export class WeatherController {
    constructor (private readonly WeatherServie: WeatherService){}

    @Post()
    async createWeather(@Body() data:CreateWeatherDto):Promise<Weather>{
        return this.WeatherServie.create(data);
    }

    @Get()
    async getAllWeather():Promise<Weather[]>{
        return this.WeatherServie.findAll();
    }

    @Get(':id')
    async getWeatherById(@Param('id') id: string){
        return this.WeatherServie.findOne(id);

    }

    @Put(':id')
    async UpdateWeather(@Param('id') id: string, @Body() data: UpdateWeatherDto): Promise<Weather>{
        return this.WeatherServie.Update(id,data);
    }
    

    @Delete(':id')
    async DeleteWeather(@Param('id') id: string): Promise<Weather>{
        return this.WeatherServie.remove(id);
    }
     
}
