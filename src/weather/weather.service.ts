import { Get, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Weather, WeatherDocument } from 'src/entity/weather.schema';
import { CreateWeatherDto } from './dto/create-weather.dto';
import { UpdateWeatherDto } from './dto/update-weather.dto';
import { error } from 'console';
import axios from 'axios';


@Injectable()
export class WeatherService {

    private readonly apiKey = 'f4f9b654afba289e675c647464820540';

    constructor(@InjectModel(Weather.name) private weatherModel: Model<WeatherDocument>){}

    async create(data: CreateWeatherDto): Promise<Weather>{
        const newWeather = new this.weatherModel(data);
        const saveWeather = await newWeather.save();
        return saveWeather;
    }

    async findAll(): Promise<Weather[]>{
        return this.weatherModel.find().exec();
    }

    async findOne(id:string): Promise<any>{
        try{
            const weather = await this.weatherModel.findById(id).exec();
            if(!weather){
                throw new error('Weather Not Found');
            }

            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${weather.lat}&lon=${weather.lon}&appid=${this.apiKey}&units=metric`;

            const {data}: any = await axios.get(url);

            const weatherReport = {
                temperature: data.main.temp,
                humidity: data.main.humidity,
                pressure: data.main.pressure
            };

            return{
                _id: weather._id,
                city: weather.city,
                lat: weather.lat,
                lon: weather.lon,
                createdAt: weather.createdAt,
                weatherReport,
             };
        } catch(error){
            console.error('Error', error.message || error);
            throw error;
        }
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
