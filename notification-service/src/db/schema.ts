import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';


export const notifications = pgTable('notifications', {
    id: varchar('id', { length: 36 }).primaryKey(),
    content: text('content').notNull(),
    email: text('email').notNull(),
    created_at: timestamp('created_at').defaultNow().notNull(),
});