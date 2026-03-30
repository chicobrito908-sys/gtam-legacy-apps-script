# 📋 Escalante Pro — Guia de Instalação (GTAM)

## Visão Geral
O sistema roda dentro do Google Apps Script (GAS), using o Google Sheets como banco de dados.
Não precisa de hospedagem extra — tudo fica na sua conta Google.

---

## Passo 1 — Criar o Google Sheets

1. Acesse [sheets.google.com](https://sheets.google.com)
2. Crie uma nova planilha em branco
3. Dê o nome: **Escalante Pro — GTAM**
4. Copie o link da planilha (você vai precisar dele)

---

## Passo 2 — Abrir o Google Apps Script

1. Na planilha aberta, clique em **Extensões → Apps Script**
2. Isso abre o editor de código
3. Apague qualquer código que já exista no arquivo `Code.gs`

---

## Passo 3 — Importar os arquivos

Você precisa criar **5 arquivos** no Apps Script:

### 3.1 — Code.gs (já existe)
- Cole o conteúdo de `Code.gs` (da pasta `escalante-pro`)

### 3.2 — Setup.gs
- Clique no **+** ao lado de "Arquivos"
- Selecione "Script"
- Nomeie como **Setup**
- Cole o conteúdo de `Setup.gs`

### 3.3 — index.html
- Clique no **+** → "HTML"
- Nomeie como **index**
- Cole o conteúdo de `index.html`

### 3.4 — style.html
- Clique no **+** → "HTML"
- Nomeie como **style**
- Cole o conteúdo de `style.html`

### 3.5 — script.html
- Clique no **+** → "HTML"
- Nomeie como **script**
- Cole o conteúdo de `script.html`

---

## Passo 4 — Configurar o appsscript.json

1. No editor, clique em **Configurações do Projeto** (ícone de engrenagem)
2. Ative **"Mostrar arquivo de manifesto appsscript.json"**
3. Clique no arquivo `appsscript.json`
4. Substitua o conteúdo pelo arquivo `appsscript.json` do projeto

---

## Passo 5 — Criar o banco de dados (SETUP)

1. No editor, selecione a função **setup** no menu suspenso
2. Clique em **▶ Executar**
3. Autorize as permissões quando solicitado
4. Aguarde a mensagem: ✅ Setup concluído!
5. Verifique no Sheets — as 8 abas devem ter sido criadas

---

## Passo 6 — Publicar como Web App

1. No editor, clique em **Implantar → Nova implantação**
2. Clique no ícone de engrenagem → selecione **Aplicativo da Web**
3. Configure:
   - **Descrição**: Escalante Pro v1.0
   - **Executar como**: Eu (seu e-mail)  
   - **Quem tem acesso**: Qualquer pessoa com conta Google
4. Clique em **Implantar**
5. Copie a **URL do aplicativo da web** gerada

---

## Passo 7 — Acessar o sistema

- Abra a URL no navegador (PC ou celular)
- Faça login com sua conta Google quando solicitado
- **Pronto!** 🎉

### Adicionar à tela inicial do celular (Android):
1. Abra a URL no Chrome
2. Toque nos 3 pontos → "Adicionar à tela inicial"
3. O sistema aparecerá como um app

---

## Estrutura do Banco de Dados (Abas do Sheets)

| Aba | Descrição |
|-----|-----------|
| `Efetivo` | Cadastro de todos os servidores |
| `Escalas` | Escala diária de serviço |
| `Plantoes` | Plantões por data |
| `Afastamentos` | Licenças médicas e especiais |
| `Ferias` | Períodos de férias |
| `Faltas` | Faltas justificadas e injustificadas |
| `Banco_Horas` | Créditos e débitos de horas |
| `Configuracoes` | Configurações do sistema |

---

## Atualizar o sistema

Sempre que fizer alterações no código:
1. Vá em **Implantar → Gerenciar implantações**
2. Clique em ✏️ (editar)
3. Em "Versão", selecione **"Nova versão"**
4. Clique em **Implantar**
5. A URL permanece a mesma

---

## Suporte

Todos os arquivos do projeto estão na pasta `escalante-pro/`.
Os dados ficam salvos diretamente no Google Sheets e podem ser visualizados/editados manualmente a qualquer momento.
