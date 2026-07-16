import { Router, type IRouter } from "express";
import { eq, and, gte, lte, like, sql, desc, asc } from "drizzle-orm";
import { db, productsTable, categoriesTable, reviewsTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/authenticate";

const router: IRouter = Router();

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now();
}

async function getProductWithRating(productId: number) {
  const [{ avgRating, reviewCount }] = await db
    .select({
      avgRating: sql<number>`coalesce(avg(${reviewsTable.rating}), 0)::numeric(3,1)`,
      reviewCount: sql<number>`count(*)::int`,
    })
    .from(reviewsTable)
    .where(eq(reviewsTable.productId, productId));
  return { rating: parseFloat(String(avgRating ?? 0)), reviewCount: reviewCount ?? 0 };
}

async function buildProductResponse(p: typeof productsTable.$inferSelect & { categoryName?: string }) {
  const { rating, reviewCount } = await getProductWithRating(p.id);
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    categoryId: p.categoryId,
    categoryName: p.categoryName ?? "",
    description: p.description ?? null,
    price: parseFloat(String(p.price)),
    discountPrice: p.discountPrice ? parseFloat(String(p.discountPrice)) : null,
    stock: p.stock,
    imageUrl: p.imageUrl ?? null,
    rating,
    reviewCount,
    isFeatured: p.isFeatured,
    isOrganic: p.isOrganic,
    weightOptions: p.weightOptions ?? null,
    createdAt: p.createdAt,
  };
}

// GET /products/featured  (must come before /products/:id)
router.get("/products/featured", async (_req, res): Promise<void> => {
  const products = await db
    .select({ p: productsTable, categoryName: categoriesTable.name })
    .from(productsTable)
    .innerJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.isFeatured, true))
    .orderBy(desc(productsTable.createdAt))
    .limit(8);
  const result = await Promise.all(products.map(({ p, categoryName }) => buildProductResponse({ ...p, categoryName })));
  res.json(result);
});

// GET /products/bestsellers
router.get("/products/bestsellers", async (_req, res): Promise<void> => {
  const products = await db
    .select({ p: productsTable, categoryName: categoriesTable.name })
    .from(productsTable)
    .innerJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(gte(productsTable.stock, 1))
    .orderBy(desc(productsTable.salesCount))
    .limit(8);
  const result = await Promise.all(products.map(({ p, categoryName }) => buildProductResponse({ ...p, categoryName })));
  res.json(result);
});

// GET /products
router.get("/products", async (req, res): Promise<void> => {
  const { categoryId, search, minPrice, maxPrice, featured, organic, inStock, sortBy, page, limit } = req.query;
  const conditions = [];
  if (categoryId) conditions.push(eq(productsTable.categoryId, parseInt(String(categoryId), 10)));
  if (search) conditions.push(like(productsTable.name, `%${String(search)}%`));
  if (minPrice) conditions.push(gte(productsTable.price, String(minPrice)));
  if (maxPrice) conditions.push(lte(productsTable.price, String(maxPrice)));
  if (featured === "true") conditions.push(eq(productsTable.isFeatured, true));
  if (organic === "true") conditions.push(eq(productsTable.isOrganic, true));
  if (inStock === "true") conditions.push(gte(productsTable.stock, 1));

  const pageNum = parseInt(String(page ?? "1"), 10);
  const limitNum = parseInt(String(limit ?? "12"), 10);
  const offset = (pageNum - 1) * limitNum;

  let orderBy: ReturnType<typeof asc | typeof desc> = desc(productsTable.createdAt);
  if (sortBy === "price") orderBy = asc(productsTable.price);
  else if (sortBy === "name") orderBy = asc(productsTable.name);
  else if (sortBy === "rating") orderBy = desc(productsTable.salesCount);
  else if (sortBy === "bestseller") orderBy = desc(productsTable.salesCount);

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [{ total }] = await db.select({ total: sql<number>`count(*)::int` }).from(productsTable).where(where);
  const products = await db
    .select({ p: productsTable, categoryName: categoriesTable.name })
    .from(productsTable)
    .innerJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(where)
    .orderBy(orderBy)
    .limit(limitNum)
    .offset(offset);

  const result = await Promise.all(products.map(({ p, categoryName }) => buildProductResponse({ ...p, categoryName })));
  res.json({ products: result, total: total ?? 0, page: pageNum, limit: limitNum });
});

// POST /products
router.post("/products", requireAdmin, async (req, res): Promise<void> => {
  const { name, categoryId, description, price, discountPrice, stock, imageUrl, isFeatured, isOrganic, weightOptions, nutritionInfo, healthBenefits } = req.body;
  if (!name || !categoryId || !price) { res.status(400).json({ error: "name, categoryId, price required" }); return; }
  const slug = toSlug(name);
  const [p] = await db.insert(productsTable).values({
    name, slug, categoryId: parseInt(String(categoryId), 10),
    description, price: String(price),
    discountPrice: discountPrice ? String(discountPrice) : undefined,
    stock: parseInt(String(stock ?? 0), 10), imageUrl,
    isFeatured: Boolean(isFeatured), isOrganic: Boolean(isOrganic),
    weightOptions, nutritionInfo, healthBenefits,
  }).returning();
  const [{ categoryName }] = await db.select({ categoryName: categoriesTable.name }).from(categoriesTable).where(eq(categoriesTable.id, p.categoryId));
  res.status(201).json(await buildProductResponse({ ...p, categoryName }));
});

// GET /products/:id
router.get("/products/:id", async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const rows = await db
    .select({ p: productsTable, categoryName: categoriesTable.name })
    .from(productsTable)
    .innerJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.id, id));
  if (!rows.length) { res.status(404).json({ error: "Product not found" }); return; }
  const { p, categoryName } = rows[0];

  const reviews = await db
    .select({ r: reviewsTable, userName: sql<string>`u.full_name` })
    .from(reviewsTable)
    .innerJoin(sql`users u`, sql`u.id = ${reviewsTable.userId}`)
    .where(eq(reviewsTable.productId, id))
    .orderBy(desc(reviewsTable.createdAt))
    .limit(10);

  const { rating, reviewCount } = await getProductWithRating(id);
  res.json({
    id: p.id, name: p.name, slug: p.slug, categoryId: p.categoryId, categoryName,
    description: p.description ?? null,
    price: parseFloat(String(p.price)),
    discountPrice: p.discountPrice ? parseFloat(String(p.discountPrice)) : null,
    stock: p.stock, imageUrl: p.imageUrl ?? null, rating, reviewCount,
    isFeatured: p.isFeatured, isOrganic: p.isOrganic,
    weightOptions: p.weightOptions ?? null, nutritionInfo: p.nutritionInfo ?? null,
    healthBenefits: p.healthBenefits ?? null, createdAt: p.createdAt,
    reviews: reviews.map(({ r, userName }) => ({
      id: r.id, productId: r.productId, userId: r.userId, userName,
      rating: r.rating, comment: r.comment, createdAt: r.createdAt,
    })),
  });
});

// PATCH /products/:id
router.patch("/products/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const updates: Record<string, string | number | boolean | null | undefined> = {};
  const fields = ["name","categoryId","description","price","discountPrice","stock","imageUrl","isFeatured","isOrganic","weightOptions","nutritionInfo","healthBenefits"];
  for (const f of fields) {
    if (req.body[f] !== undefined) {
      if (f === "price" || f === "discountPrice") updates[f] = req.body[f] !== null ? String(req.body[f]) : null;
      else if (f === "stock" || f === "categoryId") updates[f] = parseInt(String(req.body[f]), 10);
      else if (f === "isFeatured" || f === "isOrganic") updates[f] = Boolean(req.body[f]);
      else updates[f] = req.body[f];
    }
  }
  const [p] = await db.update(productsTable).set(updates).where(eq(productsTable.id, id)).returning();
  if (!p) { res.status(404).json({ error: "Product not found" }); return; }
  const [{ categoryName }] = await db.select({ categoryName: categoriesTable.name }).from(categoriesTable).where(eq(categoriesTable.id, p.categoryId));
  res.json(await buildProductResponse({ ...p, categoryName }));
});

// DELETE /products/:id
router.delete("/products/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  await db.delete(productsTable).where(eq(productsTable.id, id));
  res.sendStatus(204);
});

// GET /products/:id/related
router.get("/products/:id/related", async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const [prod] = await db.select().from(productsTable).where(eq(productsTable.id, id));
  if (!prod) { res.json([]); return; }
  const related = await db
    .select({ p: productsTable, categoryName: categoriesTable.name })
    .from(productsTable)
    .innerJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(and(eq(productsTable.categoryId, prod.categoryId), sql`${productsTable.id} != ${id}`))
    .limit(4);
  const result = await Promise.all(related.map(({ p, categoryName }) => buildProductResponse({ ...p, categoryName })));
  res.json(result);
});

export default router;
