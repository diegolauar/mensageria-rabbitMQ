CREATE TABLE "notifications" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
