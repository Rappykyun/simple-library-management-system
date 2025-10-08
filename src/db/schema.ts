import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Users table - stores both students and librarians
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // hashed password
  name: text("name").notNull(),
  role: text("role").notNull(), // 'student' or 'librarian'
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Books table - the library catalog
export const books = sqliteTable("books", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  author: text("author").notNull(),
  isbn: text("isbn").unique(),
  category: text("category"),
  totalCopies: integer("total_copies").notNull().default(1),
  availableCopies: integer("available_copies").notNull().default(1),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Borrowings table - tracks who borrowed what
export const borrowings = sqliteTable("borrowings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  bookId: integer("book_id").notNull().references(() => books.id),
  borrowDate: text("borrow_date").default(sql`CURRENT_TIMESTAMP`),
  dueDate: text("due_date").notNull(),
  returnDate: text("return_date"),
  status: text("status").notNull().default("active"), // 'active', 'returned', 'overdue'
});

// Reservations table - holds on books
export const reservations = sqliteTable("reservations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  bookId: integer("book_id").notNull().references(() => books.id),
  reservationDate: text("reservation_date").default(sql`CURRENT_TIMESTAMP`),
  status: text("status").notNull().default("pending"), // 'pending', 'fulfilled', 'cancelled'
});

// Fines table - overdue penalties
export const fines = sqliteTable("fines", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  borrowingId: integer("borrowing_id").notNull().references(() => borrowings.id),
  amount: integer("amount").notNull(), // in cents
  status: text("status").notNull().default("unpaid"), // 'unpaid', 'paid'
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  paidAt: text("paid_at"),
});

// Suggestions table - book requests from students
export const suggestions = sqliteTable("suggestions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  author: text("author"),
  reason: text("reason"),
  status: text("status").notNull().default("pending"), // 'pending', 'approved', 'rejected'
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

