import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}
  create(ownerId: number, createGroupDto: CreateGroupDto) {
    const newGroup = this.prisma.group.create({
      data: { ...createGroupDto, ownerId: ownerId },
    });
    return newGroup;
  }

  async findAll() {
    const groups = await this.prisma.group.findMany({
      include: {
        _count: {
          select: {
            members: true,
            groupTests: true,
          },
        },
        results: {
          select: {
            score: true,
            totalScore: true,
          },
        },
      },
    });

    const formattedGroups = groups.map((group) => {
      const totalScore = group.results.reduce(
        (acc, result) => acc + (result.score / result.totalScore) * 100,
        0,
      );
      const averageResultPercent =
        group.results.length > 0 ? totalScore / group.results.length : null;

      return {
        ...group,
        totalUsers: group._count.members,
        totalTests: group._count.groupTests,
        averageResultPercent,
      };
    });

    return formattedGroups;
  }

  async findOne(id: number) {
    const group = await this.prisma.group.findUnique({
      where: { id: id },
      include: {
        _count: {
          select: {
            members: true,
            groupTests: true,
          },
        },
        results: {
          select: {
            score: true,
            totalScore: true,
          },
        },
      },
    });

    const totalScore = group.results.reduce(
      (acc, result) => acc + (result.score / result.totalScore) * 100,
      0,
    );
    const averageResultPercent =
      group.results.length > 0 ? totalScore / group.results.length : null;

    return {
      ...group,
      totalUsers: group._count.members,
      totalTests: group._count.groupTests,
      averageResultPercent,
    };
  }

  update(id: number, updateGroupDto: UpdateGroupDto) {
    const updatedGroup = this.prisma.group.update({
      where: { id: id },
      data: { ...updateGroupDto },
    });
    return updatedGroup;
  }

  remove(id: number) {
    return `This action removes a #${id} group`;
  }

  addUsersToGroup(groupId: number, usersId: number[]) {
    const group = this.prisma.group.update({
      where: { id: groupId },
      data: { members: { connect: usersId.map((id) => ({ id })) } },
      include: { members: true },
    });

    for (const userId of usersId) {
      this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          groupId: groupId,
        },
      });
    }
    return group;
  }

  async getAllGroupTests(groupId: number) {
    const groupTests = await this.prisma.groupTest.findMany({
      where: {
        groupId,
      },
      include: {
        test: true,
      },
    });
    if (groupTests) {
      return groupTests.map((test) => test.test);
    }
    return null;
  }

  async findGroupUsers(groupId: number) {
    const users = await this.prisma.user.findMany({
      where: {
        role: 'USER',
        groupId: groupId
      },
      include: {
        group: true,
        results: true,
        tests: true,
      },
    });

    const formattedUsers = users.map((user) => {
      let scoreSum = 0 
      let totalScoreSum = 0
      let averageResultPercent = null
      user.results.forEach((result) => {
        scoreSum += result.score
        totalScoreSum += result.totalScore
      })

      if(totalScoreSum > 0) {
        averageResultPercent = Number((scoreSum / totalScoreSum * 100).toFixed(0))
      }
      return {
        ...user,
        testsPassed: user.tests.filter((test) => test.isDone).length,
        testsTotal: user.tests.length,
        averageResultPercent
      }
    })
    return formattedUsers;
  }
}
