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
│   App.css
│   App.jsx
│   index.css
│   main.jsx
│
├───assets
│       react.svg
│
├───components
│   │   Layout.jsx
│   │
│   ├───daily
│   │       DailyComponents.jsx
│   │
│   ├───status
│   │       EditarDisciplinaModal.jsx
│   │       UserModal.jsx
│   │
│   └───weekly
│           WeeklyComponents.jsx
│
├───context
│       ThemeContext.jsx
│
├───hooks
│       useDisciplinas.js
│
├───screens
│   ├───daily
│   │       DailyScreen.jsx
│   │       styles.js
│   │
│   ├───status
│   │       StatusScreen.jsx
│   │       styles.js
│   │
│   └───weekly
│           styles.js
│           WeeklyScreen.jsx
│
├───services
│       api.js
│       localStorage.js
│
└───utils
        deviceInfo.js
        horarioUtils.js
        sigaaParser.js
        theme.js
```