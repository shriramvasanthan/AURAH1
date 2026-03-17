import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const content = [
    { key: 'hero_est', value: 'EST. 1998' },
    { key: 'hero_label', value: 'NATURE\'S SPECIMENS' },
    { key: 'hero_title', value: 'Premium <br /> <span class="title-serif">Spices</span> & Nuts' },
    { key: 'hero_desc', value: 'Hand-picked from the world\'s finest farms, our specimens are masterfully preserved to deliver nature\'s most intense character.' },
    { key: 'hero_btn1_text', value: 'Explore Collection' },
    { key: 'hero_btn2_text', value: 'Our Story' },
    { key: 'hero_scroll_hint', value: 'SACRED HARVEST' },
    
    { key: 'collection_pre', value: '✦ Curated Selection ✦' },
    { key: 'collection_title', value: 'Featured Products' },
    { key: 'collection_desc', value: 'The jewels of our collection, hand-selected for their superior grade and sensory profile.' },
    { key: 'collection_counter', value: 'Collection / 01 — 09' },

    { key: 'heritage_tag', value: 'Our Philosophy' },
    { key: 'heritage_title', value: 'A Harvest <br /> of Purity' },
    { key: 'heritage_desc', value: 'For over two decades, we have partnered with small-scale producers who honor the ancient traditions of cultivation. No shortcuts—just the raw character of the earth.' },
    { key: 'heritage_bg', value: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=800' },
    { key: 'heritage_btn_text', value: 'Full Heritage Report' },
    { key: 'heritage_frame_text', value: 'AURAH' },

    { key: 'footer_cta_text', value: 'Ready to Elevate Your Kitchen?' },
    { key: 'footer_cta_btn', value: 'Shop Now' },
    { key: 'footer_desc', value: 'Hand-selected specimens of nature’s most intense character.' },
    { key: 'footer_email', value: 'curator@aurah.com' },
    { key: 'footer_address', value: 'Malabar Coast, India' },
    { key: 'footer_ig', value: '#' },
    { key: 'footer_tw', value: '#' },
    { key: 'footer_tagline', value: 'Explore. Preserve. Elevate.' }
  ];

  for (const item of content) {
    await prisma.siteContent.upsert({
      where: { key: item.key },
      update: {},
      create: item,
    });
  }
  console.log('Seeded initial SiteContent');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
