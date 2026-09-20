# YaTeToca

Landing mobile-first y panel básico para validar manualmente pagos por Yape, construidos con Next.js 16, TypeScript, Tailwind CSS y Supabase.

> **Aviso:** el repositorio está en modo demostración. No habilites pagos ni publiques la landing hasta sustituir las bases y confirmar las autorizaciones aplicables a sorteos o juegos a distancia en Perú.

## Qué incluye

- Landing responsive con premio, contador, packs y probabilidad matemática.
- Flujo Yape: QR, instrucciones, confirmación y comprobante opcional.
- Código de compra único.
- Órdenes `pending`, `validated` y `rejected`.
- Asignación transaccional de números sin duplicados al validar.
- Consulta privada por DNI, celular o código.
- Panel `/admin`, búsqueda, comprobantes con URL temporal, métricas y CSV.
- Botón para preparar la confirmación por WhatsApp.
- Integraciones opcionales de GA, Meta Pixel y TikTok Pixel.
- Modo demo sin servicios externos.

## Ejecutar localmente

Requiere Node.js 22 o superior. Supabase anunció que sus librerías dejarían Node 20 en 2026; este proyecto usa Node 24 durante desarrollo.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Abre `http://localhost:3000`. Para el panel demo configura primero en `.env.local`:

```env
ADMIN_SESSION_SECRET=una-frase-aleatoria-larga
DEMO_ADMIN_EMAIL=admin@demo.local
DEMO_ADMIN_PASSWORD=una-clave-local-segura
```

El almacenamiento demo vive en memoria: se reinicia cuando reinicias el servidor. Para persistencia real conecta Supabase.

## Crear y conectar Supabase

1. Crea un proyecto gratuito en [Supabase](https://supabase.com/dashboard).
2. Abre **SQL Editor**, pega el contenido completo de `supabase/schema.sql` y ejecútalo.
3. En **Project Settings → API** copia:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`.
   - Publishable key → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
   - Secret key → `SUPABASE_SECRET_KEY`.
4. Nunca uses `SUPABASE_SECRET_KEY` con el prefijo `NEXT_PUBLIC_`. Esa clave omite RLS y solo puede existir en servidor.
5. En **Authentication → Users**, crea el usuario administrador.
6. Copia su UUID y ejecuta:

```sql
insert into public.admin_users(user_id)
values ('UUID-DEL-USUARIO');
```

7. Copia `.env.example` como `.env.local`, agrega los valores y reinicia Next.js.

El SQL activa RLS, revoca acceso público a órdenes, tickets y administradores, y crea `payment-proofs` como bucket privado. La asignación bloquea la fila del sorteo y se ejecuta en una sola transacción; la restricción única `(raffle_id, ticket_number)` añade una segunda defensa contra duplicados.

## Variables de entorno

| Variable | Se expone al navegador | Uso |
|---|---:|---|
| `NEXT_PUBLIC_SITE_URL` | Sí | URL canónica y compartir |
| `NEXT_PUBLIC_SUPABASE_URL` | Sí | Proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Sí | Clave pública |
| `SUPABASE_SECRET_KEY` | No | Operaciones seguras del servidor |
| `ADMIN_SESSION_SECRET` | No | Firma de sesión en demo |
| `DEMO_ADMIN_EMAIL/PASSWORD` | No | Acceso local sin Supabase |
| `LEGAL_VERSION` | No | Versión aceptada por el comprador |
| `NEXT_PUBLIC_GA_ID` | Sí | Google Analytics opcional |
| `NEXT_PUBLIC_META_PIXEL_ID` | Sí | Meta Pixel opcional |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | Sí | TikTok Pixel opcional |

## Deploy gratuito en Vercel

1. Sube la carpeta a un repositorio privado de GitHub.
2. En [Vercel](https://vercel.com/new), importa el repositorio.
3. Si esta carpeta permanece dentro de otra, define **Root Directory** como `yate-toca`.
4. Copia todas las variables de `.env.local` a **Settings → Environment Variables**.
5. Cambia `NEXT_PUBLIC_SITE_URL` a la URL final.
6. Despliega y prueba crear, validar, consultar y exportar una orden.

Los planes gratuitos permiten validar el producto, pero revisa límites y condiciones vigentes antes de una campaña pagada.

## Datos que debes reemplazar

- `src/config/site.ts`: nombre, WhatsApp, titular/número Yape y packs.
- QR demo dentro de `src/components/purchase-flow.tsx`.
- Fotos demo en `public/prize-iphone-17-pro*.jpg`, galería en `src/components/phone-visual.tsx` y datos del premio en Supabase. Las fotos demo provienen del Newsroom oficial de Apple y deben reemplazarse por fotos propias del premio real antes de publicar.
- Metadatos y `robots` antes de indexar el sitio.
- `src/app/bases/page.tsx` y `src/app/privacidad/page.tsx` después de revisión legal.
- Fila demo y 287 tickets demo al final de `supabase/schema.sql`.
- Mensaje de WhatsApp en `src/components/admin-panel.tsx`.

## Antes de producción

- Reemplaza el QR y haz una operación de prueba de monto mínimo.
- Contrata o confirma Yape Empresa y concilia el titular correcto.
- Obtén las autorizaciones y bases revisadas; luego cambia `LEGAL_VERSION`.
- Configura dominio, correo transaccional y Libro de Reclamaciones.
- Implementa un rate limiter compartido (Upstash/Redis o equivalente) si habrá tráfico alto; el actual es una barrera ligera por instancia.
- Añade CAPTCHA administrado si aparece abuso; nunca confíes solo en el frontend.
- Define backups, conservación y eliminación de DNI y comprobantes.
- Cambia `robots.ts` para permitir indexación únicamente cuando el proyecto esté autorizado.

## Eventos de analítica

Se emiten: `view_content`, `select_pack`, `click_payment` y `payment_submitted`. `payment_validated` debe enviarse desde un servicio server-side o Conversion API al validar, para no filtrar datos ni depender del navegador del administrador.
