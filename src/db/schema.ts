import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { Tags } from 'lucide-react';

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["admin", "user"] }).default("user").notNull(),
});

// 1. Categories Table
export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  img: text('img').notNull(),
});
export const brands = sqliteTable('brands', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  img: text('img').notNull(),
});
export const sliders = sqliteTable('sliders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  link: text('link').notNull(),
  img: text('img').notNull(),
});
export const images = sqliteTable('images', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  locationid: text('locationid').notNull(),
  link: text('link').notNull(),
  img: text('img').notNull(),
});
export const offerimages = sqliteTable('offerimages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  link: text('link').notNull(),
  img: text('img').notNull(),
  date: text('date').notNull(),
});
export const feedbacks = sqliteTable('feedbacks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  img: text('img').notNull(),
  description: text('description').notNull(),
});
export const blog  = sqliteTable('blog', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  img: text('img').notNull(),
  description: text('description').notNull(),
  tags: text('tags').notNull(),
});
export const sociallink  = sqliteTable('sociallink', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  link: text('link').notNull(),
});
export const attributes = sqliteTable('attributes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  list: text('list').notNull(),
});

export const subcategories = sqliteTable('subcategories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  img: text('img').notNull(),
  categoryId: integer('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' }),
});
// 2. Products Table
export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  description: text('description'),
  
  // Pricing & Inventory
  price: real('price').notNull().default(0),
  discountedPrice: real('discounted_price').notNull().default(0),
  discountType: text('discount_type').default('percent'), // 'percent' ya 'flat'
  discountExpiry: text('discount_expiry'), // Date string or timestamp
  purchasePrice: real('purchase_price').notNull().default(0),
  stock: integer('stock').notNull().default(0),
  minPurchaseQty: integer('min_purchase_qty').notNull().default(1),
  sku: text('sku'),

  // Brand & Additional Info
  brandId: integer('brand_id'),
  brandName: text('brand_name'),
  isRefundable: text('is_refundable'), // 'yes' ya 'no'
  videoLink: text('video_link'),
  
  // Complex Data (JSON format)
  attributesList: text('attributes_list'), // JSON array for multiple attributes (e.g., [{name: "Size", value: "XL"}, {name: "Color", value: "Red"}])
  imgs: text('imgs'), // JSON format for thumbnails & previews
  categoriesId: integer("categories_id").references(() => categories.id),
  subcategoryId: integer("subcategory_id").references(() => subcategories.id),
  
  // SEO Meta Tags
  metaTags: text('meta_tags'),
  metaDescription: text('meta_description'),
  
  reviews: integer('reviews').notNull().default(0),
});


// 4. Testimonials Table
export const testimonials = sqliteTable('testimonials', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  review: text('review').notNull(),
  authorName: text('author_name').notNull(),
  authorRole: text('author_role').notNull(),
  authorImg: text('author_img').notNull(),
});

// 5. Menus Table (Self-referencing relationship for submenus)
export const menus = sqliteTable('menus', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  path: text('path'),
  newTab: integer('new_tab', { mode: 'boolean' }).notNull().default(false),
  parentId: integer('parent_id'), // Nested Submenu structure ke liye (references menus.id)
});
// Orders Table (Same as before)
export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  companyName: text("company_name"),
  country: text("country").notNull(),
  address: text("address").notNull(),
  addressTwo: text("address_two"),
  town: text("town").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  notes: text("notes"),
  totalAmount: real("total_amount").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull(),
});

// Updated Order Items Table (Attributes aur Image ke sath)
export const orderItems = sqliteTable("order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: integer("product_id").notNull(),
  title: text("title").notNull(),
  price: real("price").notNull(),
  quantity: integer("quantity").notNull(),
  image: text("image"), // Product ki image URL save karne ke liye
  selectedAttributes: text("selected_attributes"), // JSON string (e.g. '{"Color": "Black", "Size": "Medium"}')
});