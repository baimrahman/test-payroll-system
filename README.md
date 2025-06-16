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

## How-to Guides

For detailed API documentation and usage examples, please visit the Swagger documentation at:
```
http://localhost:3000/api
```

The Swagger UI provides:
- Complete API endpoint documentation
- Request/response schemas
- Interactive API testing interface
- Authentication requirements
- Example requests and responses

Common operations include:
- Employee management (create, update, delete)
- Attendance tracking
- Payroll generation
- Payslip viewing
- Reimbursement processing

## API Documentation

The API follows RESTful principles and is documented using Swagger/OpenAPI. Access the interactive documentation at:
```
http://localhost:3000/api
```

### Authentication

All API endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```bash
Authorization: Bearer <your-jwt-token>
```

### Rate Limiting

API requests are rate-limited to 100 requests per minute per IP address.

### Error Handling

The API uses standard HTTP status codes and returns error responses in the following format:
```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

## Architecture

### Clean Architecture

The project follows Clean Architecture principles with three main layers:

1. **Domain Layer**
   - Contains business entities and interfaces
   - Defines core business rules
   - Independent of external frameworks
   - Located in `src/core/domain/`

2. **Application Layer**
   - Implements use cases and business logic
   - Orchestrates the flow of data
   - Depends only on the domain layer
   - Located in `src/core/application/`

3. **Infrastructure Layer**
   - Handles external concerns
   - Implements interfaces defined in the domain layer
   - Includes database, logging, and external services
   - Located in `src/core/infrastructure/`

### Database Schema

The system uses PostgreSQL with the following main tables:
- employees
- attendance
- overtime
- reimbursements
- payroll
- payslips
- audit_logs

### Security

- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing using bcrypt
- Input validation using class-validator
- CORS protection
- Rate limiting

### Logging

The system uses Winston for logging with the following levels:
- error: For error conditions
- warn: For warning conditions
- info: For informational messages
- debug: For debug-level messages

Logs are stored in both files and database for audit purposes.

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

### Testing Strategy

1. **Unit Tests**
   - Test individual components in isolation
   - Mock external dependencies
   - Located in `*.spec.ts` files

2. **Integration Tests**
   - Test component interactions
   - Use test database
   - Located in `*.integration.spec.ts` files

3. **E2E Tests**
   - Test complete user flows
   - Use test environment
   - Located in `test/` directory

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

### Development Workflow

1. Follow the Git Flow branching strategy
2. Write tests for new features
3. Update documentation
4. Ensure code passes linting
5. Create detailed PR descriptions

## License

This project is licensed under the MIT License.

## Support

For support, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue with:
   - Detailed description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
