# Guia de Deploy - Horários Web

Este guia mostra como fazer deploy da aplicação em diferentes plataformas.

## 📦 Pré-requisitos

Antes de fazer deploy, certifique-se de que o build funciona localmente:

```bash
npm install
npm run build
npm run preview
```

## 🚀 Opções de Deploy

### 1. Vercel (Recomendado)

A forma mais fácil e rápida:

#### Opção A: Deploy via CLI

```bash
# Instale a CLI do Vercel
npm i -g vercel

# Faça login
vercel login

# Deploy
vercel
```

#### Opção B: Deploy via GitHub

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Import Project"
3. Conecte seu repositório GitHub
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Clique em "Deploy"

**Vantagens:**
- Deploy automático em cada push
- Preview de PRs
- SSL gratuito
- CDN global
- Zero configuração

### 2. Netlify

#### Opção A: Deploy via CLI

```bash
# Instale a CLI do Netlify
npm i -g netlify-cli

# Faça login
netlify login

# Deploy
netlify deploy --prod
```

#### Opção B: Deploy via GitHub

1. Acesse [netlify.com](https://netlify.com)
2. Clique em "Add new site" → "Import an existing project"
3. Conecte seu repositório GitHub
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Clique em "Deploy site"

O arquivo `netlify.toml` já está configurado com as otimizações necessárias.

**Vantagens:**
- Deploy automático em cada push
- Forms e Functions integrados
- SSL gratuito
- CDN global

### 3. GitHub Pages

#### Via GitHub Actions

Crie o arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Configure no GitHub:
1. Settings → Pages
2. Source: Deploy from a branch
3. Branch: `gh-pages`

**Vantagens:**
- Gratuito
- Integração nativa com GitHub
- SSL automático

### 4. Firebase Hosting

```bash
# Instale Firebase CLI
npm i -g firebase-tools

# Faça login
firebase login

# Inicialize o projeto
firebase init hosting

# Configure:
# - Public directory: dist
# - Single-page app: Yes
# - GitHub integration: Yes (opcional)

# Deploy
firebase deploy
```

**Vantagens:**
- CDN global do Google
- SSL gratuito
- Integração com outros serviços Firebase

### 5. Cloudflare Pages

1. Acesse [pages.cloudflare.com](https://pages.cloudflare.com)
2. Conecte seu repositório GitHub
3. Configure:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
4. Deploy

**Vantagens:**
- CDN ultra-rápido da Cloudflare
- SSL gratuito
- Workers integration
- Analytics

## 🌐 Domínio Personalizado

### Vercel
```bash
vercel domains add seu-dominio.com
```

### Netlify
```bash
netlify domains:add seu-dominio.com
```

### GitHub Pages
1. Adicione arquivo `CNAME` na pasta `public/` com seu domínio
2. Configure DNS para apontar para GitHub Pages

## 📊 Variáveis de Ambiente

Se precisar adicionar variáveis de ambiente no futuro:

### Vercel
```bash
vercel env add VITE_API_URL
```

### Netlify
```bash
netlify env:set VITE_API_URL https://api.exemplo.com
```

### Arquivo `.env.production`
```env
VITE_API_URL=https://api.exemplo.com
```

## 🔒 Segurança

Todos os provedores oferecem SSL/HTTPS automático. Certifique-se de:

1. Usar HTTPS na API backend
2. Configurar CORS corretamente no backend
3. Não expor secrets no código

## 📈 Monitoramento

### Vercel Analytics
Adicione ao projeto:
```bash
npm i @vercel/analytics
```

```jsx
// src/main.jsx
import { Analytics } from '@vercel/analytics/react'

// Adicione no JSX
<Analytics />
```

### Google Analytics
```jsx
// src/main.jsx
useEffect(() => {
  // Adicione seu código do GA aqui
}, [])
```

## ✅ Checklist Pós-Deploy

- [ ] Aplicação abre corretamente
- [ ] Todas as rotas funcionam
- [ ] PWA pode ser instalado
- [ ] Service Worker está ativo
- [ ] Manifest carrega corretamente
- [ ] Ícones aparecem no mobile
- [ ] API funciona corretamente
- [ ] SSL/HTTPS está ativo
- [ ] Modo offline funciona

## 🆘 Troubleshooting

### Erro 404 nas rotas
Certifique-se de que o redirect está configurado para SPA:

**Vercel**: `vercel.json` já está configurado
**Netlify**: `netlify.toml` já está configurado
**Firebase**: Configurar `rewrites` no `firebase.json`

### Service Worker não atualiza
1. Limpe o cache do navegador
2. Feche todas as abas da aplicação
3. Reabra em uma nova aba
4. Ou use DevTools → Application → Service Workers → Unregister

### PWA não instala
1. Verifique se está usando HTTPS
2. Verifique se o manifest.webmanifest está acessível
3. Verifique se os ícones estão no tamanho correto
4. Use Lighthouse para diagnosticar

## 📞 Suporte

Para problemas específicos de cada plataforma:
- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Netlify**: [netlify.com/support](https://netlify.com/support)
- **Firebase**: [firebase.google.com/support](https://firebase.google.com/support)

---

**Recomendação**: Use Vercel ou Netlify para o melhor suporte a PWA e deploy automático!
