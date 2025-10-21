#!/bin/bash

# Script para exportar la base de datos de XAMPP

echo "🔄 Exportando base de datos de XAMPP..."

# Configuración
DB_NAME="cafeteria_pantojito"
DB_USER="root"
DB_PASSWORD=""
OUTPUT_FILE="backup-$(date +%Y%m%d-%H%M%S).sql"

# Exportar
mysqldump -u $DB_USER -p$DB_PASSWORD $DB_NAME > $OUTPUT_FILE

echo "✅ Base de datos exportada a: $OUTPUT_FILE"
echo ""
echo "📤 Ahora puedes importar este archivo a tu base de datos en la nube"
