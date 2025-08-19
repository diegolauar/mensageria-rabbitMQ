import { pgTable, text, timestamp, varchar, numeric } from 'drizzle-orm/pg-core';

export const payments = pgTable('payments', {
  id: varchar('id', { length: 36 }).primaryKey(),
  order_id: varchar('order_id', { length: 36 }).notNull(),
  total: numeric('total', { precision: 10, scale: 2 }).notNull(),
  customer_email: text('customer_email').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});