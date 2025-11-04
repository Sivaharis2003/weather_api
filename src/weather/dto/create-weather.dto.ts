import { IsNotEmpty, IsNumber, IsString } from "class-validator";



export class CreateWeatherDto{
    @IsNotEmpty()
    @IsString()
    city:string;

    @IsNotEmpty()
    @IsNumber()
    lat:number;

    @IsNotEmpty()
    @IsNumber()
    lon:number;


}