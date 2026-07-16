import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, couponsTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/authenticate";

const router: IRouter = Router();

// GET /coupons
router.get("/coupons", requireAdmin, async (_req, res): Promise<void> => {
  const coupons = await db.select().from(couponsTable).orderBy(couponsTable.createdAt);
  res.json(coupons.map(c => ({
    ...c,
    discountValue: parseFloat(String(c.discountValue)),
    minOrderAmount: parseFloat(String(c.minOrderAmount)),
  })));
});

// POST /coupons
router.post("/coupons", requireAdmin, async (req, res): Promise<void> => {
  const { code, discountType, discountValue, minOrderAmount, expiresAt } = req.body;
  if (!code || !discountType || !discountValue || !expiresAt) {
    res.status(400).json({ error: "All fields required" });
    return;
  }
  const [coupon] = await db.insert(couponsTable).values({
    code: String(code).toUpperCase(),
    discountType: discountType as "percentage" | "fixed",
    discountValue: String(discountValue),
    minOrderAmount: String(minOrderAmount ?? 0),
    expiresAt: new Date(expiresAt),
  }).returning();
  res.status(201).json({
    ...coupon,
    discountValue: parseFloat(String(coupon.discountValue)),
    minOrderAmount: parseFloat(String(coupon.minOrderAmount)),
  });
});

// DELETE /coupons/:id
router.delete("/coupons/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  await db.delete(couponsTable).where(eq(couponsTable.id, id));
  res.sendStatus(204);
});

export default router;
