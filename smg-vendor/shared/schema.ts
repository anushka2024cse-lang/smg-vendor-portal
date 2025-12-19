import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const vendors = pgTable("vendors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vendorCode: text("vendor_code").notNull().unique(),
  companyName: text("company_name").notNull(),
  contactPerson: text("contact_person").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode").notNull(),
  gstNumber: text("gst_number"),
  panNumber: text("pan_number"),
  bankName: text("bank_name"),
  accountNumber: text("account_number"),
  ifscCode: text("ifsc_code"),
  status: text("status").notNull().default("active"),
  ndaUploaded: boolean("nda_uploaded").default(false),
  trademarkUploaded: boolean("trademark_uploaded").default(false),
  ndaFileName: text("nda_file_name"),
  trademarkFileName: text("trademark_file_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertVendorSchema = createInsertSchema(vendors).omit({
  id: true,
  createdAt: true,
});

export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type Vendor = typeof vendors.$inferSelect;

export const components = pgTable("components", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vendorId: varchar("vendor_id").notNull(),
  componentName: text("component_name").notNull(),
  category: text("category").notNull(),
  sorNumber: text("sor_number").notNull(),
  specifications: text("specifications"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertComponentSchema = createInsertSchema(components).omit({
  id: true,
  createdAt: true,
});

export type InsertComponent = z.infer<typeof insertComponentSchema>;
export type Component = typeof components.$inferSelect;

export const componentHistory = pgTable("component_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  componentId: varchar("component_id").notNull(),
  vendorId: varchar("vendor_id").notNull(),
  tool: text("tool").notNull(),
  allotment: text("allotment").notNull(),
  date: timestamp("date").defaultNow(),
  remarks: text("remarks"),
});

export const insertComponentHistorySchema = createInsertSchema(componentHistory).omit({
  id: true,
  date: true,
});

export type InsertComponentHistory = z.infer<typeof insertComponentHistorySchema>;
export type ComponentHistory = typeof componentHistory.$inferSelect;

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vendorId: varchar("vendor_id").notNull(),
  documentType: text("document_type").notNull(),
  fileName: text("file_name").notNull(),
  fileSize: text("file_size").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadedAt: true,
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
