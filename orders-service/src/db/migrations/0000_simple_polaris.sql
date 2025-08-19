CREATE TYPE "public"."order_status" AS ENUM('criado', 'pago', 'finalizado');--> statement-breakpoint
CREATE TABLE "orders" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"status" "order_status" DEFAULT 'criado' NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	"customer_name" text NOT NULL,
	"customer_email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
