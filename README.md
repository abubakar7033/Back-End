# Todo App Backend

This is the backend for the Todo App, built with Node.js, Express, and TypeScript.

## Table of Contents

- [Installation](#installation)
- [Prisma Configuration](#prisma-configuration)
- [Usage](#usage)

## Installation

1. Clone the repository:

   git clone https://github.com/abubakar7033/Back-End.git
   cd Back-End

2. Install the dependencies:

   npm install

3. Set up environment variables:
   Create a `.env` file in the root directory and add the necessary environment variables. For example:

   PORT=8080
   DATABASE_URL=your_database_url

## Prisma Configuration

1. Generate the Prisma client:

   npx prisma generate

2. Apply database migrations:

   npx prisma migrate dev --name init

## Usage

To start the server, run:

npm run start

The server will be running on `http://localhost:8080`.

To run test cases

npm run test
