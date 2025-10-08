import { db } from "./index";
import { users, books } from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create default users
  const hashedPassword = await bcrypt.hash("password123", 10);

  await db.insert(users).values([
    {
      email: "librarian@library.com",
      password: hashedPassword,
      name: "John Librarian",
      role: "librarian",
    },
    {
      email: "student@library.com",
      password: hashedPassword,
      name: "Jane Student",
      role: "student",
    },
  ]);

  // Create some sample books
  await db.insert(books).values([
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      isbn: "978-0-06-112008-4",
      category: "Fiction",
      totalCopies: 3,
      availableCopies: 3,
    },
    {
      title: "1984",
      author: "George Orwell",
      isbn: "978-0-452-28423-4",
      category: "Fiction",
      totalCopies: 2,
      availableCopies: 2,
    },
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "978-0-7432-7356-5",
      category: "Fiction",
      totalCopies: 2,
      availableCopies: 2,
    },
    {
      title: "Clean Code",
      author: "Robert C. Martin",
      isbn: "978-0-13-235088-4",
      category: "Technology",
      totalCopies: 1,
      availableCopies: 1,
    },
  ]);

  console.log("✅ Database seeded successfully!");
  console.log("\n📚 Login credentials:");
  console.log("Librarian: librarian@library.com / password123");
  console.log("Student: student@library.com / password123");
}

seed().catch(console.error);

