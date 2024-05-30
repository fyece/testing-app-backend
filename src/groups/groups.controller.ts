import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@Req() req: Request, @Body() createGroupDto: CreateGroupDto) {
    console.log(req['user']);
    const ownerId = +req['user'].id;
    return this.groupsService.create(ownerId, createGroupDto);
  }

  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(+id, updateGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupsService.remove(+id);
  }

  @Post(':id/users')
  addUsersToGroup(
    @Param('id') groupId: string,
    @Body('usersId') usersId: number[],
  ) {
    return this.groupsService.addUsersToGroup(+groupId, usersId);
  }

  @Get(':id/tests')
  getAllGroupTests(@Param('id') id: string) {
    return this.groupsService.getAllGroupTests(+id);
  }
  @Get(':id/members')
  findGroupUsers(@Param('id') id: string) {
    return this.groupsService.findGroupUsers(+id);
  }
}
