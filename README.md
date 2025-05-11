# The Delsaur Frontend

This repository contains the **frontend**, **backend** and **developpement database** application for The Delsaur project, a Tamagotchi‑inspired dinosaur care game. It provides a responsive user interface built with modern web technologies.

---

## Table of Contents

* [Prerequisites](#prerequisites)
* [Environment Variables](#environment-variables)
* [Development Setup](#development-setup)

  * [Install Dependencies](#install-dependencies)
  * [Running with Docker Compose](#running-with-docker-compose)
  * [Running Locally without Docker](#running-locally-without-docker)
* [Production](#production)
* [Deployment](#deployment)
* [Contributing](#contributing)
* [License](#license)

---

## Prerequisites

Before starting, ensure you have the following installed:

* **Node.js** v16 or higher
* **npm** (bundled with Node.js) or **yarn**
* **Docker** v20.10+ and **Docker Compose** v1.27+ (or Docker Compose plugin)

---

## Environment Variables

Configuration is managed via `.env` files. Two main environments are supported:

* **Development**: `.env.dev`
* **Production**: `.env.prod`

Copy the example file and adjust values as needed:

```bash
cp .env.example .env.dev
# or
cp .env.example .env.prod
```

Ensure the following variables are set:

```dotenv
# .env.dev
REACT_APP_API_URL=http://localhost:3000/api
# add other keys as required
```

```dotenv
# .env.prod
REACT_APP_API_URL=https://api.yourdomain.com
# AWS_ACCOUNT_ID, AWS_REGION, TAG may be defined at deployment
```

---

## Development Setup

### Install Dependencies

```bash
# In the frontend directory
npm install
# or
yarn install
```

### Running with Docker Compose

A Docker Compose file for development is provided at `docker-compose.dev.yml`. It brings up MariaDB, the backend, and this frontend:

```bash
# From project root or frontend folder
docker-compose -f docker-compose.dev.yml up --build
```

* Frontend will be available at [http://localhost:8080](http://localhost:8080)
* Backend runs on [http://localhost:3000](http://localhost:3000)
* MariaDB (dev) is exposed on port 3307

> **Tip:** With Docker Compose v2 you can also use:
>
> ```bash
> docker compose -f docker-compose.dev.yml up --build
> ```

### Running Locally without Docker

If you prefer running the frontend outside of Docker:

```bash
npm install
npm run dev       # start in development mode
# or
npm start         # if configured for production-like start
```

You must have the backend running locally at the URL defined in `REACT_APP_API_URL`.

---

## Production

Production images are published to AWS ECR. The production Compose file (used by your deployment pipeline) is `docker-compose.yml` in the project root and references images by tag:

```yaml
services:
  frontend:
    image: "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/iddlesaur-frontend:${TAG}"
    env_file:
      - .env.prod
```

On deployment, ensure the following variables are set in your CI/CD environment:

* `AWS_ACCOUNT_ID`
* `AWS_REGION`
* `TAG` (e.g., `v1.2.3`)

---

## Deployment

The deployment pipeline will:

1. Validate infrastructure (CloudFormation/Terraform)
2. Build and tag both backend and frontend Docker images
3. Push images to AWS ECR
4. Launch or update services in your container platform (e.g., ECS, Kubernetes)

> See the root-level `deploy.sh` (or your CI/CD config) for exact commands.

---

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

Ensure all tests pass and follow the established code style.

---

## License

The Delsaur Frontend is released under the **MIT License**. See [LICENSE](../LICENSE) for details.
