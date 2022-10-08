import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateFeedbackDTO } from './dtos/create-feedback.dto';
import { Feedback } from './feedback.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @Inject('FEEDBACK_REPOSITORY')
    private feedbackRepository: Repository<Feedback>,
  ) { }

  async findById(id: string): Promise<Feedback> {
    return this.feedbackRepository.findOne({ where: { id } });
  }

  async findAll(email?: string): Promise<Feedback[]> {
    if (email) {
      return this.feedbackRepository.find({ where: { email } })
    }

    return this.feedbackRepository.find();
  }

  async create(feedbackData: CreateFeedbackDTO): Promise<Feedback> {
    const feedback = this.feedbackRepository.create(feedbackData);

    return await this.feedbackRepository.save(feedback);
  }
}