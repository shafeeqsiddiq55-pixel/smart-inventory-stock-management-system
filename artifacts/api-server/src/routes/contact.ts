import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, contactMessagesTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/authenticate";

const router: IRouter = Router();

// POST /contact
router.post("/contact", async (req, res): Promise<void> => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    res.status(400).json({ error: "All fields required" });
    return;
  }
  await db.insert(contactMessagesTable).values({ name, email, subject, message });
  res.status(201).json({ message: "Message sent successfully" });
});

// GET /admin/messages
router.get("/admin/messages", requireAdmin, async (_req, res): Promise<void> => {
  const messages = await db.select().from(contactMessagesTable)
    .orderBy(contactMessagesTable.createdAt);
  res.json(messages);
});

// DELETE /admin/messages/:id
router.delete("/admin/messages/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  await db.delete(contactMessagesTable).where(eq(contactMessagesTable.id, id));
  res.sendStatus(204);
});

export default router;
