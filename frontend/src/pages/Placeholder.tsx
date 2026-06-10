// Páginas ainda não implementadas (próximas seções da ordem de implementação).
// Mantêm a navegação funcional e on-brand até /match/:id, /stats e /profile entrarem.

function Shell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="mb-2 text-xs font-semibold tracking-[0.3em] text-amber uppercase">
        Em breve
      </p>
      <h1 className="font-display text-4xl font-bold">{title}</h1>
      <p className="mt-3 max-w-md text-sm text-muted">{children}</p>
    </div>
  );
}

export function MatchDetailPage() {
  return (
    <Shell title="Detalhe do jogo">
      Header com placar e estádio, eventos (gols por minuto) e escalações dos
      dois times. Entra junto com o cache de eventos/lineups por jogo.
    </Shell>
  );
}

export function StatsPage() {
  return (
    <Shell title="Suas estatísticas">
      Jogos assistidos, minutos, gols vistos, jogadores que mais apareceram e
      seu ranking de notas. Depende da auth Google e da rota /watches.
    </Shell>
  );
}

export function ProfilePage() {
  return (
    <Shell title="Perfil">
      Avatar e nome do Google, resumo das stats e logout. Chega com a auth.
    </Shell>
  );
}
