import express from "express";
import cors from "cors";
import { openDb } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;
const db = await openDb();

app.get("/api/products", async (req, res) => {
  const products = await db.all("SELECT * FROM products ORDER BY id");
  res.json(
    products.map((product) => ({
      ...product,
      features: JSON.parse(product.features),
    }))
  );
});

app.get("/api/products/:id", async (req, res) => {
  const product = await db.get(
    "SELECT * FROM products WHERE id = ?",
    req.params.id
  );

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json({
    ...product,
    features: JSON.parse(product.features),
  });
});

app.get("/api/links", (req, res) => {
  res.json([
    {
      id: 1,
      title: "Nihonya Design Source",
      url: "https://www.nihonya.com/collections/latest",
      description: "Daily design updates and featured furniture sources.",
    },
    {
      id: 2,
      title: "Curated Furniture Preview",
      url: "https://www.pinterest.com/nihonya/furniture",
      description: "Latest furniture imagery inspiration.",
    },
  ]);
});

app.post("/api/products", async (req, res) => {
  const { name, category, price, image, description, features, sourceLink } = req.body;

  if (!name || !category || !price || !image || !description || !features) {
    return res.status(400).json({ message: "Missing required product fields" });
  }

  const result = await db.run(
    "INSERT INTO products (name, category, price, image, description, features, sourceLink) VALUES (?, ?, ?, ?, ?, ?, ?)",
    name,
    category,
    price,
    image,
    description,
    JSON.stringify(features),
    sourceLink || ""
  );

  res.status(201).json({
    id: result.lastID,
    name,
    category,
    price,
    image,
    description,
    features,
    sourceLink: sourceLink || "",
  });
});

app.listen(port, () => {
  console.log(`Backend API running at http://localhost:${port}`);
});
