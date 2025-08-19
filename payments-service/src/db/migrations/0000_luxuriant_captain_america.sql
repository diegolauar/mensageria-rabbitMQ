CREATE TABLE "payments" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"order_id" varchar(36) NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"customer_email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
