import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { serviceCategorycreatedBy, serviceCategoryStatus } from "../enum/serviceCategoryStatus.enum"; // Corrected import

@Schema({ versionKey: false, timestamps: true })
export class ServiceCategoryDocument extends AbstractDocument { 

    @Prop({ required: true, type: String, unique: true })
    name: string; // Example: 'Oil Change', 'Tire Replacement', etc.

    @Prop({ type: String })
    description?: string; // Optional: Brief description of the category.

    @Prop({
        type: String,
        enum: serviceCategoryStatus,
        required: false,
        default: serviceCategoryStatus.PENDING, // Ensure default is set
    })
    status?: serviceCategoryStatus;

    @Prop({
        type: String, 
        enum: serviceCategorycreatedBy,
        required: false,
        default: serviceCategorycreatedBy.admin // Ensure default is set
    })
    createdBy?: serviceCategorycreatedBy; // Tracks who added the category.
}

export const ServiceCategorySchema = SchemaFactory.createForClass(ServiceCategoryDocument);
