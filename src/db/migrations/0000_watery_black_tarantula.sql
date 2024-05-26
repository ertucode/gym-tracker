CREATE TABLE `exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`text` text(50) NOT NULL,
	`assisted` integer DEFAULT false
);
--> statement-breakpoint
CREATE TABLE `reps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`setId` integer NOT NULL,
	`count` integer NOT NULL,
	`index` integer NOT NULL,
	`note` text,
	FOREIGN KEY (`setId`) REFERENCES `sets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`index` integer,
	`workoutId` integer NOT NULL,
	`exerciseId` integer NOT NULL,
	`note` text,
	FOREIGN KEY (`workoutId`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exerciseId`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`timestamp` integer,
	`note` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exercises_text_unique` ON `exercises` (`text`);