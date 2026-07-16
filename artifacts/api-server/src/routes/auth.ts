import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { signToken } from "../lib/auth";
import { authenticate, type AuthRequest } from "../middlewares/authenticate";

const router: IRouter = Router();

// POST /auth/register
router.post("/auth/register", async (req, res): Promise<void> => {
  const { fullName, email, password, phone, address } = req.body;
  if (!fullName || !email || !password || !phone || !address) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters" });
    return;
  }
  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (existing.length > 0) {
    res.status(400).json({ error: "Email already registered" });
    return;
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db.insert(usersTable).values({ fullName, email, phone, address, passwordHash, role: "customer" }).returning();
  const token = signToken({ userId: user.id, role: user.role });
  res.status(201).json({
    user: { id: user.id, fullName: user.fullName, email: user.email, phone: user.phone, address: user.address, role: user.role, status: user.status, createdAt: user.createdAt },
    token,
  });
});

// POST /auth/login
router.post("/auth/login", async (req, res): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password required" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (!user || user.role === "admin") {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  if (user.status === "blocked") {
    res.status(401).json({ error: "Account is blocked" });
    return;
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const token = signToken({ userId: user.id, role: user.role });
  res.json({
    user: { id: user.id, fullName: user.fullName, email: user.email, phone: user.phone, address: user.address, role: user.role, status: user.status, createdAt: user.createdAt },
    token,
  });
});

// POST /auth/logout
router.post("/auth/logout", (_req, res): void => {
  res.json({ message: "Logged out successfully" });
});

// GET /auth/me
router.get("/auth/me", authenticate, async (req: AuthRequest, res): Promise<void> => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!));
  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }
  res.json({ id: user.id, fullName: user.fullName, email: user.email, phone: user.phone, address: user.address, role: user.role, status: user.status, createdAt: user.createdAt });
});

// PATCH /auth/profile
router.patch("/auth/profile", authenticate, async (req: AuthRequest, res): Promise<void> => {
  const { fullName, phone, address } = req.body;
  const updates: Partial<{ fullName: string; phone: string; address: string }> = {};
  if (fullName) updates.fullName = fullName;
  if (phone) updates.phone = phone;
  if (address) updates.address = address;
  const [user] = await db.update(usersTable).set(updates).where(eq(usersTable.id, req.userId!)).returning();
  res.json({ id: user.id, fullName: user.fullName, email: user.email, phone: user.phone, address: user.address, role: user.role, status: user.status, createdAt: user.createdAt });
});

// POST /auth/change-password
router.post("/auth/change-password", authenticate, async (req: AuthRequest, res): Promise<void> => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: "Both passwords required" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.userId!));
  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) {
    res.status(400).json({ error: "Current password is incorrect" });
    return;
  }
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await db.update(usersTable).set({ passwordHash }).where(eq(usersTable.id, req.userId!));
  res.json({ message: "Password changed successfully" });
});

// POST /admin/login
router.post("/admin/login", async (req, res): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password required" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (!user || user.role !== "admin") {
    res.status(401).json({ error: "Invalid admin credentials" });
    return;
  }
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid admin credentials" });
    return;
  }
  const token = signToken({ userId: user.id, role: user.role });
  res.json({
    user: { id: user.id, fullName: user.fullName, email: user.email, phone: user.phone, address: user.address, role: user.role, status: user.status, createdAt: user.createdAt },
    token,
  });
});

export default router;
