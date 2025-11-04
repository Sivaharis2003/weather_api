import { Prop,Schema,SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type WeatherDocument = Weather & Document;

@Schema({timestamps:true})
export class Weather{


    @Prop({required:true})
    city: string;

    @Prop({required:true})
    lat: number;

    @Prop({required:true})
    lon: number;

    @Prop()
    createdAt?: Date;

    @Prop()
    updatedAt?: Date;
}

export const WeatherSchema = SchemaFactory.createForClass(Weather);