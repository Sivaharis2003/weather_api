import { IsNotEmpty, IsNumber, IsString } from "class-validator";



export class WeatherUpdateDto{

    
    @IsString()
    @IsNotEmpty()

    weatherName: string;
    


    @IsString()
    @IsNotEmpty()
    
    weatherId: string;

    
    @IsNumber()
    @IsNotEmpty()

    temperature: number;

    @IsNumber()
    @IsNotEmpty()

    humidity:number;

    @IsString()
    @IsNotEmpty()

    weather_description: string;

    @IsNumber()
    @IsNotEmpty()

    updatedAt: Date;











}