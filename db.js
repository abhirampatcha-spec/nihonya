import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const productTemplates = [
  {
    name: "Solace Chair",
    category: "Chair",
    price: 34000,
    description: "Luxury Japanese chair crafted for comfort and elegance.",
    features: [
      "Soft, curved form for ergonomic support.",
      "Premium upholstery with a modern silhouette.",
      "Durable solid-wood frame with a sleek finish.",
    ],
    sourceLink: "https://dribbble.com/shots/12345678-Solace-Chair",
  },
  {
    name: "Zen Sofa",
    category: "Sofa",
    price: 52000,
    description: "Minimalist sofa that balances sleek design with deep comfort.",
    features: [
      "Luxurious foam core cushions for long-lasting comfort.",
      "Low-profile silhouette ideal for modern living rooms.",
      "Neutral tones that fit any interior style.",
    ],
    sourceLink: "https://www.pinterest.com/pin/2198289847/",
  },
  {
    name: "Nobu Dining Table",
    category: "Table",
    price: 62000,
    description: "Solid wood dining table with subtle Japanese craftsmanship.",
    features: [
      "Hand-finished surface with natural wood grain.",
      "Sturdy legs designed for stability.",
      "Spacious tabletop for family meals and gatherings.",
    ],
    sourceLink: "https://dribbble.com/shots/23456789-Nobu-Dining-Table",
  },
  {
    name: "Hikari Lounge",
    category: "Luxury",
    price: 76000,
    description: "Premium lounge chair made for long evenings of relaxation.",
    features: [
      "Generously padded seat for superior comfort.",
      "Rich leather finish with an elegant shine.",
      "Contoured shape that supports a relaxed posture.",
    ],
    sourceLink: "https://www.pinterest.com/pin/87654321/",
  },
  {
    name: "Kaze Accent Chair",
    category: "Chair",
    price: 29000,
    description: "A statement accent chair with a light, airy silhouette.",
    features: [
      "Sculptural frame with modern curves.",
      "Lightweight design for easy room placement.",
      "Soft velvet upholstery that feels luxurious.",
    ],
    sourceLink: "https://dribbble.com/shots/98765432-Kaze-Accent-Chair",
  },
  {
    name: "Sakura Bedside Table",
    category: "Table",
    price: 18000,
    description: "Compact bedside table with clean lines and warm wood tones.",
    features: [
      "Single drawer for bedside storage.",
      "Smooth tabletop surface for lamps and decor.",
      "Chamfered edges inspired by Japanese design.",
    ],
    sourceLink: "https://www.pinterest.com/pin/11223344/",
  },
  {
    name: "Yume Ottoman",
    category: "Luxury",
    price: 23000,
    description: "Plush ottoman that adds a premium finish to any room.",
    features: [
      "Soft, tufted cushion for extra comfort.",
      "Perfect companion for lounge seating.",
      "Elegant base that matches luxury interiors.",
    ],
    sourceLink: "https://dribbble.com/shots/45678901-Yume-Ottoman",
  },
  {
    name: "Mizu Coffee Table",
    category: "Table",
    price: 41000,
    description: "A serene coffee table for modern living spaces.",
    features: [
      "Floating tabletop with subtle storage shelf.",
      "Smooth finish for easy cleaning.",
      "Balanced proportions for any seating area.",
    ],
    sourceLink: "https://www.pinterest.com/pin/55667788/",
  },
];

const imageUrls = [
  "https://images.unsplash.com/photo-1519947486511-46149fa0a254",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36",
  "https://images.unsplash.com/photo-1494526585095-c41746248156",
  "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858",
  "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
];

const initialProducts = Array.from({ length: 160 }, (_, index) => {
  const template = productTemplates[index % productTemplates.length];
  const variant = Math.floor(index / productTemplates.length) + 1;
  const name = variant === 1 ? template.name : `${template.name} ${variant}`;
  const imageUrl = `${imageUrls[index % imageUrls.length]}?q=80&w=1200&auto=format&fit=crop`;
  const priceModifier = (index % 5) * 1200 + variant * 300;

  return {
    name,
    category: template.category,
    price: Math.max(12000, template.price + priceModifier),
    image: imageUrl,
    description: template.description,
    features: template.features,
    sourceLink: `${template.sourceLink}?variant=${variant}`,
  };
});

export async function openDb() {
  const db = await open({
    filename: join(__dirname, "products.db"),
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      image TEXT NOT NULL,
      description TEXT NOT NULL,
      features TEXT NOT NULL,
      sourceLink TEXT DEFAULT ""
    )
  `);

  const count = await db.get("SELECT COUNT(*) AS count FROM products");

  if (!count || count.count === 0) {
    const insert = await db.prepare(
      "INSERT INTO products (name, category, price, image, description, features, sourceLink) VALUES (?, ?, ?, ?, ?, ?, ?)"
    );

    for (const product of initialProducts) {
      await insert.run(
        product.name,
        product.category,
        product.price,
        product.image,
        product.description,
        JSON.stringify(product.features),
        product.sourceLink
      );
    }

    await insert.finalize();
  }

  return db;
}
