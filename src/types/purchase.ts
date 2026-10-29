export type PurchaseCategory = 
  | 'tech' 
  | 'clothing' 
  | 'home' 
  | 'hobbies' 
  | 'education' 
  | 'work' 
  | 'fitness' 
  | 'other';

export type PurchaseStatus = 
  | 'quarantine'  // Em quarentena / Pensando
  | 'bought'      // Comprado (aguardando tempo para review)
  | 'passed'      // Desistiu / Economizou grana
  | 'reviewed';   // Já passou por review pós-compra

export type UsageFrequency = 
  | 'multiple_daily' // 3x+ por dia (~1000x/ano)
  | 'daily'          // 1x por dia (365x/ano)
  | 'weekdays'       // Dias úteis (~250x/ano)
  | 'weekly_few'     // 2-3x por semana (~130x/ano)
  | 'weekly'         // 1x por semana (~52x/ano)
  | 'monthly_few'    // 2-3x por mês (~30x/ano)
  | 'monthly'        // 1x por mês (~12x/ano)
  | 'rarely';        // Poucas vezes no ano (~4x/ano)

export type DurabilityTier = 
  | 'fragile'     // Desgaste rápido / perecível
  | 'standard'    // Durabilidade comum de mercado
  | 'durable'     // Produto bem construído / durável
  | 'buy_it_for_life'; // Construído para durar muitos anos

export type ResaleLiquidity = 
  | 'none'        // Perda de 90-100% do valor (sem revenda)
  | 'low'         // Difícil revender (~20-30% do valor)
  | 'medium'      // Mercado razoável (~50% do valor)
  | 'high';       // Excelente liquidez e valor de revenda (~70%+)

export type DesireAge = 
  | 'minutes'     // Descobriu agora há pouco (< 24h)
  | 'days'        // Alguns dias (< 1 semana)
  | 'weeks'       // 2 a 4 semanas
  | 'months';     // Mais de 2 meses

export type PurchaseTrigger = 
  | 'social_media' // Instagram, TikTok, anúncio
  | 'boredom'      // Tédio / carência / busca por dopamina
  | 'deal'         // "Promoção imperdível", cupom
  | 'friend'       // Viu alguém usando / recomendação
  | 'real_pain'    // Dor real sentida no dia a dia
  | 'replacement'; // Substituição de algo que quebrou

export type AlternativeAvailability = 
  | 'have_similar'   // Já tenho algo que faz 80% disso
  | 'can_borrow'     // Posso pedir emprestado / alugar
  | 'free_solution'  // Existe alternativa gratuita / improviso
  | 'none';          // Não tenho nada que substitua

export interface UserProfile {
  monthlyIncome: number;     // Renda mensal líquida (R$)
  workingHoursMonth: number; // Horas trabalhadas no mês (padrão 160h)
  hourlyWage: number;        // Calculado ou fixado (R$/hora)
  currency: string;          // 'BRL'
}

export interface PurchaseEvaluationInput {
  name: string;
  category: PurchaseCategory;
  price: number;
  notes?: string;
  link?: string;

  // Eixo Utilidade
  frequency: UsageFrequency;
  lifespanMonths: number;
  durability: DurabilityTier;

  // Eixo Financeiro & Liquidez
  liquidity: ResaleLiquidity;
  paidWithSavings: boolean;

  // Eixo Impulso & Racionalidade
  desireAge: DesireAge;
  trigger: PurchaseTrigger;
  alternative: AlternativeAvailability;
  preferCashOverItem: 'cash' | 'item' | 'tie';
}

export interface CalculatedMetrics {
  score: number; // 0 a 100
  tier: 'terrible' | 'doubtful' | 'acceptable' | 'excellent';
  tierLabel: string;
  tierColor: string;
  costPerUse: number;
  totalEstimatedUses: number;
  hoursOfWork: number;
  opportunityCost2Years: number; // 10% a.a. por 2 anos
  insights: string[];
  verdict: string;
  quarantineDaysRemaining: number;
}

export interface PurchaseReview {
  reviewDate: string; // ISO
  actualFrequency: UsageFrequency;
  actualCostPerUse: number;
  stillUsing: boolean;
  satisfactionRating: number; // 1 a 5 estrelas
  reflection: string;
  wasWorthIt: boolean;
}

export interface PurchaseItem {
  id: string;
  createdAt: string; // ISO
  quarantineUntil: string; // ISO
  status: PurchaseStatus;
  input: PurchaseEvaluationInput;
  metrics: CalculatedMetrics;
  review?: PurchaseReview;
}

