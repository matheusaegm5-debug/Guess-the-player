// ============ CONTEÚDO DOS TREINAMENTOS ============
// Cada app é uma lista de passos exibidos em ordem, um abaixo do outro:
//   { type: "text", ... }  → bloco de explicação
//   { type: "video", ... } → vídeo
//
// Para adicionar um vídeo:
//   1. Coloque o arquivo em public/videos/<app>/ (ex.: public/videos/gusto/01-login.mp4)
//   2. Use src: "/videos/gusto/01-login.mp4"
// Também funciona com links do YouTube, Loom, Vimeo ou Google Drive.
// Enquanto `src` estiver vazio, aparece "Vídeo em breve" no lugar.

export type TrainingStep =
  | { type: "text"; title: string; body: string[] }
  | { type: "video"; title: string; src: string };

export type AppTraining = {
  id: string;
  name: string;
  tagline: string;
  color: string;
  steps: TrainingStep[];
};

export const TRAININGS: AppTraining[] = [
  {
    id: "encircle",
    name: "Encircle",
    tagline: "Documentação de campo: fotos, notas e medições dos projetos",
    color: "#e4572e",
    steps: [
      {
        type: "text",
        title: "O que é o Encircle",
        body: [
          "O Encircle é o app que usamos para registrar tudo o que acontece em campo em cada projeto.",
          "Neste treinamento você vai aprender o passo a passo para usar no dia a dia.",
        ],
      },
      { type: "video", title: "Vídeo 1 — Visão geral", src: "" },
      {
        type: "text",
        title: "Próximo passo",
        body: ["Escreva aqui a explicação que vem antes do próximo vídeo."],
      },
      { type: "video", title: "Vídeo 2", src: "" },
    ],
  },
  {
    id: "upr",
    name: "UPR",
    tagline: "Treinamento do UPR",
    color: "#2e86ab",
    steps: [
      {
        type: "text",
        title: "O que é o UPR",
        body: ["Escreva aqui uma introdução sobre o UPR e para que a equipe usa."],
      },
      { type: "video", title: "Vídeo 1 — Visão geral", src: "" },
      {
        type: "text",
        title: "Próximo passo",
        body: ["Escreva aqui a explicação que vem antes do próximo vídeo."],
      },
      { type: "video", title: "Vídeo 2", src: "" },
    ],
  },
  {
    id: "gusto",
    name: "Gusto",
    tagline: "Folha de pagamento, horas e benefícios",
    color: "#f45d48",
    steps: [
      {
        type: "text",
        title: "O que é o Gusto",
        body: [
          "O Gusto é onde ficam a folha de pagamento, os holerites e os dados de benefícios.",
          "Neste treinamento você vai ver como acessar e usar as funções principais.",
        ],
      },
      { type: "video", title: "Vídeo 1 — Visão geral", src: "" },
      {
        type: "text",
        title: "Próximo passo",
        body: ["Escreva aqui a explicação que vem antes do próximo vídeo."],
      },
      { type: "video", title: "Vídeo 2", src: "" },
    ],
  },
];
