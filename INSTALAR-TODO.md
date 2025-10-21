# 📦 Guía Completa de Instalación - Cafetería Pantojito

Esta guía contiene TODOS los comandos necesarios para instalar el proyecto desde cero. Solo copia y pega en orden.

---

## ⚠️ IMPORTANTE: Antes de Empezar

1. **Verifica que Node.js esté instalado:**
\`\`\`bash
node --version
\`\`\`
Debe mostrar v18 o superior. Si no está instalado, descárgalo de: https://nodejs.org/

2. **Verifica que XAMPP esté corriendo:**
- Abre XAMPP Control Panel
- Inicia Apache
- Inicia MySQL

---

## 📋 PASO 1: Limpiar Instalación Anterior (Si existe)

Copia y pega estos comandos uno por uno:

\`\`\`bash
rm -rf node_modules
\`\`\`

\`\`\`bash
rm package-lock.json
\`\`\`

\`\`\`bash
npm cache clean --force
\`\`\`

**En Windows PowerShell usa:**
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm cache clean --force
