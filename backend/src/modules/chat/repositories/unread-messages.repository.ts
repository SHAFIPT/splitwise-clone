export interface UnreadMessagesRepository {
  createUnread(
    userId: string,
    messageId: string,
    groupId: string,
  ): Promise<void>;
  deleteUnread(userId: string, groupId: string): Promise<void>;
  countUnread(userId: string, groupId: string): Promise<number>;
  getUserIdsInGroup(groupId: string): Promise<string[]>;
}
