import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, cartItemsTable, productsTable, couponsTable } from "@workspace/db";
import { authenticate, type AuthRequest } from "../middlewares/authenticate";

const router: IRouter = Router();

const DELIVERY_CHARGE = 50;
const FREE_DELIVERY_THRESHOLD = 500;

async function buildCart(userId: number, couponCode?: string | null) {
  const items = await db
    .select({ ci: cartItemsTable, p: productsTable })
    .from(cartItemsTable)
    .innerJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
    .where(eq(cartItemsTable.userId, userId));

  const cartItems = items.map(({ ci, p }) => {
    const price = parseFloat(String(p.price));
    const discountPrice = p.discountPrice ? parseFloat(String(p.discountPrice)) : null;
    const unitPrice = discountPrice ?? price;
    return {
      id: ci.id, productId: p.id, productName: p.name,
      productImage: p.imageUrl ?? null,
      price, discountPrice, quantity: ci.quantity,
      weightOption: ci.weightOption ?? null,
      subtotal: unitPrice * ci.quantity,
    };
  });

  const subtotal = cartItems.reduce((s, i) => s + i.subtotal, 0);
  let discount = 0;

  if (couponCode) {
    const [coupon] = await db.select().from(couponsTable)
      .where(and(eq(couponsTable.code, couponCode), eq(couponsTable.isActive, true)));
    if (coupon && new Date(coupon.expiresAt) > new Date() && subtotal >= parseFloat(String(coupon.minOrderAmount))) {
      if (coupon.discountType === "percentage") {
        discount = subtotal * parseFloat(String(coupon.discountValue)) / 100;
      } else {
        discount = parseFloat(String(coupon.discountValue));
      }
    }
  }

  const afterDiscount = subtotal - discount;
  const deliveryCharge = afterDiscount >= FREE_DELIVERY_THRESHOLD ? 0 : cartItems.length > 0 ? DELIVERY_CHARGE : 0;
  const total = afterDiscount + deliveryCharge;

  return { items: cartItems, subtotal, discount, deliveryCharge, total, couponCode: couponCode ?? null };
}

// GET /cart
router.get("/cart", authenticate, async (req: AuthRequest, res): Promise<void> => {
  res.json(await buildCart(req.userId!));
});

// POST /cart/items
router.post("/cart/items", authenticate, async (req: AuthRequest, res): Promise<void> => {
  const { productId, quantity, weightOption } = req.body;
  if (!productId || !quantity) { res.status(400).json({ error: "productId and quantity required" }); return; }
  const existing = await db.select().from(cartItemsTable)
    .where(and(eq(cartItemsTable.userId, req.userId!), eq(cartItemsTable.productId, parseInt(String(productId), 10))));
  if (existing.length > 0) {
    await db.update(cartItemsTable).set({ quantity: existing[0].quantity + parseInt(String(quantity), 10) })
      .where(eq(cartItemsTable.id, existing[0].id));
  } else {
    await db.insert(cartItemsTable).values({
      userId: req.userId!, productId: parseInt(String(productId), 10),
      quantity: parseInt(String(quantity), 10), weightOption,
    });
  }
  res.json(await buildCart(req.userId!));
});

// PATCH /cart/items/:itemId
router.patch("/cart/items/:itemId", authenticate, async (req: AuthRequest, res): Promise<void> => {
  const itemId = parseInt(Array.isArray(req.params.itemId) ? req.params.itemId[0] : req.params.itemId, 10);
  const { quantity } = req.body;
  if (!quantity || quantity < 1) { res.status(400).json({ error: "Valid quantity required" }); return; }
  await db.update(cartItemsTable).set({ quantity: parseInt(String(quantity), 10) })
    .where(and(eq(cartItemsTable.id, itemId), eq(cartItemsTable.userId, req.userId!)));
  res.json(await buildCart(req.userId!));
});

// DELETE /cart/items/:itemId
router.delete("/cart/items/:itemId", authenticate, async (req: AuthRequest, res): Promise<void> => {
  const itemId = parseInt(Array.isArray(req.params.itemId) ? req.params.itemId[0] : req.params.itemId, 10);
  await db.delete(cartItemsTable)
    .where(and(eq(cartItemsTable.id, itemId), eq(cartItemsTable.userId, req.userId!)));
  res.json(await buildCart(req.userId!));
});

// DELETE /cart/clear
router.delete("/cart/clear", authenticate, async (req: AuthRequest, res): Promise<void> => {
  await db.delete(cartItemsTable).where(eq(cartItemsTable.userId, req.userId!));
  res.json(await buildCart(req.userId!));
});

// POST /cart/apply-coupon
router.post("/cart/apply-coupon", authenticate, async (req: AuthRequest, res): Promise<void> => {
  const { code } = req.body;
  if (!code) { res.status(400).json({ error: "Coupon code required" }); return; }
  const [coupon] = await db.select().from(couponsTable)
    .where(and(eq(couponsTable.code, String(code).toUpperCase()), eq(couponsTable.isActive, true)));
  if (!coupon || new Date(coupon.expiresAt) <= new Date()) {
    res.status(400).json({ error: "Invalid or expired coupon" });
    return;
  }
  res.json(await buildCart(req.userId!, String(code).toUpperCase()));
});

export { buildCart };
export default router;
