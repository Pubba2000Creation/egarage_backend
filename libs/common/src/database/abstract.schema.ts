import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes, ObjectId } from 'mongoose';

@Schema({ timestamps: true })
export class AbstractDocument {
  @Prop({ type: SchemaTypes.ObjectId, auto: true })
  _id: ObjectId;
}
