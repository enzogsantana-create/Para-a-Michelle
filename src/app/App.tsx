import { useState } from "react";

type Screen = "envelope" | "letter";

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  delay: number;
  duration: number;
  size: number;
}

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Quicksand:wght@400;500;600;700&display=swap');

  @keyframes sparkle {
    0%, 100% { opacity: 0.4; transform: scale(0.85) rotate(0deg); }
    50% { opacity: 1; transform: scale(1.18) rotate(18deg); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-9px); }
  }
  @keyframes pulse-ring {
    0% { box-shadow: 0 0 0 0 rgba(255,77,109,0.45); }
    70% { box-shadow: 0 0 0 16px rgba(255,77,109,0); }
    100% { box-shadow: 0 0 0 0 rgba(255,77,109,0); }
  }
  @keyframes particle-up {
    0% { opacity: 1; transform: translate(0, 0) scale(1); }
    100% { opacity: 0; transform: translate(var(--tx), var(--ty)) scale(0.2); }
  }
  @keyframes bounce-in {
    0% { transform: scale(0.5) translateY(10px); opacity: 0; }
    65% { transform: scale(1.1) translateY(-2px); opacity: 1; }
    100% { transform: scale(1) translateY(0); opacity: 1; }
  }
  @keyframes shimmer-pulse {
    0%, 100% { opacity: 0.65; }
    50% { opacity: 1; }
  }
  @keyframes wiggle {
    0%, 100% { transform: rotate(-3deg); }
    50% { transform: rotate(3deg); }
  }
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  .letter-paper {
    background-image: repeating-linear-gradient(
      to bottom,
      transparent 0px,
      transparent 33px,
      rgba(255,140,170,0.2) 33px,
      rgba(255,140,170,0.2) 34px
    );
  }
`;

function KittySeal({ size = 76 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="39" fill="#FF4D6D" />
      <circle cx="40" cy="40" r="35" fill="#FFE5EC" />
      <circle cx="40" cy="46" r="19" fill="white" />
      <ellipse cx="28" cy="31" rx="7" ry="8" fill="white" />
      <ellipse cx="52" cy="31" rx="7" ry="8" fill="white" />
      <ellipse cx="34.5" cy="46" rx="2.5" ry="3" fill="#1a1a1a" />
      <ellipse cx="45.5" cy="46" rx="2.5" ry="3" fill="#1a1a1a" />
      <ellipse cx="40" cy="52" rx="2" ry="1.5" fill="#FFB347" />
      <line x1="21" y1="50" x2="34" y2="52" stroke="#ddd" strokeWidth="1.2" />
      <line x1="21" y1="54.5" x2="34" y2="54" stroke="#ddd" strokeWidth="1.2" />
      <line x1="46" y1="52" x2="59" y2="50" stroke="#ddd" strokeWidth="1.2" />
      <line x1="46" y1="54" x2="59" y2="54.5" stroke="#ddd" strokeWidth="1.2" />
      <ellipse cx="47.5" cy="26" rx="7" ry="4.5" fill="#FF2D55" transform="rotate(-12 47.5 26)" />
      <ellipse cx="59.5" cy="22" rx="7" ry="4.5" fill="#FF2D55" transform="rotate(-12 59.5 22)" />
      <circle cx="53.5" cy="24" r="3.2" fill="#CC0020" />
      <circle cx="53.5" cy="24" r="1.6" fill="#FF6B8A" />
    </svg>
  );
}

function Sparkle({ x, y, size, delay }: { x: string; y: string; size: number; delay: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        animation: `sparkle 2.6s ease-in-out ${delay}s infinite`,
        pointerEvents: "none",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
        <path
          d="M10 1L11.9 8.1L19 10L11.9 11.9L10 19L8.1 11.9L1 10L8.1 8.1Z"
          fill="#FF85A1"
          opacity="0.75"
        />
      </svg>
    </div>
  );
}

function EnvelopeBodySVG() {
  return (
    <svg width="280" height="190" viewBox="0 0 280 190" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="envBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFF5F7" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="280" height="190" rx="16" fill="url(#envBody)" />
      <rect x="0.75" y="0.75" width="278.5" height="188.5" rx="15.25" fill="none" stroke="#FFD6E0" strokeWidth="1.5" />
      <polygon points="0,58 140,116 0,190" fill="#FFECF0" opacity="0.85" />
      <polygon points="280,58 140,116 280,190" fill="#FFE8ED" opacity="0.85" />
      <line x1="0" y1="190" x2="140" y2="116" stroke="#FFAAB5" strokeWidth="1" opacity="0.55" />
      <line x1="280" y1="190" x2="140" y2="116" stroke="#FFAAB5" strokeWidth="1" opacity="0.55" />
      <line x1="16" y1="1" x2="264" y2="1" stroke="#FFD6E0" strokeWidth="2" strokeDasharray="5,4" opacity="0.7" />
    </svg>
  );
}

function EnvelopeFlapSVG() {
  return (
    <svg width="280" height="112" viewBox="0 0 280 112" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="flapGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFC2D4" />
          <stop offset="100%" stopColor="#FFD8E6" />
        </linearGradient>
      </defs>
      <path d="M0 0 L280 0 L140 112 Z" fill="url(#flapGrad)" />
      <line x1="0" y1="0" x2="140" y2="112" stroke="rgba(255,140,170,0.2)" strokeWidth="1" />
      <line x1="280" y1="0" x2="140" y2="112" stroke="rgba(255,140,170,0.2)" strokeWidth="1" />
      <line x1="0" y1="0.75" x2="280" y2="0.75" stroke="#FFB0C6" strokeWidth="1.5" />
    </svg>
  );
}

function EnvelopeScreen({ isOpening, onClick }: { isOpening: boolean; onClick: () => void }) {
  const sparkles = [
    { x: "7%", y: "5%", size: 13, delay: 0 },
    { x: "83%", y: "8%", size: 10, delay: 0.5 },
    { x: "4%", y: "38%", size: 8, delay: 1.0 },
    { x: "90%", y: "33%", size: 14, delay: 0.35 },
    { x: "13%", y: "71%", size: 10, delay: 0.8 },
    { x: "88%", y: "66%", size: 8, delay: 1.3 },
    { x: "48%", y: "4%", size: 11, delay: 0.4 },
    { x: "22%", y: "17%", size: 7, delay: 1.6 },
    { x: "72%", y: "22%", size: 7, delay: 0.9 },
    { x: "37%", y: "83%", size: 9, delay: 0.2 },
    { x: "62%", y: "87%", size: 10, delay: 1.1 },
    { x: "55%", y: "75%", size: 6, delay: 0.7 },
  ];

  const corners = [
    { pos: { top: 28, left: 20 }, emoji: "🌸", delay: 0 },
    { pos: { top: 28, right: 20 }, emoji: "🌸", delay: 0.6 },
    { pos: { bottom: 88, left: 20 }, emoji: "🎀", delay: 0.3 },
    { pos: { bottom: 88, right: 20 }, emoji: "🎀", delay: 1.0 },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
      }}
    >
      {sparkles.map((s, i) => (
        <Sparkle key={i} {...s} />
      ))}

      {corners.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            ...c.pos,
            fontSize: "1.5rem",
            animation: `shimmer-pulse 2.2s ease-in-out ${c.delay}s infinite`,
            pointerEvents: "none",
          }}
        >
          {c.emoji}
        </div>
      ))}

      <p
        style={{
          fontFamily: "'Fredoka', sans-serif",
          color: "#C4607A",
          fontSize: "0.95rem",
          letterSpacing: "0.13em",
          opacity: 0.85,
          margin: 0,
        }}
      >
        ✦ uma surpresa para você ✦
      </p>

      <div
        onClick={onClick}
        style={{
          position: "relative",
          cursor: "pointer",
          userSelect: "none",
          animation: isOpening ? "none" : "float 3.2s ease-in-out infinite",
          transform: isOpening ? "scale(0.96)" : "scale(1)",
          transition: "transform 0.2s ease",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: -14,
            left: "8%",
            width: "84%",
            height: 20,
            background: "rgba(255,100,145,0.18)",
            borderRadius: "50%",
            filter: "blur(10px)",
          }}
        />

        <div style={{ position: "relative", width: 280, height: 190 }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <EnvelopeBodySVG />
          </div>

          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: 112,
              transformOrigin: "50% 0%",
              transform: isOpening
                ? "perspective(560px) rotateX(-165deg)"
                : "perspective(560px) rotateX(0deg)",
              transition: "transform 0.58s cubic-bezier(0.4,0,0.2,1)",
              zIndex: isOpening ? 1 : 20,
              backfaceVisibility: "hidden",
            }}
          >
            <EnvelopeFlapSVG />
          </div>

          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 25,
              opacity: isOpening ? 0 : 1,
              transition: "opacity 0.22s ease",
              animation: isOpening ? "none" : "pulse-ring 2.6s ease-in-out infinite",
              borderRadius: "50%",
            }}
          >
            <KittySeal size={76} />
          </div>
        </div>
      </div>

      <p
        style={{
          fontFamily: "'Quicksand', sans-serif",
          color: "#D4607A",
          fontSize: "1.1rem",
          fontWeight: 600,
          opacity: isOpening ? 0 : 1,
          transition: "opacity 0.3s ease",
          animation: "shimmer-pulse 2.1s ease-in-out infinite",
          letterSpacing: "0.02em",
          margin: 0,
        }}
      >
        Toque para abrir ✨
      </p>

      <p
        style={{
          color: "#FFB3C6",
          fontSize: "1rem",
          letterSpacing: "0.55em",
          opacity: 0.8,
          margin: 0,
        }}
      >
        ✦ ✦ ✦ ✦ ✦
      </p>
    </div>
  );
}

function PolaroidFrame() {
  return (
    <div
      style={{
        background: "white",
        padding: "10px 10px 30px",
        borderRadius: "5px",
        boxShadow: "0 6px 22px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.07)",
        transform: "rotate(-2.5deg)",
        display: "inline-block",
        animation: "wiggle 6s ease-in-out infinite",
      }}
    >
      <div
        style={{
          width: 178,
          height: 178,
          borderRadius: "3px",
          overflow: "hidden",
          background: "#FFE5EC",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400&h=400&fit=crop&auto=format"
          alt="Cherry blossoms blooming in spring"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          loading="lazy"
        />
      </div>
      <p
        style={{
          textAlign: "center",
          marginTop: 10,
          fontFamily: "'Quicksand', sans-serif",
          color: "#D4607A",
          fontSize: "0.78rem",
          fontWeight: 700,
          margin: "10px 0 0",
        }}
      >
        flores para você 🌸
      </p>
    </div>
  );
}

function LetterScreen({
  hugCount,
  showHugMessage,
  onHug,
  particles,
}: {
  hugCount: number;
  showHugMessage: boolean;
  onHug: () => void;
  particles: Particle[];
}) {
  const hugMessages = [
    "Abraço recebido! 🤍",
    "Que gostoso! 💕",
    "Mais um! 🌸",
    "Você é demais! ✨",
    "Não para! 🎀",
  ];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        className="hide-scrollbar"
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
          paddingBottom: 130,
        }}
      >
        <div style={{ padding: "2rem 1.25rem 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              marginBottom: "1.5rem",
            }}
          >
            <span style={{ fontSize: "1.4rem" }}>🌸</span>
            <span
              style={{
                fontFamily: "'Quicksand', sans-serif",
                color: "#D8A0B0",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              para você, com carinho
            </span>
            <span style={{ fontSize: "1.4rem" }}>🌸</span>
          </div>

          <div
            className="letter-paper"
            style={{
              background: "#FFFAF9",
              borderRadius: "1.5rem",
              padding: "1.75rem",
              boxShadow:
                "0 4px 28px rgba(255,100,140,0.1), 0 1px 4px rgba(255,100,140,0.07)",
              border: "1.5px solid rgba(255,180,200,0.28)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "1rem",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>🎀</span>
              <span
                style={{
                  fontFamily: "'Quicksand', sans-serif",
                  color: "#D8A0B0",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                }}
              >
                12 de junho ✦
              </span>
              <span style={{ fontSize: "1.2rem" }}>🌸</span>
            </div>

            <h1
              style={{
                fontFamily: "'Fredoka', sans-serif",
                color: "#C4607A",
                fontSize: "2rem",
                fontWeight: 600,
                marginBottom: "1.5rem",
                lineHeight: 1.2,
              }}
            >
              Oi, coisinha fofa! 🎀
            </h1>

            <div
              style={{
                fontFamily: "'Quicksand', sans-serif",
                color: "#6B4050",
                fontSize: "1.05rem",
                lineHeight: 2.2,
                fontWeight: 500,
              }}
            >
              <p style={{ marginBottom: "1.4rem" }}>
                Passei por aqui só pra te lembrar de algo importante: você é uma pessoa incrível, e o mundo fica bem mais bonito com você nele.
              </p>
              <p style={{ marginBottom: "1.4rem" }}>
                Sabe aqueles dias em que tudo parece pesado? Imagina a Hello Kitty te dando um abraço apertadinho, daqueles que fazem o coração esquentar. 🤍
              </p>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "2rem 0",
              }}
            >
              <PolaroidFrame />
            </div>

            <div
              style={{
                fontFamily: "'Quicksand', sans-serif",
                color: "#6B4050",
                fontSize: "1.05rem",
                lineHeight: 2.2,
                fontWeight: 500,
              }}
            >
              <p style={{ marginBottom: "1.4rem" }}>
                Você merece carinho, paciência consigo mesma, cafés quentinhos, risadas bobas e dias ensolarados. ☀️
              </p>
              <p style={{ marginBottom: "2rem" }}>
                Obrigada por existir do jeitinho único que você é. ✨
              </p>
            </div>

            <div
              style={{
                borderTop: "1px dashed rgba(255,150,180,0.38)",
                paddingTop: "1.5rem",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "'Quicksand', sans-serif",
                  color: "#C4607A",
                  fontSize: "1rem",
                  fontWeight: 600,
                  fontStyle: "italic",
                  lineHeight: 1.7,
                  marginBottom: "1.1rem",
                }}
              >
                Espero que este pequeno detalhe tenha deixado o seu dia um pouco mais alegre!
              </p>
              <p
                style={{
                  fontFamily: "'Fredoka', sans-serif",
                  color: "#C4607A",
                  fontSize: "1.1rem",
                  textAlign: "right",
                  margin: 0,
                }}
              >
                — com amor, Hello Kitty 🎀
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.75rem",
              marginTop: "1.5rem",
            }}
          >
            {["🍓", "🌸", "🎀", "✨", "🍭"].map((emoji, i) => (
              <span
                key={i}
                style={{
                  fontSize: "1.4rem",
                  display: "inline-block",
                  animation: `float ${2.5 + i * 0.28}s ease-in-out ${i * 0.2}s infinite`,
                }}
              >
                {emoji}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "2rem 1.5rem 2.25rem",
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(255,241,246,0.97) 32%)",
          pointerEvents: "none",
          zIndex: 30,
        }}
      >
        {showHugMessage && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem" }}>
            <div
              style={{
                background: "#FF4D6D",
                color: "white",
                padding: "8px 22px",
                borderRadius: "20px",
                fontFamily: "'Fredoka', sans-serif",
                fontSize: "1rem",
                animation: "bounce-in 0.38s cubic-bezier(0.34,1.56,0.64,1) both",
                boxShadow: "0 4px 16px rgba(255,77,109,0.38)",
                pointerEvents: "none",
              }}
            >
              {hugMessages[Math.min(hugCount - 1, hugMessages.length - 1)]}
            </div>
          </div>
        )}

        <button
          onClick={onHug}
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #FF4D6D 0%, #FF85A1 100%)",
            color: "white",
            border: "none",
            borderRadius: "30px",
            padding: "17px 24px",
            fontFamily: "'Fredoka', sans-serif",
            fontSize: "1.1rem",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 6px 24px rgba(255,77,109,0.42)",
            transition: "transform 0.14s ease, box-shadow 0.14s ease",
            pointerEvents: "auto",
            letterSpacing: "0.02em",
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "scale(0.96)";
            e.currentTarget.style.boxShadow = "0 2px 10px rgba(255,77,109,0.3)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 6px 24px rgba(255,77,109,0.42)";
          }}
          onTouchStart={(e) => {
            e.currentTarget.style.transform = "scale(0.96)";
          }}
          onTouchEnd={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {hugCount === 0
            ? "Enviar um abraço de volta 🤗"
            : hugCount < 4
            ? `Mais um abraço! (${hugCount}) 💕`
            : `${hugCount} abraços enviados! 🎀`}
        </button>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 40,
          overflow: "hidden",
        }}
      >
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              bottom: `${p.y}%`,
              fontSize: p.size,
              animation: `particle-up ${p.duration}s ease-out ${p.delay}s forwards`,
              "--tx": `${Math.round((Math.random() - 0.5) * 90)}px`,
              "--ty": `-${Math.round(90 + Math.random() * 120)}px`,
            } as React.CSSProperties}
          >
            {p.emoji}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("envelope");
  const [envelopeOpening, setEnvelopeOpening] = useState(false);
  const [hugCount, setHugCount] = useState(0);
  const [showHugMessage, setShowHugMessage] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  const handleEnvelopeClick = () => {
    if (envelopeOpening) return;
    setEnvelopeOpening(true);
    setTimeout(() => setScreen("letter"), 870);
  };

  const handleHug = () => {
    const newCount = hugCount + 1;
    setHugCount(newCount);
    setShowHugMessage(true);

    const emojis = ["🤍", "💕", "🌸", "✨", "💗", "🎀", "🍭", "🌺", "⭐", "🫶"];
    const newParticles: Particle[] = Array.from({ length: 14 }, (_, i) => ({
      id: Date.now() + i,
      x: 18 + Math.random() * 64,
      y: 12 + Math.random() * 18,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      delay: Math.random() * 0.22,
      duration: 0.78 + Math.random() * 0.55,
      size: 18 + Math.floor(Math.random() * 18),
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1900);
    setTimeout(() => setShowHugMessage(false), 2800);
  };

  return (
    <div
      style={{
        minHeight: "100svh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "linear-gradient(135deg, #FFD0E4 0%, #FFF0F5 100%)",
      }}
    >
      <style>{GLOBAL_STYLES}</style>

      <div
        style={{
          position: "relative",
          width: "min(390px, 100vw)",
          height: "min(844px, 100svh)",
          overflow: "hidden",
          background: "linear-gradient(160deg, #FFE5EC 0%, #FFF5F7 55%, #FFF9E7 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: screen === "envelope" ? 1 : 0,
            transform: screen === "envelope" ? "scale(1)" : "scale(1.06)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
            pointerEvents: screen === "envelope" ? "auto" : "none",
            zIndex: screen === "envelope" ? 10 : 5,
          }}
        >
          <EnvelopeScreen isOpening={envelopeOpening} onClick={handleEnvelopeClick} />
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: screen === "letter" ? 1 : 0,
            transform: screen === "letter" ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 0.55s ease 0.28s, transform 0.55s ease 0.28s",
            pointerEvents: screen === "letter" ? "auto" : "none",
            zIndex: screen === "letter" ? 10 : 5,
          }}
        >
          <LetterScreen
            hugCount={hugCount}
            showHugMessage={showHugMessage}
            particles={particles}
            onHug={handleHug}
          />
        </div>
      </div>
    </div>
  );
}