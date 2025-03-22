import { AbstractDocument } from "@app/common";
import { Prop, SchemaFactory,Schema } from "@nestjs/mongoose";


@Schema({ versionKey: false, timestamps: true })
export class VehicletypeDocument extends AbstractDocument {

    @Prop({ required: true })
    name: string;

    @Prop({ required: false })
    category: string;

    @Prop()
    description: string;

    @Prop({ required: true, min: 2 })
    wheels: number;

    @Prop({ type: [String], required: true })
    fuelType: string[];

    @Prop({ required: true, type: Boolean, default: true })
    isActive: boolean;

}

export const VehicletypeSchema = SchemaFactory.createForClass(VehicletypeDocument);