/** Notification service. */
import { getProvider } from "@/lib/data/providers";
import type { ID } from "@/types";

const db = () => getProvider();

export const notificationService = {
  listByUser: (userId: ID) => db().notifications.listByUser(userId),
  async unreadCount(userId: ID): Promise<number> {
    const items = await db().notifications.listByUser(userId);
    return items.filter((n) => !n.read).length;
  },
  markRead: (id: ID) => db().notifications.markRead(id),
};
