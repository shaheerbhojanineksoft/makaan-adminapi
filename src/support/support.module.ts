import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SupportRequestFromAgency,
  SupportRequestFromAgencySchema,
} from './schemas/support-request-from-agency.schema';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SupportRequestFromAgency.name,
        schema: SupportRequestFromAgencySchema,
      },
    ]),
  ],
  controllers: [SupportController],
  providers: [SupportService],
  exports: [SupportService],
})
export class SupportModule {}
