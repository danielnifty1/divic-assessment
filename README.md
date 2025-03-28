# NestJS Backend Assessment

A RESTful API service built with NestJS, GraphQL, and Prisma that supports user authentication (standard and biometric), registration, and utilizes PostgreSQL as the database.

## Features

- User registration with email and password
- Standard login with email and password
- Biometric login with biometric key
- JWT-based authentication
- GraphQL API
- PostgreSQL database with Prisma ORM
- Docker support for database

## Prerequisites

- Node.js (v16 or later)
- Docker and Docker Compose
- PostgreSQL (if not using Docker)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/danielnifty1/divic-assessment.git
cd divic-assessment
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your database credentials and JWT secret.

5. Start the PostgreSQL database using Docker:
```bash
docker-compose up -d
```

6. Run Prisma migrations:
```bash
npm run prisma:generate
npm run prisma:migrate
```

7. Start the development server:
```bash
npm run start:dev
```

The application will be available at `http://localhost:3000/graphql`

## GraphQL API

### Mutations

1. Register a new user:
```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    user   {
      id
      email
      createdAt
    }
    token
  }
}
```

2. Login with email and password:
```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    user {
      id
      email
      createdAt
    }
    token
  }
}
```

3. Login with biometric key:
```graphql
mutation BiometricLogin($input: BiometricLoginInput!) {
  biometricLogin(input: $input) {
    user {
      id
      email
      createdAt
    }
    token
  }
}
```

4. Set biometric key (requires authentication):
```graphql
mutation SetBiometricKey($input: SetBiometricKeyInput!) {
  setBiometricKey(input: $input) {
    user {
      id
      email
      biometricKey
      createdAt
    }
    token
  }
}
```

## Testing

Run the test suite:
```bash
npm test
```

## Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Input validation using class-validator
- Protected routes using guards
- Secure handling of biometric data

## Project Structure

```
src/
├── auth/
│   ├── decorators/
│   ├── dto/
│   ├── guards/
│   ├── strategies/
│   ├── auth.module.ts
│   ├── auth.resolver.ts
│   └── auth.service.ts
├── prisma/
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── app.module.ts
└── main.ts
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 