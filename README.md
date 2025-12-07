# Netflix Max

A concept streaming platform combining Netflix and HBO Max, built with modern web technologies.

> ⚠️ **Disclaimer**: This is a demo/concept project for educational and UI/UX demonstration purposes only. Not affiliated with Netflix or HBO Max.

## 🎬 Overview

Netflix Max imagines how a unified streaming service might work if Netflix and HBO Max were bundled together. Features real movie/TV data from TMDB API with a modern, responsive UI.

## ✨ Features

- **Authentication** - User registration and login with JWT
- **Content Browsing** - Movies, TV Shows, and Max Hub sections
- **Search** - Debounced search with filter tabs
- **My List** - Save favorites with localStorage persistence
- **Trailer Playback** - YouTube trailer integration with auto-fullscreen
- **Public Landing** - Top 10 trending sections
- **Responsive Design** - Mobile-first with glassmorphism effects

## 🛠️ Tech Stack

### Backend (`apps/api`)

- **NestJS** - Node.js framework
- **PostgreSQL** - Database
- **Drizzle ORM** - Type-safe ORM
- **Redis** - Caching
- **JWT/Passport** - Authentication

### Frontend (`apps/web`)

- **Nuxt 3** - Vue.js framework
- **TailwindCSS** - Styling
- **Pinia** - State management
- **Lucide Icons** - Icons

### Shared (`packages/`)

- `@netflix-max/types` - TypeScript types
- `@netflix-max/config` - Shared config

## 📁 Project Structure

```
netflix-max/
├── apps/
│   ├── api/          # NestJS Backend
│   └── web/          # Nuxt Frontend
├── packages/
│   ├── types/        # Shared types
│   └── config/       # Shared config
├── docker/           # Docker files
└── turbo.json        # Turborepo config
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8
- PostgreSQL
- Redis

### Installation

```bash
# Clone repository
git clone <repo-url>
cd netflix-max

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Edit .env with your values
```

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/netflix_max
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key

# TMDB API
TMDB_API_KEY=your-tmdb-api-key

# Application
PORT=3001
FRONTEND_URL=http://localhost:3000
```

### Development

```bash
# Start all services
pnpm run dev

# Or start individually
pnpm --filter @netflix-max/api dev
pnpm --filter @netflix-max/web dev
```

### Docker

```bash
cd docker
docker-compose up -d
```

## 📱 Pages

| Route       | Description         |
| ----------- | ------------------- |
| `/`         | Public landing page |
| `/home`     | Main browse page    |
| `/movies`   | Movies section      |
| `/series`   | TV series section   |
| `/max-hub`  | HBO Max content     |
| `/search`   | Search results      |
| `/my-list`  | Saved items         |
| `/login`    | Login page          |
| `/register` | Register page       |

## 🔌 API Endpoints

| Endpoint                | Description       |
| ----------------------- | ----------------- |
| `POST /auth/register`   | User registration |
| `POST /auth/login`      | User login        |
| `GET /content/home`     | Home page content |
| `GET /content/search`   | Search content    |
| `GET /content/trending` | Public trending   |

## 📄 License

MIT License - For educational purposes only.

---

Built with ❤️ as a concept project
