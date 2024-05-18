CREATE TABLE `exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`text` text(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`setId` integer NOT NULL,
	`count` integer NOT NULL,
	FOREIGN KEY (`setId`) REFERENCES `sets`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`workoutId` integer NOT NULL,
	`exerciseId` integer,
	FOREIGN KEY (`workoutId`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`exerciseId`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`timestamp` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exercises_text_unique` ON `exercises` (`text`);