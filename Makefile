.PHONY: run build test clean docker-up docker-down

# Run the application
run:
	go run main.go

# Build the application
build:
	go build -o cafeteria-api main.go

# Run tests
test:
	go test -v ./...

# Clean build artifacts
clean:
	rm -f cafeteria-api

# Start Docker containers
docker-up:
	docker-compose up -d

# Stop Docker containers
docker-down:
	docker-compose down

# View logs
logs:
	docker-compose logs -f api

# Install dependencies
deps:
	go mod download
	go mod tidy

# Create a new migration
migrate-create:
	@read -p "Enter migration name: " name; \
	migrate create -ext sql -dir internal/db/migrations -seq $$name
