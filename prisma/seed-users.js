const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌿 Seeding users...');

    const adminHash = await bcrypt.hash('admin123', 10);
    const customerHash = await bcrypt.hash('customer123', 10);

    // Admin user (password: admin123)
    await prisma.user.upsert({
        where: { email: 'admin@aurah.com' },
        update: { password: adminHash },
        create: {
            name: 'Aurah Admin',
            email: 'admin@aurah.com',
            password: adminHash,
            role: 'admin',
        },
    });

    // Sample customer (password: customer123)
    await prisma.user.upsert({
        where: { email: 'customer@aurah.com' },
        update: { password: customerHash },
        create: {
            name: 'Sarah Johnson',
            email: 'customer@aurah.com',
            password: customerHash,
            role: 'customer',
        },
    });

    console.log('✅ Demo users seeded with hashed passwords!');
    console.log('   Admin: admin@aurah.com / admin123');
    console.log('   Customer: customer@aurah.com / customer123');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
