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

  findAll() {
    const groups = this.prisma.group.findMany();
    return groups;
  }

  findOne(id: number) {
    const group = this.prisma.group.findUnique({ where: { id: id } });
    if (!group) {
      return null;
    }
    return group;
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
}
