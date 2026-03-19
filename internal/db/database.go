package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	_ "github.com/go-sql-driver/mysql"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/mysql"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func CreateDatabase() (*sql.DB, error) {
	serverName := os.Getenv("DB_HOST")
	if serverName == "" {
		serverName = "localhost:3306"
	}
	
	user := os.Getenv("DB_USER")
	if user == "" {
		user = "root"
	}
	
	password := os.Getenv("DB_PASSWORD")
	log.Printf("[DEBUG] Connecting with - User: %s, Host: %s, Password length: %d", user, serverName, len(password))
	
	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		dbName = "cafeteria"
	}

	connectionString := fmt.Sprintf("%s:%s@tcp(%s)/%s?charset=utf8mb4&collation=utf8mb4_unicode_ci&parseTime=true&multiStatements=true", 
		user, password, serverName, dbName)
	
	db, err := sql.Open("mysql", connectionString)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	log.Println("Database connected successfully")

	if err := migrateDatabase(db); err != nil {
		return db, err
	}

	return db, nil
}

func migrateDatabase(db *sql.DB) error {
	driver, err := mysql.WithInstance(db, &mysql.Config{})
	if err != nil {
		return err
	}

	dir, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}

	migration, err := migrate.NewWithDatabaseInstance(
		fmt.Sprintf("file://%s/internal/db/migrations", dir),
		"mysql",
		driver,
	)
	if err != nil {
		return err
	}

	migration.Log = &MigrationLogger{}
	migration.Log.Printf("Applying database migrations")

	err = migration.Up()
	if err != nil && err != migrate.ErrNoChange {
		return err
	}

	version, _, err := migration.Version()
	if err != nil {
		return err
	}

	migration.Log.Printf("Active database version: %d", version)
	return nil
}
