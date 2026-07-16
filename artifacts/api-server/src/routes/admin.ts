import { Router, type IRouter } from "express";
import { eq, sql, gte, and } from "drizzle-orm";
import { db, usersTable, productsTable, ordersTable, orderItemsTable, categoriesTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/authenticate";

const router: IRouter = Router();

// GET /admin/dashboard/stats
router.get("/admin/dashboard/stats", requireAdmin, async (_req, res): Promise<void> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [[{ totalProducts }], [{ totalCustomers }], [{ totalOrders }], [{ pendingOrders }], [{ deliveredOrders }], [{ totalRevenue }], [{ lowStockProducts }], [{ outOfStockProducts }], [{ newOrdersToday }], [{ revenueToday }]] = await Promise.all([
    db.select({ totalProducts: sql<number>`count(*)::int` }).from(productsTable),
    db.select({ totalCustomers: sql<number>`count(*)::int` }).from(usersTable).where(eq(usersTable.role, "customer")),
    db.select({ totalOrders: sql<number>`count(*)::int` }).from(ordersTable),
    db.select({ pendingOrders: sql<number>`count(*)::int` }).from(ordersTable).where(eq(ordersTable.status, "pending")),
    db.select({ deliveredOrders: sql<number>`count(*)::int` }).from(ordersTable).where(eq(ordersTable.status, "delivered")),
    db.select({ totalRevenue: sql<number>`coalesce(sum(total::numeric), 0)::numeric` }).from(ordersTable).where(sql`${ordersTable.status} != 'cancelled'`),
    db.select({ lowStockProducts: sql<number>`count(*)::int` }).from(productsTable).where(and(gte(productsTable.stock, 1), sql`${productsTable.stock} <= 10`)),
    db.select({ outOfStockProducts: sql<number>`count(*)::int` }).from(productsTable).where(eq(productsTable.stock, 0)),
    db.select({ newOrdersToday: sql<number>`count(*)::int` }).from(ordersTable).where(gte(ordersTable.createdAt, today)),
    db.select({ revenueToday: sql<number>`coalesce(sum(total::numeric), 0)::numeric` }).from(ordersTable).where(and(gte(ordersTable.createdAt, today), sql`${ordersTable.status} != 'cancelled'`)),
  ]);

  res.json({
    totalProducts: totalProducts ?? 0,
    totalCustomers: totalCustomers ?? 0,
    totalOrders: totalOrders ?? 0,
    pendingOrders: pendingOrders ?? 0,
    deliveredOrders: deliveredOrders ?? 0,
    totalRevenue: parseFloat(String(totalRevenue ?? 0)),
    lowStockProducts: lowStockProducts ?? 0,
    outOfStockProducts: outOfStockProducts ?? 0,
    newOrdersToday: newOrdersToday ?? 0,
    revenueToday: parseFloat(String(revenueToday ?? 0)),
  });
});

// GET /admin/dashboard/sales-chart
router.get("/admin/dashboard/sales-chart", requireAdmin, async (req, res): Promise<void> => {
  const year = parseInt(String(req.query.year ?? new Date().getFullYear()), 10);
  const rows = await db
    .select({
      month: sql<string>`to_char(${ordersTable.createdAt}, 'Mon')`,
      monthNum: sql<number>`extract(month from ${ordersTable.createdAt})::int`,
      orders: sql<number>`count(*)::int`,
      revenue: sql<number>`coalesce(sum(${ordersTable.total}::numeric), 0)::numeric`,
    })
    .from(ordersTable)
    .where(and(sql`extract(year from ${ordersTable.createdAt}) = ${year}`, sql`${ordersTable.status} != 'cancelled'`))
    .groupBy(sql`to_char(${ordersTable.createdAt}, 'Mon')`, sql`extract(month from ${ordersTable.createdAt})`)
    .orderBy(sql`extract(month from ${ordersTable.createdAt})`);

  res.json(rows.map(r => ({ month: r.month, orders: r.orders ?? 0, revenue: parseFloat(String(r.revenue ?? 0)) })));
});

// GET /admin/dashboard/top-products
router.get("/admin/dashboard/top-products", requireAdmin, async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      productId: productsTable.id,
      productName: productsTable.name,
      imageUrl: productsTable.imageUrl,
      totalSold: sql<number>`coalesce(sum(${orderItemsTable.quantity}), 0)::int`,
      revenue: sql<number>`coalesce(sum(${orderItemsTable.quantity} * ${orderItemsTable.price}::numeric), 0)::numeric`,
    })
    .from(productsTable)
    .leftJoin(orderItemsTable, eq(orderItemsTable.productId, productsTable.id))
    .groupBy(productsTable.id, productsTable.name, productsTable.imageUrl)
    .orderBy(sql`coalesce(sum(${orderItemsTable.quantity}), 0) desc`)
    .limit(5);

  res.json(rows.map(r => ({
    productId: r.productId, productName: r.productName, imageUrl: r.imageUrl ?? null,
    totalSold: r.totalSold ?? 0, revenue: parseFloat(String(r.revenue ?? 0)),
  })));
});

// GET /admin/customers
router.get("/admin/customers", requireAdmin, async (req, res): Promise<void> => {
  const { search, status } = req.query;
  const allUsers = await db.select().from(usersTable).where(eq(usersTable.role, "customer"))
    .orderBy(usersTable.createdAt);
  let filtered = allUsers;
  if (search) {
    const s = String(search).toLowerCase();
    filtered = filtered.filter(u => u.fullName.toLowerCase().includes(s) || u.email.toLowerCase().includes(s));
  }
  if (status) filtered = filtered.filter(u => u.status === status);
  res.json(filtered.map(u => ({
    id: u.id, fullName: u.fullName, email: u.email, phone: u.phone, address: u.address,
    role: u.role, status: u.status, createdAt: u.createdAt,
  })));
});

// PATCH /admin/customers/:id/status
router.patch("/admin/customers/:id/status", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const { status } = req.body;
  const [user] = await db.update(usersTable).set({ status }).where(eq(usersTable.id, id)).returning();
  if (!user) { res.status(404).json({ error: "User not found" }); return; }
  res.json({ id: user.id, fullName: user.fullName, email: user.email, phone: user.phone, address: user.address, role: user.role, status: user.status, createdAt: user.createdAt });
});

// GET /admin/inventory
router.get("/admin/inventory", requireAdmin, async (_req, res): Promise<void> => {
  const items = await db
    .select({ p: productsTable, categoryName: categoriesTable.name })
    .from(productsTable)
    .innerJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .orderBy(productsTable.stock);
  res.json(items.map(({ p, categoryName }) => ({
    productId: p.id, productName: p.name, categoryName,
    stock: p.stock, price: parseFloat(String(p.price)),
    status: p.stock === 0 ? "out_of_stock" : p.stock <= 10 ? "low_stock" : "in_stock",
  })));
});

// PATCH /admin/inventory/:productId
router.patch("/admin/inventory/:productId", requireAdmin, async (req, res): Promise<void> => {
  const productId = parseInt(Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId, 10);
  const { stock } = req.body;
  const [p] = await db.update(productsTable).set({ stock: parseInt(String(stock), 10) })
    .where(eq(productsTable.id, productId)).returning();
  if (!p) { res.status(404).json({ error: "Product not found" }); return; }
  const [{ categoryName }] = await db.select({ categoryName: categoriesTable.name }).from(categoriesTable).where(eq(categoriesTable.id, p.categoryId));
  res.json({
    productId: p.id, productName: p.name, categoryName,
    stock: p.stock, price: parseFloat(String(p.price)),
    status: p.stock === 0 ? "out_of_stock" : p.stock <= 10 ? "low_stock" : "in_stock",
  });
});

export default router;
