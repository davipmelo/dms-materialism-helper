# 🛡️ DMS Materialism Helper

> **Decisões de compra racionais, anti-impulso e cálculo de custo por uso.**  
> Disponível online em: [davimelo.github.io/dms-materialism-helper](https://davimelo.github.io/dms-materialism-helper/)

---

## 🎯 O Propósito

As compras por impulso alimentam-se da falta de atrito cognitivo e da incapacidade do cérebro humano de quantificar duas variáveis fundamentais:
1. **O Custo por Uso Real (CPU)**
2. **O Custo de Oportunidade e Horas de Trabalho Gastas**

O **DMS Materialism Helper** é uma ferramenta pessoal, desenvolvida com abordagem **Mobile-First** (feita para abrir no celular no exato momento em que você está tentado a passar o cartão), que submete qualquer intenção de compra a uma matriz de decisão racional.

---

## 🧠 Como Funciona o Algoritmo

O sistema calcula um **Score de Racionalidade de 0 a 100%** baseado em 5 eixos ponderados:

### 1. Custo por Uso (Utility & Lifespan)
$$\text{Custo por Uso} = \frac{\text{Preço}}{\text{Frequência Anual} \times \text{Vida Útil em Anos}}$$
Um produto de R$ 1.500 usado todos os dias por 3 anos custa **R$ 1,36 por uso** (super barato).  
Uma jaqueta de R$ 900 usada 4 vezes no ano custa **R$ 225 por uso** (altíssimo desperdício).

### 2. Conversão em Horas de Vida
Com base no seu perfil financeiro (renda líquida e horas trabalhadas), o sistema calcula quanto tempo da sua vida real você precisará trabalhar exclusivamente para pagar aquele item.

### 3. O "Teste do Dinheiro Vivo"
> *"Se alguém te desse esse valor exato em cédulas de dinheiro na mão agora, você preferiria ficar com o dinheiro ou comprar o produto?"*  
Se a resposta for "dinheiro", o item é desmascarado como um impulso momentâneo.

### 4. A Regra dos 7 Dias de Quarentena
Itens com pontuação intermediária ou compras acima da média entram em **Quarentena**. O sistema marca uma contagem regressiva para deixar a dopamina baixar. Se após 7 dias você ainda quiser o item, ele se torna uma compra consciente.

### 5. Review Pós-Compra (Expectativa vs. Realidade)
Após comprar, você pode registrar o uso real semanas depois:
* Você realmente usou com a frequência que achava que usaria?
* O custo por uso real confirmou ou desmentiu a expectativa?
* Isso alimenta o seu índice de autoconhecimento e calibra futuras decisões.

---

## 📱 Mobile-First & Recursos

- **Design Responsivo & App-like**: Barra de navegação inferior estilo nativo no mobile com suporte a áreas seguras (notch / home bar).
- **100% Seguro & Privado**: Todos os dados residem no seu próprio navegador via `localStorage`. Nenhum dado financeiro ou pessoal é enviado para servidores externos.
- **Portabilidade Total (Export/Import JSON)**: Botão de 1 clique para baixar backup completo e sincronizar entre celular e computador.
- **Painel de Estatísticas**:
  - Total de dinheiro salvo com compras evitadas.
  - Maiores "balas desviadas" (maiores itens de impulso superados).
  - Análise dos gatilhos mais frequentes (anúncios de feed, tédio, falsas promoções).

---

## 🚀 Como Executar Localmente

```bash
# Clone o repositório
git clone https://github.com/davimelo/dms-materialism-helper.git
cd dms-materialism-helper

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# Para gerar o build de produção
npm run build
```

---

## 🛠️ Stack Tecnológica

- **Framework**: React 18 + TypeScript + Vite
- **Estilização**: Tailwind CSS
- **Ícones**: Lucide React
- **Deploy**: GitHub Pages (via GitHub Actions automatizado)
