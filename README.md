# R3B00T

## Installation Instructions

This project consists of three main components: ElizaOS agent, backend API, and frontend application. Follow the instructions below to install and run each component.

### Prerequisites

- Node.js (version 22 or higher)
- pnpm package manager
- PHP 8.1 or higher
- Composer
- MySQL or SQLite database

## ElizaOS Agent Installation

Navigate to the `eliza-r3boot` folder and follow these steps:

1. Install dependencies:
```bash
cd eliza-r3boot
pnpm install
```

2. Configure environment:
```bash
cp .env.example .env
```

3. Edit the `.env` file with the following keys and configuration:
```env
GROK_API_KEY=

# R3boot Configuration
MANTLE_RPC_URL=
MANTLE_EXPLORER_API_URL=https://explorer.sepolia.mantle.xyz/api
TOKEN_ADDRESSES=["0xdEAddEaDdeadDEadDEADDEAddEADDEAddead1111","0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9","0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE"]
RPC_PROVIDER_URL=https://testnet-rpc.etherspot.io/v2/5003?api-key=etherspot_3ZJdtNqp5Q1NjqTLC9FdG5v8
PRIMESDK_API_KEY=
WALLET_PRIVATE_KEY=
WALLET_PUBLIC_KEY=
```

4. Build and deploy the agent:
```bash
pnpm build
pnpm start --characters="r3boot.character.json"
```

## Backend Installation

Navigate to the `backend` folder and follow these steps:

1. Install PHP dependencies:
```bash
cd backend
composer install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Configure your database settings in the `.env` file

4. Generate application key:
```bash
php artisan key:generate
```

5. Run database migrations:
```bash
php artisan migrate
```

6. Start the Laravel development server:
```bash
php artisan serve
```

The backend API will be available at `http://localhost:8000`

## Frontend Installation

Navigate to the `frontend` folder and follow these steps:

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend application will be available at `http://localhost:5173`

## Running the Complete Stack

1. Start the backend server: `php artisan serve` (from backend folder)
2. Start the frontend development server: `npm run dev` (from frontend folder)
3. Start the ElizaOS agent: `pnpm start --characters="r3boot.character.json"` (from eliza-r3boot folder)

All three components should now be running and communicating with each other.
