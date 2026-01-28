# 🎯 Código de Atração 2.0: Experiência Imersiva Refúgio

Este é um funil de vendas gamificado de altíssima conversão desenvolvido para a **Pousada Refúgio Tiradentes**. Ele utiliza técnicas de *storytelling* imersivo, simulação de interfaces (WhatsApp/Chamada Telefônica) e gatilhos psicológicos para transformar visitantes em hóspedes.

## 🚀 A Experiência (User Journey)

O projeto é dividido em atos narrativos que quebram o padrão de navegação tradicional:

*   **Ato 0: Diagnóstico de Stress** – O usuário inicia uma análise biométrica (simulada) que detecta níveis críticos de stress.
*   **Ato 0.1: Reboot do Sistema** – Uma "falha de sistema" (Blue Screen) força o usuário a um exercício de respiração guiada.
*   **Ato 2: O Contato (WhatsApp)** – Joaquim (personagem real da pousada) entra em contato via interface de chat simulada.
*   **Ato 3: A Ligação** – O celular do usuário "toca". Joaquim fala através de um áudio espacial, revelando segredos de Tiradentes.
*   **Ato 5: Deep Web Login** – O usuário recebe credenciais para acessar um sistema "secreto" de reservas.
*   **Ato 4: A Oferta** – Uma Landing Page cinematográfica com Tour Virtual 360º e o convite final para o "Plano de Fuga".

## 🛠️ Stack Técnica

*   **Frontend:** React 19 (Hooks, Context, Refs para manipulação de áudio).
*   **Estilização:** Tailwind CSS (Animações customizadas, Glitch effects, Glassmorphism).
*   **Ícones:** Lucide React.
*   **Áudio:** Engenharia de som com trilhas de fundo e voz sobreposta (*layering*) com controle de volume dinâmico (fading).
*   **Performance:** 100% Estático. Sem dependências de backend ou latência de APIs de IA, garantindo carregamento instantâneo em conexões mobile.

## 📁 Estrutura de Pastas

```text
/components
  ├── Act0BiometricAnalysis.tsx  # Simulação de ECG e Stress
  ├── Act0BlueScreen.tsx        # Interfaces de erro (Estilo Windows/Unix)
  ├── Act2WhatsApp.tsx           # Simulador de chat com lógica de digitação
  ├── Act3PhoneCall.tsx          # Interface de chamada com vibração e áudio
  ├── Act4Offer.tsx              # Landing Page final de alta conversão
  └── DevIndex.tsx               # Painel de controle para testes (Mission Control)
/constants.ts                    # URLs de ativos (Imagens/Áudios)
/types.ts                        # Definições de passos do funil
```

## 📦 Como Rodar Localmente

Este projeto utiliza o padrão de módulos ES6 modernos.

1.  Clone o repositório.
2.  Abra o `index.html` em um servidor local (como Live Server do VS Code) ou utilize um bundler de sua preferência.
3.  **Nota:** Não é necessário `npm install` para a execução básica se estiver utilizando os imports via ESM.sh.

## 🚢 Deploy (Vercel / Netlify)

O projeto está otimizado para deploy em 1 clique:

1.  Conecte seu GitHub à **Vercel** ou **Netlify**.
2.  O sistema identificará o projeto como um site estático.
3.  **Não há necessidade de Variáveis de Ambiente (API Keys)**, pois o fluxo de IA foi removido em favor de performance e controle narrativo.

## 🧹 Auditoria e Limpeza (v2.1)

Recentemente, o projeto passou por uma limpeza técnica onde:
- Removido `geminiService.ts` (Código morto).
- Removido `Act1Quiz.tsx` (Substituído pela Biometria para maior imersão).
- Otimização de áudios e imagens em cache para evitar "pulos" na transição entre atos.

---
Feito com ❤️ pela equipe d'**O Forno**.
*"Tú és o meu Refúgio e minha fortaleza."*
