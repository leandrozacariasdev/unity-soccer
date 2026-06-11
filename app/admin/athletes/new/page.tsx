import { AthleteForm } from '@/components/admin/AthleteForm';

export const metadata = { title: 'Novo Atleta · Admin' };

export default function NewAthletePage() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <h1 className="font-display text-3xl uppercase tracking-[0.02em] text-ink mb-2">Novo Atleta</h1>
      <p className="text-ink-mid text-sm mb-8">Cadastre um novo atleta no plantel.</p>
      <AthleteForm />
    </div>
  );
}
