# ChainMed 🔗💊

> **Decentralized Medical Supply Chain Tracker**
> A fully functional blockchain + Java + React application that tracks pharmaceuticals from manufacturer to hospital — with every event permanently recorded on the Ethereum blockchain.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-chainmed.vercel.app-blue?style=for-the-badge)](https://chainmed.vercel.app)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)](https://reactjs.org)
[![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=java)](https://java.com)
[![Ethereum](https://img.shields.io/badge/Ethereum-Blockchain-purple?style=for-the-badge&logo=ethereum)](https://ethereum.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql)](https://postgresql.org)

---

## 🌐 Live Site

**Production URL:** https://chainmed.vercel.app

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
  - [Docker Compose](#docker-compose)
- [Frontend](#frontend)
- [Backend API](#backend-api)
- [Blockchain / Smart Contracts](#blockchain--smart-contracts)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Roadmap](#roadmap)

---

## Overview

ChainMed is a **decentralized medical supply chain tracker** that solves the problem of pharmaceutical counterfeiting and opaque supply chains. Every product registered in the system is recorded on the **Ethereum blockchain**, creating an immutable audit trail from manufacturer to end consumer.

### The Problem
- Counterfeit pharmaceuticals cost the industry billions annually
- Traditional supply chain databases are centralized, mutable, and siloed
- There is no single source of truth for a product's journey

### The Solution
ChainMed creates a tamper-proof digital passport for every pharmaceutical product:
1. Manufacturer registers the product → stored in PostgreSQL + hash recorded on Ethereum
2. Each handoff (distributor → pharmacy → hospital) is an immutable blockchain event
3. Anyone can verify a product's authenticity by checking its blockchain transaction hash

---

## Features

| Feature | Description |
|---------|-------------|
| 📦 **Product Registration** | Register new pharmaceutical products with batch numbers, manufacturer details, expiry dates |
| 🔍 **Product Tracking** | Search any product by batch number or ID to see its current status |
| 🔗 **Blockchain Recording** | Every registration and status update is hashed and stored on Ethereum |
| 📊 **Dashboard** | Real-time stats: total products, in-transit count, deliveries, blockchain records |
| 🗺️ **Supply Chain Timeline** | Full event history: Manufacturer → Distributor → Pharmacy → Hospital |
| 🔐 **Blockchain Explorer** | Browse all on-chain transactions with block numbers, tx hashes, timestamps |
| ✅ **Verification** | Verify product authenticity via blockchain transaction hash |
| 🚨 **Recall Management** | Flag and recall products across the entire supply chain |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | SPA user interface |
| **Styling** | TailwindCSS 3 | Utility-first CSS framework |
| **Charts** | Recharts | Dashboard analytics |
| **Web3** | Ethers.js v6 + Web3.js v4 | Ethereum blockchain interaction |
| **Backend** | Java 17 + Spring Boot 3 | REST API server |
| **ORM** | Spring Data JPA + Hibernate | Database abstraction |
| **Migrations** | Flyway | Database schema versioning |
| **Database** | PostgreSQL 15 | Open-source relational database |
| **Blockchain** | Ethereum (Solidity 0.8) | Smart contract platform |
| **Dev Tools** | Hardhat | Smart contract development + testing |
| **Containerization** | Docker + Docker Compose | Local orchestration |
| **Hosting** | Vercel (frontend) | Production deployment |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                          │
│  React 18 + Vite + TailwindCSS + Ethers.js              │
│  https://chainmed.vercel.app                            │
└──────────────┬────────────────────┬────────────────────-┘
               │ REST API           │ JSON-RPC / Web3
               ▼                    ▼
┌──────────────────────┐  ┌─────────────────────────────┐
│   JAVA BACKEND       │  │   ETHEREUM BLOCKCHAIN        │
│   Spring Boot 3      │  │   Solidity Smart Contract    │
│   Port 8080          │  │   SupplyChain.sol            │
│   REST API           │  │   Sepolia Testnet /          │
│   Web3j integration  │  │   Local Hardhat Node         │
└──────────┬───────────┘  └─────────────────────────────┘
           │ JPA / Hibernate
           ▼
┌──────────────────────┐
│   PostgreSQL DB      │
│   Port 5432          │
│   Flyway migrations  │
│   products table     │
│   supply_chain_events│
│   blockchain_txns    │
└──────────────────────┘
```

### Data Flow
1. User registers a product via the React frontend
2. React sends a POST request to the Java Spring Boot API
3. Spring Boot validates and saves the product to PostgreSQL
4. Spring Boot uses **Web3j** to call the `SupplyChain.sol` smart contract
5. The smart contract emits a `ProductRegistered` event on Ethereum
6. The transaction hash is stored back in PostgreSQL for reference
7. The frontend displays the product with its blockchain verification hash

---

## Project Structure

```
newprod/
├── README.md                          # This file
├── docker-compose.yml                 # Full-stack local orchestration
│
├── frontend/                          # React + Vite application
│   ├── index.html                     # HTML entry point
│   ├── package.json                   # Node dependencies
│   ├── vite.config.js                 # Vite bundler config
│   ├── tailwind.config.js             # TailwindCSS config
│   ├── postcss.config.js              # PostCSS (required for Tailwind)
│   ├── vercel.json                    # Vercel deployment config
│   └── src/
│       ├── main.jsx                   # React entry point
│       ├── App.jsx                    # Router + providers
│       ├── index.css                  # Global styles + Tailwind directives
│       ├── components/
│       │   └── Layout.jsx             # Sidebar + navigation shell
│       ├── pages/
│       │   ├── Dashboard.jsx          # Stats + charts + recent products
│       │   ├── Products.jsx           # Product list + search
│       │   ├── ProductDetail.jsx      # Product detail + supply chain timeline
│       │   ├── RegisterProduct.jsx    # New product registration form
│       │   ├── TrackProduct.jsx       # Search & track by batch number
│       │   └── BlockchainExplorer.jsx # Browse blockchain transactions
│       ├── hooks/
│       │   └── useBlockchain.js       # Ethers.js wallet + contract hook
│       └── services/
│           └── api.js                 # REST API client (fetch-based)
│
├── backend/                           # Java Spring Boot application
│   ├── Dockerfile                     # Multi-stage Docker build
│   ├── pom.xml                        # Maven build file (Java 17, Spring Boot 3)
│   └── src/main/
│       ├── java/com/chainmed/
│       │   ├── ChainMedApplication.java      # Spring Boot entry point
│       │   ├── model/
│       │   │   └── Product.java              # JPA entity
│       │   └── controller/
│       │       └── ProductController.java    # REST endpoints
│       └── resources/
│           ├── application.properties        # Spring config (DB, Web3j)
│           └── db/migration/
│               └── V1__init_chainmed_schema.sql  # Flyway schema migration
│
└── blockchain/                        # Ethereum smart contracts
    ├── hardhat.config.js              # Hardhat network config
    ├── package.json                   # Hardhat + ethers dependencies
    ├── contracts/
    │   └── SupplyChain.sol            # Main smart contract
    └── scripts/
        └── deploy.js                  # Contract deployment script
```

---

## Getting Started

### Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | 18+ | https://nodejs.org |
| Java JDK | 17+ | https://adoptium.net |
| Maven | 3.9+ | https://maven.apache.org |
| PostgreSQL | 15+ | https://postgresql.org |
| Docker | 24+ | https://docker.com |
| MetaMask | Latest | https://metamask.io (browser extension) |

---

### Local Development

#### 1. Clone the repository

```bash
git clone https://github.com/Ansumansahoo/newprod.git
cd newprod
```

#### 2. Start the Blockchain (local Hardhat node)

```bash
cd blockchain
npm install
npx hardhat node
# In a new terminal:
npx hardhat run scripts/deploy.js --network localhost
# Copy the deployed contract address from output
```

#### 3. Start the Backend

```bash
# Create a PostgreSQL database
psql -U postgres -c "CREATE DATABASE chainmed;"

# Configure environment variables (or edit application.properties)
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=chainmed
export DB_USER=postgres
export DB_PASSWORD=your_password
export WEB3_RPC_URL=http://localhost:8545
export CONTRACT_ADDRESS=0x_your_deployed_contract_address

cd backend
mvn clean install
mvn spring-boot:run
# Backend starts at http://localhost:8080
```

#### 4. Start the Frontend

```bash
cd frontend
npm install

# Create .env.local
echo "VITE_API_URL=http://localhost:8080" > .env.local
echo "VITE_RPC_URL=http://localhost:8545" >> .env.local
echo "VITE_CONTRACT_ADDRESS=0x_your_contract_address" >> .env.local

npm run dev
# Frontend starts at http://localhost:5173
```

---

### Docker Compose

Spin up the entire stack (PostgreSQL + Backend + Frontend) with one command:

```bash
# Clone and start
git clone https://github.com/Ansumansahoo/newprod.git
cd newprod

# Start all services
docker-compose up --build

# Services will be available at:
# Frontend:  http://localhost:3000
# Backend:   http://localhost:8080
# Database:  localhost:5432
```

To stop all services:
```bash
docker-compose down
# To also remove volumes (database data):
docker-compose down -v
```

---

## Frontend

The frontend is a React 18 SPA built with Vite and styled with TailwindCSS.

### Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Dashboard | Stats cards, activity chart, recent products |
| `/products` | Products | Searchable product list with status badges |
| `/products/:id` | ProductDetail | Full product info + supply chain timeline |
| `/register` | RegisterProduct | Form to register a new product on-chain |
| `/track` | TrackProduct | Search by batch number or product ID |
| `/blockchain` | BlockchainExplorer | Browse all Ethereum transactions |

### Key Dependencies

```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.21.0",
  "ethers": "^6.9.0",
  "web3": "^4.3.0",
  "recharts": "^2.10.0",
  "lucide-react": "^0.303.0",
  "@tanstack/react-query": "^5.17.0",
  "react-hot-toast": "^2.4.1",
  "tailwindcss": "^3.4.0"
}
```

### Build for Production

```bash
cd frontend
npm run build
# Output: frontend/dist/
```

---

## Backend API

The Java Spring Boot backend exposes a REST API on port 8080.

### Technology Details

- **Java 17** — LTS release with modern language features
- **Spring Boot 3.2** — Auto-configured application framework
- **Spring Data JPA** — Repository pattern over Hibernate ORM
- **Flyway** — SQL migration versioning (runs on startup)
- **Web3j** — Java library for Ethereum JSON-RPC interaction
- **PostgreSQL Driver** — JDBC connection to PostgreSQL

### Maven Dependencies (pom.xml highlights)

```xml
<dependencies>
  <dependency>spring-boot-starter-web</dependency>
  <dependency>spring-boot-starter-data-jpa</dependency>
  <dependency>flyway-core</dependency>
  <dependency>postgresql</dependency>
  <dependency>web3j-core</dependency>
</dependencies>
```

---

## Blockchain / Smart Contracts

### SupplyChain.sol

The core smart contract deployed on Ethereum. It stores product registration events on-chain.

**Key Functions:**

| Function | Description |
|----------|-------------|
| `registerProduct(string batchId, string name, address manufacturer)` | Register a new product on-chain |
| `updateStatus(string batchId, uint8 status, string location)` | Update product status (REGISTERED / IN_TRANSIT / DELIVERED / RECALLED) |
| `getProduct(string batchId)` | Read product data from the blockchain |
| `getEventHistory(string batchId)` | Get all supply chain events for a product |

**Events Emitted:**

```solidity
event ProductRegistered(string batchId, string name, address manufacturer, uint256 timestamp);
event StatusUpdated(string batchId, uint8 status, string location, address updatedBy, uint256 timestamp);
```

**Deployment Networks:**

| Network | Status | Notes |
|---------|--------|-------|
| Hardhat Local | ✅ Supported | `npx hardhat node` |
| Sepolia Testnet | 🔧 Configure | Add `SEPOLIA_RPC_URL` + `PRIVATE_KEY` to `.env` |
| Ethereum Mainnet | 🚀 Future | Production deployment |

### Deploy to Sepolia Testnet

```bash
cd blockchain

# Create .env
echo "SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY" > .env
echo "PRIVATE_KEY=your_wallet_private_key" >> .env

# Deploy
npx hardhat run scripts/deploy.js --network sepolia
# Output: Contract deployed at: 0x...
```

---

## Database Schema

Managed by **Flyway** migrations in `backend/src/main/resources/db/migration/`.

### Tables

#### `products`
| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL PRIMARY KEY | Auto-increment ID |
| batch_number | VARCHAR(100) UNIQUE | Unique batch identifier |
| name | VARCHAR(255) | Product name |
| manufacturer | VARCHAR(255) | Manufacturer name |
| category | VARCHAR(100) | Product category |
| quantity | INTEGER | Unit quantity |
| expiry_date | DATE | Product expiry date |
| description | TEXT | Additional description |
| status | VARCHAR(50) | REGISTERED / IN_TRANSIT / DELIVERED / RECALLED |
| blockchain_tx_hash | VARCHAR(66) | Ethereum transaction hash |
| created_at | TIMESTAMPTZ | Record creation time |
| updated_at | TIMESTAMPTZ | Last update time |

#### `supply_chain_events`
| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL PRIMARY KEY | Auto-increment ID |
| product_id | BIGINT FK | References products.id |
| event_type | VARCHAR(100) | MANUFACTURED / SHIPPED / RECEIVED / DISPENSED |
| location | VARCHAR(255) | Geographic location of event |
| handled_by | VARCHAR(255) | Actor (distributor, pharmacy, etc.) |
| blockchain_tx_hash | VARCHAR(66) | On-chain transaction hash |
| timestamp | TIMESTAMPTZ | Event time |

#### `blockchain_transactions`
| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL PRIMARY KEY | Auto-increment ID |
| transaction_hash | VARCHAR(66) UNIQUE | Ethereum tx hash |
| product_id | BIGINT FK | Related product |
| event_type | VARCHAR(100) | Type of blockchain event |
| block_number | BIGINT | Ethereum block number |
| gas_used | BIGINT | Gas consumed |
| status | VARCHAR(20) | PENDING / CONFIRMED / FAILED |
| timestamp | TIMESTAMPTZ | Transaction time |

---

## Deployment

### Frontend (Vercel)

The frontend is deployed on **Vercel** with automatic builds from the `main` branch.

**Current Production Deployment:**
- URL: https://chainmed.vercel.app
- Framework: Vite
- Root Directory: `frontend/`
- Build Command: `npm run build`
- Output Directory: `dist`

**Manual Redeploy via Vercel CLI:**
```bash
cd frontend
npm install -g vercel
vercel --prod
```

### Backend (Recommended: Railway or Render)

```bash
# Railway deployment
railway login
railway init
railway up

# Set environment variables in Railway dashboard:
# DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
# WEB3_RPC_URL, CONTRACT_ADDRESS
```

### Backend (Docker)

```bash
cd backend
docker build -t chainmed-backend .
docker run -p 8080:8080 \
  -e DB_HOST=your_db_host \
  -e DB_PASSWORD=your_password \
  -e CONTRACT_ADDRESS=0x_your_contract \
  chainmed-backend
```

---

## Environment Variables

### Frontend (`frontend/.env.local`)

```env
VITE_API_URL=http://localhost:8080
VITE_RPC_URL=http://localhost:8545
VITE_CONTRACT_ADDRESS=0x_your_contract_address
```

### Backend (`application.properties` or system env)

```properties
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=chainmed
DB_USER=postgres
DB_PASSWORD=your_password

# Ethereum
WEB3_RPC_URL=http://localhost:8545
CONTRACT_ADDRESS=0x_your_contract_address
```

### Blockchain (`blockchain/.env`)

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_wallet_private_key_without_0x_prefix
```

---

## API Reference

Base URL: `http://localhost:8080` (local) or your deployed backend URL.

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | List all products |
| `GET` | `/api/products/:id` | Get product by ID |
| `POST` | `/api/products` | Register a new product |
| `PUT` | `/api/products/:id/status` | Update product status |
| `GET` | `/api/products/track?q=` | Search by batch number or ID |
| `GET` | `/api/products/search?q=` | Search products by name/batch |

### Supply Chain Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products/:id/history` | Get all events for a product |
| `POST` | `/api/products/:id/events` | Add a new supply chain event |

### Blockchain

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/blockchain/transactions` | List all on-chain transactions |
| `GET` | `/api/blockchain/stats` | Blockchain statistics |
| `GET` | `/api/blockchain/verify/:id` | Verify product on-chain |

### Stats

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/stats` | General statistics |
| `GET` | `/api/stats/dashboard` | Dashboard summary stats |

### Example: Register a Product

```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Amoxicillin 500mg",
    "batchNumber": "BATCH-2026-001",
    "manufacturer": "PharmaCo Ltd",
    "category": "Antibiotic",
    "quantity": 10000,
    "expiryDate": "2028-12-31",
    "description": "Broad-spectrum antibiotic capsules"
  }'
```

### Example Response

```json
{
  "id": 1,
  "name": "Amoxicillin 500mg",
  "batchNumber": "BATCH-2026-001",
  "manufacturer": "PharmaCo Ltd",
  "status": "REGISTERED",
  "blockchainTxHash": "0x3a4b5c6d7e8f...",
  "createdAt": "2026-05-11T10:30:00Z"
}
```

---

## Roadmap

- [x] React frontend with Vite + TailwindCSS
- [x] All 6 page components (Dashboard, Products, Detail, Register, Track, Blockchain)
- [x] Vercel production deployment
- [x] Java Spring Boot REST API structure
- [x] Solidity smart contract (SupplyChain.sol)
- [x] PostgreSQL schema with Flyway migrations
- [x] Docker Compose orchestration
- [ ] Deploy Java backend to Railway/Render
- [ ] Connect PostgreSQL (Supabase or Railway Postgres)
- [ ] Deploy smart contract to Ethereum Sepolia testnet
- [ ] MetaMask wallet integration in frontend
- [ ] Real blockchain transaction recording
- [ ] JWT authentication for API endpoints
- [ ] Role-based access (Manufacturer / Distributor / Pharmacy / Hospital)
- [ ] QR code generation per product
- [ ] Mobile responsive UI improvements
- [ ] Unit tests (JUnit 5 + Jest)
- [ ] CI/CD pipeline (GitHub Actions)

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Author

**Ansumansahoo** — [github.com/Ansumansahoo](https://github.com/Ansumansahoo)

---

*Built with ❤️ using Java + React + Ethereum blockchain*
