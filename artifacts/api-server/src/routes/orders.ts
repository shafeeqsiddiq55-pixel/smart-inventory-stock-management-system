import { Router, type IRouter } from "express";
import { eq, and, sql } from "drizzle-orm";
import { db, ordersTable, orderItemsTable, cartItemsTable, productsTable, usersTable } from "@workspace/db";
import { authenticate, requireAdmin, type AuthRequest } from "../middlewares/authenticate";
import { buildCart } from "./cart";

const router: IRouter = Router();

async function buildOrderResponse(order: typeof ordersTable.$inferSelect & { customerName?: string; customerEmail?: string }) {
  const items = await db
    .select({ oi: orderItemsTable, p: productsTable })
    .from(orderItemsTable)
    .innerJoin(productsTable, eq(orderItemsTable.productId, productsTable.id))
    .where(eq(orderItemsTable.orderId, order.id));
  return {
    id: order.id, userId: order.userId,
    customerName: order.customerName ?? null,
    customerEmail: order.customerEmail ?? null,
    status: order.status, deliveryAddress: order.deliveryAddress,
    phone: order.phone, paymentMethod: order.paymentMethod,
    subtotal: parseFloat(String(order.subtotal)),
    discount: parseFloat(String(order.discount)),
    deliveryCharge: parseFloat(String(order.deliveryCharge)),
    total: parseFloat(String(order.total)),
    couponCode: order.couponCode ?? null,
    estimatedDelivery: order.estimatedDelivery ?? null,
    createdAt: order.createdAt,
    items: items.map(({ oi, p }) => ({
      id: oi.id, productId: p.id, productName: p.name,
      productImage: p.imageUrl ?? null,
      quantity: oi.quantity, price: parseFloat(String(oi.price)),
      weightOption: oi.weightOption ?? null,
      subtotal: parseFloat(String(oi.price)) * oi.quantity,
    })),
  };
}

// GET /orders
router.get("/orders", authenticate, async (req: AuthRequest, res): Promise<void> => {
  const { status } = req.query;
  let q = db.select().from(ordersTable).where(eq(ordersTable.userId, req.userId!));
  const orders = await q.orderBy(sql`${ordersTable.createdAt} desc`);
  const filtered = status ? orders.filter(o => o.status === status) : orders;
  const result = await Promise.all(filtered.map(o => buildOrderResponse(o)));
  res.json(result);
});

// POST /orders
router.post("/orders", authenticate, async (req: AuthRequest, res): Promise<void> => {
  const { deliveryAddress, phone, paymentMethod, couponCode } = req.body;
  if (!deliveryAddress || !phone || !paymentMethod) {
    res.status(400).json({ error: "deliveryAddress, phone, paymentMethod required" });
    return;
  }
  const cart = await buildCart(req.userId!, couponCode);
  if (cart.items.length === 0) {
    res.status(400).json({ error: "Cart is empty" });
    return;
  }
  const estimated = new Date();
  estimated.setDate(estimated.getDate() + 3);
  const [order] = await db.insert(ordersTable).values({
    userId: req.userId!,
    status: "pending",
    deliveryAddress, phone,
    paymentMethod: paymentMethod as "cash_on_delivery" | "upi" | "debit_card" | "credit_card",
    subtotal: String(cart.subtotal),
    discount: String(cart.discount),
    deliveryCharge: String(cart.deliveryCharge),
    total: String(cart.total),
    couponCode: cart.couponCode ?? undefined,
    estimatedDelivery: estimated.toDateString(),
  }).returning();

  await Promise.all(cart.items.map(item =>
    db.insert(orderItemsTable).values({
      orderId: order.id, productId: item.productId,
      quantity: item.quantity,
      price: String(item.discountPrice ?? item.price),
      weightOption: item.weightOption ?? undefined,
    })
  ));

  // Update sales count and clear cart
  await Promise.all([
    ...cart.items.map(item =>
      db.update(productsTable)
        .set({ salesCount: sql`${productsTable.salesCount} + ${item.quantity}` })
        .where(eq(productsTable.id, item.productId))
    ),
    db.delete(cartItemsTable).where(eq(cartItemsTable.userId, req.userId!)),
  ]);

  res.status(201).json(await buildOrderResponse(order));
});

// GET /orders/:id
router.get("/orders/:id", authenticate, async (req: AuthRequest, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const [order] = await db.select().from(ordersTable)
    .where(and(eq(ordersTable.id, id), eq(ordersTable.userId, req.userId!)));
  if (!order) { res.status(404).json({ error: "Order not found" }); return; }
  res.json(await buildOrderResponse(order));
});

// POST /orders/:id/cancel
router.post("/orders/:id/cancel", authenticate, async (req: AuthRequest, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const [order] = await db.select().from(ordersTable)
    .where(and(eq(ordersTable.id, id), eq(ordersTable.userId, req.userId!)));
  if (!order) { res.status(404).json({ error: "Order not found" }); return; }
  if (!["pending", "confirmed"].includes(order.status)) {
    res.status(400).json({ error: "Order cannot be cancelled at this stage" });
    return;
  }
  const [updated] = await db.update(ordersTable).set({ status: "cancelled" }).where(eq(ordersTable.id, id)).returning();
  res.json(await buildOrderResponse(updated));
});

// ── ADMIN ─────────────────────────────────────────────────────────────
// GET /admin/orders
router.get("/admin/orders", requireAdmin, async (req, res): Promise<void> => {
  const { status } = req.query;
  const allOrders = await db
    .select({ o: ordersTable, fullName: usersTable.fullName, email: usersTable.email })
    .from(ordersTable)
    .innerJoin(usersTable, eq(ordersTable.userId, usersTable.id))
    .orderBy(sql`${ordersTable.createdAt} desc`);
  const filtered = status ? allOrders.filter(r => r.o.status === status) : allOrders;
  const result = await Promise.all(filtered.map(({ o, fullName, email }) =>
    buildOrderResponse({ ...o, customerName: fullName, customerEmail: email })
  ));
  res.json(result);
});

// PATCH /admin/orders/:id/status
router.patch("/admin/orders/:id/status", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const { status } = req.body;
  if (!status) { res.status(400).json({ error: "Status required" }); return; }
  const [order] = await db.update(ordersTable).set({ status }).where(eq(ordersTable.id, id)).returning();
  if (!order) { res.status(404).json({ error: "Order not found" }); return; }
  const [{ fullName, email }] = await db.select({ fullName: usersTable.fullName, email: usersTable.email })
    .from(usersTable).where(eq(usersTable.id, order.userId));
  res.json(await buildOrderResponse({ ...order, customerName: fullName, customerEmail: email }));
});

export default router;
