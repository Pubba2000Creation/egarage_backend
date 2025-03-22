import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AbstractRepository } from "@app/common";
import { ServiceCategoryDocument } from "./entities/service-category.entity";

@Injectable()
export class ServiceCategoryRepository extends AbstractRepository<ServiceCategoryDocument> {
    protected readonly logger = new Logger(ServiceCategoryRepository.name);

    constructor(
        @InjectModel(ServiceCategoryDocument.name)
        protected readonly serviceCategoryModel: Model<ServiceCategoryDocument>,
    ) {
        super(serviceCategoryModel);
    }
}
