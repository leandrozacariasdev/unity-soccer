-- ═══════════════════════════════════════════════════════
-- Unity Soccer — Seed de Atletas (do index.html original)
-- ═══════════════════════════════════════════════════════

insert into athletes (slug, name, position, birth_date, nationality, current_club, height_cm, photo_url, is_active, display_order, bio, full_bio, stats, career, highlights)
values
  (
    'lucas-oliveira',
    'Lucas Oliveira',
    'Atacante',
    '1998-05-15',
    'Brasileira',
    'São Paulo FC',
    180,
    '/images/atacante.jpeg',
    true,
    1,
    'Atacante veloz e finalizador, conhecido por sua movimentação inteligente e faro de gol. Destacou-se nas categorias de base do São Paulo e hoje é referência no elenco profissional.',
    'Atacante veloz e finalizador, conhecido por sua movimentação inteligente e faro de gol. Destacou-se nas categorias de base do São Paulo e hoje é referência no elenco profissional.

Formado nas categorias de base do São Paulo, Lucas Oliveira sempre demonstrou talento natural para o gol. Sua velocidade e capacidade de leitura de jogo o tornaram um dos atacantes mais promissores do futebol brasileiro.

Com passagens pela seleção brasileira sub-20 e convocações para a principal, Lucas continua evoluindo e buscando novos desafios na carreira.',
    '{"Jogos": "120", "Gols": "45", "Assistências": "30", "Valor de mercado": "€15M"}'::jsonb,
    '[
      {"season": "2024", "club": "São Paulo FC", "apps": 38, "goals": 18, "assists": 12},
      {"season": "2023", "club": "São Paulo FC", "apps": 35, "goals": 12, "assists": 9},
      {"season": "2022", "club": "Grêmio (empréstimo)", "apps": 28, "goals": 10, "assists": 5},
      {"season": "2021", "club": "São Paulo FC", "apps": 19, "goals": 5, "assists": 4}
    ]'::jsonb,
    '[]'::jsonb
  ),
  (
    'gabriel-santos',
    'Gabriel Santos',
    'Meio Campo',
    '2002-03-22',
    'Brasileira',
    'Palmeiras',
    178,
    '/images/meia.jpg',
    true,
    2,
    'Meio-campista criativo com excelente visão de jogo e passes precisos. Um dos principais armadores do campeonato, com grande capacidade de ditar o ritmo das partidas.',
    'Meio-campista criativo com excelente visão de jogo e passes precisos. Um dos principais armadores do campeonato, com grande capacidade de ditar o ritmo das partidas.

Gabriel Santos é o típico camisa 10 moderno: capaz de organizar, criar e finalizar. Com passagens pela seleção brasileira sub-20 e sub-23, é considerado uma das maiores promessas da sua geração.',
    '{"Jogos": "85", "Gols": "12", "Assistências": "35", "Valor de mercado": "€12M"}'::jsonb,
    '[
      {"season": "2024", "club": "Palmeiras", "apps": 32, "goals": 5, "assists": 15},
      {"season": "2023", "club": "Palmeiras", "apps": 28, "goals": 4, "assists": 12},
      {"season": "2022", "club": "Santos", "apps": 25, "goals": 3, "assists": 8}
    ]'::jsonb,
    '[]'::jsonb
  ),
  (
    'pedro-costa',
    'Pedro Costa',
    'Zagueiro',
    '2000-01-10',
    'Brasileira',
    'Flamengo',
    188,
    '/images/zagueiro.jpeg',
    true,
    3,
    'Zagueiro de granito, excelente nos desarmes e muito forte no jogo aéreo. Líder nato da defesa, com ótima capacidade de organizar a linha defensiva.',
    'Zagueiro de granito, excelente nos desarmes e muito forte no jogo aéreo. Líder nato da defesa, com ótima capacidade de organizar a linha defensiva.

Pedro Costa é a referência defensiva que toda equipe busca. Forte no jogo aéreo e preciso nos desarmes, já vestiu a camisa da seleção brasileira e é considerado um dos melhores zagueiros em atividade no país.',
    '{"Jogos": "90", "Clean Sheets": "40", "Gols": "5", "Valor de mercado": "€10M"}'::jsonb,
    '[
      {"season": "2024", "club": "Flamengo", "apps": 35, "goals": 2, "assists": 1},
      {"season": "2023", "club": "Flamengo", "apps": 30, "goals:": 2, "assists": 0},
      {"season": "2022", "club": "Atlético-MG", "apps": 25, "goals": 1, "assists": 0}
    ]'::jsonb,
    '[]'::jsonb
  ),
  (
    'felipe-almeida',
    'Felipe Almeida',
    'Goleiro',
    '1996-08-03',
    'Brasileira',
    'Atlético-MG',
    192,
    '/images/goleiro.jpeg',
    true,
    4,
    'Goleiro experiente e de reflexos rápidos, com grande capacidade de defesa em um contra um. Referência no vestiário e líder indiscutível da equipe.',
    'Goleiro experiente e de reflexos rápidos, com grande capacidade de defesa em um contra um. Referência no vestiário e líder indiscutível da equipe.

Com mais de 150 jogos na carreira, Felipe Almeida é sinônimo de segurança. Líder nato, já defendeu pênaltis decisivos e tem passagens pela seleção brasileira.',
    '{"Jogos": "150", "Clean Sheets": "60", "Gols Sofridos": "120", "Valor de mercado": "€8M"}'::jsonb,
    '[
      {"season": "2024", "club": "Atlético-MG", "apps": 38, "goals": 0, "assists": 0},
      {"season": "2023", "club": "Atlético-MG", "apps": 36, "goals": 0, "assists": 0},
      {"season": "2022", "club": "Internacional", "apps": 34, "goals": 0, "assists": 0},
      {"season": "2021", "club": "Internacional", "apps": 30, "goals": 0, "assists": 0}
    ]'::jsonb,
    '[]'::jsonb
  ),
  (
    'rafael-lima',
    'Rafael Lima',
    'Volante',
    '2003-07-19',
    'Brasileira',
    'Fluminense',
    175,
    '/images/volante.jpeg',
    true,
    5,
    'Volante box-to-box com enorme resistência física e qualidade no passe. Destaca-se pela capacidade de recuperar bolas e iniciar jogadas de ataque.',
    'Volante box-to-box com enorme resistência física e qualidade no passe. Destaca-se pela capacidade de recuperar bolas e iniciar jogadas de ataque.

Rafael Lima é o motor do meio-campo do Fluminense. Sua resistência física e inteligência tática fazem dele um dos volantes mais cobiçados do futebol brasileiro, com propostas frequentes do exterior.',
    '{"Jogos": "65", "Gols": "8", "Assistências": "15", "Valor de mercado": "€18M"}'::jsonb,
    '[
      {"season": "2024", "club": "Fluminense", "apps": 30, "goals": 4, "assists": 8},
      {"season": "2023", "club": "Fluminense", "apps": 25, "goals": 3, "assists": 5},
      {"season": "2022", "club": "Fluminense", "apps": 10, "goals": 1, "assists": 2}
    ]'::jsonb,
    '[]'::jsonb
  ),
  (
    'matheus-ribeiro',
    'Matheus Ribeiro',
    'Extremo',
    '2004-11-28',
    'Brasileira',
    'Corinthians',
    173,
    '/images/ponta.jpeg',
    true,
    6,
    'Extremo driblador e veloz, com grande capacidade de ultrapassar defesas e criar oportunidades. Um dos jovens talentos mais promissores do futebol brasileiro.',
    'Extremo driblador e veloz, com grande capacidade de ultrapassar defesas e criar oportunidades. Um dos jovens talentos mais promissores do futebol brasileiro.

Matheus Ribeiro explodiu nas categorias de base do Corinthians e logo ganhou espaço no time principal. Com dribles desconcertantes e velocidade, é comparado a grandes nomes do futebol brasileiro.',
    '{"Jogos": "50", "Gols": "15", "Assistências": "12", "Valor de mercado": "€20M"}'::jsonb,
    '[
      {"season": "2024", "club": "Corinthians", "apps": 28, "goals": 9, "assists": 7},
      {"season": "2023", "club": "Corinthians", "apps": 18, "goals": 5, "assists": 4},
      {"season": "2022", "club": "Corinthians Sub-20", "apps": 20, "goals": 8, "assists": 6}
    ]'::jsonb,
    '[]'::jsonb
  )
on conflict (slug) do nothing;

-- ═══════════════════════════════════════════════════════
-- Galeria inicial (5 fotos + 1 destaque)
-- ═══════════════════════════════════════════════════════

insert into gallery_items (title, description, image_url, category, is_featured, display_order)
values
  ('Lucas Oliveira', 'Atacante · Convocação Seleção', '/images/atacante.jpeg', 'evento', true, 1),
  ('Gabriel Santos', 'Meio Campo · Destaque do Ano', '/images/meia.jpg', 'premiacao', true, 2),
  ('Pedro Costa', 'Zagueiro · Líder Defensivo', '/images/zagueiro.jpeg', 'jogo', true, 3),
  ('Felipe Almeida', 'Goleiro · Defesa Impenetrável', '/images/goleiro.jpeg', 'jogo', true, 4),
  ('Rafael Lima', 'Volante · Motor do Time', '/images/volante.jpeg', 'treino', true, 5)
on conflict do nothing;

-- ═══════════════════════════════════════════════════════
-- Notícias iniciais (do HTML original)
-- ═══════════════════════════════════════════════════════

insert into news (slug, title, excerpt, content, author, category, is_published, is_featured, published_at, meta_title, meta_description)
values
  (
    'atleta-unity-selecao-brasileira',
    'Atleta da Unity Soccer é convocado para Seleção Brasileira',
    'Lucas Oliveira, atacante de 28 anos, foi convocado para a Seleção Brasileira após grande temporada no clube. A Unity Soccer acompanhou todo o processo.',
    '<p>Lucas Oliveira, atacante de 28 anos, foi convocado para a Seleção Brasileira após grande temporada no clube. A Unity Soccer acompanhou todo o processo.</p><p>O atleta vinha sendo monitorado pela comissão técnica e teve seu nome confirmado na lista divulgada nesta semana. A convocação reconhece o excelente momento vivido pelo jogador.</p><p>A Unity Soccer parabeniza Lucas e deseja muito sucesso nesta nova etapa da carreira.</p>',
    'Unity Soccer',
    'elenco',
    true,
    true,
    now(),
    'Lucas Oliveira convocado para Seleção Brasileira',
    'Lucas Oliveira, atacante da Unity Soccer, é convocado para a Seleção Brasileira após grande temporada.'
  ),
  (
    'unity-soccer-expande-mercado-europeu',
    'Unity Soccer expande atuação para o mercado europeu',
    'Com novos escritórios em Portugal e Inglaterra, a agência fortalece a presença internacional e amplia oportunidades para seus atletas no futebol europeu.',
    '<p>Com novos escritórios em Portugal e Inglaterra, a agência fortalece a presença internacional e amplia oportunidades para seus atletas no futebol europeu.</p><p>A expansão é resultado do trabalho consistente desenvolvido nos últimos anos e da crescente demanda por atletas brasileiros no exterior.</p><p>Os novos escritórios permitirão um acompanhamento mais próximo dos atletas que atuam na Europa e a prospecção de novos talentos para o mercado.</p>',
    'Unity Soccer',
    'parceria',
    true,
    true,
    now() - interval '13 days',
    'Unity Soccer expande para a Europa',
    'Agência abre novos escritórios em Portugal e Inglaterra e amplia atuação no mercado europeu.'
  ),
  (
    'parceria-serie-a-novas-oportunidades',
    'Parceria com clube da Série A abre novas oportunidades',
    'Acordo firmado entre Unity Soccer e clube da elite do futebol brasileiro garante prioridade na negociação de jovens talentos revelados pelas categorias de base.',
    '<p>Acordo firmado entre Unity Soccer e clube da elite do futebol brasileiro garante prioridade na negociação de jovens talentos revelados pelas categorias de base.</p><p>A parceria estratégica visa identificar e desenvolver novos talentos, criando uma ponte entre o trabalho de formação e o futebol profissional.</p><p>Este é mais um passo importante na consolidação da Unity Soccer como referência em gestão de carreira de atletas no Brasil.</p>',
    'Unity Soccer',
    'parceria',
    true,
    false,
    now() - interval '27 days',
    'Parceria com clube da Série A',
    'Unity Soccer firma parceria estratégica com clube da elite do futebol brasileiro.'
  )
on conflict (slug) do nothing;
