import { Test, TestingModule } from '@nestjs/testing';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

describe('WeatherController', () => {
  let controller: WeatherController;
  let service: WeatherService;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      Update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeatherController],
      providers: [{ provide: WeatherService, useValue: mockService }],
    }).compile();

    controller = module.get<WeatherController>(WeatherController);
    service = module.get<WeatherService>(WeatherService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.create on createWeather', async () => {
    const dto = { city: 'London', lat: 10, lon: 20 };
    (service.create as jest.Mock).mockResolvedValue({ _id: '1', ...dto });

    const result = await controller.createWeather(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result.city).toBe('London');
  });
});
