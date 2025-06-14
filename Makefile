
# Makefile for Spotify Analytics Dashboard

# Variables
NODE_MODULES := node_modules
DIST_DIR := dist

# Default target
.DEFAULT_GOAL := dev

# Help command to show available targets
help:
	@echo "Available commands:"
	@echo "  install     - Install dependencies"
	@echo "  dev         - Start development server"
	@echo "  build       - Build for production"
	@echo "  preview     - Preview production build"
	@echo "  lint        - Lint the code"
	@echo "  type-check  - Run TypeScript type checking"
	@echo "  clean       - Clean build artifacts and node_modules"
	@echo "  test        - Run tests (if configured)"
	@echo "  format      - Format code with Prettier"
	@echo "  setup-env   - Create .env file from .env.example"
	@echo "  setup       - Full setup (install + setup-env)"

# Install dependencies
install:
	@echo "Installing dependencies..."
	npm install

# Start development server
dev:
	@echo "Starting development server..."
	npm run dev

# Build for production
build:
	@echo "Building for production..."
	npm run build

# Preview production build
preview: build
	@echo "Starting preview server..."
	npm run preview

# Lint the code
lint:
	@echo "Linting code..."
	npm run lint

# Type check
type-check:
	@echo "Running TypeScript type checking..."
	npx tsc --noEmit

# Format code
format:
	@echo "Formatting code..."
	npx prettier --write "src/**/*.{ts,tsx,js,jsx,json,css,md}"

# Run tests
test:
	@echo "Running tests..."
	npm test

# Clean up build artifacts and dependencies
clean:
	@echo "Cleaning up..."
	rm -rf $(DIST_DIR) $(NODE_MODULES)

# Create .env file from example
setup-env:
	@if [ ! -f .env ]; then \
		echo "Creating .env file from .env.example..."; \
		cp .env.example .env; \
		echo ".env file created! Please edit it with your configuration."; \
	else \
		echo ".env file already exists."; \
	fi

# Full setup
setup: install setup-env
	@echo "Setup complete! Run 'make dev' to start the development server."

# Quick start with dummy data
start-dummy:
	@echo "Starting with dummy data..."
	@echo "VITE_USE_DUMMY_DATA=true" > .env.local
	@echo "VITE_APP_ENV=development" >> .env.local
	npm run dev

# Deploy preparation
deploy-prep: clean install build
	@echo "Deployment build ready in $(DIST_DIR)/"

# Development utilities
dev-logs:
	@echo "Starting dev server with verbose logging..."
	npm run dev -- --host --open

# Check project health
health-check: type-check lint
	@echo "Project health check completed!"

.PHONY: help install dev build preview lint type-check format test clean setup-env setup start-dummy deploy-prep dev-logs health-check
