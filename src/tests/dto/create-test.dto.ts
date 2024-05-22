import { CreateQuestionDto } from "src/questions/dto/create-question.dto";

export class CreateTestDto {
	name: string;
	description: string;
	questions: CreateQuestionDto[]
}
