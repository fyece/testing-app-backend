export interface User {
  id: number;
  firstname: string;
  surname: string;
  patronymic?: string | null;
  username: string;
  email?: string | null;
  birthday?: Date | null;
  jobTitle?: string | null;
  password: string;
  phoneNumber?: string | null;
  role: 'admin' | 'user';
}

export interface Group {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  members: number[];
  tests: number[];
}

export interface Test {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  questions: number[];
  timeLimitMinutes?: number | null;
}

export interface Question {
  id: number;
  text: string;
  type: string;
  points: number;
  answers: string[];
  correctAnswers: any[];
}

export interface UserAnswer {
  id: number;
  userId: number;
  questionId: number;
  testId: number;
  answerType: 'single' | 'multiple' | 'text';
  textAnswer?: string | null; // for text answer questions
  answersId?: number[] | null; // for single and multiple choice answer questions
}

export interface Result {
  id: number;
  userId: number;
  testId: number;
  groupId?: number | null;
  score: number; // result of user
  totalScore: number; // total score of the test (sum of all questions points)
  startedAt: Date; // date and time of the test start
  finishedAt: Date; // date and time of the test finish
}
