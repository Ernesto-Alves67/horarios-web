# Horários Web

Versão web da aplicação "Horários" (Android) para poder atender usuários iOS.

Progressive Web App (PWA) que permite aos estudantes da UFCAT (Universidade Federal de Catalão) visualizar seus horários de aula de forma fácil e intuitiva, com suporte para instalação no dispositivo.

## 🚀 Funcionalidades

- ✅ Visualização das aulas do dia
- ✅ Visualização semanal completa
- ✅ Carregamento de horários via arquivo do comporvante de matriculas em HTML obtido no SIGAA
- ✅ PWA instalável (pode ser instalado como app no iOS, Android e Desktop)
- ✅ Armazenamento local de dados (substitui DataStore do Android)
- ✅ Registro automático de informações do dispositivo
- ✅ Funciona offline.
## 📱 Como usar

### Instalando como App

#### No iOS (Safari):
1. Abra o site no Safari
2. Toque no botão de compartilhar (ícone com seta para cima)
3. Role para baixo e toque em "Adicionar à Tela de Início"
4. Toque em "Adicionar"

#### No Android (Chrome):
1. Abra o site no Chrome
2. Toque no menu (três pontos)
3. Selecione "Adicionar à tela inicial" ou "Instalar app"
4. Confirme a instalação

#### No Desktop (Chrome/Edge):
1. Abra o site no navegador
2. Clique no ícone de instalação na barra de endereços
3. Ou vá no menu → "Instalar Horários"

### Carregando seus Horários

1. Acesse a aba "SIGAA" no app
2. Clique em "Abrir SIGAA"
3. Faça login com suas credenciais da UFCAT
4. Navegue até seu comprovante de matrícula
5. Salve a página como HTML (Ctrl+S ou Cmd+S)
6. Volte ao app e clique em "Carregar Arquivo HTML"
7. Selecione o arquivo salvo
8. Pronto! Seus horários serão carregados automaticamente

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
│   └── theme.js             # Tema e estilos
├── App.jsx           # Componente principal
└── main.jsx          # Ponto de entrada

public/               # Arquivos públicos
├── pwa-192x192.png  # Ícone PWA 192x192
├── pwa-512x512.png  # Ícone PWA 512x512
└── apple-touch-icon.png  # Ícone iOS
```

## 🔧 Desenvolvimento

### Pré-requisitos

- Node.js 22+ 
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Ernesto-Alves67/horarios-web.git

# Entre na pasta
cd horarios-web

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Lint
npm run lint
```


## 📊 Diferenças do Android

| Recurso | Android | Web |
|---------|---------|-----|
| Armazenamento Local | DataStore | LocalStorage |
| Instalação | APK | PWA |
| Atualização | Manual (APK) | Automática |
| Plataforma | Android apenas | iOS, Android, Desktop |
| Tamanho | ~10MB | ~300KB |

## 🔒 Privacidade

- Todos os dados são armazenados localmente no dispositivo
- Nenhuma informação pessoal é compartilhada com terceiros
- Comunicação com API apenas para autenticação e registro de dispositivo
- Código fonte aberto e auditável

## 📄 Licença

Este projeto está sob a licença GPL-3.0 - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

Ernesto Alves - [@Ernesto-Alves67](https://github.com/Ernesto-Alves67)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📞 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato através do repositório.

---

⭐ Se este projeto foi útil para você, considere dar uma estrela!
