# 🚀 Guia Rápido de Deployment - Hostinger

## Em 3 passos:

### 1️⃣ Build do Projeto
```bash
npm install
npm run build:spa
```

Arquivos prontos em: `dist-spa/`

### 2️⃣ Upload na Hostinger
- Acesse cPanel → File Manager → public_html
- Faça upload de:
  - `index.html`
  - `favicon.ico`
  - `robots.txt`
  - `.htaccess`
  - Pasta `assets/`

### 3️⃣ Pronto! 
Acesse seu domínio em `https://seudominio.com`

---

## ⚙️ Requisitos Hostinger

✅ **mod_rewrite** (Apache)  
✅ **SSL/TLS** (Let's Encrypt - grátis)  
❌ Não precisa de **PHP** ou **Node.js**

---

## 📚 Documentação Completa

Leia `HOSTINGER_DEPLOYMENT.md` para:
- Troubleshooting
- Configurações avançadas
- Melhorias de performance
- Segurança

---

**Suporte**: Veja HOSTINGER_DEPLOYMENT.md
