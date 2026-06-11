# Unity Soccer

Site institucional da agência Unity Soccer com área administrativa completa.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Supabase** (Postgres + Auth + Storage)
- **Resend** (envio de emails transacionais)
- **Tailwind CSS** + fontes self-hosted (Bebas Neue + DM Sans)
- **TipTap** (editor rich-text)
- **Vercel** (deploy)

## Setup local

```bash
# 1. Instalar dependências
npm install

# 2. Copiar variáveis de ambiente
cp .env.local.example .env.local
# Preencha com suas chaves do Supabase e Resend

# 3. Rodar em desenvolvimento
npm run dev
# Acesse http://localhost:3000

# 4. Verificar tipos
npm run typecheck

# 5. Build de produção
npm run build
```

## Configurar Supabase

1. Crie um projeto em https://supabase.com
2. Em **SQL Editor**, execute o conteúdo de `supabase/migrations/0001_initial.sql`
3. Em **Storage**, crie 3 buckets públicos:
   - `athletes` (fotos e capas de atletas)
   - `gallery` (fotos da galeria)
   - `news` (capas e imagens de conteúdo de notícias)
4. Em **Authentication → Users**, crie o(s) admin(s) que usarão o painel
5. Copie as chaves para `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (Settings → API → service_role)

## Configurar Resend

1. Crie conta em https://resend.com
2. Adicione e verifique o domínio (ex: unitysoccer.com.br)
3. Crie uma API Key
4. Preencha:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL` (ex: `noreply@unitysoccer.com.br`)

## Estrutura

- `/` — Home
- `/atletas` — Listagem de atletas
- `/atletas/[slug]` — Perfil individual do atleta
- `/galeria` — Galeria completa
- `/noticias` — Listagem de notícias
- `/noticias/[slug]` — Notícia individual com comentários
- `/admin/*` — Área administrativa (protegida por login)

## Deploy na Vercel

1. Faça push do código para o GitHub
2. Importe o projeto em https://vercel.com
3. Configure as env vars (mesmas do `.env.local`)
4. Deploy automático a cada push

## Custos

- **Vercel**: Grátis (até 100GB bandwidth/mês)
- **Supabase**: Grátis (até 500MB DB, 1GB Storage)
- **Resend**: Grátis (até 3.000 emails/mês)
- **Domínio**: ~R$ 40/ano

**Total mensal**: ~R$ 3/mês
