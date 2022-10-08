import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { FeedbackController } from './feedback.controller';
import { feedbackProviders } from './feedback.providers';
import { FeedbackService } from './feedback.service';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...feedbackProviders,
    FeedbackService,
  ],
  controllers: [FeedbackController]
})
export class FeedbackModule { }