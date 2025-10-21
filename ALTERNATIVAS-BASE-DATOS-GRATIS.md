# Alternativas de Base de Datos GRATIS

PlanetScale ya no tiene plan gratuito. Aquí están las mejores alternativas:

---

## OPCIÓN 1: RAILWAY (RECOMENDADA - MySQL)

**Ventajas:**
- $5 de crédito GRATIS cada mes
- Soporta MySQL (no necesitas cambiar nada en tu código)
- Muy fácil de usar
- Suficiente para proyectos pequeños/medianos

**Pasos:**

1. **Ve a:** https://railway.app

2. **Haz clic en "Start a New Project"**

3. **Selecciona "Login with GitHub"**

4. **Autoriza a Railway**

5. **Haz clic en "+ New Project"**

6. **Selecciona "Provision MySQL"**

7. **Espera 1 minuto a que se cree**

8. **Haz clic en la base de datos MySQL**

9. **Ve a la pestaña "Variables"**

10. **Copia el valor de `MYSQL_PUBLIC_URL`** (algo como: `mysql://root:password@...`)

11. **Guarda esa URL, la necesitarás para Vercel**

---

## OPCIÓN 2: SUPABASE (100% GRATIS - PostgreSQL)

**Ventajas:**
- Completamente GRATIS para siempre
- Muy confiable
- Incluye autenticación y storage

**Desventaja:**
- Usa PostgreSQL en lugar de MySQL (necesitas cambiar 1 línea en tu código)

**Pasos:**

1. **Ve a:** https://supabase.com

2. **Haz clic en "Start your project"**

3. **Selecciona "Sign in with GitHub"**

4. **Autoriza a Supabase**

5. **Haz clic en "New project"**

6. **Completa:**
   - **Name:** cafeteria-pantojito
   - **Database Password:** Crea una contraseña segura (guárdala)
   - **Region:** Selecciona la más cercana
   - **Plan:** Free (gratis)

7. **Haz clic en "Create new project"**

8. **Espera 2-3 minutos**

9. **Ve a "Settings" → "Database"**

10. **Busca "Connection string" → "URI"**

11. **Copia la URL y reemplaza `[YOUR-PASSWORD]` con tu contraseña**

12. **Guarda esa URL**

**IMPORTANTE: Si usas Supabase, necesitas cambiar 1 línea en tu código:**

En el archivo `prisma/schema.prisma`, cambia:

\`\`\`prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
\`\`\`

Por:

\`\`\`prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
\`\`\`

---

## OPCIÓN 3: NEON (100% GRATIS - PostgreSQL)

Similar a Supabase, también usa PostgreSQL.

1. **Ve a:** https://neon.tech
2. **Sign up with GitHub**
3. **Crea un nuevo proyecto**
4. **Copia la connection string**
5. **Cambia el provider en Prisma a "postgresql"**

---

## MI RECOMENDACIÓN

**Para ti, te recomiendo RAILWAY porque:**
- Usa MySQL (no necesitas cambiar nada en tu código)
- Es muy fácil de configurar
- $5 gratis al mes es suficiente para empezar
- Cuando tu negocio crezca, puedes pagar más

**Si prefieres algo 100% gratis para siempre, usa SUPABASE** (solo necesitas cambiar 1 línea de código)

---

## SIGUIENTE PASO

Dime cuál opción prefieres:
1. **Railway** (MySQL, $5 gratis/mes, más fácil)
2. **Supabase** (PostgreSQL, 100% gratis, necesitas cambiar 1 línea)

Y te guío paso a paso.
