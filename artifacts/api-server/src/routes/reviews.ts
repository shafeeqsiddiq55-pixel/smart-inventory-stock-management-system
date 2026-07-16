import { Router, type IRouter } from "express";
import { eq, desc, sql } from "drizzle-orm";
import { db, reviewsTable, usersTable } from "@workspace/db";
import { authenticate, type AuthRequest } from "../middlewares/authenticate";

const router: IRouter = Router();

// GET /products/:id/reviews
router.get("/products/:id/reviews", async (req, res): Promise<void> => {
  const productId = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const reviews = await db
    .select({ r: reviewsTable, userName: usersTable.fullName })
    .from(reviewsTable)
    .innerJoin(usersTable, eq(reviewsTable.userId, usersTable.id))
    .where(eq(reviewsTable.productId, productId))
    .orderBy(desc(reviewsTable.createdAt));
  res.json(reviews.map(({ r, userName }) => ({
    id: r.id, productId: r.productId, userId: r.userId, userName,
    rating: r.rating, comment: r.comment, createdAt: r.createdAt,
  })));
});

// POST /products/:id/reviews
router.post("/products/:id/reviews", authenticate, async (req: AuthRequest, res): Promise<void> => {
  const productId = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const { rating, comment } = req.body;
  if (!rating || !comment) { res.status(400).json({ error: "Rating and comment required" }); return; }
  if (rating < 1 || rating > 5) { res.status(400).json({ error: "Rating must be 1-5" }); return; }
  const [review] = await db.insert(reviewsTable).values({
    productId, userId: req.userId!, rating: parseInt(String(rating), 10), comment,
  }).returning();
  const [user] = await db.select({ fullName: usersTable.fullName }).from(usersTable).where(eq(usersTable.id, req.userId!));
  res.status(201).json({
    id: review.id, productId: review.productId, userId: review.userId,
    userName: user.fullName, rating: review.rating, comment: review.comment, createdAt: review.createdAt,
  });
});

export default router;
