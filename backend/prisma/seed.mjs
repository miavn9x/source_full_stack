import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

const permissions = [
  'page:read',
  'page:create',
  'page:update',
  'page:publish',
  'page:delete',
  'media:read',
  'media:upload',
  'media:delete',
  'product:read',
  'product:write',
  'order:read',
  'order:update',
  'customer:read',
  'customer:update',
  'user:read',
  'user:manage',
  'role:manage',
  'audit:read',
  'setting:manage',
];

const rolePermissions = {
  SUPER_ADMIN: permissions,
  ADMIN: permissions,
  EDITOR: [
    'page:read',
    'page:create',
    'page:update',
    'page:publish',
    'media:read',
    'media:upload',
  ],
  VIEWER: [
    'page:read',
    'media:read',
    'product:read',
    'order:read',
    'customer:read',
  ],
};

async function main() {
  for (const key of permissions) {
    await prisma.permission.upsert({
      where: { key },
      update: {},
      create: { key },
    });
  }

  const permissionRows = await prisma.permission.findMany();
  const permissionByKey = new Map(permissionRows.map((row) => [row.key, row]));

  for (const [name, keys] of Object.entries(rolePermissions)) {
    const role = await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });
    await prisma.rolePermission.createMany({
      data: keys.map((key) => ({
        roleId: role.id,
        permissionId: permissionByKey.get(key).id,
      })),
      skipDuplicates: true,
    });
  }

  const email = (process.env.ADMIN_EMAIL ?? 'admin@example.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? 'ChangeMe123!';
  const passwordHash = await argon2.hash(password);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, status: 'ACTIVE' },
    create: {
      email,
      passwordHash,
      name: 'Administrator',
      status: 'ACTIVE',
    },
  });

  const superAdmin = await prisma.role.findUnique({
    where: { name: 'SUPER_ADMIN' },
  });

  await prisma.userRole.deleteMany({ where: { userId: user.id } });
  await prisma.userRole.create({
    data: { userId: user.id, roleId: superAdmin.id },
  });

  console.log(`Seeded admin user: ${email}`);
  console.log('Change the password after first login.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
