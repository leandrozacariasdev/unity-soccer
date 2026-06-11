# Manual do Administrador — Unity Soccer

Este manual explica como usar a área administrativa do site para gerenciar conteúdo.

## Acesso

**URL**: `https://unitysoccer.com.br/admin/login`
**Credenciais**: as que você recebeu por email (email + senha)

> Recomendamos alterar a senha após o primeiro acesso em [Supabase Dashboard](https://supabase.com) → Authentication → Users.

---

## Visão Geral

Ao entrar, você verá a **Dashboard** com um resumo de tudo:

- Total de atletas, fotos, notícias publicadas
- Comentários pendentes de moderação
- Mensagens de contato não lidas
- Atalhos para as áreas mais usadas

A **barra lateral** (esquerda) dá acesso a todas as seções.

---

## 1. Atletas (`/admin/athletes`)

Gerencia o perfil completo de cada atleta.

### Adicionar novo atleta
1. Clique em **"Novo Atleta"** (canto superior direito)
2. Preencha os campos:
   - **Nome**: nome completo (gera o slug da URL automaticamente)
   - **Posição**: Goleiro, Zagueiro, Lateral, Volante, Meio Campo, Extremo ou Atacante
   - **Nacionalidade, clube, data de nascimento, número da camisa, altura, pé dominante**
   - **Ordem de exibição**: quanto menor o número, mais cedo aparece na home
3. **Foto principal**: clique em "Enviar foto" (formato 3:4 retrato, recomendado 800×1067px)
4. **Imagem de capa**: opcional, formato 16:9 (1920×1080px)
5. **Bio curta** (1-2 frases) — aparece nos cards
6. **Biografia completa** — página individual do atleta
7. **Estatísticas**: adicione pares chave/valor (ex: "Jogos: 120")
8. **Carreira**: adicione uma linha por temporada
9. **Highlights**: vídeos do YouTube/Vimeo (opcional)
10. **Redes sociais**: Instagram, Transfermarkt, etc.
11. **Ativo**: deixe marcado para aparecer no site
12. Clique em **"Salvar Atleta"**

### Editar atleta existente
- Clique no ícone de **lápis** na lista
- Faça as alterações
- Clique em **"Salvar Atleta"**

### Desativar (não excluir) um atleta
- Clique no botão **"Ativo"** (verde) na lista
- Ele vira **"Inativo"** (cinza) e some do site público, mas os dados ficam salvos

### Quando usar desativar vs. excluir?
- **Desativar**: atleta emprestado, lesionado, ou em fim de contrato
- **Excluir**: apenas para cadastros errados que não devem aparecer em lugar nenhum

---

## 2. Galeria (`/admin/gallery`)

### Adicionar fotos
1. Acesse **"Galeria"** no menu
2. **(Opcional)** Preencha "Título" e "Categoria" — esses valores serão aplicados a todas as fotos do upload em lote
3. Clique em **"Clique para selecionar imagens"** ou arraste arquivos
4. Você pode selecionar várias fotos de uma vez
5. Revise os previews
6. Clique em **"Enviar N imagem(ns)"**

### Categorias sugeridas
- `treino` — fotos de treino
- `jogo` — fotos de partidas
- `evento` — eventos, lançamentos, premiações
- `lifestyle` — bastidores, lifestyle
- `imprensa` — coletivas, entrevistas

### Destacar uma foto
- No banco, edite a flag `is_featured` (atualmente o destaque é automático pelas 6 primeiras)

---

## 3. Notícias (`/admin/news`)

### Criar uma notícia
1. Acesse **"Notícias"** no menu
2. Clique em **"Nova Notícia"**
3. **Título** (gera slug automaticamente)
4. **Resumo** — aparece nos cards e na meta description do Google
5. **Conteúdo** — use o editor:
   - **Negrito**, *itálico*, listas, citações
   - Títulos (H2, H3)
   - Links (selecione o texto → botão de link)
   - **Imagens**: clique no ícone de imagem e faça upload
6. **Capa** — imagem principal (16:9 recomendado, 1920×1080px)
7. **Legenda da capa** (opcional)
8. **Categoria**: Transferência, Contrato, Premiação, Evento, Elenco, Parceria ou Geral
9. **Atleta relacionado** — vincule a um atleta cadastrado (cria link no fim da matéria)
10. **Publicada**: marque para aparecer no site
11. **Em destaque na home**: marque para aparecer no topo da seção de notícias da home
12. **Data de publicação**: se já publicada, define quando aparece; se não, ignora
13. **SEO**: meta título e meta descrição (opcional — usa o título e resumo se vazio)
14. **Autor**: padrão "Unity Soccer"
15. Clique em **"Salvar"**

### Rascunho vs. Publicada
- **Rascunho** (is_published = false): salva mas não aparece no site
- **Publicada** (is_published = true): aparece imediatamente

### Boas práticas
- Sempre adicione uma **capa** (sem capa, fica sem吸引力)
- Use **parágrafos curtos** no conteúdo
- Adicione **imagens dentro do texto** para quebrar
- Categorize corretamente para os filtros funcionarem
- **Revise o SEO** se for uma matéria importante (Google usa isso)

---

## 4. Comentários (`/admin/comments`)

Visitantes podem comentar nas notícias. Os comentários ficam com status **"Pendente"** até você aprovar.

### Moderar
- **Aprovar**: clique no botão verde → comentário aparece no site
- **Rejeitar**: clique no botão vermelho → comentário some
- **Excluir**: clique no ícone de lixeira → remove permanentemente

### Recomendações
- Aprove comentários construtivos e respeitosos
- Rejeite spam, palavrões ou conteúdo ofensivo
- Você pode editar a data do comentário no banco se necessário

---

## 5. Contatos (`/admin/contacts`)

Todas as mensagens enviadas pelo formulário do site aparecem aqui.

### Visualizar
- Mensagens **não lidas** aparecem com tarja dourada
- Clique no ícone de **envelope aberto** para marcar como lida
- Para responder, clique no email do remetente (abre seu cliente de email)

### Configurar para qual email as mensagens vão
Acesse **Configurações** (item 6) → **"Email que recebe o formulário"**

---

## 6. Configurações (`/admin/settings`)

Aqui você altera tudo que aparece no site público:

### Email & Telefone
- **Email de contato** — aparece na seção de contato
- **Email que recebe o formulário** — onde chegam as mensagens
- **Telefone (exibido)** — formato livre, ex: "+55 (11) 99999-8888"
- **WhatsApp (apenas números)** — para gerar o link `https://wa.me/...`
- **WhatsApp (texto exibido)** — como aparece para o usuário

### Endereço & Atendimento
- **Endereço** — ex: "Av. Paulista, 1000 · São Paulo, SP"
- **Horário de atendimento** — ex: "Seg-Sex: 9h às 18h"

### Redes Sociais
- Cole os links completos (com `https://`)
- Deixe em branco para não exibir

### SEO
- **Descrição do site** — aparece no rodapé e em mecanismos de busca

> **Dica**: as alterações entram em vigor em até 60 segundos (cache do site).

---

## 7. Sair

Clique em **"Sair"** no rodapé do menu lateral.

**Importante**: feche a sessão em computadores compartilhados.

---

## Dúvidas Frequentes

### Posso editar fotos depois?
Sim. Abra o atleta/galeria, clique no **X** sobre a imagem para remover e faça upload da nova.

### Como desfazer uma publicação?
Edite a notícia e desmarque **"Publicada"**.

### Como mudar a senha?
Peça ao administrador técnico (ou acesse o Supabase Dashboard → Authentication).

### Como adicionar outro administrador?
Acesse Supabase Dashboard → Authentication → Users → **Add user** → "Create new user". A pessoa receberá um email para definir a senha.

### Como funciona o backup?
O Supabase faz backup automático diário. Não precisa se preocupar.

### Posso ver o que os visitantes veem?
Sim! No menu lateral, clique em **"Ver site público →"** (no rodapé do menu).

---

## Suporte

Em caso de problemas técnicos, contate o desenvolvedor através do email/WhatsApp informado na entrega.
