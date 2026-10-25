# Guess the Player ⚽

Jogo de quiz de futebol (React + TypeScript + Vite). O jogador responde perguntas
sobre jogadores de futebol em diferentes modos:

- **Pistas (clues)** — adivinhe o jogador a partir de três dicas.
- **Escalação (lineup)** — descubra o jogador que falta em uma escalação.
- **Clubes (clubs)** — adivinhe o jogador pelos clubes por onde passou.
- **Ano (year)** — adivinhe o jogador por um ano/época marcante.
- **Aleatório (random)** — mistura todos os modos acima.

Existem também pools de perguntas focadas no futebol brasileiro (`brazil*`), e o
app está traduzido para inglês, português e espanhol.

## Rodando localmente

```bash
npm install
npm run dev
```

O build de produção do site (`dist/`) é gerado com:

```bash
npm run build     # roda checagem de tipos (tsc) + vite build
# ou, se preferir pular a checagem de tipos:
npx vite build
```

> Nota: o `App.tsx` original (a "base" do jogo) tem vários estilos inline sem
> tipagem estrita, então `tsc -b` hoje falha com erros de tipo em `style={{...}}`.
> Isso é pré-existente e não bloqueia o app — o `vite build` sozinho funciona
> normalmente. Vale corrigir a tipagem depois, mas não foi mexido aqui para não
> arriscar quebrar a base já pronta.

## Publicando como app nativo (App Store / Google Play)

O projeto usa o [Capacitor](https://capacitorjs.com/) para empacotar o mesmo
código web como um app nativo iOS e Android. Já está tudo configurado neste
repositório:

- `capacitor.config.ts` — `appId: com.guesstheplayer.app`, `appName: Guess the Player`.
- `android/` — projeto nativo Android (Gradle) pronto para abrir no Android Studio.
- `ios/` — projeto nativo iOS (Xcode, via Swift Package Manager) pronto para abrir no Xcode.
- `resources/icon.png` (1024×1024) e `resources/splash.png` (2732×2732) — arte
  base do ícone/splash. **São um placeholder gerado automaticamente** (bola de
  futebol + lupa sobre o gramado listrado) — recomendo substituir por uma arte
  final antes de publicar.

### Fluxo para atualizar os apps nativos após mudar o código

```bash
npm run cap:sync   # builda o site (vite build) e sincroniza dist/ para android/ e ios/
```

Se você trocar o ícone/splash em `resources/`, regenere os assets nativos com:

```bash
npx capacitor-assets generate --android --ios
```

### Android (Google Play)

Pré-requisitos: [Android Studio](https://developer.android.com/studio) instalado
e uma conta de desenvolvedor no [Google Play Console](https://play.google.com/console)
(taxa única de US$25).

1. `npm run cap:open:android` (abre `android/` no Android Studio).
2. No Android Studio: `Build > Generate Signed Bundle / APK`, criando/usando uma
   keystore de release. Gere um **Android App Bundle (.aab)**.
3. No Play Console: crie o app, preencha a ficha da loja (descrição, screenshots,
   política de privacidade, classificação indicativa) e envie o `.aab` numa faixa
   de teste ou produção.

### iOS (App Store)

Pré-requisitos: um Mac com [Xcode](https://developer.apple.com/xcode/) e uma
conta no [Apple Developer Program](https://developer.apple.com/programs/) (US$99/ano).

1. `npm run cap:open:ios` (abre `ios/App/App.xcodeproj` no Xcode).
2. Em *Signing & Capabilities*, selecione seu time de desenvolvedor (cria o
   certificado/provisioning profile automaticamente).
3. `Product > Archive`, depois use o Organizer para enviar o build ao
   **App Store Connect**.
4. No [App Store Connect](https://appstoreconnect.apple.com/), crie o registro
   do app (mesmo Bundle ID `com.guesstheplayer.app`), preencha metadados,
   screenshots e política de privacidade, e envie para revisão da Apple.

### O que ainda precisa ser feito manualmente (fora deste ambiente)

Este ambiente é Linux e não tem Xcode/Android Studio/contas de loja, então o que
foi preparado aqui é todo o projeto nativo e os scripts — mas os passos abaixo
só podem ser feitos por você, localmente ou em um Mac (para iOS):

- Criar as contas de desenvolvedor (Apple e/ou Google) e pagar as taxas.
- Trocar o ícone/splash placeholder por uma arte final (opcional, mas recomendado).
- Gerar as chaves de assinatura (keystore Android / certificado iOS).
- Tirar screenshots reais do app rodando no dispositivo/simulador para a ficha da loja.
- Escrever uma política de privacidade (obrigatória em ambas as lojas) e hospedá-la
  em uma URL pública.
- Fazer o build assinado e enviar para revisão em cada loja.
