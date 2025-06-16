import { PrismaClient, UserRole } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      username: 'admin',
      password: adminPassword,
      role: UserRole.ADMIN,
      salary: 10000, // Admin salary
    },
  });

  // Create 100 employees
  const employees = Array.from({ length: 100 }, async () => {
    const password = await bcrypt.hash('employee123', 10);
    return {
      username: faker.internet.username(),
      password,
      role: UserRole.EMPLOYEE,
      salary: faker.number.float({ min: 3000, max: 8000, fractionDigits: 2 }),
    };
  });

  // Wait for all password hashing to complete
  const employeeData = await Promise.all(employees);

  // Create employees in batches to avoid overwhelming the database
  for (const employee of employeeData) {
    await prisma.user.create({
      data: employee,
    });
  }

  console.log('Database has been seeded. 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 