import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUser } from './types';
import { User } from '@prisma/client';
import { Role } from 'src/auth/role.enum';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      where: {
        role: 'USER',
      },
      include: {
        group: true,
        results: true,
        tests: true,
      },
    });

    const formattedUsers = users.map((user) => {
      let scoreSum = 0;
      let totalScoreSum = 0;
      let averageResultPercent = null;
      user.results.forEach((result) => {
        scoreSum += result.score;
        totalScoreSum += result.totalScore;
      });

      if (totalScoreSum > 0) {
        averageResultPercent = Number(
          ((scoreSum / totalScoreSum) * 100).toFixed(0),
        );
      }
      return {
        ...user,
        testsPassed: user.tests.filter((test) => test.isDone).length,
        testsTotal: user.tests.length,
        averageResultPercent,
      };
    });
    return formattedUsers;
  }

  async findOne(email: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        group: true,
      },
    });
    return user;
  }

  async findById(id: number): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        group: true,
      },
    });
    return user;
  }

  async createUser(data: CreateUser): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: {
        ...data,
        role: data.role ?? 'USER',
      },
    });
    return newUser;
  }

  async getAllUserTests(userId: number) {
    const userTests = await this.prisma.userTest.findMany({
      where: {
        userId,
      },
      include: {
        test: true,
        result: true,
      },
    });
    if (userTests) {
      return userTests.map((userTest) => ({
        ...userTest.test,
        isDone: userTest.isDone,
        result: userTest.result,
      }));
    }
    return null;
  }

  async getUserStatsById(userId: number) {
    const userTests = await this.prisma.userTest.findMany({
      where: {
        userId,
      },
      include: {
        result: true,
      },
    });

    const userStats = {
      testsPassed: userTests.filter((userTest) => userTest.isDone).length,
      testsTotal: userTests.length,
      averageResultPercent:
        userTests.length > 0
          ? Number(
              (
                (userTests
                  .filter((userTest) => userTest.isDone)
                  .reduce((sum, userTest) => sum + userTest.result.score, 0) /
                  userTests
                    .filter((userTest) => userTest.isDone)
                    .reduce(
                      (sum, userTest) => sum + userTest.result.totalScore,
                      0,
                    )) *
                100
              ).toFixed(0),
            ) /100
          : null,
    };
    return userStats;
  }
}
