import { pgTable, text, timestamp, varchar, numeric, pgEnum } from 'drizzle-orm/pg-core';

export const orderStatusEnum = pgEnum('order_status', ['criado', 'pago', 'finalizado']);

export const orders = pgTable('orders', {
  id: varchar('id', { length: 36 }).primaryKey(),
  status: orderStatusEnum('status').default('criado').notNull(),
  value: numeric('value', { precision: 10, scale: 2 }).notNull(),
  customer_name: text('customer_name').notNull(),
  customer_email: text('customer_email').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});