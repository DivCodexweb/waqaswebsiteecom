CREATE TABLE `blog` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`img` text NOT NULL,
	`description` text NOT NULL,
	`tags` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `feedbacks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`img` text NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`link` text NOT NULL,
	`img` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `offerimages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`link` text NOT NULL,
	`img` text NOT NULL,
	`date` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sliders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`link` text NOT NULL,
	`img` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sociallink` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`link` text NOT NULL
);
