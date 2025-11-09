.PHONY: help dev run stop install build clean logs

# Default target - show help
help:
	@echo "Youth Resource Navigator - Development Commands"
	@echo ""
	@echo "Usage:"
	@echo "  make dev        Start development servers (frontend + proxy)"
	@echo "  make run        Alias for 'make dev'"
	@echo "  make stop       Stop all running servers"
	@echo "  make install    Install dependencies"
	@echo "  make build      Build for production"
	@echo "  make clean      Clean node_modules and build artifacts"
	@echo "  make logs       Show logs from running servers"
	@echo ""
	@echo "Prerequisites:"
	@echo "  - Node.js v18+"
	@echo "  - .env file with VITE_ANTHROPIC_API_KEY"
	@echo ""

# Install dependencies
install:
	@echo "📦 Installing dependencies..."
	npm install
	@echo "✅ Dependencies installed!"

# Start development servers
dev:
	@echo "🚀 Starting development servers..."
	@echo ""
	@echo "  📱 Frontend: http://localhost:5173"
	@echo "  🔌 Proxy:    http://localhost:3001"
	@echo ""
	@echo "Press Ctrl+C to stop all servers"
	@echo ""
	@trap 'make stop' INT; \
	node server.js & echo $$! > .proxy.pid & \
	npm run dev & echo $$! > .vite.pid & \
	wait

# Alias for dev
run: dev

# Stop all servers
stop:
	@echo "🛑 Stopping servers..."
	@if [ -f .proxy.pid ]; then \
		kill `cat .proxy.pid` 2>/dev/null || true; \
		rm .proxy.pid; \
		echo "  ✅ Proxy server stopped"; \
	fi
	@if [ -f .vite.pid ]; then \
		kill `cat .vite.pid` 2>/dev/null || true; \
		rm .vite.pid; \
		echo "  ✅ Vite server stopped"; \
	fi
	@pkill -f "node server.js" 2>/dev/null || true
	@pkill -f "vite" 2>/dev/null || true
	@lsof -ti:3001 | xargs kill -9 2>/dev/null || true
	@lsof -ti:5173 | xargs kill -9 2>/dev/null || true
	@echo "✅ All servers stopped"

# Build for production
build:
	@echo "🏗️  Building for production..."
	npm run build
	@echo "✅ Build complete! Files in dist/"

# Clean everything
clean:
	@echo "🧹 Cleaning..."
	rm -rf node_modules
	rm -rf dist
	rm -f .proxy.pid .vite.pid
	@echo "✅ Cleaned!"

# Show logs (for background processes)
logs:
	@echo "📋 Server logs:"
	@echo ""
	@if [ -f .proxy.pid ]; then \
		echo "Proxy server (PID: `cat .proxy.pid`)"; \
	else \
		echo "Proxy server: Not running"; \
	fi
	@if [ -f .vite.pid ]; then \
		echo "Vite server (PID: `cat .vite.pid`)"; \
	else \
		echo "Vite server: Not running"; \
	fi
