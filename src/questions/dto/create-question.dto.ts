export interface CreateAnswersDto {
	text: string;
	isCorrect: boolean;
}

export class CreateQuestionDto {
	text: string;
	type: string;
	points: number;
	answers: CreateAnswersDto[];
}
