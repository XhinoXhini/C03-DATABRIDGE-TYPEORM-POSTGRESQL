import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateSneakerDto } from './create-sneaker.dto';
import { Sneaker } from './sneaker.entity';
import { SneakersService } from './sneakers.service';
import { UpdateSneakerDto } from './update-sneaker.dto';

@Controller('sneakers')
export class SneakersController {
  constructor(private readonly service: SneakersService) {}

  @Get()
  findAll(): Promise<Sneaker[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Sneaker> {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateSneakerDto): Promise<Sneaker> {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSneakerDto,
  ): Promise<Sneaker> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}