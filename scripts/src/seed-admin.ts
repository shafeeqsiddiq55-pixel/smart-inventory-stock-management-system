import bcrypt from 'bcryptjs';
import { db, usersTable } from '@workspace/db';
import { eq } from 'drizzle-orm';

const adminEmail = 'admin@fruitshop.com';
const adminPassword = 'password123';

async function main() {
  const existingUsers = await db.select().from(usersTable).where(eq(usersTable.email, adminEmail));

  if (existingUsers.length > 0) {
    console.log(`Admin user already exists: ${adminEmail}`);
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const [user] = await db.insert(usersTable).values({
    fullName: 'Admin User',
    email: adminEmail,
    phone: '+1-555-0100',
    address: 'Fruit Shop HQ',
    passwordHash,
    role: 'admin',
    status: 'active',
  }).returning();

  console.log(`Created admin user: ${user.email} (${user.role})`);
}

main().catch((error) => {
  console.error('Failed to seed admin user:', error);
  process.exit(1);
});
