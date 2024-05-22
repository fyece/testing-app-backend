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
import { TestsService } from './tests.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';

@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Post()
  create(@Req() req, @Body() createTestDto: CreateTestDto) {
    const ownerId = +req['user'].id;
    return this.testsService.create(ownerId, createTestDto);
  }

  @Get()
  findAll() {
    return this.testsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto) {
    return this.testsService.update(+id, updateTestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testsService.remove(+id);
  }

  @Post(':id/users')
  addUsersToTest(
    @Param('id') testId: string,
    @Body('usersId') usersId: number[],
  ) {
    return this.testsService.addUsersToTest(+testId, usersId);
  }

  @Post(':id/groups')
  addGroupsToTest(
    @Param('id') testId: string,
    @Body('groupsId') groupsId: number[],
  ) {
    return this.testsService.addGroupsToTest(+testId, groupsId);
  }
}
