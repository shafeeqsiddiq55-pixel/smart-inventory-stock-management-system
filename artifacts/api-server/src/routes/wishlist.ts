import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, wishlistTable, productsTable, cartItemsTable } from "@workspace/db";
import { authenticate, type AuthRequest } from "../middlewares/authenticate";
import { buildCart } from "./cart";

const router: IRouter = Router();

// GET /wishlist
router.get("/wishlist", authenticate, async (req: AuthRequest, res): Promise<void> => {
  const items = await db
    .select({ w: wishlistTable, p: productsTable })
    .from(wishlistTable)
    .innerJoin(productsTable, eq(wishlistTable.productId, productsTable.id))
    .where(eq(wishlistTable.userId, req.userId!));
  res.json(items.map(({ w, p }) => ({
    id: w.id, productId: p.id, productName: p.name,
    productImage: p.imageUrl ?? null,
    price: parseFloat(String(p.price)),
    discountPrice: p.discountPrice ? parseFloat(String(p.discountPrice)) : null,
    stock: p.stock,
  })));
});

// POST /wishlist/:productId
router.post("/wishlist/:productId", authenticate, async (req: AuthRequest, res): Promise<void> => {
  const productId = parseInt(Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId, 10);
  const existing = await db.select().from(wishlistTable)
    .where(and(eq(wishlistTable.userId, req.userId!), eq(wishlistTable.productId, productId)));
  if (!existing.length) {
    await db.insert(wishlistTable).values({ userId: req.userId!, productId }).onConflictDoNothing();
  }
  res.json({ message: "Added to wishlist" });
});

// DELETE /wishlist/:productId
router.delete("/wishlist/:productId", authenticate, async (req: AuthRequest, res): Promise<void> => {
  const productId = parseInt(Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId, 10);
  await db.delete(wishlistTable)
    .where(and(eq(wishlistTable.userId, req.userId!), eq(wishlistTable.productId, productId)));
  res.json({ message: "Removed from wishlist" });
});

// POST /wishlist/:productId/move-to-cart
router.post("/wishlist/:productId/move-to-cart", authenticate, async (req: AuthRequest, res): Promise<void> => {
  const productId = parseInt(Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId, 10);
  await db.delete(wishlistTable)
    .where(and(eq(wishlistTable.userId, req.userId!), eq(wishlistTable.productId, productId)));
  const existing = await db.select().from(cartItemsTable)
    .where(and(eq(cartItemsTable.userId, req.userId!), eq(cartItemsTable.productId, productId)));
  if (!existing.length) {
    await db.insert(cartItemsTable).values({ userId: req.userId!, productId, quantity: 1 });
  }
  res.json(await buildCart(req.userId!));
});

export default router;
