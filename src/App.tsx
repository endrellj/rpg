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
      {/* Header + Navigation */}
      <header className="sticky top-0 z-50 border-b border-[#8B4513]/12" style={{
        background: 'linear-gradient(180deg, rgba(13, 8, 5, 0.97) 0%, rgba(13, 8, 5, 0.92) 100%)',
        backdropFilter: 'blur(16px)',
      }}>
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h1 className="medieval-title text-2xl md:text-3xl text-white glow-red">
                Coração Maldito
              </h1>
              <span className="text-[#D4A574]/30 hidden sm:inline">•</span>
              <p className="text-[#D4A574]/40 text-sm font-serif italic hidden sm:inline">
                Lendas do sertão
              </p>
            </div>
            <nav className="flex gap-1 md:gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-button px-4 md:px-6 py-2 rounded-lg font-bold text-sm md:text-base flex items-center gap-2
                    ${activeTab === tab.id
                      ? "text-[#FFD700] active"
                      : "text-[#F5DEB3]/40 hover:text-[#F5DEB3]/70 hover:bg-white/[0.02]"
                    }`}
                >
                  <span className="text-lg md:text-xl">{tab.icon}</span>
                  <span className="medieval-title hidden md:inline">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

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
