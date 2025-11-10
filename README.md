# R3almN8N

[![GitHub Repo stars](https://img.shields.io/github/stars/R3almN8N/R3almN8N?style=social)](https://github.com/R3almN8N/R3almN8N)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v20-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-v5-orange.svg)](https://vitejs.dev/)
[![Web3](https://img.shields.io/badge/Web3-Ecosystem-purple.svg)](https://web3.org/)

R3almN8N is an open-source, self-hosted workflow automation tool inspired by n8n, developed by **Capital Realm, Inc.** as a core component of our **Web3 Ecosystem**. It features a visual drag-and-drop editor for building workflows, a robust backend engine for execution, and extensible nodes for integrations (e.g., HTTP, email, AI via LangChain, and Web3 primitives like smart contracts and oracles). Designed for developers in decentralized environments, it's modular, scalable, and AI-ready—perfect for devops, marketing automations, RAG-based chatbots, or blockchain event triggers.

This is an MVP in active development (as of November 2025). Built with a small team mindset: lightweight, TypeScript-first, and deployable via Docker. Expect 20+ core integrations in v1.0, with Web3-focused expansions. Primary domain: [r3alm.com](https://r3alm.com); MVP hosted at [aiflow.r3alm.com](https://aiflow.r3alm.com).

## ✨ Features

- **Visual Workflow Builder**: Drag-and-drop nodes with React Flow; real-time testing, undo/redo, and template imports.
- **Extensible Node System**: Triggers (webhook/CRON), actions (HTTP/DB), logic (if/else/loops), AI nodes (prompts, embeddings), and **Web3 nodes** (e.g., Ethereum event listeners, token transfers via Ethers.js).
- **Execution Engine**: Sequential/parallel runs with BullMQ queues, retries, error handling, and WebSockets for status updates.
- **Integrations**: 20+ starters (OAuth for Google/Slack, REST APIs); marketplace for custom plugins, including IPFS for decentralized workflow storage.
- **Multi-Tenancy & Security**: Supabase auth (JWT/RBAC), data isolation, audit logs; wallet-based auth stub for Web3.
- **Deployment Options**: Self-hosted (Docker/K8s), hybrid SaaS; scheduling via CRON.
- **AI Depth**: LangChain for agentic flows, vector DBs (Pinecone), multimodal support (e.g., Stable Diffusion).
- **Pro UI**: Responsive nav (mega-dropdowns, hamburger), Tailwind styling, Framer Motion anims, dark mode.

| Feature | Status | Notes |
|---------|--------|-------|
| Visual Editor | ✅ MVP | React Flow + zoom/debug |
| Core Engine | ✅ MVP | BullMQ + sequential exec |
| Nodes/Integrations | 🔄 In Progress | 20+; AI/Web3 stubs ready |
| Scheduling/Triggers | ✅ Basic | CRON via BullMQ; Web3 events planned |
| Multi-Tenancy | ✅ Basic | Supabase RLS |
| Marketplace | 📋 Planned | User-submitted nodes (incl. DAO-voted) |

## 🛠 Tech Stack

- **Frontend**: React 18+ (TS, hooks), Vite (fast HMR), React Flow (editor), Tailwind CSS (styling), Framer Motion (anims), Lucide/Heroicons (icons).
- **Backend**: Node.js/Express (API), BullMQ + Redis (queues/engine), Supabase (Postgres DB + auth).
- **Web3**: Ethers.js/Web3.js (blockchain nodes), IPFS (decentralized storage stub).
- **DevOps**: Docker Compose (local stack), GitHub Actions (CI/CD), Prometheus/Grafana (monitoring stub).
- **AI/Ext**: LangChain (agents), OpenAI/Claude APIs (prompts), Pinecone (vectors).
- **Tools**: TypeScript (typesafety), Yarn/PNPM (deps), VSCode (Mac OSX optimized).

No heavy frameworks—keeps it lightweight (~50MB Docker image).

## 🚀 Quick Start

### Prerequisites
- Node.js ≥20
- Docker (for local Supabase/Redis)
- Yarn/PNPM (or npm)
- Supabase account (free tier: create project for DB/auth)

### Installation
1. Clone the repo:
   ```bash
   git clone https://github.com/R3almN8N/R3almN8N.git
   cd R3almN8N
