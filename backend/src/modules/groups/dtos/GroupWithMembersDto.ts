export interface GroupWithMembersDto {
  id: string;
  name: string;
  image: string;
  updatedAt: string | null;
  members: {
    id: string;
    name: string;
    avatarUrl: string | null;
    role: string;
  }[];
}
