import { useState, useEffect, useRef } from "react";
import { ThreeDice } from "./ThreeDice";

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
  const [isRolling, setIsRolling] = useState(false);
  const [rollingDice, setRollingDice] = useState<string | null>(null);
  const [currentRoll, setCurrentRoll] = useState<{ sides: number; result: number | number[] } | null>(null);
  const [show3D, setShow3D] = useState(false);
  const diceRef = useRef<HTMLDivElement>(null);

  const diceTypes = [
    { name: "d2", sides: 2, bg: "from-red-700 to-red-900", border: "border-red-500" },
    { name: "d4", sides: 4, bg: "from-red-700 to-red-900", border: "border-red-500" },
    { name: "d6", sides: 6, bg: "from-red-900 to-red-700", border: "border-red-800" },
    { name: "d8", sides: 8, bg: "from-red-700 to-red-900", border: "border-red-500" },
    { name: "d10", sides: 10, bg: "from-red-900 to-red-700", border: "border-red-800" },
    { name: "d12", sides: 12, bg: "from-red-700 to-red-900", border: "border-red-500" },
    { name: "d20", sides: 20, bg: "from-red-900 to-red-700", border: "border-red-800" },
    { name: "d100", sides: 100, bg: "from-red-700 to-red-900", border: "border-red-500" },
  ];

  const rollDice = (sides: number, name: string) => {
    setIsRolling(true);
    setRollingDice(name);

    const rolls: number[] = [];
    for (let i = 0; i < quantity; i++) {
      rolls.push(Math.floor(Math.random() * sides) + 1);
    }
    const finalResult = rolls.reduce((a, b) => a + b, 0) + modifier;
    
    setShow3D(true);
    setCurrentRoll({ sides, result: rolls });

    setTimeout(() => {
      const newResult: DiceResult = {
        type: name,
        rolls,
        total: finalResult,
        modifier,
        timestamp: new Date(),
      };

      setResults((prev) => [newResult, ...prev].slice(0, 20));
      setIsRolling(false);
      setRollingDice(null);
      setShow3D(false);
      setCurrentRoll(null);
    }, 3000);
  };

  const getDiceRotation = (sides: number, result: number): string => {
    const rotations: { [key: number]: string } = {
      4: `rotateX(${(result - 1) * -30 + 45}deg) rotateY(${(result - 1) * 45}deg)`,
      6: `rotateX(${result <= 3 ? 0 : 180}deg) rotateZ(${result % 2 === 1 ? 0 : 180}deg)`,
      8: `rotateX(${(result - 1) * -30 + 35}deg) rotateY(${(result - 1) * 45}deg)`,
      10: `rotateX(${(result - 1) * -18 + 18}deg) rotateY(${(result - 1) * 36}deg)`,
      12: `rotateX(${(result - 1) * -15 + 15}deg) rotateY(${(result - 1) * 30}deg)`,
      20: `rotateX(${(result - 1) * -9 + 9}deg) rotateY(${(result - 1) * 18}deg)`,
      100: `rotateX(${(result - 1) * -18 + 18}deg) rotateY(${(result - 1) * 36}deg)`,
    };
    return rotations[sides] || `rotateX(0deg) rotateY(0deg)`;
  };

  const clearHistory = () => setResults([]);

  const rollAll = () => {
    diceTypes.forEach((dice, index) => {
      setTimeout(() => rollDice(dice.sides, dice.name), index * 150);
    });
  };

  return (
    <div className="space-y-8">
      {/* Título da seção */}
      <div className="text-center">
        <h2 className="medieval-title text-4xl md:text-5xl text-white glow-red mb-2">
          ◆ Torre de Dados
        </h2>
        <p className="text-[#F5DEB3]/60 italic font-serif">
          O destino está nas mãos dos dados...
        </p>
      </div>

      {/* Área de rolar dados */}
      <div className="nordestino-card rounded-2xl p-8">
        {/* Controles */}
        <div className="flex flex-wrap gap-6 mb-8 justify-center items-center">
          <div className="flex items-center gap-3">
            <label className="text-[#8B0000] font-bold font-serif">Quantidade:</label>
            <input
              type="number"
              min="1"
              max="20"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
              className="w-16 input-medieval rounded-lg px-3 py-2 text-center font-bold"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-[#8B0000] font-bold font-serif">Modificador:</label>
            <input
              type="number"
              value={modifier}
              onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
              className="w-16 input-medieval rounded-lg px-3 py-2 text-center font-bold"
            />
          </div>
          <button
            onClick={rollAll}
            disabled={isRolling}
            className="gold-button px-6 py-2 rounded-lg font-bold text-lg"
          >
            ◇ Rolar Todos
          </button>
        </div>

        {/* Botões de dados */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {diceTypes.map((dice) => (
            <button
              key={dice.name}
              onClick={() => rollDice(dice.sides, dice.name)}
              disabled={isRolling}
              className={`dice-3d bg-gradient-to-br ${dice.bg} ${dice.border} border-2 
                p-6 rounded-xl font-bold text-white text-xl shadow-xl
                disabled:opacity-50 disabled:cursor-not-allowed
                ${rollingDice === dice.name ? "animate-roll" : ""}`}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-3xl drop-shadow-lg">◆</span>
                <span>{dice.name}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Modal de resultado com Three.js */}
        {show3D && currentRoll && (
          <div 
            className="fixed inset-0 z-50 flex flex-col items-center justify-center"
            onClick={() => setShow3D(false)}
          >
            <div className="text-center" onClick={(e) => e.stopPropagation()}>
              <ThreeDice 
                sides={currentRoll.sides} 
                result={currentRoll.result}
                quantity={quantity}
                onComplete={() => {}}
              />
              <p className="medieval-title text-8xl text-[#FFD700] animate-bounce" style={{ textShadow: '0 0 30px rgba(0,0,0,0.8), 0 0 60px rgba(255,215,0,0.6)' }}>
                {Array.isArray(currentRoll.result) 
                  ? currentRoll.result.reduce((a, b) => a + b, 0) + modifier 
                  : currentRoll.result + modifier}
              </p>
              <p className="text-[#F5DEB3]/60 mt-6 text-lg">Clique para fechar</p>
            </div>
          </div>
        )}
      </div>

      {/* Histórico de resultados */}
      <div className="nordestino-card rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="medieval-title text-2xl text-[#8B0000]">◇ Registro do Destino</h3>
          {results.length > 0 && (
            <button
              onClick={clearHistory}
              className="px-4 py-2 bg-[#8B0000]/20 text-[#8B0000] rounded-lg font-bold 
                hover:bg-[#8B0000]/30 transition-colors"
            >
              Limpar
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-6xl mb-4 text-[#8B0000]">◆</p>
            <p className="text-[#8B0000]/60 italic font-serif text-lg">
              Clique nos dados para revelar seu destino
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto scroll-parchment pr-2">
            {results.map((result, index) => (
              <div
                key={index}
                className={`result-card rounded-lg p-4 flex items-center justify-between
                  ${index === 0 ? "latest" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-[#FFD700] bg-[#FFD700]/10 px-4 py-2 rounded-lg">
                    {result.type}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[#F5DEB3] font-mono text-lg">
                      {result.rolls.join(" + ")}
                      {result.modifier !== 0 && (
                        <span className={result.modifier > 0 ? "text-red-400 ml-2" : "text-red-900 ml-2"}>
                          {result.modifier > 0 ? `+ ${result.modifier}` : `- ${Math.abs(result.modifier)}`}
                        </span>
                      )}
                    </span>
                    <span className="text-[#D4A574]/50 text-xs">
                      {result.timestamp.toLocaleTimeString("pt-BR")}
                    </span>
                  </div>
                </div>
                <span className={`text-4xl font-bold ${result.total >= 15 ? "text-red-400" : result.total <= 5 ? "text-red-900" : "text-white"}`}>
                  {result.total}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-box rounded-xl p-4 text-center">
          <p className="text-[#D4A574]/60 text-sm">Total</p>
          <p className="text-3xl font-bold text-[#FFD700]">{results.length}</p>
        </div>
        <div className="stat-box rounded-xl p-4 text-center">
          <p className="text-[#D4A574]/60 text-sm">Maior</p>
          <p className="text-3xl font-bold text-red-400">
            {results.length > 0 ? Math.max(...results.map(r => r.total)) : 0}
          </p>
        </div>
        <div className="stat-box rounded-xl p-4 text-center">
          <p className="text-[#D4A574]/60 text-sm">Menor</p>
          <p className="text-3xl font-bold text-red-900">
            {results.length > 0 ? Math.min(...results.map(r => r.total)) : 0}
          </p>
        </div>
        <div className="stat-box rounded-xl p-4 text-center">
          <p className="text-[#D4A574]/60 text-sm">Média</p>
          <p className="text-3xl font-bold text-[#D4A574]">
            {results.length > 0 ? (results.reduce((a, b) => a + b.total, 0) / results.length).toFixed(1) : 0}
          </p>
        </div>
      </div>
    </div>
  );
}


