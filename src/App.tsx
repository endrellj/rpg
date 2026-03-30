import { useState, useEffect } from "react";
import "./index.css";
import { DiceRoller } from "./components/DiceRoller";
import { CharacterGenerator } from "./components/CharacterGenerator";
import { Notes } from "./components/Notes";

type Tab = "dice" | "character" | "notes";

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>("dice");

  // Track mouse position for ambient glow effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "dice", label: "Dados", icon: "🎲" },
    { id: "character", label: "Personagens", icon: "⚔" },
    { id: "notes", label: "Diário", icon: "📖" },
  ];

  return (
    <div className="min-h-screen relative" style={{ zIndex: 1 }}>
      {/* Header */}
      <header className="relative overflow-hidden py-10 md:py-14">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(139, 69, 19, 0.06) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="medieval-title text-5xl md:text-7xl text-white glow-red mb-3" style={{
              lineHeight: 1.1,
            }}>
              Coração Maldito
            </h1>
            <p className="text-[#D4A574]/50 text-lg md:text-xl font-serif italic tracking-wide">
              Lendas do sertão
            </p>
            <div className="flex justify-center gap-4 mt-5 items-center">
              <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent to-[#8B4513]/40" />
              <span className="text-[#8B4513]/50 text-lg">♦</span>
              <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent to-[#8B4513]/40" />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-[#8B4513]/12" style={{
        background: 'linear-gradient(180deg, rgba(13, 8, 5, 0.97) 0%, rgba(13, 8, 5, 0.92) 100%)',
        backdropFilter: 'blur(16px)',
      }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center gap-1 md:gap-2 py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button px-5 md:px-8 py-3 rounded-xl font-bold text-base md:text-lg flex items-center gap-2 md:gap-3
                  ${activeTab === tab.id
                    ? "text-[#FFD700] active"
                    : "text-[#F5DEB3]/40 hover:text-[#F5DEB3]/70 hover:bg-white/[0.02]"
                  }`}
              >
                <span className="text-xl md:text-2xl">{tab.icon}</span>
                <span className="medieval-title hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <div className="animate-fade-in-up" key={activeTab}>
          {activeTab === "dice" && <DiceRoller />}
          {activeTab === "character" && <CharacterGenerator />}
          {activeTab === "notes" && <Notes />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#8B4513]/10 py-8 mt-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#D4A574]/25 italic font-serif text-sm">
              "No escuro, o destino espera..."
            </p>
            <p className="text-[#D4A574]/15 text-xs">
              Coração Maldito RPG Tools
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
