CREATE TABLE `blog_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`date` text NOT NULL,
	`views` integer DEFAULT 0 NOT NULL,
	`img` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`img` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `menus` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`path` text,
	`new_tab` integer DEFAULT false NOT NULL,
	`parent_id` integer
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`reviews` integer DEFAULT 0 NOT NULL,
	`price` real DEFAULT 0 NOT NULL,
	`discounted_price` real DEFAULT 0 NOT NULL,
	`imgs` text
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`review` text NOT NULL,
	`author_name` text NOT NULL,
	`author_role` text NOT NULL,
	`author_img` text NOT NULL
);
