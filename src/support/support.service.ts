import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { RespondAgencyRequestDto } from './dto/respond-agency-request.dto';
import {
  SUPPORT_STATUS,
  SupportRequestFromAgency,
  type SupportRequestFromAgencyDocument,
  type SupportStatus,
} from './schemas/support-request-from-agency.schema';

@Injectable()
export class SupportService {
  constructor(
    @InjectModel(SupportRequestFromAgency.name)
    private readonly supportModel: Model<SupportRequestFromAgencyDocument>,
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  private isSupportStatus(value: string): value is SupportStatus {
    return (SUPPORT_STATUS as readonly string[]).includes(value);
  }

  private async resolveAgencyNames(agencyIds: Types.ObjectId[]) {
    if (!agencyIds.length) return new Map<string, string>();

    const uniqueIds = [
      ...new Map(agencyIds.map((id) => [String(id), id])).values(),
    ];

    const rows = await this.connection
      .getClient()
      .db('makaan_agency')
      .collection('users')
      .find(
        { _id: { $in: uniqueIds } },
        { projection: { agency: 1, name: 1, email: 1 } },
      )
      .toArray();

    const map = new Map<string, string>();
    for (const row of rows) {
      const label =
        String(row.agency || '').trim() ||
        String(row.name || '').trim() ||
        String(row.email || '').trim() ||
        'Agency';
      map.set(String(row._id), label);
    }
    return map;
  }

  private toSafe(
    doc: SupportRequestFromAgencyDocument,
    agencyName: string,
  ) {
    const raw = doc.toObject({ virtuals: false }) as SupportRequestFromAgency & {
      _id: Types.ObjectId;
    };
    return {
      _id: String(raw._id),
      agencyId: String(raw.agencyId),
      agencyName,
      subject: raw.subject,
      topic: raw.topic,
      message: raw.message,
      attachments: Array.isArray(raw.attachments) ? raw.attachments : [],
      phone: raw.phone,
      status: raw.status,
      response: raw.response || '',
      createdAt: raw.createdAt?.toISOString?.() || raw.createdAt,
      updatedAt: raw.updatedAt?.toISOString?.() || raw.updatedAt,
    };
  }

  async listAgencyRequests(status?: string) {
    const filter: Record<string, unknown> = {};
    const normalized = String(status || 'all').trim().toLowerCase();
    if (normalized !== 'all' && this.isSupportStatus(normalized)) {
      filter.status = normalized;
    }

    const rows = await this.supportModel
      .find(filter)
      .sort({ createdAt: -1 })
      .exec();

    const agencyNames = await this.resolveAgencyNames(
      rows.map((row) => row.agencyId),
    );

    return rows.map((row) =>
      this.toSafe(row, agencyNames.get(String(row.agencyId)) || 'Agency'),
    );
  }

  private async findByIdOrThrow(requestId: string) {
    if (!Types.ObjectId.isValid(requestId)) {
      throw new NotFoundException('Agency support request not found');
    }

    const row = await this.supportModel
      .findById(new Types.ObjectId(requestId))
      .exec();
    if (!row) throw new NotFoundException('Agency support request not found');
    return row;
  }

  private async toSafeWithAgency(row: SupportRequestFromAgencyDocument) {
    const agencyNames = await this.resolveAgencyNames([row.agencyId]);
    return this.toSafe(
      row,
      agencyNames.get(String(row.agencyId)) || 'Agency',
    );
  }

  async markAgencyRequestInReview(requestId: string) {
    const row = await this.findByIdOrThrow(requestId);

    if (row.status === 'pending') {
      row.status = 'in_review';
      row.updatedAt = new Date();
      await row.save();
    }

    return this.toSafeWithAgency(row);
  }

  async respondAgencyRequest(
    requestId: string,
    dto: RespondAgencyRequestDto,
  ) {
    const reply = String(dto.response || '').trim();
    if (!reply) {
      throw new BadRequestException('Admin reply is required');
    }

    const row = await this.findByIdOrThrow(requestId);
    row.response = reply;
    row.status = 'responded';
    row.updatedAt = new Date();
    await row.save();

    return this.toSafeWithAgency(row);
  }
}
