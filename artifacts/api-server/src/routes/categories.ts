import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, categoriesTable, productsTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/authenticate";

const router: IRouter = Router();

function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

// GET /categories
router.get("/categories", async (_req, res): Promise<void> => {
  const cats = await db.select().from(categoriesTable).orderBy(categoriesTable.name);
  const withCounts = await Promise.all(cats.map(async (c) => {
    const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(productsTable).where(eq(productsTable.categoryId, c.id));
    return { ...c, productCount: count ?? 0 };
  }));
  res.json(withCounts);
});

// POST /categories
router.post("/categories", requireAdmin, async (req, res): Promise<void> => {
  const { name, description, imageUrl } = req.body;
  if (!name) { res.status(400).json({ error: "Name is required" }); return; }
  const slug = toSlug(name);
  const [cat] = await db.insert(categoriesTable).values({ name, slug, description, imageUrl }).returning();
  res.status(201).json({ ...cat, productCount: 0 });
});

// GET /categories/:id
router.get("/categories/:id", async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const [cat] = await db.select().from(categoriesTable).where(eq(categoriesTable.id, id));
  if (!cat) { res.status(404).json({ error: "Category not found" }); return; }
  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(productsTable).where(eq(productsTable.categoryId, id));
  res.json({ ...cat, productCount: count ?? 0 });
});

// PATCH /categories/:id
router.patch("/categories/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  const { name, description, imageUrl } = req.body;
  const updates: Record<string, string | undefined> = {};
  if (name) { updates.name = name; updates.slug = toSlug(name); }
  if (description !== undefined) updates.description = description;
  if (imageUrl !== undefined) updates.imageUrl = imageUrl;
  const [cat] = await db.update(categoriesTable).set(updates).where(eq(categoriesTable.id, id)).returning();
  if (!cat) { res.status(404).json({ error: "Category not found" }); return; }
  const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(productsTable).where(eq(productsTable.categoryId, id));
  res.json({ ...cat, productCount: count ?? 0 });
});

// DELETE /categories/:id
router.delete("/categories/:id", requireAdmin, async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id, 10);
  await db.delete(categoriesTable).where(eq(categoriesTable.id, id));
  res.sendStatus(204);
});

export default router;
