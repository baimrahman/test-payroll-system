# Payroll System

A scalable payslip generation system built with NestJS, Prisma, and PostgreSQL.

## Features

- Employee management
- Attendance tracking
- Overtime management
- Reimbursement processing
- Payroll generation
- Payslip generation
- Audit logging
- API documentation with Swagger

## Tech Stack

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Swagger/OpenAPI
- Winston Logger
- Jest for testing

## Project Structure

```
src/
├── core/
│   ├── domain/           # Domain entities and interfaces
│   ├── application/      # Application services and use cases
│   └── infrastructure/   # Infrastructure implementations
├── modules/             # Feature modules
├── shared/             # Shared utilities and configurations
└── main.ts            # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd payroll-system
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. Run database migrations:
```bash
pnpm prisma migrate dev
```

5. Start the development server:
```bash
pnpm start:dev
```

### API Documentation

Once the application is running, you can access the Swagger documentation at:
```
http://localhost:3000/api
```

## Testing

Run the test suite:
```bash
# Unit tests
pnpm test

# e2e tests
pnpm test:e2e

# Test coverage
pnpm test:cov
```

## Architecture

The project follows Clean Architecture principles:

1. **Domain Layer**: Contains business entities and interfaces
2. **Application Layer**: Implements use cases and business logic
3. **Infrastructure Layer**: Handles external concerns (database, logging, etc.)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
