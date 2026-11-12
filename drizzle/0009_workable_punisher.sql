CREATE TABLE `order_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` integer NOT NULL,
	`product_id` integer NOT NULL,
	`title` text NOT NULL,
	`price` real NOT NULL,
	`quantity` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`company_name` text,
	`country` text NOT NULL,
	`address` text NOT NULL,
	`address_two` text,
	`town` text NOT NULL,
	`phone` text NOT NULL,
	`email` text NOT NULL,
	`notes` text,
	`total_amount` real NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text NOT NULL
);
