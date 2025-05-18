# 💼 Agentic Banking Demo App — PRD

This terminal-style PRD details the three core workflows (Account Opening, Credit Card Issuance, Loan Origination) for Lyzr’s demo application showcasing a fully autonomous, AI-agent-powered digital bank.

All data is simulated. Architecture is modular, agent-based, and built for a visually immersive, narrative-complete demo.

---

## 🧱 Architecture Principles

- **Agentic Design**: Each workflow is managed by specialized agents with scoped responsibilities.
- **Chat-First UX**: Conversations guide each interaction; agents prompt and respond with human-like flow.
- **Real-Time Observability**: Internal logs, audit trails, and GRC compliance agents track every action.
- **Fully Simulated Data**: No external API calls; mock data supports all features.
- **Modular Codebase**: Each tab = one workflow. Each workflow = JSON-configured agent behaviors.

---

## 🗂️ Tab 1: 🏦 Account Opening Workflow

### 🎯 Goal
Enable users to open a new account through a guided, intelligent chat interface.

### 🤖 Agents
- `OnboardingAgent`: Initiates dialogue, collects KYC info
- `DocumentAgent`: Validates uploaded ID, utility bill, etc.
- `KYCAMLAgent`: Simulates checks against KYC/AML databases
- `AccountProvisioner`: Opens account, returns account # and welcome packet

### 💬 Sample Flow
1. Agent greets user → asks intent
2. Prompts user to upload documents → simulates OCR validation
3. Asks structured questions (name, address, SSN)
4. Simulated KYC/AML agent decision (approve/deny)
5. On success: generates fake account number + “Welcome Kit”

### 📦 Output
- JSON log with KYC metadata
- `account_opened: true/false`
- `risk_score: <float>` (used in GRC dashboard)

---

## 🗂️ Tab 2: 💳 Credit Card Issuance

### 🎯 Goal
Issue a virtual credit card based on user's eligibility and risk profile.

### 🤖 Agents
- `CreditCardAgent`: Collects intent and personal info
- `CreditEvaluator`: Simulates credit scoring logic
- `DocumentAgent`: Reuses uploaded docs from Tab 1 if available
- `CardIssuer`: Generates virtual card, credit limit, APR

### 💬 Sample Flow
1. “I’d like a credit card” → prompts for income, employment, existing debt
2. Agent calculates `sim_credit_score` using mock rules
3. Based on approval logic → issues virtual card OR prompts for secured option
4. Shows virtual card with branding + simulated limit

### 📦 Output
- `card_approved: true/false`
- `credit_limit: $<amount>`
- `apr: <float>`
- Optional: simulated soft pull explanation + “next steps”

---

## 🗂️ Tab 3: 📝 Loan Origination

### 🎯 Goal
Simulate application and approval/denial of a personal or home loan.

### 🤖 Agents
- `LoanAgent`: Collects loan purpose, amount, and financials
- `DocumentAgent`: Asks for income verification, W2, etc.
- `RiskScoringAgent`: Calculates DTI (debt-to-income), risk
- `LoanProcessor`: Approves/denies, returns amortization simulation

### 💬 Sample Flow
1. User selects loan type → prompted for amount + duration
2. Uploads pay stubs / W2s → DocumentAgent “verifies”
3. Agent calculates `DTI`, `sim_credit_score`
4. Loan approved/denied → amortization chart shown in UI

### 📦 Output
- `loan_approved: true/false`
- `loan_amount: $<amount>`
- `interest_rate: <float>`
- `monthly_payment_schedule: [ ... ]` (chart-friendly JSON)

---

## 🔐 Internal Agent Layer

### 🔍 Audit Trail + GRC

**Agents:**
- `AuditAgent`: Writes every user-agent interaction to `audit_log.json`
- `GRCComplianceAgent`: Simulates governance checks, flags policy violations

**Key Logs:**
- KYC timestamp
- Document upload confirmation
- Risk classification
- Decisions made + justification
- All chat steps with timestamps

---

## 📊 Home Visualization (Default View)

### Top-Level Layout
- **80%**: Animated overview of “agentic bank” (visual map)
    - Agents walk between desks (task → task)
    - Chat bubbles animate above them (simulated messages)
- **20%**: Vertical scroll log of real-time activity

**Example:**
```

\[09:34] Account Opening started for John Doe
\[09:35] KYC Check passed (risk: 0.12)
\[09:36] Account #498201 created
\[09:38] Credit card issued (limit: \$5,000)

```

---

## 🧪 Developer Notes

- All logic defined in `/agents/<agent>.json`
- Chat flow modular per workflow in `/data/conversations/`
- Tailwind + `shadcn/ui` for styling
- React + Zustand for state management (optional)
- All visual animations stubbed using placeholder SVGs or animated GIFs

---

## 🔄 Extensibility (Future Tabs)

- **Fraud Detection Agent**
- **Treasury Ops Agent**
- **Personalized Advisor Agent**
- **SMB Business Account Onboarding**

---

## 🏁 Summary

This PRD defines a polished, high-impact demo that:
- Demonstrates 3 distinct financial workflows powered by AI agents
- Visualizes internal operations like a game or animation
- Logs every action for transparency and GRC storytelling
- Makes Lyzr the **first to simulate a fully autonomous bank**

---
```
