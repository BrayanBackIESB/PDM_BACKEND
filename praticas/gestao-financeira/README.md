# Aula 08: aplicativo instalável com EAS (Expo)

Com **Expo Go** o app depende do computador e do comando `npx expo start`. Com **EAS Build**, a Expo compila o projeto na nuvem e você baixa um **APK** (Android) para instalar no celular como um app “de verdade”, sem cabo e sem servidor local rodando.

---

## O que você vai conseguir ao final

1. Projeto ligado à sua conta Expo (`eas init`).
2. Perfil de build **preview** gerando **APK** (instalável direto no Android).
3. Um build na nuvem (`eas build`) e o arquivo no aparelho para testar.

---

## Antes de começar (pré-requisitos)

| Item | Detalhe |
|------|---------|
| **Node.js** | Instalado (LTS recomendado). Confira com `node -v` no terminal. |
| **Conta Expo** | Gratuita em [expo.dev](https://expo.dev). |
| **Celular Android** | Para instalar o APK (iOS usa fluxo diferente / conta Apple). |
| **Pasta certa** | Todos os comandos `eas` desta aula são na pasta do app: `praticas/gestao-financeira` (é ali que estão `app.json`, `package.json` e `eas.json`). |

---

## Roteiro rápido (checklist)

- [ ] **1.** Criar conta em [expo.dev](https://expo.dev)  
- [ ] **2.** Instalar a CLI: `npm install -g eas-cli`  
- [ ] **3.** Entrar na pasta do projeto e fazer login: `eas login`  
- [ ] **4.** Associar o projeto: `eas init` (cria/atualiza `eas.json` e o `projectId` no `app.json`)  
- [ ] **5.** Conferir `eas.json` (perfil `preview` com APK — ver abaixo)  
- [ ] **6.** Disparar o build: `eas build -p android --profile preview`  
- [ ] **7.** Abrir o link (ou QR Code) no celular, baixar o `.apk` e instalar  

---

## Passo a passo

### 1. Instalar o EAS CLI e entrar na conta

Em qualquer pasta do terminal:

```bash
npm install -g eas-cli
eas login
```

Use o e-mail e a senha da conta [expo.dev](https://expo.dev).

### 2. Ir para a pasta do aplicativo

Exemplo (ajuste o caminho se o seu projeto estiver em outro lugar):

```bash
cd praticas/gestao-financeira
```

### 3. Ligar o projeto ao EAS (`eas init`)

Ainda nessa pasta:

```bash
eas init
```

- Aceite vincular o app ao seu usuário/equipe Expo quando o assistente perguntar.  
- Isso preenche o **`extra.eas.projectId`** no `app.json`. Se ainda aparecer um texto tipo “AQUI VAI O ID DO PROJETO”, rode de novo `eas init` ou copie o ID do painel do projeto em [expo.dev](https://expo.dev).

### 4. Configurar o `eas.json` para gerar APK

Build de **produção** para Play Store costuma gerar **`.aab`**, que o usuário comum **não instala tocando no arquivo**. Para testar no próprio celular, o perfil **preview** deve pedir **`apk`**.

No arquivo **`eas.json`** (na raiz de `gestao-financeira`), o perfil `preview` deve incluir `android.buildType`:

```json
{
  "cli": {
    "version": ">= 15.0.14",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

> **Resumo para leigo:** `preview` + `apk` = arquivo que você baixa e instala no Android sem publicar na loja.

### 5. Rodar o build na nuvem

Na pasta `gestao-financeira`:

```bash
eas build -p android --profile preview
```

O que pode aparecer:

- Pergunta sobre **keystore** (chave de assinatura): na primeira vez, confirme para a Expo **gerar e guardar** a keystore (recomendado para quem está aprendendo).  
- O projeto sobe para os servidores da Expo; no **plano gratuito** há **fila** — costuma levar **cerca de 10–25 minutos** (varia).  
- No terminal surgirá um **link** para acompanhar o build e, ao terminar, para **baixar** o APK.

### 6. Instalar no Android

1. Abra o link no **celular** (ou use o QR Code no terminal).  
2. Baixe o arquivo **`.apk`**.  
3. Toque para instalar.  
4. Se o sistema bloquear: **Configurações → segurança / apps → permitir instalação desta fonte** (o nome muda conforme a marca do aparelho).  
5. Abra o ícone do app e teste **sem** precisar do `expo start` no PC.

---

## Tipos de build (ideia geral)

| Tipo | Uso principal |
|------|----------------|
| **Development** | Cliente de desenvolvimento (tipo “Expo Go customizado”); ainda costuma precisar do fluxo de dev no computador para muitos testes. |
| **Preview (APK interno)** | Distribuir para você, amigos ou banca: app **fechado**, roda **offline** em relação ao seu PC. |
| **Production** | Versão para **Play Store / App Store**; Android em geral vira **`.aab`**. Lojas têm taxas e requisitos extras (conta de desenvolvedor Google/Apple). |

---

## Problemas comuns

- **“Não estou na pasta certa”** — `eas build` precisa ser executado onde existe `eas.json` e `app.json` (`gestao-financeira`).  
- **Build falhou por configuração** — rode `npx expo-doctor` na mesma pasta e siga as sugestões (pacote Android `applicationId`, ícones, etc., se o doctor apontar).  
- **Muito tempo na fila** — normal no plano gratuito; use o link do dashboard para ver status.  
- **iPhone** — instalar build de terceiros exige fluxo com **TestFlight** ou **development build** com cadastro de dispositivo; esta aula foca no **APK Android** por ser o caminho mais simples para “baixar e instalar”.

---

## Conclusão do módulo

Você passou do protótipo no Expo Go a um **pacote instalável** gerado com **EAS**, alinhado ao fluxo profissional de apps React Native/Expo. Para evoluir: filtros, gráficos, publicação nas lojas com `eas submit` quando tiver conta de desenvolvedor.
