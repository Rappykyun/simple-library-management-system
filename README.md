# Library Management System 📚

A modern, role-based library management system built with Next.js, SQLite, and Drizzle ORM.

## Features

### For Students (Users)
- **Browse Books** - Explore the library collection
- **Borrow Books** - Check out available books (14-day loan period)
- **Reserve Books** - Reserve books that are currently unavailable
- **Suggest Books** - Request new books for the library
- **Manage Fines** - View and pay overdue fines ($1 per day)

### For Librarians
- **Manage Books** - Add new books to the collection
- **Process Borrowings** - View active loans and process returns
- **Handle Fines** - System automatically creates fines for overdue books
- **Review Suggestions** - Approve or reject student book suggestions
- **Dashboard Overview** - View library statistics

## Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **Backend**: Next.js API Routes
- **Database**: SQLite with Drizzle ORM
- **Authentication**: NextAuth.js v5 with role-based access control
- **Styling**: TailwindCSS with green color palette

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Demo Accounts

### Librarian Access
- **Email**: librarian@library.com
- **Password**: password123

### Student Access
- **Email**: student@library.com
- **Password**: password123

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   │   ├── student/      # Student features
│   │   └── librarian/    # Librarian features
│   └── login/            # Login page
├── components/            # Reusable React components
├── db/                    # Database configuration
│   ├── schema.ts         # Drizzle schema definitions
│   ├── index.ts          # Database connection
│   └── seed.ts           # Seed data script
└── types/                # TypeScript type definitions
```

## Database Schema

### Tables
- **users** - User accounts (students and librarians)
- **books** - Library catalog
- **borrowings** - Loan records
- **reservations** - Book reservations
- **fines** - Overdue fines
- **suggestions** - Student book suggestions

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Features in Detail

### Authentication & Authorization
- Role-based access control (Student vs Librarian)
- Protected routes with middleware
- Session management with NextAuth.js

### Book Management
- Add books with ISBN, category, and multiple copies
- Track available vs total copies
- Real-time availability updates

### Borrowing System
- 14-day loan period
- Automatic availability tracking
- Return processing with overdue detection

### Fine Management
- Automatic fine calculation ($1 per day overdue)
- Payment processing
- Fine history tracking

### Reservation System
- Reserve unavailable books
- Track reservation status
- Notification-ready infrastructure

## Color Palette

The system uses a green color scheme throughout:
- Primary: Green-600 (`#059669`)
- Background: Green-50 (`#f0fdf4`)
- Hover: Green-700 (`#047857`)
- Accents: Various green shades

## Future Enhancements

- Email notifications for due dates and reservations
- Book ratings and reviews
- Advanced search and filtering
- Export reports (PDF/CSV)
- Book categories management
- Multi-library support
- Mobile responsive improvements

## License

This project is open source and available under the MIT License.
