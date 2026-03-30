import { useEffect, useRef } from "react";

interface ThreeDiceProps {
  sides: number;
  result: number;
  quantity: number;
  onComplete: () => void;
}

export function ThreeDice({ sides, result, quantity = 1, onComplete }: ThreeDiceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = "";

    const numbers: string[] = [];
    if (sides === 2) {
      numbers.push("0", "1");
    } else if (sides === 4) {
      numbers.push("1", "2", "3", "4");
    } else if (sides === 6) {
      numbers.push("1", "2", "3", "4", "5", "6");
    } else if (sides === 8) {
      numbers.push("1", "2", "3", "4", "5", "6", "7", "8");
    } else if (sides === 10) {
      for (let i = 0; i <= 9; i++) numbers.push(i.toString());
    } else if (sides === 12) {
      for (let i = 1; i <= 12; i++) numbers.push(i.toString());
    } else if (sides === 20) {
      for (let i = 1; i <= 20; i++) numbers.push(i.toString());
    } else if (sides === 100) {
      numbers.push("00", "10", "20", "30", "40", "50", "60", "70", "80", "90");
    } else {
      numbers.push("1", "2", "3", "4", "5", "6");
    }

    const getClipPath = (sides: number, isBorder: boolean) => {
      const offset = isBorder ? 4 : 0;
      const size = 120 + offset * 2;
      
      if (sides === 4) {
        return "polygon(50% 0%, 0% 100%, 100% 100%)";
      } else if (sides === 8) {
        return "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)";
      } else if (sides === 12) {
        return "polygon(75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%, 25% 6.7%)";
      } else if (sides === 20) {
        const sides20 = 10;
        const angle = (2 * Math.PI) / sides20;
        const points: string[] = [];
        for (let i = 0; i < sides20; i++) {
          const x = 50 + 50 * Math.cos(i * angle - Math.PI / 2);
          const y = 50 + 50 * Math.sin(i * angle - Math.PI / 2);
          points.push(`${x}% ${y}%`);
        }
        return `polygon(${points.join(", ")})`;
      }
      return "";
    };

    const diceContainer = document.createElement("div");
    diceContainer.style.cssText = `
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 20px;
      padding: 20px;
    `;

    const createDiceElement = (resultValue: number) => {
      const diceWrapper = document.createElement("div");
      diceWrapper.style.cssText = `
        width: 120px;
        height: 120px;
        position: relative;
        animation: rollDice 1.5s ease-out;
        animation-delay: ${Math.random() * 0.2}s;
      `;

      if (sides === 4 || sides === 8 || sides === 12 || sides === 20) {
        const border = document.createElement("div");
        border.style.cssText = `
          position: absolute;
          inset: -4px;
          background: #FFD700;
          clip-path: ${getClipPath(sides, true)};
        `;
        
        const inner = document.createElement("div");
        inner.style.cssText = `
          width: 100%;
          height: 100%;
          background: linear-gradient(145deg, #8B0000, #5a0000);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          font-weight: bold;
          color: #FFD700;
          font-family: serif;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(255, 215, 0, 0.3);
          clip-path: ${getClipPath(sides, false)};
        `;
        
        diceWrapper.appendChild(border);
        diceWrapper.appendChild(inner);
        return { wrapper: diceWrapper, inner };
      } else {
        const dice = document.createElement("div");
        dice.style.cssText = `
          width: 120px;
          height: 120px;
          background: linear-gradient(145deg, #8B0000, #5a0000);
          border: 4px solid #FFD700;
          border-radius: ${sides === 2 ? '50%' : '16px'};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          font-weight: bold;
          color: #FFD700;
          font-family: serif;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 20px rgba(255, 215, 0, 0.3);
          animation: rollDice 1.5s ease-out;
        `;
        return { wrapper: dice, inner: dice };
      }
    };

    const resultsArray = Array.isArray(result) ? result : [result];
    const diceCount = Math.min(quantity, resultsArray.length);
    const diceElements: { wrapper: HTMLElement; inner: HTMLElement }[] = [];

    for (let i = 0; i < diceCount; i++) {
      const diceData = createDiceElement(resultsArray[i]);
      diceContainer.appendChild(diceData.wrapper);
      diceElements.push(diceData);
    }

    container.appendChild(diceContainer);

    const intervals: number[] = [];

    diceElements.forEach(({ inner }) => {
      let idx = 0;
      const intervalId = window.setInterval(() => {
        inner.textContent = numbers[idx];
        idx = (idx + 1) % numbers.length;
      }, 80);
      intervals.push(intervalId);
    });

    setTimeout(() => {
      intervals.forEach(id => clearInterval(id));
      
      diceElements.forEach(({ inner }, i) => {
        const finalValue = resultsArray[i];
        inner.textContent = sides === 100 
          ? (finalValue < 10 ? `0${finalValue}` : finalValue.toString()) 
          : finalValue.toString();
      });
      setTimeout(onComplete, 200);
    }, 1200);

    const style = document.createElement("style");
    style.textContent = `
      @keyframes rollDice {
        0% { transform: rotate(0deg) scale(0.5); opacity: 0; }
        20% { transform: rotate(720deg) scale(1.2); }
        40% { transform: rotate(1080deg) scale(0.9); }
        60% { transform: rotate(1440deg) scale(1.1); }
        80% { transform: rotate(1800deg) scale(1); }
        100% { transform: rotate(2160deg) scale(1); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      intervals.forEach(id => clearInterval(id));
      document.head.removeChild(style);
    };
  }, [sides, result, quantity, onComplete]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: 300, 
        minHeight: 300, 
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    />
  );
}
