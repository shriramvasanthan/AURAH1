import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get content by key, or all content
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const key = searchParams.get('key');

        if (key) {
            const content = await prisma.siteContent.findUnique({ where: { key } });
            return NextResponse.json(content || { key, value: '' });
        }

        const allContent = await prisma.siteContent.findMany();
        const contentMap = allContent.reduce((acc, item) => {
            acc[item.key] = item.value;
            return acc;
        }, {});

        return NextResponse.json(contentMap);
    } catch (error) {
        console.error("Failed to fetch content:", error);
        return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
    }
}

// Update or create content
export async function PUT(request) {
    try {
        const body = await request.json();
        const results = [];

        // Support array of updates or single object map
        const updates = Array.isArray(body) ? body : Object.entries(body).map(([key, value]) => ({ key, value }));

        for (const { key, value } of updates) {
            const updated = await prisma.siteContent.upsert({
                where: { key },
                update: { value: String(value) },
                create: { key, value: String(value) },
            });
            results.push(updated);
        }

        return NextResponse.json({ success: true, updated: results });
    } catch (error) {
        console.error("Failed to update content:", error);
        return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
    }
}
