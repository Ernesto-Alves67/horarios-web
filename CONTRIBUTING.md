# Guia de Contribuição

Obrigado por considerar contribuir com o projeto Horários Web! 🎉

## 🚀 Como Começar

### 1. Fork e Clone

```bash
# Fork o repositório no GitHub, depois clone:
git clone https://github.com/SEU-USUARIO/horarios-web.git
cd horarios-web

# Adicione o upstream
git remote add upstream https://github.com/Ernesto-Alves67/horarios-web.git
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Execute Localmente

```bash
npm run dev
```

Acesse http://localhost:5173

## 📝 Fluxo de Trabalho

### Criando uma Branch

```bash
# Atualize a main
git checkout main
git pull upstream main

# Crie uma branch para sua feature/fix
git checkout -b feature/minha-feature
# ou
git checkout -b fix/meu-fix
```

### Desenvolvendo

1. Faça suas alterações
2. Teste localmente
3. Commit suas mudanças:

```bash
git add .
git commit -m "feat: adiciona nova funcionalidade"
```

#### Convenção de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Alterações na documentação
- `style:` Formatação, falta de ponto e vírgula, etc
- `refactor:` Refatoração de código
- `test:` Adição de testes
- `chore:` Manutenção geral

Exemplos:
```
feat: adiciona filtro por curso na tela semanal
fix: corrige parsing de horários com acentos
docs: atualiza README com instruções de deploy
style: formata código com prettier
refactor: extrai lógica de parsing para utility
test: adiciona testes para localStorage service
chore: atualiza dependências
```

### Testando

Antes de fazer push, certifique-se de:

```bash
# Build funciona
npm run build

# Lint passa
npm run lint

# Preview funciona
npm run preview
```

### Submetendo um Pull Request

```bash
# Push para seu fork
git push origin feature/minha-feature
```

Depois abra um Pull Request no GitHub:

1. Descreva claramente o que foi alterado
2. Adicione screenshots se houver mudanças visuais
3. Referencie issues relacionadas (#número)
4. Aguarde review

## 🎨 Padrões de Código

### Estrutura de Componentes

```jsx
// Imports
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import theme from '../utils/theme';

// Styled Components
const Container = styled.div`
  // estilos
`;

// Componente
function MeuComponente({ prop1, prop2 }) {
  // Hooks
  const [state, setState] = useState(null);
  
  // Effects
  useEffect(() => {
    // lógica
  }, []);
  
  // Handlers
  const handleClick = () => {
    // lógica
  };
  
  // Render
  return (
    <Container>
      {/* JSX */}
    </Container>
  );
}

export default MeuComponente;
```

### Estilização

- Use Styled Components
- Siga o tema em `src/utils/theme.js`
- Use cores do tema, não valores hardcoded
- Mobile-first (media queries para desktop)

```jsx
// ✅ Bom
const Button = styled.button`
  background-color: ${theme.colors.ufcatGreen};
  padding: ${theme.spacing.md};
  
  @media (min-width: ${theme.breakpoints.tablet}) {
    padding: ${theme.spacing.lg};
  }
`;

// ❌ Evite
const Button = styled.button`
  background-color: #00A859;
  padding: 16px;
`;
```

### Nomenclatura

- Componentes: PascalCase (`DailyScreen.jsx`)
- Funções/variáveis: camelCase (`handleClick`)
- Constantes: UPPER_SNAKE_CASE (`API_URL`)
- Arquivos CSS/utils: camelCase (`localStorage.js`)

## 📂 Estrutura de Pastas

```
src/
├── components/     # Componentes reutilizáveis
├── screens/        # Páginas/Telas
├── services/       # APIs e serviços
├── utils/          # Utilitários e helpers
├── hooks/          # Custom hooks (futuros)
└── assets/         # Imagens, fontes, etc
```

## 🐛 Reportando Bugs

Ao reportar um bug, inclua:

1. **Descrição clara** do problema
2. **Passos para reproduzir**
3. **Comportamento esperado**
4. **Comportamento atual**
5. **Screenshots** (se aplicável)
6. **Ambiente**:
   - SO e versão
   - Navegador e versão
   - Versão do Node (se relevante)

Exemplo:

```markdown
### Descrição
O botão "Carregar HTML" não funciona no Safari iOS

### Passos para Reproduzir
1. Abra a tela SIGAA
2. Clique em "Carregar Arquivo HTML"
3. Selecione um arquivo

### Esperado
Modal de upload deve abrir

### Atual
Nada acontece

### Ambiente
- iOS 15.2
- Safari 15
- iPhone 12 Pro
```

## 💡 Sugerindo Melhorias

Para sugerir uma nova funcionalidade:

1. **Verifique** se já não existe uma issue sobre isso
2. **Descreva** claramente a funcionalidade
3. **Explique** por que seria útil
4. **Sugira** como poderia ser implementada
5. **Adicione** mockups/wireframes se possível

## 🧪 Adicionando Testes

Planeje adicionar testes? Ótimo!

```bash
# Instale dependências de teste
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

Estrutura:
```
src/
├── components/
│   ├── Layout.jsx
│   └── Layout.test.jsx
```

Exemplo:
```jsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Layout from './Layout';

describe('Layout', () => {
  it('renders navigation', () => {
    render(<Layout />);
    expect(screen.getByText('Horários')).toBeInTheDocument();
  });
});
```

## 📚 Documentação

Ao adicionar funcionalidades, atualize:

- `README.md` - Se afeta o uso geral
- `DEPLOY.md` - Se afeta o deploy
- Comentários no código - Para lógica complexa
- JSDoc - Para funções públicas

```javascript
/**
 * Calcula o total de horas de aula na semana
 * @param {Array} schedules - Array de horários
 * @returns {number} Total de horas
 */
function calculateWeeklyHours(schedules) {
  // implementação
}
```

## 🎯 Áreas que Precisam de Contribuição

### Alta Prioridade
- [ ] Melhorar parser HTML do SIGAA
- [ ] Adicionar testes automatizados
- [ ] Criar ícones PWA personalizados
- [ ] Melhorar acessibilidade (ARIA labels)

### Média Prioridade
- [ ] Adicionar modo escuro
- [ ] Exportar horários para PDF
- [ ] Notificações de aula próxima
- [ ] Sincronização com Google Calendar

### Baixa Prioridade
- [ ] Animações de transição
- [ ] Temas personalizáveis
- [ ] Widget para home screen
- [ ] Compartilhar horário via link

## ❓ Dúvidas?

- Abra uma [Discussion](https://github.com/Ernesto-Alves67/horarios-web/discussions)
- Ou uma [Issue](https://github.com/Ernesto-Alves67/horarios-web/issues) com a label `question`

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a GPL-3.0 License.

## 🙏 Obrigado!

Toda contribuição é valiosa, seja código, documentação, design ou feedback!

---

**Happy Coding! 🚀**
