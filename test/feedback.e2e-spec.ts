import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Feedback } from '../src/feedback/feedback.entity';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { FeedbackModule } from '../src/feedback/feedback.module';

describe('FeedbackController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<Feedback>;

  const defaultFeedback = {
    name: "Peter Parker",
    email: "peter@email.com",
    message: "Message"
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        FeedbackModule
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    repository = app.get<Repository<Feedback>>('FEEDBACK_REPOSITORY');
    repository.clear();
    await app.init();
  });

  afterAll(async () => {
    repository = app.get<Repository<Feedback>>('FEEDBACK_REPOSITORY');
    repository.clear();
  })

  it('/api/feedbacks (POST)', async () => {
    return request(app.getHttpServer())
      .post('/feedbacks')
      .send(defaultFeedback)
      .expect(201)
      .then(response => {
        expect(response.body).toEqual(expect.objectContaining(defaultFeedback))
      })
  });

  it('/api/feedbacks (GET)', async () => {
    repository.save(defaultFeedback);

    return request(app.getHttpServer())
      .get('/feedbacks')
      .expect(200)
      .then(response => {
        const feedbacks = response.body;

        expect(Array.isArray(feedbacks)).toBe(true);

        feedbacks.forEach((feedback: Feedback) => {
          expect(feedback instanceof Feedback);
        })
      })
  })

  it('/api/feedbacks/:id (GET)', async () => {
    const newFeedback = await repository.save(defaultFeedback);

    return request(app.getHttpServer())
      .get(`/feedbacks/${newFeedback.id}`)
      .expect(200)
      .then(response => {
        const feedback = response.body;

        expect(feedback.id === newFeedback.id);
      })
  })
});
