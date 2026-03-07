import type { Response } from "express";

interface Client {
  userId: string;
  res: Response;
  keepAlive: NodeJS.Timeout;
}

const clientsByUser = new Map<string, Set<Client>>();

type NotificationPayload = Record<string, unknown>;

const writeEvent = (res: Response, payload: NotificationPayload) => {
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
};

export const addNotificationClient = (userId: string, res: Response) => {
  res.status(200);
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  res.flushHeaders?.();

  const keepAlive = setInterval(() => {
    res.write("event: ping\n");
    res.write("data: {}\n\n");
  }, 25000);

  const client: Client = { userId, res, keepAlive };
  const current = clientsByUser.get(userId) ?? new Set<Client>();
  current.add(client);
  clientsByUser.set(userId, current);

  const onClose = () => {
    clearInterval(keepAlive);
    const set = clientsByUser.get(userId);
    if (set) {
      set.delete(client);
      if (set.size === 0) {
        clientsByUser.delete(userId);
      }
    }
  };

  res.on("close", onClose);

  writeEvent(res, { type: "ready" });
};

export const pushNotificationToUser = (
  userId: string,
  payload: NotificationPayload,
) => {
  const clients = clientsByUser.get(userId);
  if (!clients || clients.size === 0) {
    return;
  }

  clients.forEach((client) => {
    writeEvent(client.res, payload);
  });
};

export const pushNotificationToUsers = (
  userIds: string[],
  payloads: NotificationPayload[],
) => {
  userIds.forEach((userId, index) => {
    const payload = payloads[index] ?? payloads[0]!;
    pushNotificationToUser(userId, payload);
  });
};
