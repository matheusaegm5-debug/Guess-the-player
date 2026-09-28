import { useEffect, useState } from "react";
import { TRAININGS, type AppTraining, type TrainingStep } from "./trainings";

// Rotas por hash: "#/" = lista de apps, "#/gusto" = treinamento do Gusto
function readRoute() {
  return window.location.hash.replace(/^#\/?/, "");
}

export default function TrainingApp() {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(readRoute());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const training = TRAININGS.find((t) => t.id === route);
  return training ? <TrainingPage training={training} /> : <AppList />;
}

function AppList() {
  return (
    <main className="page">
      <header className="hero">
        <h1>Treinamento de Apps</h1>
        <p>Escolha um app para começar o treinamento.</p>
      </header>
      <nav className="app-list">
        {TRAININGS.map((t) => (
          <a key={t.id} className="app-card" href={`#/${t.id}`}>
            <span className="app-badge" style={{ background: t.color }}>
              {t.name.charAt(0)}
            </span>
            <span className="app-info">
              <span className="app-name">{t.name}</span>
              <span className="app-tagline">{t.tagline}</span>
            </span>
            <span className="app-meta">
              {t.steps.filter((s) => s.type === "video").length} vídeos
            </span>
            <span className="app-arrow" aria-hidden>
              →
            </span>
          </a>
        ))}
      </nav>
    </main>
  );
}

function TrainingPage({ training }: { training: AppTraining }) {
  return (
    <main className="page">
      <a className="back" href="#/">
        ← Todos os apps
      </a>
      <header className="training-header">
        <span className="app-badge large" style={{ background: training.color }}>
          {training.name.charAt(0)}
        </span>
        <div>
          <h1>{training.name}</h1>
          <p>{training.tagline}</p>
        </div>
      </header>
      <ol className="steps">
        {training.steps.map((step, i) => (
          <li key={i} className={`step step-${step.type}`}>
            <Step step={step} />
          </li>
        ))}
      </ol>
      <a className="back bottom" href="#/">
        ← Voltar para todos os apps
      </a>
    </main>
  );
}

function Step({ step }: { step: TrainingStep }) {
  if (step.type === "text") {
    return (
      <section className="explanation">
        <h2>{step.title}</h2>
        {step.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </section>
    );
  }
  return (
    <section className="video-block">
      <h2>{step.title}</h2>
      <Video src={step.src} title={step.title} />
    </section>
  );
}

// Converte links de YouTube / Loom / Vimeo / Google Drive em URLs de embed
function toEmbedUrl(src: string): string | null {
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, "");
  if (host === "youtube.com" || host === "m.youtube.com") {
    const id = url.searchParams.get("v") ?? url.pathname.split("/").pop();
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (host === "youtu.be") {
    return `https://www.youtube.com/embed${url.pathname}`;
  }
  if (host === "loom.com") {
    return `https://www.loom.com/embed/${url.pathname.split("/").pop()}`;
  }
  if (host === "vimeo.com") {
    return `https://player.vimeo.com/video/${url.pathname.split("/").pop()}`;
  }
  if (host === "drive.google.com") {
    return src.replace(/\/view.*$/, "/preview");
  }
  return null;
}

function Video({ src, title }: { src: string; title: string }) {
  if (!src) {
    return (
      <div className="video-frame placeholder">
        <span>▶</span>
        <p>Vídeo em breve</p>
      </div>
    );
  }
  const embed = toEmbedUrl(src);
  return (
    <div className="video-frame">
      {embed ? (
        <iframe
          src={embed}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video src={src} controls preload="metadata" playsInline />
      )}
    </div>
  );
}
