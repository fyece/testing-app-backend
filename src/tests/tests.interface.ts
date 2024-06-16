export interface UserTestDto {
  testId: number;
  answers: {
    questionId: number;
    answerIds?: number[] | null | undefined;
    textAnswer?: string | null | undefined;
  }[];
}
