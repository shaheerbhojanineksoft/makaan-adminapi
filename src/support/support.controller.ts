import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RespondAgencyRequestDto } from './dto/respond-agency-request.dto';
import { SupportService } from './support.service';

@ApiTags('support')
@ApiBearerAuth()
@Controller('support')
@UseGuards(JwtAuthGuard)
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Get('agency-requests')
  @ApiOperation({ summary: 'List all agency support requests' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['all', 'pending', 'in_review', 'responded'],
    description: 'Filter by status. Default: all',
  })
  listAgencyRequests(@Query('status') status?: string) {
    return this.supportService.listAgencyRequests(status);
  }

  @Patch('agency-requests/:id/in-review')
  @ApiOperation({ summary: 'Mark agency support request as in review' })
  markAgencyRequestInReview(@Param('id') id: string) {
    return this.supportService.markAgencyRequestInReview(id);
  }

  @Patch('agency-requests/:id/respond')
  @ApiOperation({ summary: 'Respond to agency support request' })
  respondAgencyRequest(
    @Param('id') id: string,
    @Body() dto: RespondAgencyRequestDto,
  ) {
    return this.supportService.respondAgencyRequest(id, dto);
  }
}
