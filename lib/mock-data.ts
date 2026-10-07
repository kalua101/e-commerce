// Mock data to replace database
export const mockProducts = [
  {
    id: '1',
    name: 'Premium Laptop',
    slug: 'premium-laptop',
    description: 'High-performance laptop for professionals',
    price: 1299.99,
    comparePrice: 1499.99,
    image: '/placeholder.svg',
    images: ['/placeholder.svg'],
    categoryId: '1',
    featured: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { id: '1', name: 'Electronics', slug: 'electronics' },
    inventory: { stock: 50, lowStockThreshold: 10 },
    reviews: []
  },
  {
    id: '2',
    name: 'Wireless Headphones',
    slug: 'wireless-headphones',
    description: 'Noise-canceling wireless headphones',
    price: 199.99,
    comparePrice: 249.99,
    image: '/placeholder.svg',
    images: ['/placeholder.svg'],
    categoryId: '1',
    featured: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { id: '1', name: 'Electronics', slug: 'electronics' },
    inventory: { stock: 100, lowStockThreshold: 20 },
    reviews: []
  },
  {
    id: '3',
    name: 'Smart Watch',
    slug: 'smart-watch',
    description: 'Advanced fitness tracking smartwatch',
    price: 299.99,
    comparePrice: 349.99,
    image: '/placeholder.svg',
    images: ['/placeholder.svg'],
    categoryId: '1',
    featured: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { id: '1', name: 'Electronics', slug: 'electronics' },
    inventory: { stock: 75, lowStockThreshold: 15 },
    reviews: []
  },
  {
    id: '4',
    name: 'Gaming Mouse',
    slug: 'gaming-mouse',
    description: 'Professional gaming mouse with RGB',
    price: 79.99,
    comparePrice: 99.99,
    image: '/placeholder.svg',
    images: ['/placeholder.svg'],
    categoryId: '1',
    featured: true,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: { id: '1', name: 'Electronics', slug: 'electronics' },
    inventory: { stock: 150, lowStockThreshold: 30 },
    reviews: []
  }
];

export const mockCategories = [
  { id: '1', name: 'Electronics', slug: 'electronics', description: 'Electronic devices and accessories' },
  { id: '2', name: 'Clothing', slug: 'clothing', description: 'Fashion and apparel' },
  { id: '3', name: 'Home & Garden', slug: 'home-garden', description: 'Home improvement and garden supplies' }
];

export const mockUsers = [
  {
    id: 'admin-1',
    email: 'admin@store.com',
    name: 'Admin User',
    password: '$2a$10$8YzN.qQ5EZJ5YQxF5P5h1OZ5kKqZ1J5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5', // hashed "Admin@123456"
    role: 'admin',
    emailVerified: new Date(),
    createdAt: new Date()
  }
];

export const mockOrders = [];
