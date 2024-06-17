import { Injectable } from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { PrismaService } from 'src/prisma.service';
import { UserTestDto } from './tests.interface';
import { arraysEqual } from './utils';

@Injectable()
export class TestsService {
  constructor(private prisma: PrismaService) {}

  create(ownerId: number, createTestDto: CreateTestDto) {
    const newTest = this.prisma.test.create({
      data: {
        name: createTestDto.name,
        description: createTestDto.description,
        ownerId: ownerId,
        questions: {
          create: createTestDto.questions.map((question) => ({
            text: question.text,
            type: question.type,
            points: question.points,
            answers: {
              create: question.answers.map((answer) => ({
                text: answer.text,
                isCorrect: answer.isCorrect,
              })),
            },
          })),
        },
      },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    return newTest;
  }

  async findAll() {
    const tests = await this.prisma.test.findMany({
      include: {
        userTests: true,
        results: true,
        _count: {
          select: {
            userTests: true,
          },
        },
      },
    });

    const formattedTests = tests.map((test) => {
      let testsScoreSum = 0;
      let testTotalScoreSum = 0;
      test.results.forEach((result) => {
        testsScoreSum = testsScoreSum + result.score;
        testTotalScoreSum = testTotalScoreSum + result.totalScore;
      });

      return {
        ...test,
        totalUsers: test._count.userTests,
        averageResultPercent:
          testTotalScoreSum > 0
            ? Number(((testsScoreSum / testTotalScoreSum) * 100).toFixed(0))
            : null,
      };
    });

    return formattedTests;
  }

  findOne(id: number) {
    const test = this.prisma.test.findUnique({
      where: {
        id,
      },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });
    if (!test) {
      return null;
    }
    return test;
  }

  update(id: number, updateTestDto: UpdateTestDto) {
    return `This action updates a #${id} test`;
  }

  remove(id: number) {
    return `This action removes a #${id} test`;
  }

  async addUsersToTest(testId: number, usersId: number[]) {
    const userTestPromises = usersId.map((userId) => {
      return this.prisma.userTest.create({
        data: {
          userId,
          testId,
          isDone: false,
        },
      });
    });
    await Promise.all(userTestPromises);
    const testWithUsers = await this.prisma.test.findUnique({
      where: { id: testId },
      include: { userTests: { include: { user: true } } },
    });
    return testWithUsers;
  }

  async addGroupsToTest(testId: number, groupsId: number[]) {
    const groupTestPromises = groupsId.map((groupId) => {
      return this.prisma.groupTest.create({
        data: {
          groupId,
          testId,
        },
      });
    });
    await Promise.all(groupTestPromises);

    try {
      const groups = await this.prisma.group.findMany({
        where: {
          id: { in: groupsId },
        },
        include: {
          members: {
            select: { id: true },
          },
        },
      });

      const usersIds: number[] = groups.flatMap((group) =>
        group.members.map((member) => member.id),
      );

      return this.addUsersToTest(testId, usersIds);
    } catch (error) {
      throw new Error(`Failed to get users ids from groups: ${error.message}`);
    }
  }

  async getUserTests(userId: number) {
    const userTests = await this.prisma.userTest.findMany({
      where: {
        userId,
      },
      include: {
        test: {
          include: {
            questions: false,
            _count: {
              select: {
                questions: true,
              },
            },
          },
        },
        result: true,
      },
    });

    if (userTests) {
      return userTests.map((userTest) => ({
        ...userTest.test,
        isDone: userTest.isDone,
        result: userTest.result,
        questionsCount: userTest.test._count.questions,
      }));
    }
    return null;
  }

  async getAllTestResultsByTestId(testId: number) {
    const results = await this.prisma.userTest.findMany({
      where: {
        testId,
      },
      include: {
        user: {
          include: {
            group: true,
          },
        },
        result: true,
      },
    });
    return results;
  }

  async submitTest(userId: number, body: UserTestDto) {
    let userScore = 0;
    let testTotalScore = 0;

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        group: true,
      },
    });

    const test = await this.prisma.test.findUnique({
      where: {
        id: body.testId,
      },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    await this.prisma.userAnswer.createMany({
      data: body.answers.map((answer) => ({
        testId: body.testId,
        userId,
        questionId: answer.questionId,
        answerIds: answer.answerIds,
        textAnswer: answer.textAnswer,
      })),
    });

    const userAnswers = await this.prisma.userAnswer.findMany({
      where: {
        testId: body.testId,
        userId,
      },
    });

    test.questions.forEach((question) => {
      testTotalScore = testTotalScore + question.points;

      const correctAnswers = question.answers.filter(
        (answer) => answer.isCorrect && answer.questionId === question.id,
      );

      const userAnswer = userAnswers.find(
        (answer) => answer.questionId === question.id,
      );

      if (question.type === 'single') {
        const isUserAnswerCorrect =
          userAnswer.answerIds[0] === correctAnswers[0].id;

        userScore = userScore + (isUserAnswerCorrect ? question.points : 0);
      }

      if (question.type === 'multiple') {
        const isUserAnswerCorrect = arraysEqual(
          userAnswer.answerIds.sort(),
          correctAnswers.map((answer) => answer.id).sort(),
        );

        userScore = userScore + (isUserAnswerCorrect ? question.points : 0);
      }

      if (question.type === 'text') {
        const isUserAnswerCorrect = correctAnswers
          .map((answer) => answer.text.toLocaleLowerCase())
          .includes(userAnswer.textAnswer.toLocaleLowerCase());

        userScore = userScore + (isUserAnswerCorrect ? question.points : 0);
      }
    });

    const userTest = await this.prisma.userTest.update({
      where: {
        userId_testId: {
          userId,
          testId: body.testId,
        },
      },
      data: {
        isDone: true,
        result: {
          create: {
            score: userScore,
            totalScore: testTotalScore,
            user: {
              connect: {
                id: userId,
              },
            },
            test: {
              connect: {
                id: body.testId,
              },
            },
            group: {
              connect: {
                id: user.group.id,
              },
            },
          },
        },
      },
      include: {
        result: true,
      },
    });

    return userTest;
  }

  async getUserTestResult(userId: number, testId: number) {
    const result = await this.prisma.result.findFirst({
      where: {
        userId,
        testId,
      },
      include: {
        user: true,
        test: true,
      },
    });

    return result;
  }
}
