# Documentação - Horários Web

## 🛠️ Tecnologias Utilizadas

- **React** - Framework JavaScript para construção da interface
- **Vite** - Build tool moderna e rápida
- **React Router** - Navegação entre páginas
- **Styled Components** - Estilização de componentes
- **Axios** - Cliente HTTP para requisições API
- **Vite PWA Plugin** - Configuração automática de PWA
- **LocalStorage** - Armazenamento local de dados (substitui DataStore do Android)

## 🏗️ Estrutura do Projeto

```
src/
├── components/        # Componentes reutilizáveis
│   └── Layout.jsx    # Layout principal com navegação
│   ├── DailyComponents.jsx      # estilos e layouts tela inicial
│   ├── WeeklyComponents.jsx      # estilos e layouts tela semanal
│   ├── StatusComponents.jsx      # estilos e layouts tela informações do estudante
├── screens/          # Telas da aplicação
│   ├── DailyScreen.jsx      # Visualização diária
│   ├── WeeklyScreen.jsx     # Visualização semanal
│   ├── StatusScreen.jsx     # Status e informações
│   └── SigaaScreen.jsx      # Carregamento de horários
├── services/         # Serviços e APIs
│   ├── api.js               # Comunicação com backend
│   └── localStorage.js      # Gerenciamento de dados locais
├── utils/            # Utilitários
│   ├── deviceInfo.js        # Informações do dispositivo
│   ├── sigaaParser.js        # Helper para extração de dados das diciplinas
│   └── theme.js             # Tema e estilos
├── App.jsx           # Componente principal
└── main.jsx          # Ponto de entrada

public/               # Arquivos públicos
├── pwa-192x192.png  # Ícone PWA 192x192
├── pwa-512x512.png  # Ícone PWA 512x512
└── apple-touch-icon.png  # Ícone iOS
```