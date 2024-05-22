import { Injectable } from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { PrismaService } from 'src/prisma.service';

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

  findAll() {
    const tests = this.prisma.test.findMany();
    return tests;
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
}
