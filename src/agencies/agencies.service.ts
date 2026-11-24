import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, Types } from 'mongoose';
import { UpdateAgencyStatusDto } from './dto/update-agency-status.dto';

@Injectable()
export class AgenciesService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  private agenciesCollection() {
    return this.connection.getClient().db('makaan_agency').collection('users');
  }

  private toSafe(row: Record<string, unknown>) {
    const id = String(row._id || '');
    const createdOn = row.createdOn ? new Date(String(row.createdOn)) : null;
    const modifiedOn = row.modifiedOn ? new Date(String(row.modifiedOn)) : null;
    const isActive = row.isActive !== false;

    return {
      _id: id,
      id,
      name: String(row.agency || '').trim() || 'Agency',
      contactPerson: String(row.name || '').trim() || '—',
      city: String(row.city || '').trim(),
      phone: String(row.phone || '').trim(),
      whatsapp: String(row.whatsapp || '').trim(),
      email: String(row.email || '').trim(),
      officeAddress: String(row.officeAddress || '').trim(),
      bio: String(row.bio || '').trim(),
      avatar: String(row.profilePicture || '').trim(),
      profilePicture: String(row.profilePicture || '').trim(),
      coverImage: String(row.coverImage || '').trim(),
      licenseNumber: String(row.licenseNumber || '').trim(),
      responseTime: String(row.responseTime || '').trim(),
      experienceYears: Number(row.experienceYears) || 0,
      teamSize: Number(row.teamSize) || 0,
      specializations: Array.isArray(row.specializations)
        ? row.specializations.map((item) => String(item || '').trim()).filter(Boolean)
        : [],
      areasServed: Array.isArray(row.areasServed)
        ? row.areasServed.map((item) => String(item || '').trim()).filter(Boolean)
        : [],
      services: Array.isArray(row.services)
        ? row.services.map((item) => String(item || '').trim()).filter(Boolean)
        : [],
      isProfileCompleted: Boolean(row.isProfileCompleted),
      isActive,
      status: isActive ? 'active' : 'inactive',
      listingsCount: 0,
      activeListings: 0,
      memberSince: createdOn ? createdOn.getFullYear() : '',
      createdAt: createdOn?.toISOString?.() || null,
      updatedAt: modifiedOn?.toISOString?.() || null,
    };
  }

  async listAll() {
    const rows = await this.agenciesCollection()
      .find({})
      .sort({ createdOn: -1 })
      .toArray();

    return rows.map((row) => this.toSafe(row as Record<string, unknown>));
  }

  async updateStatus(agencyId: string, dto: UpdateAgencyStatusDto) {
    if (!Types.ObjectId.isValid(agencyId)) {
      throw new NotFoundException('Agency not found');
    }

    const _id = new Types.ObjectId(agencyId);
    const result = await this.agenciesCollection().findOneAndUpdate(
      { _id },
      {
        $set: {
          isActive: Boolean(dto.isActive),
          modifiedOn: new Date(),
        },
      },
      { returnDocument: 'after' },
    );

    const updated =
      (result as { value?: Record<string, unknown> } | null)?.value ??
      (result as Record<string, unknown> | null);

    if (!updated || !updated._id) {
      throw new NotFoundException('Agency not found');
    }

    return this.toSafe(updated);
  }

  async remove(agencyId: string) {
    if (!Types.ObjectId.isValid(agencyId)) {
      throw new NotFoundException('Agency not found');
    }

    const _id = new Types.ObjectId(agencyId);
    const result = await this.agenciesCollection().findOneAndDelete({ _id });
    const deleted =
      (result as { value?: Record<string, unknown> } | null)?.value ??
      (result as Record<string, unknown> | null);

    if (!deleted || !deleted._id) {
      throw new NotFoundException('Agency not found');
    }

    return this.toSafe(deleted);
  }
}
