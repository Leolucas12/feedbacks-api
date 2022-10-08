import { Test, TestingModule } from "@nestjs/testing";
import { randomUUID } from "crypto";
import { FeedbackService } from "./feedback.service";

describe('FeedbackService', () => {
  let service: FeedbackService;

  const mockFeedbacks = [{
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

  const mockFeedbackRepository = {
    create: jest.fn().mockImplementation(),
    save: jest.fn().mockImplementation(),
    find: jest.fn().mockImplementation(),
    findOne: jest.fn().mockImplementation()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FeedbackService, {
        provide: 'FEEDBACK_REPOSITORY',
        useValue: mockFeedbackRepository
      }],
    }).compile();

    service = module.get<FeedbackService>(FeedbackService);
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new feedback record and return that', async () => {
    const newFeedback = {
      name: 'John Doe',
      email: 'john@email.com',
      message: 'This is my feedback.'
    }

    mockFeedbackRepository.save.mockReturnValue({ id: randomUUID(), ...newFeedback });

    expect(await service.create(newFeedback)).toEqual({
      id: expect.any(String),
      ...newFeedback
    })
    expect(mockFeedbackRepository.create).toHaveBeenCalledWith(newFeedback);
  })

  it('should return an array of feedbacks', async () => {
    mockFeedbackRepository.find.mockReturnValue(mockFeedbacks);

    expect(await service.findAll()).toEqual(mockFeedbacks);
    expect(mockFeedbackRepository.find).toHaveBeenCalled();
  })

  it('should return an array of feedbacks made by the same email', async () => {
    const email = 'john@email.com';
    const filteredFeedbacks = mockFeedbacks.filter(feedback => feedback.email === email)
    mockFeedbackRepository.find.mockReturnValue(filteredFeedbacks);

    expect(await service.findAll(email)).toEqual(filteredFeedbacks);
    expect(mockFeedbackRepository.find).toHaveBeenCalledWith({ where: { email } });
  })

  it('should return an unique feedback identified by its id', async () => {
    const id = mockFeedbacks[0].id;

    const feedback = mockFeedbacks.filter(feedback => feedback.id === id)[0];

    mockFeedbackRepository.findOne.mockReturnValue(feedback);

    expect(await service.findById(id)).toEqual(feedback)
    expect(mockFeedbackRepository.findOne).toHaveBeenCalledWith({ where: { id } });
  })
})