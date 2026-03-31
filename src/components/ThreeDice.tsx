import { useEffect, useRef, useState, useCallback } from 'react';
import DiceBox from '@3d-dice/dice-box';

interface DiceResult {
  type: string;
  rolls: number[];
  total: number;
  modifier: number;
  timestamp: Date;
}

interface ThreeDiceProps {
  diceType: string;
  quantity: number;
  onRollComplete: (rolls: number[]) => void;
  onClose: () => void;
  onRollAgain: () => void;
  lastResult: DiceResult | null;
}

const diceSideMap: Record<string, string> = {
  d2: 'd6',
  d4: 'd4',
  d6: 'd6',
  d8: 'd8',
  d10: 'd10',
  d12: 'd12',
  d20: 'd20',
  d100: 'd%',
};

export default function ThreeDice({ diceType, quantity, onRollComplete, onClose, onRollAgain, lastResult }: ThreeDiceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const diceBoxRef = useRef<DiceBox | null>(null);
  const [phase, setPhase] = useState<'rolling' | 'result'>('rolling');
  const [resultValues, setResultValues] = useState<number[]>([]);
  const onRollCompleteRef = useRef(onRollComplete);
  onRollCompleteRef.current = onRollComplete;
  const hasRolledRef = useRef(false);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'r' || e.key === 'R') {
        if (phase === 'result') {
          handleRollAgain();
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, onClose, handleRollAgain]);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.id = 'dice-canvas-container';
    hasRolledRef.current = false;

    const diceBox = new DiceBox('#dice-canvas-container', {
      assetPath: '/assets/dice-box/',
      gravity: 1,
      mass: 1,
      friction: 0.8,
      restitution: 0.2,
      angularDamping: 0.4,
      linearDamping: 0.4,
      spinForce: 4,
      throwForce: 5,
      startingHeight: 8,
      settleTimeout: 5000,
      enableShadows: true,
      theme: 'default',
      scale: 9,
      onRollComplete: (rollResult) => {
        if (hasRolledRef.current) return;
        hasRolledRef.current = true;

        const rolls = rollResult.flatMap((group: any) => {
          if (group.value !== undefined && !isNaN(group.value)) {
            return [group.value];
          }
          return group.rolls.map((die: any) => {
            const val = die.result ?? die.value ?? 0;
            if (diceType === 'd100') {
              return val * 10 || 100;
            }
            if (diceType === 'd2') {
              return val <= 3 ? 1 : 2;
            }
            return val;
          });
        }).filter((v: number) => typeof v === 'number' && !isNaN(v));

        setResultValues(rolls);
        setPhase('result');
        onRollCompleteRef.current(rolls);
      },
    });

    diceBoxRef.current = diceBox;

    diceBox.init().then(() => {
      const notation = `${quantity}${diceSideMap[diceType] || diceType}`;
      diceBox.roll(notation);
    });

    return () => {
      diceBox.clear();
      diceBoxRef.current = null;
    };
  }, []);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleRollAgain = useCallback(() => {
    setPhase('rolling');
    setResultValues([]);
    hasRolledRef.current = false;
    if (diceBoxRef.current) {
      const notation = `${quantity}${diceSideMap[diceType] || diceType}`;
      diceBoxRef.current.roll(notation);
    }
  }, [quantity, diceType]);

  const modifier = lastResult?.modifier ?? 0;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center p-4 pt-[12vh]">
      <div className="relative w-full max-w-[850px] h-[70vh] max-h-[700px] rounded-2xl overflow-hidden shadow-[0_25px_60px_-10px_rgba(0,0,0,0.9),inset_0_0_80px_rgba(120,53,15,0.2)] bg-[#110A07] border-2 border-[#8B4513]/40">

        <div ref={containerRef} className="absolute inset-0" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <style>{`
            #dice-canvas-container canvas {
              width: 100% !important;
              height: 100% !important;
              display: block !important;
              transform: scale(0.8);
            }
          `}</style>
        </div>

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-[#2C160B]/90 border-2 border-amber-700/50 text-amber-600 font-bold text-lg cursor-pointer hover:bg-amber-900 hover:text-amber-400 hover:scale-110 hover:border-amber-500 transition-all duration-200 shadow-lg"
          title="Fechar (Esc)"
        >
          ✕
        </button>

        {phase === 'rolling' && (
          <div className="absolute top-0 left-0 right-0 p-4 text-center pointer-events-none z-10 bg-gradient-to-b from-black/90 via-black/40 to-transparent">
            <p className="font-['MedievalSharp'] text-2xl text-amber-500 m-0 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
              🎲 Rolando...
            </p>
          </div>
        )}

        {phase === 'result' && (
          <>
            <div className="absolute top-0 left-0 right-0 p-4 text-center pointer-events-none z-10 bg-gradient-to-b from-black/90 via-black/40 to-transparent">
              <p className="font-['MedievalSharp'] text-xl text-amber-400 m-0 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
                ✨ Resultado
              </p>
            </div>

            <div className="absolute bottom-24 left-0 right-0 z-20 flex flex-col items-center">
              <div className="bg-[#1a0f0a]/95 border-2 border-[#D4A574]/60 rounded-2xl py-5 px-10 backdrop-blur-md shadow-[0_0_50px_rgba(139,69,19,0.5),0_10px_30px_rgba(0,0,0,0.8)]">
                <p className="font-['MedievalSharp'] text-[4rem] text-[#FFD700] m-0 leading-none drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]">
                  {resultValues.reduce((a, b) => a + b, 0) + modifier}
                </p>
                {(resultValues.length > 1 || modifier !== 0) && (
                  <p className="font-['Cormorant_Garamond'] text-lg text-[#D4A574]/90 m-0 mt-2 font-bold tracking-wider">
                    {resultValues.join(' + ')}{modifier !== 0 && (modifier > 0 ? ` + ${modifier}` : ` − ${Math.abs(modifier)}`)}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleRollAgain}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-6 py-2 rounded-lg
                bg-[#8B4513]/80 border-2 border-amber-700/50 text-amber-200 font-bold
                hover:bg-amber-700 hover:text-amber-100 hover:scale-105 transition-all duration-200
                shadow-lg flex items-center gap-2"
            >
              <span>🎲</span>
              <span>RolarNovamente</span>
              <span className="text-xs opacity-60">(R)</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
