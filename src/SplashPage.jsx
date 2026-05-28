import { useState, useEffect, useRef } from "react";
import "./SplashPage.css";

const PUZZLE_PIECES = [
  { id: 0, correctPos: 0, emoji: "🌟" },
  { id: 1, correctPos: 1, emoji: "🚀" },
  { id: 2, correctPos: 2, emoji: "🎯" },
  { id: 3, correctPos: 3, emoji: "💎" },
  { id: 4, correctPos: 4, emoji: "🔥" },
  { id: 5, correctPos: 5, emoji: "⚡" },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SplashPage({ onEnter }) {
  const [phase, setPhase] = useState("intro"); // intro | puzzle | explore
  const [pieces, setPieces] = useState(() => shuffle(PUZZLE_PIECES));
  const [selected, setSelected] = useState(null);
  const [solved, setSolved] = useState(false);
  const [solveAnim, setSolveAnim] = useState(false);

  // Explore button dodge logic
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });
  const [dodgeCount, setDodgeCount] = useState(0);
  const [surrendered, setSurrendered] = useState(false);
  const btnRef = useRef(null);
  const containerRef = useRef(null);

  // Particles
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const p = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      dur: Math.random() * 6 + 4,
      delay: Math.random() * 4,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    setParticles(p);
  }, []);

  // Check puzzle solved
  useEffect(() => {
    if (pieces.every((p, i) => p.correctPos === i)) {
      setSolveAnim(true);
      setTimeout(() => setSolved(true), 900);
    }
  }, [pieces]);

  const handlePieceClick = (index) => {
    if (solved) return;
    if (selected === null) {
      setSelected(index);
    } else {
      if (selected !== index) {
        const newPieces = [...pieces];
        [newPieces[selected], newPieces[index]] = [newPieces[index], newPieces[selected]];
        setPieces(newPieces);
      }
      setSelected(null);
    }
  };

  const dodge = () => {
    if (surrendered) return;
    const newCount = dodgeCount + 1;
    setDodgeCount(newCount);
    if (newCount >= 4) {
      setSurrendered(true);
      setBtnPos({ x: 0, y: 0 });
      return;
    }
    const container = containerRef.current;
    const btn = btnRef.current;
    if (!container || !btn) return;
    const cRect = container.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    const maxX = cRect.width - bRect.width - 20;
    const maxY = cRect.height - bRect.height - 20;
    const newX = Math.random() * maxX - maxX / 2;
    const newY = Math.random() * maxY - maxY / 2;
    setBtnPos({ x: newX, y: newY });
  };

  return (
    <div className="splash-root">
      {/* Floating particles */}
      <div className="particles">
        {particles.map((p) => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              animationDuration: `${p.dur}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* INTRO PHASE */}
      {phase === "intro" && (
        <div className="intro-container">
          <div className="intro-badge">✦ Welcome</div>
          <h1 className="intro-title">
            <span className="title-line1">Something</span>
            <span className="title-line2">Awaits</span>
          </h1>
          <p className="intro-sub">
            But first — prove you're worthy. <br />
            Solve the puzzle to proceed.
          </p>
          <button className="cta-btn" onClick={() => setPhase("puzzle")}>
            Accept the Challenge
            <span className="btn-arrow">→</span>
          </button>
        </div>
      )}

      {/* PUZZLE PHASE */}
      {phase === "puzzle" && (
        <div className="puzzle-container">
          <div className="puzzle-header">
            <span className="puzzle-label">✦ The Puzzle</span>
            <h2 className="puzzle-title">Arrange the symbols</h2>
            <p className="puzzle-hint">
              Tap two tiles to swap them. Align them in order: 🌟 🚀 🎯 💎 🔥 ⚡
            </p>
          </div>

          <div className={`puzzle-grid ${solveAnim ? "solved-anim" : ""}`}>
            {pieces.map((piece, index) => (
              <div
                key={piece.id}
                className={`puzzle-tile
                  ${selected === index ? "selected" : ""}
                  ${piece.correctPos === index ? "correct" : ""}
                  ${solveAnim ? "celebrate" : ""}
                `}
                style={{ animationDelay: `${index * 0.08}s` }}
                onClick={() => handlePieceClick(index)}
              >
                <span className="tile-emoji">{piece.emoji}</span>
                <span className="tile-num">{index + 1}</span>
              </div>
            ))}
          </div>

          {solved && (
            <div className="solved-msg">
              <span className="solved-icon">🎉</span>
              <p>Puzzle solved! You're in.</p>
              <button className="cta-btn" onClick={() => setPhase("explore")}>
                Continue
                <span className="btn-arrow">→</span>
              </button>
            </div>
          )}

          {!solved && (
            <button
              className="skip-btn"
              onClick={() => { setPieces(PUZZLE_PIECES.map((p, i) => ({ ...p, correctPos: i }))); setSolveAnim(true); setTimeout(() => setSolved(true), 900); }}
            >
              I give up, solve it for me
            </button>
          )}
        </div>
      )}

      {/* EXPLORE PHASE */}
      {phase === "explore" && (
        <div className="explore-container" ref={containerRef}>
          <div className="explore-header">
            <span className="explore-badge">✦ Final Step</span>
            <h2 className="explore-title">You're almost there!</h2>
            <p className="explore-sub">
              {surrendered
                ? "OK fine, we'll let you in. You seem frustrated enough 😂"
                : dodgeCount === 0
                ? "Just click the button below to explore."
                : dodgeCount === 1
                ? "Hmm, interesting. Try again? 😏"
                : dodgeCount === 2
                ? "You're really trying, aren't you? 😂"
                : "One more try... we dare you. 😈"}
            </p>
          </div>

          {surrendered ? (
            <div className="surrender-box">
              <div className="surrender-emoji">😅🎉🥳😂🎊</div>
              <p className="surrender-msg">
                OK you've been quite patient with us! Click away, you've earned it! 🎁
              </p>
              <button
                className="cta-btn final-btn"
                onClick={onEnter}
              >
                Explore Now
                <span className="btn-arrow">→</span>
              </button>
            </div>
          ) : (
            <div className="dodge-wrapper">
              <button
                ref={btnRef}
                className="dodge-btn"
                style={{
                  transform: `translate(${btnPos.x}px, ${btnPos.y}px)`,
                }}
                onMouseEnter={dodge}
                onClick={dodge}
              >
                Explore
                <span className="btn-arrow">→</span>
              </button>
              {dodgeCount > 0 && (
                <p className="dodge-counter">
                  {["", "Almost! 😏", "Getting warmer... 🔥", "SO CLOSE!! 😂"][dodgeCount]}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
