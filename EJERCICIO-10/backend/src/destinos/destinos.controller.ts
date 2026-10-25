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
import { CreateDestinoDto } from './create-destino.dto';
import { Destino } from './destino.entity';
import { DestinosService } from './destinos.service';
import { UpdateDestinoDto } from './update-destino.dto';

@Controller('destinos')
export class DestinosController {
  constructor(private readonly service: DestinosService) {}

  @Get()
  findAll(): Promise<Destino[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Destino> {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateDestinoDto): Promise<Destino> {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDestinoDto,
  ): Promise<Destino> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.service.remove(id);
  }
}