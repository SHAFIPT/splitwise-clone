import { Injectable } from '@nestjs/common';
import { GroupRepository } from '../repository/group.repository';
import { CreateGroupDto } from '../dtos/create-group.dto';
import { Group } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class PrismaGroupRepository implements GroupRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateGroupDto): Promise<Group> {
    const { name, description, category, image, members, creatorId } = data;

    const allMemberIds = Array.from(new Set([...members, creatorId]));

    const group = await this.prisma.group.create({
      data: {
        name,
        description,
        category,
        image,
        members: {
          connect: allMemberIds.map((id) => ({ id })),
        },
      },
    });

    return group;
  }
  async findMany(
    userId: string,
    search: string,
    category: string,
  ): Promise<Group[]> {
    return this.prisma.group.findMany({
      where: {
        AND: [
          {
            members: {
              some: {
                id: userId,
              },
            },
          },
          {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          },
          ...(category ? [{ category: category }] : []),
        ],
      },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
