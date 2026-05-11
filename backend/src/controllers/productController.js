import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.resolve(__dirname, '../data/products.json');

const readProducts = async () => {
  try {
    const content = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(content || '[]');
  } catch (error) {
    return [];
  }
};

const writeProducts = async (products) => {
  await fs.writeFile(dataPath, JSON.stringify(products, null, 2), 'utf8');
};

export const getProducts = async (req, res) => {
  const products = await readProducts();
  res.json({ data: products });
};

export const addProduct = async (req, res) => {
  const { name, price, description, quantity, unit, category, farmerId, farmerName } = req.body;
  if (!name || price === undefined || quantity === undefined) {
    return res.status(400).json({ error: 'Name, price, and quantity are required' });
  }

  const products = await readProducts();
  const newProduct = {
    id: Date.now().toString(),
    name,
    description: description || '',
    price: Number(price),
    quantity: Number(quantity),
    unit: unit || 'kg',
    category: category || 'Other',
    farmerId: farmerId || null,
    farmerName: farmerName || 'Unknown farmer',
    image: req.file ? `/uploads/products/${req.file.filename}` : null,
    createdAt: new Date().toISOString()
  };

  products.push(newProduct);
  await writeProducts(products);

  res.status(201).json({ data: newProduct });
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const products = await readProducts();
  const productIndex = products.findIndex(p => p.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  products.splice(productIndex, 1);
  await writeProducts(products);
  res.json({ message: 'Product deleted successfully' });
};
