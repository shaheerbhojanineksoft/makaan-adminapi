import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AgenciesService } from './agencies.service';
import { UpdateAgencyStatusDto } from './dto/update-agency-status.dto';

@ApiTags('agencies')
@ApiBearerAuth()
@Controller('agencies')
@UseGuards(JwtAuthGuard)
export class AgenciesController {
  constructor(private readonly agenciesService: AgenciesService) {}

  @Get()
  @ApiOperation({ summary: 'List all agencies from makaan_agency.users' })
  listAll() {
    return this.agenciesService.listAll();
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Enable or disable an agency (isActive)' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateAgencyStatusDto) {
    return this.agenciesService.updateStatus(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an agency account' })
  remove(@Param('id') id: string) {
    return this.agenciesService.remove(id);
  }
}
