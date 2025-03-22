import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ServiceCenterStatus } from "../enum/ServiceCenterStatus.enum";

class LocationURL {
  @Prop({ type: String, required: true })
  longitude: string;

  @Prop({ type: String, required: true })
  latitude: string;
}

@Schema({ versionKey: false, timestamps: true })
export class ServiceCenterDocument extends AbstractDocument {

  @Prop({ type: String,unique: false})
  userId?: string;

  @Prop({ type: String, required: true, index: "text" })
  serviceTitle: string;

  @Prop({ type: [String], required: true })
  serviceCategories: string[];

  @Prop({ type: String, required: true, index: "text" })
  description: string;

  @Prop({ type: [String], default: [] })
  specializedVehicles: string[];

  @Prop({ type: String, required: true })
  mobileNumber: string;

  @Prop({ type: String })
  telephoneNumber?: string;

  @Prop({ type: LocationURL, required: true })
  locationURL: LocationURL;

  @Prop({ type: [String], default: [] })
  imageGallery?: string[];

  @Prop({ type: String, required: true })
  ownerName: string;

  @Prop({ type: String, required: true })
  ownerNIC: string;

  @Prop({ type: String, required: true })
  businessRegistrationCertificate: string;

  @Prop({
    type: String,
    enum: ServiceCenterStatus,
    required: true,
    default: ServiceCenterStatus.PENDING,
  })
  status?: ServiceCenterStatus;
}

export const ServiceCenterSchema = SchemaFactory.createForClass(ServiceCenterDocument);


//  Text search only on `serviceTitle` and `description`
ServiceCenterSchema.index({
  serviceTitle: "text",
  description: "text",
});

//  Use a 2dsphere index for geospatial queries
ServiceCenterSchema.index({ locationURL: "2dsphere" });