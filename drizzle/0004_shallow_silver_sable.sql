CREATE TABLE `brands` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`img` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `products` ADD `description` text;--> statement-breakpoint
ALTER TABLE `products` ADD `discount_type` text DEFAULT 'percent';--> statement-breakpoint
ALTER TABLE `products` ADD `discount_expiry` text;--> statement-breakpoint
ALTER TABLE `products` ADD `purchase_price` real DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `stock` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `min_purchase_qty` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `sku` text;--> statement-breakpoint
ALTER TABLE `products` ADD `brand_id` integer;--> statement-breakpoint
ALTER TABLE `products` ADD `brand_name` text;--> statement-breakpoint
ALTER TABLE `products` ADD `is_refundable` text;--> statement-breakpoint
ALTER TABLE `products` ADD `video_link` text;--> statement-breakpoint
ALTER TABLE `products` ADD `attributes_list` text;--> statement-breakpoint
ALTER TABLE `products` ADD `meta_tags` text;--> statement-breakpoint
ALTER TABLE `products` ADD `meta_description` text;