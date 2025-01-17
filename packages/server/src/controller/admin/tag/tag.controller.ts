import {
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/provider/auth/auth.guard';
import { ISRProvider } from 'src/provider/isr/isr.provider';
import { TagProvider } from 'src/provider/tag/tag.provider';
@ApiTags('tag')
@UseGuards(AdminGuard)
@Controller('/api/admin/tag/')
export class TagController {
  constructor(
    private readonly tagProvider: TagProvider,
    private readonly isrProvider: ISRProvider,
  ) {}

  @Get('/all')
  async getAllTags() {
    const data = await this.tagProvider.getAllTags(true);
    return {
      statusCode: 200,
      data,
    };
  }

  @Get('/:name')
  async getArticlesByTagName(@Param('name') name: string) {
    const data = await this.tagProvider.getArticlesByTag(name, true);
    return {
      statusCode: 200,
      data,
    };
  }
  @Put('/:name')
  async updateTagByName(
    @Param('name') name: string,
    @Query('value') newName: string,
  ) {
    const data = await this.tagProvider.updateTagByName(name, newName);
    this.isrProvider.activeAll('批量更新标签名触发增量渲染！');
    return {
      statusCode: 200,
      data,
    };
  }
  @Delete('/:name')
  async deleteTagByName(@Param('name') name: string) {
    const data = await this.tagProvider.deleteOne(name);
    this.isrProvider.activeAll('批量删除标签触发增量渲染！');
    return {
      statusCode: 200,
      data,
    };
  }
}
