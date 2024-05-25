ALTER TABLE `exercises` ADD `assisted` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `reps` ADD `note` text;--> statement-breakpoint
ALTER TABLE `sets` ADD `note` text;--> statement-breakpoint
ALTER TABLE `workouts` ADD `note` text;