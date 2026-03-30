import { useState, useCallback } from "react";
import ThreeDice from "./ThreeDice";

interface DiceResult {
  type: string;
  rolls: number[];
  total: number;
  modifier: number;
  timestamp: Date;
}

export function DiceRoller() {
  const [results, setResults] = useState<DiceResult[]>([]);
  const [modifier, setModifier] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showDice3D, setShowDice3D] = useState(false);
  const [currentDiceType, setCurrentDiceType] = useState("d6");

  const diceTypes = [
    { name: "d2", sides: 2, icon: "🪙", shape: "coin" },
    { name: "d4", sides: 4, icon: "🔺", shape: "tetra" },
    { name: "d6", sides: 6, icon: "🎲", shape: "cube" },
    { name: "d8", sides: 8, icon: "💎", shape: "octa" },
    { name: "d10", sides: 10, icon: "🔶", shape: "deca" },
    { name: "d12", sides: 12, icon: "⬡", shape: "dodeca" },
    { name: "d20", sides: 20, icon: "⚡", shape: "icosa" },
    { name: "d100", sides: 100, icon: "💀", shape: "sphere" },
  ];

  const rollDice = (name: string) => {
    setCurrentDiceType(name);
    setShowDice3D(true);
  };

  const handleRollComplete = useCallback((rolls: number[]) => {
    const total = rolls.reduce((a, b) => a + b, 0) + modifier;

    setResults((prev) => [
      {
        type: currentDiceType,
        rolls,
        total,
        modifier,
        timestamp: new Date(),
      },
      ...prev,
    ].slice(0, 30));

    // Close the dice view after a delay
    setTimeout(() => {
      setShowDice3D(false);
    }, 2500);
  }, [modifier, currentDiceType]);

  const handleCloseDice = useCallback(() => {
    setShowDice3D(false);
  }, []);

  const clearHistory = () => setResults([]);

  const getResultColor = (total: number, type: string) => {
    const sides = parseInt(type.replace('d', ''));
    const ratio = total / (sides * quantity);
    if (ratio >= 0.8) return "text-emerald-400";
    if (ratio <= 0.2) return "text-red-400";
    return "text-amber-200";
  };

  return (
    <div className="space-y-8">
      {/* 3D Dice Overlay */}
      {showDice3D && (
        <ThreeDice
          diceType={currentDiceType}
          quantity={quantity}
          onRollComplete={handleRollComplete}
          onClose={handleCloseDice}
        />
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="medieval-title text-4xl md:text-5xl text-white glow-red mb-3">
          ◆ Torre de Dados
        </h2>
        <p className="text-[#F5DEB3]/60 italic font-serif text-lg">
          Pegue o dado e lance seu destino
        </p>
      </div>

      {/* Controls Card */}
      <div className="glass-card rounded-2xl p-6 md:p-8">
        {/* Quantity & Modifier */}
        <div className="flex flex-wrap gap-6 mb-8 justify-center items-center">
          <div className="flex items-center gap-3">
            <label className="text-[#FFD700]/80 font-bold font-serif text-sm uppercase tracking-wider">
              Quantidade
            </label>
            <div className="flex items-center bg-[#0a0505] rounded-xl border border-[#8B4513]/40 overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-[#FFD700] hover:bg-[#8B4513]/30 transition-colors font-bold"
              >
                −
              </button>
              <span className="px-4 py-2 text-[#FFD700] font-bold text-lg min-w-[40px] text-center border-x border-[#8B4513]/20">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="px-3 py-2 text-[#FFD700] hover:bg-[#8B4513]/30 transition-colors font-bold"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-[#FFD700]/80 font-bold font-serif text-sm uppercase tracking-wider">
              Modificador
            </label>
            <div className="flex items-center bg-[#0a0505] rounded-xl border border-[#8B4513]/40 overflow-hidden">
              <button
                onClick={() => setModifier(modifier - 1)}
                className="px-3 py-2 text-[#FFD700] hover:bg-[#8B4513]/30 transition-colors font-bold"
              >
                −
              </button>
              <span className={`px-4 py-2 font-bold text-lg min-w-[40px] text-center border-x border-[#8B4513]/20 ${
                modifier > 0 ? 'text-emerald-400' : modifier < 0 ? 'text-red-400' : 'text-[#FFD700]'
              }`}>
                {modifier > 0 ? `+${modifier}` : modifier}
              </span>
              <button
                onClick={() => setModifier(modifier + 1)}
                className="px-3 py-2 text-[#FFD700] hover:bg-[#8B4513]/30 transition-colors font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Dice Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {diceTypes.map((dice) => (
            <button
              key={dice.name}
              onClick={() => rollDice(dice.name)}
              className="dice-button group"
            >
              <div className="dice-button-inner">
                <span className="text-3xl mb-1 group-hover:scale-125 transition-transform duration-300">
                  {dice.icon}
                </span>
                <span className="text-sm font-bold tracking-wider opacity-90">
                  {dice.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* History */}
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="medieval-title text-2xl text-[#FFD700]/90 flex items-center gap-2">
            <span className="text-[#8B4513]">◇</span> Registro do Destino
          </h3>
          {results.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-4 py-2 bg-[#8B4513]/20 text-[#D4A574] rounded-lg font-bold text-sm
                hover:bg-[#8B4513]/40 transition-all border border-[#8B4513]/30 hover:border-[#8B4513]/60"
            >
              ✕ Limpar
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4 opacity-30">🎲</p>
            <p className="text-[#F5DEB3]/40 italic font-serif text-lg">
              Clique em um dado para revelar seu destino
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto scroll-parchment pr-2">
            {results.map((result, index) => (
              <div
                key={index}
                className={`result-entry rounded-xl p-4 flex items-center justify-between
                  ${index === 0 ? "latest" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <span className="dice-badge">
                    {result.type}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[#F5DEB3]/90 font-mono text-sm">
                      {result.rolls.join(" + ")}
                      {result.modifier !== 0 && (
                        <span className={result.modifier > 0 ? "text-emerald-400 ml-1" : "text-red-400 ml-1"}>
                          {result.modifier > 0
                            ? ` + ${result.modifier}`
                            : ` − ${Math.abs(result.modifier)}`}
                        </span>
                      )}
                    </span>
                    <span className="text-[#D4A574]/40 text-xs">
                      {result.timestamp.toLocaleTimeString("pt-BR")}
                    </span>
                  </div>
                </div>
                <span className={`text-3xl font-bold ${getResultColor(result.total, result.type)}`}>
                  {result.total}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      {results.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Rolagens", value: results.length, color: "text-[#FFD700]" },
            { label: "Maior", value: Math.max(...results.map((r) => r.total)), color: "text-emerald-400" },
            { label: "Menor", value: Math.min(...results.map((r) => r.total)), color: "text-red-400" },
            { label: "Média", value: (results.reduce((a, b) => a + b.total, 0) / results.length).toFixed(1), color: "text-amber-300" },
          ].map((stat) => (
            <div key={stat.label} className="stat-card">
              <p className="text-[#D4A574]/50 text-xs uppercase tracking-wider mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}