import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUser } from './types';
import { User } from '@prisma/client';

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
      },
    });
    return users;
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
      data,
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
    }});
    if (userTests) {
      return userTests.map((userTest) => ({...userTest.test, isDone: userTest.isDone, result: userTest.result}));
    }
    return null;
  }
}
