# Painel de Controle CORE

Dashboard interativo para gestão de projetos baseada no Método CORE.

## 🎨 Design

- **Dark Mode**: Tema profissional com fundo `#111827`
- **Cores**: Azul `#3b82f6` para elementos interativos, verde para sucesso, amarelo para alertas
- **Componentes**: Baseado em shadcn/ui

## 🚀 Funcionalidades

### 1. Autenticação
- Login com telefone e senha
- Proteção de rotas com JWT Bearer Token
- Logout seguro

### 2. Dashboard de Projetos (`/`)
- Lista de todos os projetos do usuário
- Cards com resumo: sprints concluídas e iniciativas ativas
- Barra de progresso geral do projeto

### 3. Detalhes do Projeto (`/projeto/:id`)
**"Sala de Comando"** com:
- Informações do projeto
- Sprint ativa e sprints anteriores
- **Quadro Kanban** com 3 colunas:
  - A Fazer
  - Em Andamento
  - Concluído

### 4. Iniciativas
- Cards com checklist e gráfico de progresso
- Modal detalhado com:
  - Gráfico de pizza mostrando distribuição
  - Lista interativa de tarefas
  - Checkbox para marcar itens como concluídos
  - Salvamento de alterações

### 5. Celebração da Sprint (`/projeto/:id/celebracao`)
Tela especial para revisar resultados:
- Métricas de iniciativas concluídas
- Percentual de progresso
- **Quadro de Aprendizados**:
  - ✅ Pontos Positivos
  - ⚠️ Custos Ocultos (Desafios)
  - 📖 Lições Aprendidas

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:8000/api
```

### 2. API Backend

A aplicação espera uma API REST com os seguintes endpoints:

#### Autenticação
- `POST /api/login`
  - Body: `{ telefone: string, senha: string }`
  - Response: `{ access_token: string, user: { id, nome, telefone } }`

#### Projetos
- `GET /api/projetos` - Lista todos os projetos
- `GET /api/projetos/:id` - Detalhes de um projeto específico

#### Iniciativas
- `PUT /api/iniciativas/:id/checklist` - Atualiza checklist de uma iniciativa
  - Body: `{ checklist_data: { items: ChecklistItem[] } }`

### 3. Formato dos Dados

#### Projeto
```typescript
{
  id: string;
  nome_projeto: string;
  descricao: string;
  sprints?: Sprint[];
  iniciativas?: Iniciativa[];
  sprints_concluidas?: number;
  iniciativas_ativas?: number;
}
```

#### Sprint
```typescript
{
  id: string;
  nome: string;
  data_inicio: string; // ISO date
  data_fim: string; // ISO date
  status: "ativa" | "concluida";
  projeto_id: string;
  resumo_evolucao?: {
    positivos: string[];
    desafios: string[];
    licoes: string[];
  };
}
```

#### Iniciativa
```typescript
{
  id: string;
  nome: string;
  descricao?: string;
  status: "A Fazer" | "Em Andamento" | "Concluído";
  checklist_data?: {
    items: Array<{
      id: string;
      text: string;
      status: "pending" | "completed";
    }>;
  };
  projeto_id: string;
  sprint_id?: string;
}
```

## 🎯 Jornada do Usuário

1. **Login** → Acessa com telefone e senha
2. **Dashboard** → Visualiza todos os projetos
3. **Projeto** → Clica em um projeto para ver detalhes
4. **Kanban** → Visualiza iniciativas organizadas por status
5. **Checklist** → Clica em uma iniciativa para ver/editar checklist
6. **Celebração** → Acessa tela especial para revisar resultados da sprint

## 🛠️ Tecnologias

- React + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- Recharts (gráficos)
- date-fns (formatação de datas)

## 📝 Notas

- Token JWT é armazenado no localStorage
- Todas as rotas (exceto `/login`) são protegidas
- A aplicação usa dark mode por padrão
- Todas as cores seguem o design system HSL
