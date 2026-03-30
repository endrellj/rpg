import { useState } from "react";
import "./index.css";
import { DiceRoller } from "./components/DiceRoller";
import { CharacterGenerator } from "./components/CharacterGenerator";
import { Notes } from "./components/Notes";

type Tab = "dice" | "character" | "notes";

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>("dice");

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "dice", label: "Dados", icon: "◆" },
    { id: "character", label: "Personagens", icon: "⚔" },
    { id: "notes", label: "Diário", icon: "✎" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0505] to-[#2d0a0a]"></div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="medieval-title text-6xl md:text-7xl text-white glow-red mb-4">
              Coração Maldito
            </h1>
            <p className="text-[#F5DEB3]/70 text-xl md:text-2xl font-serif italic">
              Lendas do sertão
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <div className="h-px w-24 bg-gradient-to-r from-transparent to-[#8B0000]"></div>
              <span className="text-[#8B0000] text-2xl">♦</span>
              <div className="h-px w-24 bg-gradient-to-l from-transparent to-[#8B0000]"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Navegação */}
      <nav className="sticky top-0 z-50 bg-[#1a0505]/95 backdrop-blur-sm border-b border-[#8B0000]/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center gap-2 md:gap-4 py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button px-6 md:px-10 py-3 rounded-lg font-bold text-lg flex items-center gap-3
                  ${activeTab === tab.id 
                    ? "text-[#FF4444] active" 
                    : "text-[#F5DEB3]/60 hover:text-[#F5DEB3] hover:bg-white/5"
                  }`}
              >
                <span className="text-2xl">{tab.icon}</span>
                <span className="medieval-title">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="animate-fade-in-up">
          {activeTab === "dice" && <DiceRoller />}
          {activeTab === "character" && <CharacterGenerator />}
          {activeTab === "notes" && <Notes />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0505] border-t border-[#8B0000]/20 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#F5DEB3]/50 italic font-serif">
              "No escuro, o destino espera..."
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
