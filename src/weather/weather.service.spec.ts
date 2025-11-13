import { Test, TestingModule } from '@nestjs/testing';
import { WeatherService } from './weather.service';
import { getModelToken } from '@nestjs/mongoose';
import { ClientProxy } from '@nestjs/microservices';
import axios from 'axios';
import { Weather } from '../entity/weather.schema';

jest.mock('axios'); // mock axios

describe('WeatherService', () => {
  let service: WeatherService;
  let weatherModel: any;
  let weatherClient: any;

  beforeEach(async () => {
    weatherModel = {
      findById: jest.fn().mockReturnThis(),
      exec: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      find: jest.fn().mockReturnThis(),
      save: jest.fn(),
    };

    weatherClient = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        { provide: getModelToken(Weather.name), useValue: weatherModel },
        { provide: 'WEATHER_SERVICE', useValue: weatherClient },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return weather data correctly (findOne)', async () => {
    const fakeWeather = { _id: '1', city: 'London', lat: 51.5, lon: -0.12 };
    const fakeApiResponse = { data: { main: { temp: 25, humidity: 70, pressure: 1010 } } };

    weatherModel.exec.mockResolvedValue(fakeWeather);
    (axios.get as jest.Mock).mockResolvedValue(fakeApiResponse);

    const result = await service.findOne('1');

    expect(result.city).toBe('London');
    expect(result.weatherReport.temperature).toBe(25);
    expect(weatherClient.emit).toHaveBeenCalledWith(
      'weather_updates',
      expect.objectContaining({
        weatherId: '1',
        weatherName: 'London',
        temperature: 25,
        humidity: 70,
        pressure: 1010,
      }),
    );
  });

  it('should throw error when weather not found', async () => {
    weatherModel.exec.mockResolvedValue(null);
    await expect(service.findOne('999')).rejects.toThrow('Weather Not Found');
  });

  it('should update weather successfully', async () => {
    const updatedWeather = { _id: '123', city: 'Paris' };
    weatherModel.findByIdAndUpdate = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(updatedWeather),
    });

    const result = await service.Update('123', { city: 'Paris' });
    expect(result.city).toBe('Paris');
  });

  it('should throw NotFoundException on update when missing', async () => {
    weatherModel.findByIdAndUpdate = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(service.Update('999', { city: 'Rome' })).rejects.toThrow('Weather Not Found');
  });

  it('should delete weather successfully', async () => {
    const deletedWeather = { _id: '456', city: 'Tokyo' };
    weatherModel.findByIdAndDelete = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(deletedWeather),
    });

    const result = await service.remove('456');
    expect(result.city).toBe('Tokyo');
  });

  it('should throw NotFoundException on delete when missing', async () => {
    weatherModel.findByIdAndDelete = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    await expect(service.remove('999')).rejects.toThrow('Weather Not Found');
  });
});
