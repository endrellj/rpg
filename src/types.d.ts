declare module '@3d-dice/dice-box' {
  export interface DiceBoxOptions {
    assetPath?: string;
    gravity?: number;
    mass?: number;
    friction?: number;
    restitution?: number;
    angularDamping?: number;
    linearDamping?: number;
    spinForce?: number;
    throwForce?: number;
    startingHeight?: number;
    settleTimeout?: number;
    enableShadows?: boolean;
    theme?: string;
    scale?: number;
    onRollComplete?: (result: any[]) => void;
  }

  export default class DiceBox {
    constructor(container: string | HTMLElement, options?: DiceBoxOptions);
    init(): Promise<void>;
    roll(notation: string | string[]): void;
    clear(): void;
    hide(): void;
    show(): void;
  }
}
