import { Get, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather, WeatherDocument } from '../entity/weather.schema';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { UpdateWeatherDto } from './dto/update-weather.dto';
import { error } from 'console';
import axios from 'axios';
import { ClientProxy } from '@nestjs/microservices';

type ApiResponse = {
    main:{
        temp: number;
        humidity: number;
        pressure: number;

    };
}

type weatherResponse = {

    _id: string;
    city: string;
    lat: number;
    lon: number;
    createdAt: Date;
    weatherReport:{

        temperature: number;
        humidity: number;
        pressure: number;
        
    }


}


@Injectable()
export class WeatherService {

    private readonly apiKey = process.env.OPENWEATHER_API_KEY;

    constructor(@InjectModel(Weather.name) private weatherModel: Model<WeatherDocument>,
                @Inject('WEATHER_SERVICE') private readonly weatherClient:ClientProxy, ){}

    async create(data: CreateWeatherDto): Promise<Weather>{
        const newWeather = new this.weatherModel(data);
        const saveWeather = await newWeather.save();
        return saveWeather;
    }

    async findAll(): Promise<Weather[]>{
        return this.weatherModel.find().exec();
    }

    async findOne(id: string): Promise<weatherResponse> {
        const weather = await this.getWeatherById(id);
        const data = await this.fetchWeatherData(weather.lat, weather.lon);
        const weatherReport = this.buildWeatherReport(data);

        this.emitWeatherUpdate(weather, weatherReport);

        return this.buildWeatherResponse(weather, weatherReport);
    }

    // --- Helper Methods ---

    private async getWeatherById(id: string): Promise<WeatherDocument> {
        const weather = await this.weatherModel.findById(id).exec();
        if (!weather) throw new Error('Weather Not Found');
        return weather;
    }

    private async fetchWeatherData(lat: number, lon: number) {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
        const { data } = await axios.get<ApiResponse>(url);
        return data;
    }

    private buildWeatherReport(data: ApiResponse) {
        return {
            temperature: data.main.temp,
            humidity: data.main.humidity,
            pressure: data.main.pressure,
        };
    }

    private emitWeatherUpdate(weather: Weather, report: {temperature: number; humidity: number; pressure:number})
     {
        this.weatherClient.emit('weather_updates', {
            weatherId: weather._id as string,
            weatherName: weather.city,
            ...report,
        });
    }

    private buildWeatherResponse(weather: Weather, report: {temperature: number; humidity: number; pressure:number}
    ): weatherResponse {
        return {
            _id: weather._id,
            city: weather.city,
            lat: weather.lat,
            lon: weather.lon,
            createdAt: weather.createdAt || new Date(),
            weatherReport: report,
        };
    }


    async Update(id: string, data:UpdateWeatherDto): Promise<Weather>{
        const UpdateWeather = await this.weatherModel.findByIdAndUpdate(id,data, {new:true, runValidators:true}).exec();
        if(!UpdateWeather) throw new NotFoundException('Weather Not Found');
        return UpdateWeather;
    }

    async remove(id: string): Promise<Weather>{
        const DeleteWeather = await this.weatherModel.findByIdAndDelete(id).exec();
        if(!DeleteWeather) throw new NotFoundException('Weather Not Found')
            return DeleteWeather;
    }

}
