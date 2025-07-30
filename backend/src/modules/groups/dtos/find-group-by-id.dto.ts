import { Prisma } from '@prisma/client';

export type GroupWithMembers = {
  id: string;
  name: string;
  image: string;
  members: {
    id: string;
    name: string;
    avatarUrl: string | null;
  }[];
};

export type GroupWithMember = Prisma.GroupGetPayload<{
  select: {
    id: true;
    name: true;
    image: true;
    updatedAt: true;
    createdById: true;
    members: {
      select: {
        id: true;
        role: true;
        userId: true;
        user: {
          select: {
            id: true;
            name: true;
            avatarUrl: true;
          };
        };
      };
    };
  };
}>;
