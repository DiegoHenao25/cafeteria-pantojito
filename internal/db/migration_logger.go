package db

import "log"

type MigrationLogger struct{}

func (l *MigrationLogger) Printf(format string, v ...interface{}) {
	log.Printf("[MIGRATION] "+format, v...)
}

func (l *MigrationLogger) Verbose() bool {
	return true
}
