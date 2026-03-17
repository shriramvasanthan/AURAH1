const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    try {
        const content = await prisma.siteContent.findMany();
        console.log("Success:", content);
    } catch(e) {
        console.error("Error:", e);
    }
}
test();
