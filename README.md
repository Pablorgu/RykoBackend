# Ryko Backend API

## Overview

Ryko is a comprehensive nutrition management system designed to provide personalized dietary recommendations and nutritional tracking capabilities. This backend API serves as the core service layer, implementing advanced algorithms for meal planning, nutritional analysis, and intelligent food recommendations.

## Technical Architecture

### Framework & Technologies
- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: MariaDB/MySQL with TypeORM
- **Authentication**: JWT + Google OAuth 2.0
- **File Storage**: Cloudinary
- **Email Service**: SMTP integration

### Key Features

#### Authentication & Authorization
- Multi-provider authentication (Local, Google OAuth)
- JWT-based session management
- Password reset functionality with rate limiting
- Role-based access control (User/Admin)

#### Nutrition Management
- Comprehensive food item database integration
- Custom dish creation and management
- Meal planning and tracking
- Macro and micronutrient calculation

#### Intelligent Recommendations
- Machine learning-based dish recommendations
- Personalized nutrition targets based on user profiles
- Dietary preference and restriction handling
- Historical consumption pattern analysis

#### Data Management
- RESTful API design
- Comprehensive data validation
- Optimized database queries
- Image upload and processing

## System Requirements

- Node.js >= 16.x
- MariaDB/MySQL >= 10.x
- npm >= 8.x

## Environment Configuration

Copy the example environment file and configure the required variables:

```bash
cp .env.example .env
```

### Required Environment Variables

- **Database**: `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`
- **Authentication**: `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- **Email**: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- **Storage**: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

