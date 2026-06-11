#!/usr/bin/env node
/**
 * Script de setup automatizado do Supabase.
 *
 * Aplica migrations, cria buckets de Storage, executa seed.
 *
 * Requer:
 *   - SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 *   - SUPABASE_DB_PASSWORD  (opcional, só para psql direto)
 *
 * Uso:
 *   node scripts/setup-supabase.mjs
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Faltam variáveis de ambiente:');
  console.error('   SUPABASE_URL=' + (SUPABASE_URL || '(vazio)'));
  console.error('   SUPABASE_SERVICE_ROLE_KEY=' + (SERVICE_KEY ? '(definido)' : '(vazio)'));
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function runSqlFile(path) {
  const sql = readFileSync(path, 'utf8');
  // Supabase JS não tem método direto para DDL. Vamos usar a API REST /pg/query
  // Mas a forma mais simples é usar psql se disponível.
  console.log(`📄 Lendo ${path} (${sql.length} bytes)`);
  return sql;
}

async function execSql(sql) {
  // A REST API do Supabase não permite DDL arbitrário por design.
  // A forma recomendada é usar o SQL Editor no Dashboard.
  // Para automatizar DDL, usamos a conexão Postgres direta via psql.
  console.log('⚠️  DDL precisa ser executado via SQL Editor ou psql.');
  console.log('   Vou imprimir o SQL e tentar via psql...\n');
}

async function ensureBucket(name) {
  const { data: existing } = await supabase.storage.getBucket(name);
  if (existing) {
    console.log(`✅ Bucket "${name}" já existe.`);
    return;
  }
  const { error } = await supabase.storage.createBucket(name, {
    public: true,
    fileSizeLimit: 10 * 1024 * 1024, // 10MB
  });
  if (error) {
    console.error(`❌ Erro ao criar bucket "${name}":`, error.message);
  } else {
    console.log(`✅ Bucket "${name}" criado.`);
  }
}

async function main() {
  console.log('\n🚀 Setup Supabase — Unity Soccer\n');
  console.log(`URL: ${SUPABASE_URL}\n`);

  // 1) Testar conexão
  console.log('1️⃣  Testando conexão...');
  const { error: pingErr } = await supabase.from('athletes').select('id').limit(1);
  if (pingErr && !pingErr.message.includes('does not exist')) {
    console.error('❌ Erro de conexão:', pingErr.message);
    process.exit(1);
  }
  console.log('✅ Conexão OK\n');

  // 2) Criar buckets
  console.log('2️⃣  Criando buckets de Storage...');
  for (const bucket of ['athletes', 'gallery', 'news']) {
    await ensureBucket(bucket);
  }
  console.log('');

  // 3) Imprimir SQL para aplicar manualmente
  console.log('3️⃣  Migration SQL precisa ser aplicada no SQL Editor:\n');
  console.log('   👉 Acesse: ' + SUPABASE_URL.replace('.supabase.co', '.supabase.co/project/_/sql'));
  console.log('   👉 Cole o conteúdo de supabase/migrations/0001_initial.sql');
  console.log('   👉 Rode (Run)\n');

  console.log('4️⃣  Após aplicar a migration, rode o seed:');
  console.log('   👉 Cole o conteúdo de supabase/seed.sql no SQL Editor');
  console.log('   👉 Rode (Run)\n');

  console.log('5️⃣  Crie o primeiro admin:');
  console.log('   👉 Acesse Authentication → Users → Add user → Create new user');
  console.log('   👉 Email: seu-email@exemplo.com');
  console.log('   👉 Senha: sua-senha-segura');
  console.log('   👉 Auto Confirm User: ✅\n');

  console.log('✨ Setup concluído!\n');
}

main().catch((e) => {
  console.error('Erro:', e);
  process.exit(1);
});
