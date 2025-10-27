# Agregar DATABASE_URL a Vercel

El error 500 en `/api/orders` significa que **falta la variable DATABASE_URL en Vercel**.

## Paso 1: Obtener DATABASE_URL de Railway

1. Ve a https://railway.app
2. Abre tu proyecto de base de datos
3. Click en la pestaña **Variables**
4. Busca `DATABASE_URL` y copia el valor completo
   - Se ve algo así: `postgresql://postgres:contraseña@host.railway.app:5432/railway`

## Paso 2: Agregar en Vercel

1. Ve a https://vercel.com/diegohenao25s-projects/cafeteria-pantojito
2. Click en **Settings** (arriba)
3. Click en **Environment Variables** (menú izquierdo)
4. Click en **Add New**
5. Agrega:
   - **Key**: `DATABASE_URL`
   - **Value**: (pega el valor que copiaste de Railway)
   - **Environment**: Selecciona **Production**, **Preview**, y **Development**
6. Click en **Save**

## Paso 3: Redesplegar

Después de agregar la variable, Vercel te preguntará si quieres redesplegar. Click en **Redeploy** o ve a la pestaña **Deployments** y redespliega el último deployment.

## Verificar

Después del redespliegue, prueba hacer un pedido de nuevo. Ahora debería funcionar correctamente.
