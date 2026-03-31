import { useState, useCallback, useEffect } from "react";
import ThreeDice from "./ThreeDice";
import {
  CrossedSwordsIcon, SwordIcon, DaggerIcon, TargetIcon,
  QuestionIcon, FeatherIcon, CoinIcon, TriangleIcon,
  DiceIcon, DiamondIcon, PentagonIcon, HexagonIcon,
  LightningIcon, SkullIcon
} from "./Icons";

interface DiceResult {
  type: string;
  rolls: number[];
  total: number;
  modifier: number;
  timestamp: Date;
}

const quickPresets = [
  { label: "Ataque", notation: "1d20", modifier: 0, icon: <CrossedSwordsIcon size={16} /> },
  { label: "Dano", notation: "1d8", modifier: 3, icon: <SwordIcon size={16} /> },
  { label: "Punhal", notation: "1d4", modifier: 2, icon: <DaggerIcon size={16} /> },
  { label: "Iniciativa", notation: "1d20", modifier: 2, icon: <TargetIcon size={16} /> },
  { label: "Teste", notation: "2d6", modifier: 0, icon: <QuestionIcon size={16} /> },
  { label: "Vantagem", notation: "2d20", modifier: 0, icon: <FeatherIcon size={16} /> },
];

const diceTypes = [
  { name: "d2", sides: 2, icon: <CoinIcon size={22} />, key: "1" },
  { name: "d4", sides: 4, icon: <TriangleIcon size={22} />, key: "2" },
  { name: "d6", sides: 6, icon: <DiceIcon size={22} />, key: "3" },
  { name: "d8", sides: 8, icon: <DiamondIcon size={22} />, key: "4" },
  { name: "d10", sides: 10, icon: <PentagonIcon size={22} />, key: "5" },
  { name: "d12", sides: 12, icon: <HexagonIcon size={22} />, key: "6" },
  { name: "d20", sides: 20, icon: <LightningIcon size={22} />, key: "7" },
  { name: "d100", sides: 100, icon: <SkullIcon size={22} />, key: "8" },
];

export function DiceRoller() {
  const [results, setResults] = useState<DiceResult[]>([]);
  const [modifier, setModifier] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showDice3D, setShowDice3D] = useState(false);
  const [currentDiceType, setCurrentDiceType] = useState("d6");
  const [lastRoll, setLastRoll] = useState<DiceResult | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowDice3D(false);
        return;
      }

      const num = parseInt(e.key);
      if (num >= 1 && num <= 9) {
        setQuantity(num);
        return;
      }
      if (e.key === '0') setQuantity(10);

      if (e.key === '+' || e.key === '=') setModifier(m => m + 1);
      if (e.key === '-' || e.key === '_') setModifier(m => m - 1);
      if (e.key === 'r' || e.key === 'R') {
        if (lastRoll) {
          setCurrentDiceType(lastRoll.type);
          setModifier(lastRoll.modifier);
          setQuantity(lastRoll.rolls.length);
          setShowDice3D(true);
        }
        return;
      }

      const dice = diceTypes.find(d => d.key === e.key);
      if (dice) {
        setCurrentDiceType(dice.name);
        setShowDice3D(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lastRoll]);

  const rollDice = (name: string, qty?: number, mod?: number) => {
    if (qty !== undefined) setQuantity(qty);
    if (mod !== undefined) setModifier(mod);
    setCurrentDiceType(name);
    setShowDice3D(true);
  };

  const rollPreset = (preset: typeof quickPresets[0]) => {
    const qty = parseInt(preset.notation.match(/^\d+/)?.[0] || "1");
    const dice = preset.notation.match(/d\d+/)?.[0]?.replace(/^\d+/, "") || "d20";
    setQuantity(qty);
    setModifier(preset.modifier);
    setCurrentDiceType(dice);
    setShowDice3D(true);
  };

  const handleRollComplete = useCallback((rolls: number[]) => {
    const total = rolls.reduce((a, b) => a + b, 0) + modifier;

    const result: DiceResult = {
      type: currentDiceType,
      rolls,
      total,
      modifier,
      timestamp: new Date(),
    };

    setLastRoll(result);
    setResults((prev) => [result, ...prev].slice(0, 30));
  }, [modifier, currentDiceType]);

  const handleCloseDice = useCallback(() => {
    setShowDice3D(false);
  }, []);

  const handleRollAgain = useCallback(() => {
    setShowDice3D(false);
  }, []);

  const clearHistory = () => setResults([]);

  const getResultColor = (total: number, type: string, qty: number) => {
    const sides = parseInt(type.replace('d', ''));
    const ratio = total / (sides * qty);
    if (ratio >= 0.8) return "text-emerald-400";
    if (ratio <= 0.2) return "text-red-400";
    return "text-amber-200";
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* 3D Dice Overlay */}
      {showDice3D && (
        <ThreeDice
          diceType={currentDiceType}
          quantity={quantity}
          onRollComplete={handleRollComplete}
          onClose={handleCloseDice}
          onRollAgain={handleRollAgain}
          lastResult={lastRoll}
        />
      )}

      {/* Main Content - Left Side */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Header */}
        <div className="text-center lg:text-left">
          <h2 className="medieval-title text-3xl text-white glow-red mb-1">
            ◆Torre de Dados
          </h2>
          <p className="text-[#F5DEB3]/60 italic font-serif text-sm">
            Pegue o dado e lance seu destino
          </p>
        </div>

        {/* Quick Presets */}
        <div className="glass-card rounded-xl p-3">
          <p className="text-[#FFD700]/70 text-xs uppercase tracking-wider mb-2 text-center font-bold">
            Rolagens Rápidas
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {quickPresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => rollPreset(preset)}
                className="px-3 py-1.5 rounded-lg bg-[#8B4513]/20 border border-[#8B4513]/40
                  text-[#F5DEB3]/80 hover:bg-[#8B4513]/40 hover:border-[#FFD700]/50 hover:text-[#FFD700]
                  transition-all duration-200 flex items-center gap-2 font-medium text-sm"
              >
                <span>{preset.icon}</span>
                <span>{preset.label}</span>
                <span className="text-xs opacity-60 font-mono">
                  {preset.notation}{preset.modifier !== 0 ? (preset.modifier > 0 ? `+${preset.modifier}` : preset.modifier) : ''}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="glass-card rounded-xl p-3">
          {/* Quantity & Modifier */}
          <div className="flex flex-wrap gap-3 mb-4 justify-center items-center">
            <div className="flex items-center gap-2">
              <label className="text-[#FFD700]/70 font-bold text-xs uppercase tracking-wider">
                Qtd
              </label>
              <div className="flex items-center bg-[#0a0505] rounded-lg border border-[#8B4513]/40 overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2 py-1 text-[#FFD700] hover:bg-[#8B4513]/30 transition-colors font-bold"
                >
                  −
                </button>
                <span className="px-2 py-1 text-[#FFD700] font-bold text-base min-w-[32px] text-center border-x border-[#8B4513]/20">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="px-2 py-1 text-[#FFD700] hover:bg-[#8B4513]/30 transition-colors font-bold"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[#FFD700]/70 font-bold text-xs uppercase tracking-wider">
                Mod
              </label>
              <div className="flex items-center bg-[#0a0505] rounded-lg border border-[#8B4513]/40 overflow-hidden">
                <button
                  onClick={() => setModifier(modifier - 1)}
                  className="px-2 py-1 text-[#FFD700] hover:bg-[#8B4513]/30 transition-colors font-bold"
                >
                  −
                </button>
                <span className={`px-2 py-1 font-bold text-base min-w-[32px] text-center border-x border-[#8B4513]/20 ${
                  modifier > 0 ? 'text-emerald-400' : modifier < 0 ? 'text-red-400' : 'text-[#FFD700]'
                }`}>
                  {modifier > 0 ? `+${modifier}` : modifier}
                </span>
                <button
                  onClick={() => setModifier(modifier + 1)}
                  className="px-2 py-1 text-[#FFD700] hover:bg-[#8B4513]/30 transition-colors font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Dice Grid */}
          <div className="grid grid-cols-4 gap-2">
            {diceTypes.map((dice) => (
              <button
                key={dice.name}
                onClick={() => rollDice(dice.name)}
                className="dice-button group"
                title={`Pressione ${dice.key} para rolar`}
              >
                <div className="dice-button-inner">
                  <span className="text-2xl mb-1 group-hover:scale-125 transition-transform duration-300">
                    {dice.icon}
                  </span>
                  <span className="text-xs font-bold tracking-wider opacity-90">
                    {dice.name}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <p className="text-center text-[#8B4513]/40 text-xs mt-2">
            1-9: quantidade • +/−: modificador • R: repetir
          </p>
        </div>

        {/* Stats */}
        {results.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Rolagens", value: results.length, color: "text-[#FFD700]" },
              { label: "Maior", value: Math.max(...results.map((r) => r.total)), color: "text-emerald-400" },
              { label: "Menor", value: Math.min(...results.map((r) => r.total)), color: "text-red-400" },
              { label: "Média", value: (results.reduce((a, b) => a + b.total, 0) / results.length).toFixed(1), color: "text-amber-300" },
            ].map((stat) => (
              <div key={stat.label} className="stat-card py-2">
                <p className="text-[#D4A574]/50 text-xs uppercase tracking-wider mb-0.5">{stat.label}</p>
                <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History - Right Side */}
      <div className="lg:w-72 xl:w-80 flex-shrink-0">
        <div className="glass-card rounded-xl p-3 h-full flex flex-col lg:sticky lg:top-20">
          <div className="flex justify-between items-center mb-3">
            <h3 className="medieval-title text-lg text-[#FFD700]/90 flex items-center gap-2">
              <span>◇</span>Registro
            </h3>
            {results.length > 0 && (
              <button
                onClick={clearHistory}
                className="px-2 py-1 bg-[#8B4513]/20 text-[#D4A574] rounded font-bold text-xs
                  hover:bg-[#8B4513]/40 transition-all border border-[#8B4513]/30"
              >
                Limpar
              </button>
            )}
          </div>

          {results.length === 0 ? (
            <div className="text-center py-6 flex-1 flex flex-col items-center justify-center">
              <p className="text-3xl mb-2 opacity-30">🎲</p>
              <p className="text-[#F5DEB3]/40 italic font-serif text-sm">
                Nenhum registro
              </p>
            </div>
          ) : (
            <div className="space-y-1.5 overflow-y-auto scroll-parchment flex-1 max-h-[calc(100vh-180px)] lg:max-h-none">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`result-entry rounded-lg p-2.5 flex items-center justify-between
                    ${index === 0 ? "latest" : ""}`}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="dice-badge text-xs px-1.5 py-0.5 flex-shrink-0">{result.type}</span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[#F5DEB3]/90 font-mono text-xs truncate">
                        {result.rolls.join("+")}
                        {result.modifier !== 0 && (
                          <span className={result.modifier > 0 ? "text-emerald-400 ml-0.5" : "text-red-400 ml-0.5"}>
                            {result.modifier > 0 ? `+${result.modifier}` : result.modifier}
                          </span>
                        )}
                      </span>
                      <span className="text-[#D4A574]/40 text-xs">
                        {result.timestamp.toLocaleTimeString("pt-BR")}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xl font-bold flex-shrink-0 ml-2 ${getResultColor(result.total, result.type, result.rolls.length)}`}>
                    {result.total}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}