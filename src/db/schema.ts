// src/db/schema.ts

import { mysqlTable, varchar, text, boolean, timestamp, uniqueIndex, decimal, int, json } from "drizzle-orm/mysql-core";

export const appRole = [ 'customer', 'partner', 'admin_ng', 'admin_uk' ] as const;
export const shipmentStatus = [
    'draft', 'pending_payment', 'confirmed', 'picked_up', 'in_transit_ng',
    'customs_ng', 'departed_ng', 'in_transit_uk', 'customs_uk', 'cleared_uk',
    'out_for_delivery', 'delivered', 'returned', 'cancelled'
] as const;
export const paymentStatus = [ 'pending', 'processing', 'completed', 'failed', 'refunded' ] as const;
export const paymentProvider = [ 'paystack', 'stripe', 'bank_transfer' ] as const;


export const profiles = mysqlTable('profiles', {
    id: varchar('id', { length: 36 }).primaryKey().notNull(), // UUID stored as string
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    full_name: varchar('full_name', { length: 255 }),
    phone: varchar('phone', { length: 50 }),
    company_name: varchar('company_name', { length: 255 }),
    address: text('address'),
    city: varchar('city', { length: 100 }),
    country: varchar('country', { length: 100 }).default('Nigeria'),
    avatar_url: text('avatar_url'),
    partner_code: varchar('partner_code', { length: 100 }).unique(),
    is_active: boolean('is_active').default(true),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
});


export const user_roles = mysqlTable('user_roles', {
    id: varchar('id', { length: 36 }).primaryKey(),
    user_id: varchar('user_id', { length: 36 }).references(() => profiles.id).notNull(),
    role: varchar('role', { length: 36 }).notNull(),// Use TypeScript AppRole type
    assigned_by: varchar('assigned_by', { length: 36 }),
    assigned_at: timestamp('assigned_at').defaultNow(),
}, (table) => ({
    uniqueUserRole: uniqueIndex('unique_user_role').on(table.user_id, table.role),
}));


export const shipments = mysqlTable('shipments', {
    id: varchar('id', { length: 36 }).primaryKey(),
    tracking_number: varchar('tracking_number', { length: 50 }).unique().notNull(),
    customer_id: varchar('customer_id', { length: 36 }),
    partner_id: varchar('partner_id', { length: 36 }),
    status: varchar('status', { length: 36 }).default('draft'),

    // Sender details
    sender_name: varchar('sender_name', { length: 255 }).notNull(),
    sender_phone: varchar('sender_phone', { length: 50 }).notNull(),
    sender_email: varchar('sender_email', { length: 255 }),
    sender_address: text('sender_address').notNull(),
    sender_city: varchar('sender_city', { length: 100 }).notNull(),
    sender_country: varchar('sender_country', { length: 100 }).default('Nigeria'),

    // Receiver details
    receiver_name: varchar('receiver_name', { length: 255 }).notNull(),
    receiver_phone: varchar('receiver_phone', { length: 50 }).notNull(),
    receiver_email: varchar('receiver_email', { length: 255 }),
    receiver_address: text('receiver_address').notNull(),
    receiver_city: varchar('receiver_city', { length: 100 }).notNull(),
    receiver_country: varchar('receiver_country', { length: 100 }).default('United Kingdom'),

    // Package details
    total_weight_kg: decimal('total_weight_kg', { precision: 10, scale: 2 }),
    total_volume_cbm: decimal('total_volume_cbm', { precision: 10, scale: 4 }),
    declared_value_ngn: decimal('declared_value_ngn', { precision: 12, scale: 2 }),
    declared_value_gbp: decimal('declared_value_gbp', { precision: 12, scale: 2 }),

    // Pricing
    shipping_cost_ngn: decimal('shipping_cost_ngn', { precision: 12, scale: 2 }),
    shipping_cost_gbp: decimal('shipping_cost_gbp', { precision: 12, scale: 2 }),
    insurance_cost: decimal('insurance_cost', { precision: 12, scale: 2 }).default("0.00"),
    total_cost_ngn: decimal('total_cost_ngn', { precision: 12, scale: 2 }),
    total_cost_gbp: decimal('total_cost_gbp', { precision: 12, scale: 2 }),

    // Dates
    pickup_date: timestamp('pickup_date'),
    estimated_delivery: timestamp('estimated_delivery'),
    actual_delivery: timestamp('actual_delivery'),

    // Additional
    special_instructions: text('special_instructions'),
    is_fragile: boolean('is_fragile').default(false),
    requires_insurance: boolean('requires_insurance').default(false),

    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
});


export const shipment_items = mysqlTable('shipment_items', {
    id: varchar('id', { length: 36 }).primaryKey().default('UUID()'),
    shipment_id: varchar('shipment_id', { length: 36 }).notNull(),
    description: text('description').notNull(),
    quantity: int('quantity').default(1),
    weight_kg: decimal('weight_kg', { precision: 10, scale: 2 }),
    length_cm: decimal('length_cm', { precision: 10, scale: 2 }),
    width_cm: decimal('width_cm', { precision: 10, scale: 2 }),
    height_cm: decimal('height_cm', { precision: 10, scale: 2 }),
    declared_value_ngn: decimal('declared_value_ngn', { precision: 12, scale: 2 }),
    hs_code: varchar('hs_code', { length: 50 }),
    created_at: timestamp('created_at').defaultNow(),
});


export const tracking_events = mysqlTable('tracking_events', {
    id: varchar('id', { length: 36 }).primaryKey(),
    shipment_id: varchar('shipment_id', { length: 36 }).notNull(),
    status: varchar('status', { length: 30 }).notNull(),
    location: varchar('location', { length: 255 }).notNull(),
    description: text('description').notNull(),
    notes: text('notes'),
    created_by: varchar('created_by', { length: 36 }),
    event_time: timestamp('event_time').defaultNow(),
    created_at: timestamp('created_at').defaultNow(),
});


export const payments = mysqlTable('payments', {
    id: varchar('id', { length: 36 }).primaryKey(),
    shipment_id: varchar('shipment_id', { length: 36 }).notNull(),
    user_id: varchar('user_id', { length: 36 }).notNull(),
    amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
    currency: varchar('currency', { length: 10 }).default('NGN'),
    provider: varchar('provider', { length: 50 }).notNull(),
    provider_reference: varchar('provider_reference', { length: 100 }),
    status: varchar('status', { length: 20 }).default('pending'),
    metadata: json('metadata'),
    paid_at: timestamp('paid_at'),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
});



export const partner_commissions = mysqlTable('partner_commissions', {
    id: varchar('id', { length: 36 }).primaryKey(),
    partner_id: varchar('partner_id', { length: 36 }).notNull(),
    shipment_id: varchar('shipment_id', { length: 36 }).references(() => shipments.id).notNull(),
    payment_id: varchar('payment_id', { length: 36 }),
    commission_rate: decimal('commission_rate', { precision: 5, scale: 2 }).default("10.00"),
    commission_amount: decimal('commission_amount', { precision: 12, scale: 2 }).notNull(),
    currency: varchar('currency', { length: 10 }).default('NGN'),
    status: varchar('status', { length: 20 }).default('pending'),
    paid_at: timestamp('paid_at'),
    created_at: timestamp('created_at').defaultNow(),
});

export const documents = mysqlTable('documents', {
    id: varchar('id', { length: 36 }).primaryKey(),
    shipment_id: varchar('shipment_id', { length: 36 }).references(() => shipments.id).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    type: varchar('type', { length: 100 }).notNull(),
    file_path: text('file_path').notNull(),
    file_size: int('file_size'),
    uploaded_by: varchar('uploaded_by', { length: 36 }),
    created_at: timestamp('created_at').defaultNow(),
});


export const notifications = mysqlTable('notifications', {
    id: varchar('id', { length: 36 }).primaryKey(),
    user_id: varchar('user_id', { length: 36 }).notNull(),
    shipment_id: varchar('shipment_id', { length: 36 }).references(() => shipments.id),
    title: varchar('title', { length: 255 }).notNull(),
    message: text('message').notNull(),
    type: varchar('type', { length: 50 }).default('info'),
    channel: varchar('channel', { length: 50 }).default('in_app'),
    is_read: boolean('is_read').default(false),
    sent_at: timestamp('sent_at'),
    created_at: timestamp('created_at').defaultNow(),
});

export const system_settings = mysqlTable('system_settings', {
    id: varchar('id', { length: 36 }).primaryKey(),
    key: varchar('key', { length: 255 }).notNull(),
    value: json('value').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
}, (table) => ({
    uniqueKey: uniqueIndex('unique_key').on(table.key),
}));


export const sessions = mysqlTable('sessions', {
    id: varchar('id', { length: 36 }).primaryKey(),
    user_id: varchar('user_id', { length: 36 }).references(() => profiles.id).notNull(),
    refresh_token_hash: varchar('refresh_token_hash', { length: 255 }).notNull(),
    user_agent: text('user_agent'),
    ip_address: varchar('ip_address', { length: 45 }),
    expires_at: timestamp('expires_at').notNull(),
    revoked_at: timestamp('revoked_at'),
    created_at: timestamp('created_at').defaultNow(),
});
