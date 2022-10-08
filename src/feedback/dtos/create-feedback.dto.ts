import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateFeedbackDTO {
  @IsNotEmpty({ message: 'Please inform your name.' })
  name: string;
  @IsEmail({}, { message: 'Please inform a valid email.' })
  email: string;
  @IsNotEmpty({ message: 'Please send a message to complete your feedback.' })
  message: string;
}