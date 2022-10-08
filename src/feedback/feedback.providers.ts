import { DataSource } from 'typeorm';
import { Feedback } from './feedback.entity';

export const feedbackProviders = [
  {
    provide: 'FEEDBACK_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Feedback),
    inject: ['DATA_SOURCE'],
  },
];