export interface InvitableGroupDto {
  id: string;
  name: string;
  image?: string;
  description?: string;
  expiresAt: Date;
  createdBy: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
  };
  members: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    role: string;
  }[];
}
