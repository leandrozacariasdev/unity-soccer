#!/bin/bash
set -e

cd /Users/lzacarias/Projects/unity-soccer

# Variáveis de ambiente que serão configuradas na Vercel
ENV_VARS=(
  "NEXT_PUBLIC_SUPABASE_URL=https://tmbnyeqrldsuqosccxks.supabase.co"
  "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRtYm55ZXFybGRzdXFvc2NjeGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExNDA2MzYsImV4cCI6MjA5NjcxNjYzNn0.mM6DIVbGwsgx6O7RacDfkh3GzCYD4wOmltxaynW07hI"
  "RESEND_API_KEY=re_YVi8bGaa_4EiBzhZHBph2CKLLH2GiPdzS"
  "RESEND_FROM_EMAIL=noreply@unitysoccer.com.br"
  "NEXT_PUBLIC_SITE_URL=https://unitysoccer.com.br"
)

echo "🚀 Deploy Unity Soccer na Vercel"
echo ""

# 1. Login
echo "1. Fazendo login na Vercel..."
./node_modules/.bin/vercel login --token "${VERCEL_TOKEN}"

# 2. Link ou criar projeto
echo "2. Criando/linkando projeto..."
./node_modules/.bin/vercel link --yes --token "${VERCEL_TOKEN}" || true

# 3. Adicionar env vars
echo "3. Configurando variáveis de ambiente..."
for var in "${ENV_VARS[@]}"; do
  key="${var%%=*}"
  value="${var#*=}"
  echo "   → $key"
  echo "$value" | ./node_modules/.bin/vercel env add "$key" production --yes --token "${VERCEL_TOKEN}" 2>/dev/null || true
done

# 4. Deploy produção
echo "4. Fazendo deploy em produção..."
./node_modules/.bin/vercel deploy --prod --yes --token "${VERCEL_TOKEN}"

echo ""
echo "✨ Deploy concluído!"
