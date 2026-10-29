import {
  CalculatedMetrics,
  PurchaseEvaluationInput,
  UsageFrequency,
  UserProfile,
} from '../types/purchase';

export const ANNUAL_USES: Record<UsageFrequency, number> = {
  multiple_daily: 1000,
  daily: 365,
  weekdays: 250,
  weekly_few: 130,
  weekly: 52,
  monthly_few: 30,
  monthly: 12,
  rarely: 4,
};

export const FREQUENCY_LABELS: Record<UsageFrequency, string> = {
  multiple_daily: 'Várias vezes ao dia (~3x/dia)',
  daily: 'Diariamente (1x ao dia)',
  weekdays: 'Dias úteis (segunda a sexta)',
  weekly_few: '2 a 3 vezes por semana',
  weekly: '1 vez por semana',
  monthly_few: '2 a 3 vezes por mês',
  monthly: '1 vez por mês',
  rarely: 'Raramente (poucas vezes ao ano)',
};

export const CATEGORY_LABELS: Record<string, { label: string; icon: string }> = {
  tech: { label: 'Eletrônicos & Tech', icon: '💻' },
  clothing: { label: 'Roupas & Estilo', icon: '👕' },
  home: { label: 'Casa & Conforto', icon: '🏠' },
  hobbies: { label: 'Lazer & Hobbies', icon: '🎮' },
  education: { label: 'Cursos & Livros', icon: '📚' },
  work: { label: 'Trabalho & Produtividade', icon: '💼' },
  fitness: { label: 'Saúde & Esportes', icon: '🏃' },
  other: { label: 'Outros', icon: '📦' },
};

export const DEFAULT_USER_PROFILE: UserProfile = {
  monthlyIncome: 0,
  workingHoursMonth: 160,
  hourlyWage: 0,
  currency: 'BRL',
  isConfigured: false,
};

export function calculateMetrics(
  input: PurchaseEvaluationInput,
  profile: UserProfile = DEFAULT_USER_PROFILE
): CalculatedMetrics {
  const price = Math.max(0.01, input.price || 1);
  const lifespanYears = Math.max(0.08, (input.lifespanMonths || 12) / 12);
  const annualUses = ANNUAL_USES[input.frequency] || 52;
  const totalEstimatedUses = Math.max(1, Math.round(annualUses * lifespanYears));
  const costPerUse = price / totalEstimatedUses;

  // Horas de trabalho
  const hourlyWage = profile.hourlyWage > 0 
    ? profile.hourlyWage 
    : (profile.monthlyIncome > 0 ? profile.monthlyIncome / (profile.workingHoursMonth || 160) : 0);
  const hoursOfWork = hourlyWage > 0 ? price / hourlyWage : 0;

  // Custo de oportunidade (10.5% a.a. por 2 anos composto => ~22.1% de ganho real)
  const opportunityGain = price * (Math.pow(1 + 0.105, 2) - 1);
  const opportunityCost2Years = price + opportunityGain;

  // --- Sistema de Pontuação (0 a 100) ---
  let score = 0;

  // 1. Custo por Uso (Máx 30 pts)
  if (costPerUse <= 1.0) score += 30;
  else if (costPerUse <= 3.0) score += 26;
  else if (costPerUse <= 8.0) score += 21;
  else if (costPerUse <= 20.0) score += 15;
  else if (costPerUse <= 50.0) score += 9;
  else if (costPerUse <= 100.0) score += 4;
  else score += 1;

  // 2. Tempo de Desejo / Fricção temporal (Máx 20 pts)
  switch (input.desireAge) {
    case 'months':
      score += 20;
      break;
    case 'weeks':
      score += 15;
      break;
    case 'days':
      score += 8;
      break;
    case 'minutes':
      score += 2;
      break;
  }

  // 3. Origem do Desejo / Gatilho (Máx 15 pts)
  switch (input.trigger) {
    case 'real_pain':
    case 'replacement':
      score += 15;
      break;
    case 'friend':
      score += 9;
      break;
    case 'deal':
      score += 5;
      break;
    case 'social_media':
      score += 2;
      break;
    case 'boredom':
      score += 0;
      break;
  }

  // 4. Alternativas Existentes (Máx 15 pts)
  switch (input.alternative) {
    case 'none':
      score += 15;
      break;
    case 'can_borrow':
      score += 8;
      break;
    case 'free_solution':
      score += 4;
      break;
    case 'have_similar':
      score += 0;
      break;
  }

  // 5. Liquidez e Depreciação (Máx 10 pts)
  switch (input.liquidity) {
    case 'high':
      score += 10;
      break;
    case 'medium':
      score += 7;
      break;
    case 'low':
      score += 4;
      break;
    case 'none':
      score += 1;
      break;
  }

  // 6. Teste "Dinheiro Vivo vs Item" (Máx 10 pts)
  switch (input.preferCashOverItem) {
    case 'item':
      score += 10;
      break;
    case 'tie':
      score += 4;
      break;
    case 'cash':
      score += 0;
      break;
  }

  // Ajustes de bônus / penalidade
  if (input.durability === 'buy_it_for_life') score = Math.min(100, score + 4);
  if (input.durability === 'fragile') score = Math.max(0, score - 5);
  if (!input.paidWithSavings && price > profile.monthlyIncome * 0.3) {
    score = Math.max(0, score - 8); // Penalidade se comprometer mais de 30% da renda sem reserva
  }

  score = Math.min(100, Math.max(0, Math.round(score)));

  // Determinação do Tier
  let tier: CalculatedMetrics['tier'];
  let tierLabel: string;
  let tierColor: string;
  let verdict: string;

  if (score >= 80) {
    tier = 'excellent';
    tierLabel = 'Excelente Investimento';
    tierColor = 'text-[#ffbb00] bg-[#ffbb00]/10 border-[#ffbb00]/40';
    verdict = 'Compra altamente recomendada. Alto custo-benefício e alinhada com suas reais necessidades.';
  } else if (score >= 60) {
    tier = 'acceptable';
    tierLabel = 'Compra Consciente';
    tierColor = 'text-amber-300 bg-amber-500/10 border-amber-500/30';
    verdict = 'Compra viável e ponderada. Se o orçamento do mês estiver tranquilo, pode seguir sem peso na consciência.';
  } else if (score >= 40) {
    tier = 'doubtful';
    tierLabel = 'Zona de Quarentena';
    tierColor = 'text-orange-400 bg-orange-500/10 border-orange-500/30';
    verdict = 'Risco moderado de arrependimento. Dê 7 dias de quarentena antes de passar o cartão.';
  } else {
    tier = 'terrible';
    tierLabel = 'Alerta de Impulso';
    tierColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    verdict = 'Forte indício de compra por impulso ou tédio. A relação custo por uso é muito desfavorável.';
  }

  // Insights dinâmicos
  const insights: string[] = [];

  // Insight 1: Custo por uso
  if (costPerUse <= 1.5) {
    insights.push(`Super eficiente: custará aprox. ${formatBRL(costPerUse)} por cada utilização prevista.`);
  } else if (costPerUse > 35) {
    insights.push(`Atenção ao custo por uso: cada vez que usar, estará pagando ${formatBRL(costPerUse)}.`);
  } else {
    insights.push(`Custo estimado por uso: ${formatBRL(costPerUse)} ao longo de ${lifespanYears.toFixed(1)} anos.`);
  }

  // Insight 2: Horas de trabalho
  if (hoursOfWork > 0) {
    const hoursFormatted = hoursOfWork < 8 
      ? `${hoursOfWork.toFixed(1)} horas de trabalho` 
      : `${(hoursOfWork / 8).toFixed(1)} dias inteiros de expediente`;
    insights.push(`Equivale a ${hoursFormatted} da sua jornada profissional.`);
  }

  // Insight 3: Teste do dinheiro
  if (input.preferCashOverItem === 'cash') {
    insights.push(`🚨 Você admitiu que preferiria o dinheiro na mão. Isso é o maior sinal de impulso momentâneo!`);
  }

  // Insight 4: Alternativas
  if (input.alternative === 'have_similar') {
    insights.push(`Você já possui algo 80% similar. Pergunte-se se o ganho marginal vale ${formatBRL(price)}.`);
  }

  // Insight 5: Custo de oportunidade
  insights.push(`Se investido a 10,5% a.a., esses ${formatBRL(price)} virariam ${formatBRL(opportunityCost2Years)} em 2 anos.`);

  return {
    score,
    tier,
    tierLabel,
    tierColor,
    costPerUse,
    totalEstimatedUses,
    hoursOfWork,
    opportunityCost2Years,
    insights,
    verdict,
    quarantineDaysRemaining: 7,
  };
}

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

