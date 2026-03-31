import { useEffect, useRef, useState, useCallback } from 'react';
import DiceBox from '@3d-dice/dice-box';

interface ThreeDiceProps {
  diceType: string;
  quantity: number;
  onRollComplete: (rolls: number[]) => void;
  onClose: () => void;
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

export default function ThreeDice({ diceType, quantity, onRollComplete, onClose }: ThreeDiceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const diceBoxRef = useRef<DiceBox | null>(null);
  const [phase, setPhase] = useState<'rolling' | 'result'>('rolling');
  const [resultValues, setResultValues] = useState<number[]>([]);
  const onRollCompleteRef = useRef(onRollComplete);
  onRollCompleteRef.current = onRollComplete;
  const resultTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasRolledRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.id = 'dice-canvas-container';

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

        resultTimeoutRef.current = setTimeout(() => {
          onRollCompleteRef.current(rolls);
        }, 1800);
      },
    });

    diceBoxRef.current = diceBox;

    diceBox.init().then(() => {
      const notation = `${quantity}${diceSideMap[diceType] || diceType}`;
      diceBox.roll(notation);
    });

    return () => {
      if (resultTimeoutRef.current) {
        clearTimeout(resultTimeoutRef.current);
        resultTimeoutRef.current = null;
      }
      diceBox.clear();
      diceBoxRef.current = null;
    };
  }, [diceType, quantity]);

  const handleClose = useCallback(() => {
    if (resultTimeoutRef.current) {
      clearTimeout(resultTimeoutRef.current);
      resultTimeoutRef.current = null;
    }
    onClose();
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-stone-950/80 backdrop-blur-md p-4 transition-all duration-500">
      <div className="relative w-full max-w-[850px] h-[80vh] max-h-[800px] rounded-3xl overflow-hidden shadow-[0_25px_60px_-10px_rgba(0,0,0,0.9),inset_0_0_80px_rgba(120,53,15,0.2)] bg-[#110A07] border-2 border-[#8B4513]/40">

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

        <div className="absolute top-0 left-0 right-0 p-6 text-center pointer-events-none z-10 bg-gradient-to-b from-black/90 via-black/40 to-transparent">
          <p className="font-['MedievalSharp'] text-3xl text-amber-500 m-0 drop-shadow-[0_2px_4px_rgba(0,0,0,1)] tracking-wide">
            {phase === 'rolling' ? '🎲 Rolando...' : `✨ Resultado: ${resultValues.join(' + ')} = ${resultValues.reduce((a, b) => a + b, 0)}`}
          </p>
        </div>

        <button
          onClick={handleClose}
          className="absolute top-5 right-5 z-20 w-12 h-12 rounded-full flex items-center justify-center bg-[#2C160B]/90 border-2 border-amber-700/50 text-amber-600 font-bold text-xl cursor-pointer hover:bg-amber-900 hover:text-amber-400 hover:scale-110 hover:border-amber-500 transition-all duration-300 shadow-lg"
        >
          ✕
        </button>

        {phase === 'result' && (
          <div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 text-center"
            style={{ animation: 'resultPopIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
          >
            <div className="bg-[#1a0f0a]/95 border-2 border-[#D4A574]/60 rounded-2xl py-6 px-12 backdrop-blur-md shadow-[0_0_50px_rgba(139,69,19,0.5),0_10px_30px_rgba(0,0,0,0.8)]">
              <p className="font-['MedievalSharp'] text-[5rem] text-[#FFD700] m-0 leading-none drop-shadow-[0_0_30px_rgba(255,215,0,0.5)]">
                {resultValues.reduce((a, b) => a + b, 0)}
              </p>
              {resultValues.length > 1 && (
                <p className="font-['Cormorant_Garamond'] text-xl text-[#D4A574]/90 m-0 mt-3 font-bold tracking-wider">
                  {resultValues.join(' + ')}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
