import { getAllNotifications } from "../services/adminNotificationService.js"

export const listNotifications = async (req, res) => {
  const notifications = await getAllNotifications()
  res.json({ notifications })
}
