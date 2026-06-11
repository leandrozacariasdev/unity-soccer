import { Users, TrendingUp, Megaphone, Shield, Search, Globe } from 'lucide-react';

const services = [
  {
    icon: Users,
    title: 'Gestão de Carreira',
    body: 'Planejamento estratégico de transferências, renovações e empréstimos. Definimos a trajetória ideal em clubes nacionais e internacionais.',
  },
  {
    icon: TrendingUp,
    title: 'Consultoria Financeira',
    body: 'Gestão patrimonial, planejamento tributário, investimentos e previdência para garantir segurança financeira durante e após a carreira.',
  },
  {
    icon: Megaphone,
    title: 'Marketing e Imagem',
    body: 'Construção de marca pessoal, gestão de redes sociais, relações públicas e parcerias comerciais para maximizar o valor do atleta.',
  },
  {
    icon: Shield,
    title: 'Assessoria Jurídica',
    body: 'Suporte em direito desportivo: contratos, litígios, direito de imagem, questões trabalhistas e procedimentos emigratórios.',
  },
  {
    icon: Search,
    title: 'Scouting e Captação',
    body: 'Rede de olheiros e análise de desempenho para identificar jovens talentos e conectá-los a clubes no Brasil e no exterior.',
  },
  {
    icon: Globe,
    title: 'Carreira Internacional',
    body: 'Consultoria para transferências internacionais, adaptação cultural, vistos e conexão com clubes na Europa, Ásia e Américas.',
  },
];

export function Services() {
  return (
    <section className="section bg-ink" id="servicos" aria-labelledby="services-title">
      <div className="wrap">
        <p className="section-label" style={{ color: 'var(--gold-light)' }} data-reveal>
          O Que Fazemos
        </p>
        <h2
          id="services-title"
          className="section-title text-paper"
          data-reveal
          data-delay="1"
        >
          Serviços <span style={{ color: 'rgba(250,250,248,0.2)' }}>Completos</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-16 border-t border-paper/5">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                className="p-10 border-b border-r border-paper/5 bg-ink hover:bg-ink-soft transition-colors"
                data-reveal
                data-delay={((i % 3) + 1) as 1 | 2 | 3}
              >
                <div className="w-10 h-10 flex items-center justify-center mb-7 text-gold">
                  <Icon size={32} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-[1.75rem] tracking-[0.04em] uppercase text-paper mb-4 leading-[1.05]">
                  {service.title}
                </h3>
                <p className="text-[0.9375rem] text-paper/55 leading-[1.7]">{service.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
