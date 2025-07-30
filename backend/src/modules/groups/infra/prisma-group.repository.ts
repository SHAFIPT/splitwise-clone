import { Injectable } from '@nestjs/common';
import { GroupRepository } from '../repository/group.repository';
import { CreateGroupDto } from '../dtos/create-group.dto';
import { Group, Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { UpdateGroupDto } from '../dtos/update-group.dto';
import { GroupWithMember } from '../dtos/find-group-by-id.dto';
import { InvitableGroupDto } from '../dtos/InvitableGroupDto';

@Injectable()
export class PrismaGroupRepository implements GroupRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateGroupDto): Promise<Group> {
    const { name, description, category, image, members, creatorId } = data;

    const uniqueMemberIds = Array.from(
      new Set(members.filter((id) => id !== creatorId)),
    );

    const group = await this.prisma.group.create({
      data: {
        name,
        description,
        category,
        image,
        createdBy: {
          connect: { id: creatorId },
        },
        members: {
          create: [
            {
              user: { connect: { id: creatorId } },
              role: 'admin',
            },
            ...uniqueMemberIds.map((id) => ({
              user: { connect: { id } },
              role: 'viewer',
            })),
          ],
        },
      },
      include: {
        members: true,
      },
    });

    return group;
  }
  async findMany(
    userId: string,
    search: string,
    category: string,
    page: number,
    limit: number,
  ): Promise<{ data: Group[]; total: number }> {
    const where: Prisma.GroupWhereInput = {
      AND: [
        {
          members: {
            some: {
              userId: userId,
            },
          },
        },
        {
          OR: [
            { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
            {
              description: {
                contains: search,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        },
        ...(category ? [{ category }] : []),
      ],
    };

    const [data, total] = await Promise.all([
      this.prisma.group.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          updatedAt: 'desc',
        },
        include: {
          members: {
            select: {
              id: true,
              role: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.group.count({ where }),
    ]);
    return { data, total };
  }

  async findById(id: string) {
    const group: GroupWithMember | null = await this.prisma.group.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        image: true,
        createdById: true,
        updatedAt: true,
        members: {
          select: {
            id: true,
            role: true,
            userId: true,
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!group) return null;

    return {
      id: group.id,
      name: group.name,
      image: group.image,
      updatedAt: (group.updatedAt as Date)?.toISOString() || null,
      members: group.members.map((member) => ({
        id: member.user.id,
        name: member.user.name,
        avatarUrl: member.user.avatarUrl,
        role: member.role,
      })),
    };
  }
  async update(groupId: string, data: UpdateGroupDto): Promise<void> {
    const { name, description, category, image, members } = data;

    await this.prisma.$transaction(async (tx) => {
      await tx.group.update({
        where: { id: groupId },
        data: {
          name,
          description,
          category,
          image,
          updatedAt: new Date(),
        },
      });
      if (members && Array.isArray(members)) {
        const currentGroup = await tx.group.findUnique({
          where: { id: groupId },
          include: {
            members: {
              select: {
                userId: true,
                role: true,
              },
            },
          },
        });
        const currentAdmins =
          currentGroup?.members
            .filter((m) => m.role === 'admin')
            .map((m) => m.userId) || [];
        await tx.groupMember.deleteMany({
          where: { groupId },
        });

        const membersToCreate = members
          .map((m) => {
            const userId = m.userId || (m.user ? m.user.id : m.id);
            return userId
              ? {
                  groupId,
                  userId,
                  role: currentAdmins.includes(userId)
                    ? 'admin'
                    : m.role || 'viewer',
                }
              : null;
          })
          .filter(
            (
              member,
            ): member is { groupId: string; userId: string; role: string } =>
              member !== null,
          );

        if (membersToCreate.length > 0) {
          await tx.groupMember.createMany({
            data: membersToCreate,
          });
        }
      }
    });
  }

  async delete(groupId: string): Promise<boolean> {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) return false;

    await this.prisma.$transaction([
      this.prisma.groupMember.deleteMany({ where: { groupId } }),
      this.prisma.group.delete({ where: { id: groupId } }),
    ]);

    return true;
  }
  async findLatestInviteTokenRecord(groupId: string) {
    return await this.prisma.groupInviteToken.findFirst({
      where: {
        groupId,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  async addMembers(
    groupId: string,
    members: { id: string; role: string }[],
  ): Promise<void> {
    await this.prisma.groupMember.createMany({
      data: members.map((m) => ({
        groupId,
        userId: m.id,
        role: m.role,
      })),
      skipDuplicates: true,
    });
  }
  async findGroupByInviteToken(
    token: string,
  ): Promise<InvitableGroupDto | null> {
    const inviteRecord = await this.prisma.groupInviteToken.findFirst({
      where: {
        token,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        group: {
          select: {
            id: true,
            name: true,
            image: true,
            description: true,
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
            members: {
              select: {
                role: true,
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!inviteRecord || !inviteRecord.group) return null;

    const group = inviteRecord.group;

    return {
      id: group.id,
      name: group.name,
      image: group.image || undefined,
      description: group.description || undefined,
      expiresAt: inviteRecord.expiresAt,
      createdBy: {
        id: group.createdBy!.id,
        name: group.createdBy!.name,
        email: group.createdBy!.email,
        avatarUrl: group.createdBy!.avatarUrl || undefined,
      },
      members: group.members.map((member) => ({
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        avatarUrl: member.user.avatarUrl || undefined,
        role: member.role,
      })),
    };
  }
  async joinGroupWithInvite(
    groupId: string,
    userId: string,
    token: string,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // First, verify the token is still valid and get the tokenId
      const inviteToken = await tx.groupInviteToken.findFirst({
        where: {
          token,
          groupId,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (!inviteToken) {
        throw new Error('Invalid or expired invite token');
      }

      // Check if user is already a member (double-check in transaction)
      const existingMember = await tx.groupMember.findFirst({
        where: {
          groupId,
          userId,
        },
      });

      if (existingMember) {
        throw new Error('User is already a member of this group');
      }

      // Add user as group member with viewer role
      await tx.groupMember.create({
        data: {
          groupId,
          userId,
          role: 'viewer',
        },
      });

      // Record the invite usage
      await tx.inviteUsage.create({
        data: {
          userId,
          tokenId: inviteToken.id,
        },
      });
    });
  }
}
