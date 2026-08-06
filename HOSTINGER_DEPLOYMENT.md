# Guia de Deployment na Hostinger

Este guia descreve como fazer o deploy do site Vortice na Hostinger sem necessidade de banco de dados.

## 📋 Pré-requisitos

- Conta ativa na Hostinger
- Acesso ao cPanel
- Domínio configurado na Hostinger (ou subdomínio)

## 🚀 Passos para Deploy

### 1. Preparar o Build Local

```bash
# Instalar dependências
npm install

# Fazer build SPA para Hostinger
npm run build:spa
```

Isso gera os arquivos em `dist-spa/` prontos para publicar.

### 2. Upload dos Arquivos na Hostinger

#### Opção A: Usando File Manager (Recomendado)
1. Acesse cPanel → File Manager
2. Navegue até a pasta `public_html` (ou a pasta do seu domínio/subdomínio)
3. Limpe os arquivos antigos se houver
4. Faça upload dos arquivos do `dist-spa/`:
   - `index.html`
   - Pasta `assets/`
   - `favicon.ico`
   - `robots.txt`
   - `.htaccess`

#### Opção B: Usando FTP
1. Use um cliente FTP (FileZilla, WinSCP, etc.)
2. Conecte usando as credenciais FTP da Hostinger
3. Navegue até `public_html`
4. Transfira os arquivos de `dist-spa/`

### 3. Configuração do .htaccess

O arquivo `.htaccess` já está configurado para:
- ✅ Redirecionar requisições para `index.html` (necessário para SPA funcionar)
- ✅ Comprimir respostas (gzip)
- ✅ Configurar cache de assets
- ✅ Adicionar headers de segurança
- ✅ Desabilitar listagem de diretórios

Certifique-se que o arquivo `.htaccess` foi uploadado. Se você não conseguir ver (está oculto), ative a opção "Show Hidden Files" no File Manager.

### 4. Verificar Configurações da Hostinger

No cPanel, verifique:

#### PHP Version
- Acesse `cPanel → PHP Version`
- Selecione a versão mais recente (8.3 ou superior recomendado)
- **Nota**: Não é necessário PHP para este site, pode estar desativado

#### .htaccess Support
- Certifique-se que `mod_rewrite` está habilitado
- Entre em contato com support se não conseguir usar `.htaccess`

#### SSL/TLS
- Acesse `cPanel → SSL/TLS`
- Instale um certificado gratuito Let's Encrypt
- Ative HTTPS automático

### 5. Verificar o Site

1. Abra seu navegador
2. Acesse `https://seudominio.com`
3. Você deve ver a página inicial do Vortice

### 6. Testes

Teste as seguintes funcionalidades:

- [ ] Página carrega sem erros
- [ ] CSS e JavaScript carregam corretamente
- [ ] Links de navegação funcionam
- [ ] Imagens aparecem corretamente
- [ ] Responsividade funciona em mobile
- [ ] Não há erros no console (F12)

## 🔧 Estrutura de Arquivos

```
dist-spa/
├── index.html          # Arquivo principal (sempre servido para rotas desconhecidas)
├── favicon.ico         # Ícone do site
├── robots.txt          # Configuração para buscadores
└── assets/             # CSS, JS e imagens otimizadas
    ├── styles-*.css
    ├── *.js
    └── *.jpg/png
```

## 🛡️ Segurança

O arquivo `.htaccess` inclui:
- **X-Content-Type-Options**: Previne MIME-type sniffing
- **X-Frame-Options**: Previne clickjacking
- **X-XSS-Protection**: Proteção contra XSS
- **Referrer-Policy**: Controla informações de referência

## 📊 Performance

### Cache de Arquivos
- **Assets** (CSS, JS, Imagens): 1 ano
- **HTML**: 1 hora
- **Padrão**: 1 mês

### Compressão
- Gzip automático para: HTML, CSS, JS, JSON, SVG

## ⚠️ Problemas Comuns

### "404 Not Found" ao acessar rotas
**Solução**: Verifique se `.htaccess` foi uploadado e se `mod_rewrite` está ativo

### Assets (CSS/JS) não carregam
**Solução**: 
- Verifique se a pasta `assets/` foi uploadada
- Limpe cache do navegador (Ctrl+Shift+Delete)
- Verifique permissões de arquivo (755 para pastas, 644 para arquivos)

### Imagens não aparecem
**Solução**:
- Certifique-se que as imagens em `assets/` foram uploadadas
- Verifique se os nomes de arquivo estão corretos (case-sensitive em Linux)

### Site quebrado após update
**Solução**:
1. Guarde backup dos arquivos antigos
2. Delete os arquivos antigos do `public_html`
3. Faça upload dos novos arquivos do `dist-spa/`
4. Limpe cache do navegador

## 🔄 Atualizações Futuras

Para atualizar o site:

1. Faça as mudanças no código
2. Execute `npm run build:spa`
3. Faça upload apenas da pasta `assets/` e do `index.html`
4. Não esqueça de atualizar `.htaccess` se houver mudanças

## 📞 Suporte

Se encontrar problemas:

1. Verifique o console do navegador (F12 → Console)
2. Verifique os logs de erro da Hostinger (cPanel → Error Log)
3. Contate o suporte da Hostinger informando o erro específico

## ✅ Checklist Final

- [ ] Arquivos do `dist-spa/` uploadados
- [ ] `.htaccess` presente no `public_html`
- [ ] Site acessível em HTTPS
- [ ] Todas as páginas carregam corretamente
- [ ] Responsividade funciona
- [ ] Cache está configurado
- [ ] Certificado SSL ativo

---

**Último atualizado**: 2026-08-06
**Versão**: 1.0
