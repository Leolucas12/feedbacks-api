import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from '@nestjs/common';
import { CreateFeedbackDTO } from './dtos/create-feedback.dto';
import { Feedback } from './feedback.entity';
import { FeedbackService } from './feedback.service';

@Controller('feedbacks')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) { }

  @Get()
  async find(
    @Query('email') email?: string,
  ): Promise<Feedback[]> {
    return this.feedbackService.findAll(email);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Feedback> {
    return this.feedbackService.findById(id);
  }

  @Post()
  async create(
    @Body() feedbackData: CreateFeedbackDTO
  ): Promise<Feedback> {
    return this.feedbackService.create(feedbackData);
  }
}
