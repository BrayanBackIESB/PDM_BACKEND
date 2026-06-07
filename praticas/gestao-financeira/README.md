# Última aula: próximos passos após o curso

Parabéns por chegar até aqui. A ideia deste módulo não foi levar ninguém do “não sei nada” ao nível sênior em um único curso, e sim entregar **uma base sólida**. A partir daqui, o que acelera de verdade é **praticar em projetos reais** e ir aprofundando conforme a necessidade.

---

## Avalie o curso

Ao concluir esta aula, **avalie o curso** e envie comentários e feedback. Isso ajuda a melhorar o material e as próximas turmas.

---

## Depois do curso: prática e portfólio

Recomenda-se **fazer mais projetos**. O mais proveitoso costuma ser criar algo que **você queira usar ou mostrar** no portfólio, com a **sua cara**, em vez de só repetir tutoriais idênticos aos de aula.

Com a base que você já tem, um jeito muito eficiente de evoluir (principalmente estudando sozinho) é:

1. Ter uma **necessidade concreta** no app (ex.: “preciso de notificação push”, “preciso de login”).
2. **Pesquisar** na documentação do Expo/React Native e em exemplos.
3. **Implementar** e corrigir até funcionar.

Assim você fixa o que aprendeu e descobre bibliotecas e APIs no contexto de um problema real.

---

## Sem ideia de projeto?

A documentação do Expo oferece um **tutorial em várias páginas** (navegação, telas, gestos, etc.) que monta um app **diferente** do nosso: trabalha com **imagens da galeria do celular** (editar, cortar, compor). Vale seguir passo a passo se quiser variar o repertório.

- [Tutorial Expo](https://docs.expo.dev/tutorial/introduction/) (texto em **inglês**; se preferir, use a tradução automática do navegador).

---

## Roadmap como mapa de estudos

O site **[roadmap.sh](https://roadmap.sh)** organiza **caminhos de aprendizado** por tecnologia. Há um roteiro específico para **[React Native](https://roadmap.sh/react-native)** (sempre em atualização). Use como **checklist** do que já viu e do que pode explorar depois.

Em linha com o que foi comentado na aula:

| Tema | O que vale lembrar |
|------|---------------------|
| **Expo vs. CLI** | Usamos **Expo**, alinhado ao que a documentação do React Native sugere para começar. Se quiser fluxo mais manual, existe **React Native CLI** e **Metro**. |
| **Execução no aparelho** | Você já viu como rodar no device; o roadmap aponta aprofundamentos. |
| **Debug** | Ferramentas extras para quem quiser mergulhar em depuração. |
| **Componentes core** | Já usamos vários (`Text`, `TextInput`, `View`, etc.). Vale explorar os que **não entramos a fundo**: por exemplo **RefreshControl**, **ActivityIndicator**, **Switch**, **ImageBackground** (e outros listados no roadmap), sempre com a [documentação do React Native](https://reactnative.dev/docs/components-and-apis). |
| **Código por plataforma** | `Platform` e arquivos específicos por SO quando o comportamento precisa divergir. |
| **React Native Web** | Possibilidade de versão web; no curso apareceu o cuidado com imports (evitar puxar coisas de web sem querer). |
| **Estilização** | `StyleSheet` é o padrão que usamos; existem alternativas (ex.: **styled-components** também no ecossistema React Native). |
| **Rede** | Requisições HTTP: **fetch**, **axios**, ou **Apollo Client** se for GraphQL, entre outras opções. |
| **Notificações e interação** | Push notifications, gestos, animações (dá aprofundar além do básico). |
| **Deep linking, segurança, performance** | Camadas mais avançadas; faz sentido estudar quando os apps forem **maiores** e mais exigentes. |
| **Armazenamento** | **AsyncStorage** foi o foco principal; existem **expo-secure-store**, **file-system**, **SQLite** (documentação do Expo explica casos de uso). |
| **Testes** | **Jest** e **React Native Testing Library** (próximas do ecossistema React); para E2E há ferramentas como **Detox** e **Appium**, entre outras. |
| **Código nativo** | Integrar módulos **iOS/Android** nativos quando a biblioteca JS não basta; tópico mais específico e avançado. |
| **Lojas** | Publicar na **App Store** / **Google Play** exige **contas de desenvolvedor** e processos da loja; o roadmap encerra essa etapa como próximo degrau. |

Tópicos “pesados” (performance em app minúsculo, otimizações extremas) costumam fazer mais sentido **depois** de você ter projetos maiores e sentir gargalo real.

---

## Complemento: build instalável com EAS (opcional)

Este repositório inclui **`eas.json`** configurado para um perfil de **preview** com **APK** no Android, útil para **distribuir um arquivo instalável** sem depender do Expo Go no dia a dia.

Se quiser seguir esse caminho técnico depois desta aula conceitual:

1. Conta em [expo.dev](https://expo.dev), `npm install -g eas-cli`, `eas login`.
2. Na pasta `gestao-financeira`, `eas init` (preenche o `projectId` no `app.json` se ainda estiver em branco).
3. `eas build -p android --profile preview` e acompanhar o link no painel da Expo.

Documentação oficial (builds, distribuição interna, lojas):

- [EAS Build — introdução](https://docs.expo.dev/build/introduction/)
- [Distribuição interna](https://docs.expo.dev/tutorial/eas/internal-distribution-builds/)
