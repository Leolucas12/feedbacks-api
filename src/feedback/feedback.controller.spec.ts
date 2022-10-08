import { Test, TestingModule } from "@nestjs/testing";
import { randomUUID } from "crypto";
import { CreateFeedbackDTO } from "./dtos/create-feedback.dto";
import { FeedbackController } from "./feedback.controller";
import { Feedback } from "./feedback.entity";
import { FeedbackService } from "./feedback.service";

describe('FeedbackController', () => {
  let controller: FeedbackController;

  const mockFeedbackService = {
    findAll: jest.fn().mockImplementation((email?: string) => {
      const feedbacks = [{
        id: randomUUID(),
        name: 'John Doe',
        email: 'john@email.com',
        message: 'This is my feedback.'
      },
      {
        id: randomUUID(),
        name: 'Peter Parker',
        email: 'peter@email.com',
        message: 'This is another feedback.'
      }]

      if (email) {
        return feedbacks.filter(feedback => feedback.email === email);
      }

      return feedbacks;
    }),
    findById: jest.fn().mockImplementation((id: string) => {
      return {
        id,
        name: 'John Doe',
        email: 'john@email.com',
        message: 'This is my feedback.'
      }
    }),
    create: jest.fn().mockImplementation((dto: CreateFeedbackDTO) => {
      return {
        id: randomUUID(),
        ...dto,
      }
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackController],
      providers: [FeedbackService]
    }).overrideProvider(FeedbackService).useValue(mockFeedbackService).compile();

    controller = module.get<FeedbackController>(FeedbackController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new feedback', async () => {
    const feedback = await controller.create({
      name: 'John Doe',
      email: 'john@email.com',
      message: 'This is my feedback.'
    })

    expect(feedback)
      .toEqual({
        id: expect.any(String),
        name: 'John Doe',
        email: 'john@email.com',
        message: 'This is my feedback.'
      })

    expect(mockFeedbackService.create).toHaveBeenCalled();
  });

  it('should return a single feedback by id', async () => {
    const id = randomUUID();
    const feedback = await controller.findById(id);

    expect(feedback)
      .toEqual({
        id: expect.any(String),
        name: expect.any(String),
        email: expect.any(String),
        message: expect.any(String)
      })

    expect(mockFeedbackService.findById).toHaveBeenCalledWith(id);
  })

  it('should return a list of feedbacks', async () => {
    const feedbacks = await controller.find();

    expect(Array.isArray(feedbacks)).toBe(true);

    feedbacks.forEach(feedback => {
      expect(feedback instanceof Feedback);
    })

    expect(mockFeedbackService.findAll).toHaveBeenCalled();
  })

  it('should return a list of feedbacks made by an email', async () => {
    const userEmail = 'john@email.com';
    const feedbacks = await controller.find(userEmail);

    expect(Array.isArray(feedbacks)).toBe(true);

    feedbacks.forEach(feedback => {
      expect(feedback instanceof Feedback);
      expect(feedback.email === userEmail)
    })

    expect(mockFeedbackService.findAll).toHaveBeenCalledWith(userEmail);
  })
});