import { useState, useEffect } from "react";
import { DaggerIcon, SwordIcon, PlusIcon, XIcon, EditIcon, ShieldIcon, SparklesIcon } from "./Icons";

interface Character {
  id: string;
  name: string;
  race: string;
  characterClass: string;
  height: string;
  age: string;
  description: string;
  images: string[];
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  stats: {
    strength: number;
    intellect: number;
    endurance: number;
    agility: number;
    sanity: number;
    manaStat: number;
  };
  createdAt: Date;
}

export function CharacterGenerator() {
  const [savedCharacters, setSavedCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [rollResults, setRollResults] = useState<{ [key: string]: { rolls: number[]; total: number; modifier: number } | null }>({});
  const [modifiers, setModifiers] = useState<{ [key: string]: number }>({
    strength: 0,
    intellect: 0,
    endurance: 0,
    agility: 0,
    sanity: 0,
    manaStat: 0,
  });

  const [editForm, setEditForm] = useState({
    name: "",
    race: "Humano",
    characterClass: "Cangaceiro",
    height: "",
    age: "",
    description: "",
    images: [] as string[],
    hp: 10,
    maxHp: 10,
    mana: 10,
    maxMana: 10,
    stats: {
      strength: 10,
      intellect: 10,
      endurance: 10,
      agility: 10,
      sanity: 10,
      manaStat: 10,
    },
  });

  useEffect(() => {
    const saved = localStorage.getItem("rpg-characters");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedCharacters(parsed.map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
        })));
      } catch (e) {
        console.error("Erro ao carregar personagens:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("rpg-characters", JSON.stringify(savedCharacters));
  }, [savedCharacters]);

  const classes = [
    "Cangaceiro",
    "Retirante",
    "Soldado da Volante",
    "Bendezeiro",
    "Ex-Escravo",
    "Padre",
    "Descrente",
  ];

  const generateRandomCharacter = () => {
    const maleNames = ["Antonio", "Francisco", "Jose", "Joao", "Pedro", "Paulo", "Carlos", "Luis", "Marcos", "Gabriel", "Miguel", "Rafael", "Severino", "Jeronimo"];
    const femaleNames = ["Maria", "Ana", "Francisca", "Antonia", "Adriana", "Juliana", "Marcia", "Fernanda", "Patricia", "Carla", "Rosalia", "Luzia", "Beatriz", "Isabel"];

    const heights = ["1,55m", "1,60m", "1,65m", "1,70m", "1,75m", "1,80m", "1,85m"];
    const ages = ["18", "20", "22", "25", "28", "30", "32", "35", "40", "45", "50"];

    const isMale = Math.random() > 0.5;
    const name = (isMale ? maleNames : femaleNames)[Math.floor(Math.random() * (isMale ? maleNames.length : femaleNames.length))];
    const characterClass = classes[Math.floor(Math.random() * classes.length)];

    const rollStat = () => Math.floor(Math.random() * 15) + 8;

    const rollHp = () => Math.floor(Math.random() * 15) + 8;
    const rollMana = () => Math.floor(Math.random() * 15) + 8;
    const maxHp = rollHp() * 2;
    const maxMana = rollMana();

    const newCharacter: Character = {
      id: Date.now().toString(),
      name,
      race: "Humano",
      characterClass,
      height: heights[Math.floor(Math.random() * heights.length)],
      age: ages[Math.floor(Math.random() * ages.length)],
      description: "",
      images: [],
      hp: maxHp,
      maxHp,
      mana: maxMana,
      maxMana,
      stats: {
        strength: rollStat(),
        intellect: rollStat(),
        endurance: rollStat(),
        agility: rollStat(),
        sanity: rollStat(),
        manaStat: rollStat(),
      },
      createdAt: new Date(),
    };

    setEditForm({
      name: newCharacter.name,
      race: newCharacter.race,
      characterClass: newCharacter.characterClass,
      height: newCharacter.height,
      age: newCharacter.age,
      description: newCharacter.description,
      images: newCharacter.images,
      hp: newCharacter.hp,
      maxHp: newCharacter.maxHp,
      mana: newCharacter.mana,
      maxMana: newCharacter.maxMana,
      stats: newCharacter.stats,
    });
    setSelectedCharacter(null);
    setIsEditing(true);
  };

  const createNewCharacter = () => {
    setEditForm({
      name: "",
      race: "Humano",
      characterClass: "Cangaceiro",
      height: "",
      age: "",
      description: "",
      images: [] as string[],
      hp: 10,
      maxHp: 10,
      mana: 10,
      maxMana: 10,
      stats: {
        strength: 10,
        intellect: 10,
        endurance: 10,
        agility: 10,
        sanity: 10,
        manaStat: 10,
      },
    });
    setSelectedCharacter(null);
    setIsEditing(true);
  };

  const saveCharacter = () => {
    const newCharacter: Character = {
      id: selectedCharacter?.id || Date.now().toString(),
      name: editForm.name || "Sem Nome",
      race: editForm.race,
      characterClass: editForm.characterClass,
      height: editForm.height,
      age: editForm.age,
      description: editForm.description,
      images: editForm.images,
      hp: editForm.hp,
      maxHp: editForm.maxHp,
      mana: editForm.mana,
      maxMana: editForm.maxMana,
      stats: editForm.stats,
      createdAt: selectedCharacter?.createdAt || new Date(),
    };

    if (selectedCharacter) {
      setSavedCharacters(savedCharacters.map(c => c.id === selectedCharacter.id ? newCharacter : c));
    } else {
      setSavedCharacters([newCharacter, ...savedCharacters]);
    }

    setSelectedCharacter(newCharacter);
    setIsEditing(false);
  };

  const deleteCharacter = (id: string) => {
    setSavedCharacters(savedCharacters.filter(c => c.id !== id));
    if (selectedCharacter?.id === id) {
      setSelectedCharacter(null);
      setIsEditing(false);
    }
  };

  const editCharacter = (character: Character) => {
    setEditForm({
      name: character.name,
      race: character.race,
      characterClass: character.characterClass,
      height: character.height,
      age: character.age,
      description: character.description,
      images: character.images || [],
      hp: character.hp,
      maxHp: character.maxHp,
      mana: character.mana,
      maxMana: character.maxMana,
      stats: { ...character.stats },
    });
    setSelectedCharacter(character);
    setIsEditing(true);
  };

  const adjustHp = (delta: number) => {
    setEditForm({
      ...editForm,
      hp: Math.max(0, Math.min(editForm.maxHp, editForm.hp + delta)),
    });
  };

  const adjustMaxHp = (delta: number) => {
    const newMax = Math.max(1, editForm.maxHp + delta);
    setEditForm({
      ...editForm,
      maxHp: newMax,
      hp: Math.min(editForm.hp, newMax),
    });
  };

  const adjustMana = (delta: number) => {
    setEditForm({
      ...editForm,
      mana: Math.max(0, Math.min(editForm.maxMana, editForm.mana + delta)),
    });
  };

  const adjustMaxMana = (delta: number) => {
    const newMax = Math.max(1, editForm.maxMana + delta);
    setEditForm({
      ...editForm,
      maxMana: newMax,
      mana: Math.min(editForm.mana, newMax),
    });
  };

  const StatBar = ({ label, color, statKey }: { label: string; color: string; statKey: keyof typeof editForm.stats }) => {
    const points = editForm.stats[statKey];
    const result = rollResults[statKey];
    const modifier = modifiers[statKey] || 0;

    const rollStat = () => {
      const rolls: number[] = [];
      for (let i = 0; i < points; i++) {
        rolls.push(Math.floor(Math.random() * 20) + 1);
      }
      const highest = Math.max(...rolls);
      const finalTotal = highest + modifier;
      setRollResults({ ...rollResults, [statKey]: { rolls, total: finalTotal, modifier } });
    };

    const adjustPoints = (delta: number) => {
      const newVal = Math.max(1, Math.min(10, points + delta));
      setEditForm({
        ...editForm,
        stats: { ...editForm.stats, [statKey]: newVal },
      });
    };

    return (
      <div className="flex items-center gap-3 p-2 rounded-lg bg-[#0d0805]/50 border border-[#8B4513]/20 hover:border-[#8B4513]/40 transition-all">
        <span className="w-20 text-xs font-bold text-[#D4A574] truncate">{label}</span>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => adjustPoints(-1)}
            className="w-6 h-6 rounded bg-[#1a0f08] border border-[#8B4513]/40 text-[#FFD700] text-xs hover:bg-[#8B4513]/40 hover:border-[#FFD700]/50 transition-all flex items-center justify-center"
          >
            −
          </button>
          <span className="w-8 text-center text-white text-sm font-bold">{points}</span>
          <button
            onClick={() => adjustPoints(1)}
            className="w-6 h-6 rounded bg-[#1a0f08] border border-[#8B4513]/40 text-[#FFD700] text-xs hover:bg-[#8B4513]/40 hover:border-[#FFD700]/50 transition-all flex items-center justify-center"
          >
            +
          </button>
        </div>

        <button
          onClick={rollStat}
          className="w-7 h-7 rounded bg-gradient-to-br from-[#8B4513] to-[#5C3317] text-white text-xs font-bold hover:from-[#9B5523] hover:to-[#6C4317] transition-all flex items-center justify-center shadow-lg shadow-[#8B4513]/20"
          title="Rolar dado"
        >
          <SparklesIcon size={12} />
        </button>

        <div className="flex items-center gap-1">
          <span className="text-[#8B4513]/50 text-xs">±</span>
          <input
            type="number"
            value={modifier}
            onChange={(e) => {
              setModifiers({ ...modifiers, [statKey]: parseInt(e.target.value) || 0 });
            }}
            className="w-10 bg-[#1a0f08] border border-[#8B4513]/40 rounded px-1 py-0.5 text-center text-white text-xs focus:border-[#FFD700]/50 focus:outline-none transition-colors"
            placeholder="0"
          />
        </div>

        {result && (
          <div className="flex-1 min-w-0 text-right">
            <span className="text-[#FFD700] text-sm font-bold">
              {result.total}
            </span>
            <span className="text-[#8B4513]/60 text-xs ml-1">
              ({result.rolls.join(",")}{modifier !== 0 && (modifier > 0 ? `+${modifier}` : modifier)})
            </span>
          </div>
        )}
      </div>
    );
  };

  const ResourceBar = ({ 
    label, 
    current, 
    max, 
    color, 
    gradient, 
    onAdjustCurrent, 
    onAdjustMax,
    icon
  }: { 
    label: string; 
    current: number; 
    max: number; 
    color: string; 
    gradient: string;
    onAdjustCurrent: (delta: number) => void;
    onAdjustMax: (delta: number) => void;
    icon: React.ReactNode;
  }) => {
    const percentage = Math.min(100, Math.max(0, (current / max) * 100));
    
    return (
      <div className="p-3 rounded-xl bg-[#0d0805]/60 border border-[#8B4513]/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`${color}`}>{icon}</span>
            <span className={`text-xs font-bold uppercase tracking-wider ${color}`}>{label}</span>
          </div>
          <span className="text-xs text-[#D4A574]/70 font-mono">{current}/{max}</span>
        </div>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-3 bg-[#0a0505] rounded-full overflow-hidden border border-[#8B4513]/30">
            <div
              className={`h-full ${gradient} transition-all duration-500 ease-out`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between bg-[#0a0505] rounded-lg px-2 py-1.5 border border-[#8B4513]/20">
            <span className="text-xs text-[#8B4513]/70">Atual</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onAdjustCurrent(-1)}
                className="w-5 h-5 rounded bg-[#1a0f08] text-[#FFD700] text-xs hover:bg-[#8B4513]/40 transition-all flex items-center justify-center"
              >
                −
              </button>
              <span className="w-8 text-center text-white text-sm font-bold">{current}</span>
              <button
                onClick={() => onAdjustCurrent(1)}
                className="w-5 h-5 rounded bg-[#1a0f08] text-[#FFD700] text-xs hover:bg-[#8B4513]/40 transition-all flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between bg-[#0a0505] rounded-lg px-2 py-1.5 border border-[#8B4513]/20">
            <span className="text-xs text-[#8B4513]/70">Máx</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => onAdjustMax(-1)}
                className="w-5 h-5 rounded bg-[#1a0f08] text-[#FFD700] text-xs hover:bg-[#8B4513]/40 transition-all flex items-center justify-center"
              >
                −
              </button>
              <span className="w-8 text-center text-white text-sm font-bold">{max}</span>
              <button
                onClick={() => onAdjustMax(1)}
                className="w-5 h-5 rounded bg-[#1a0f08] text-[#FFD700] text-xs hover:bg-[#8B4513]/40 transition-all flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Main Content - Left Side */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Header */}
        <div className="text-center lg:text-left mb-2">
          <h2 className="medieval-title text-3xl text-white glow-red mb-1">
            ◆Galeria de Heróis
          </h2>
          <p className="text-[#F5DEB3]/60 italic font-serif text-sm">
            Crie lendas que ecoarão pelo sertão
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
          <button
            onClick={createNewCharacter}
            className="gold-button px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg shadow-[#8B4513]/20"
          >
            <PlusIcon size={18} />
            <span>Novo Personagem</span>
          </button>
          <button
            onClick={generateRandomCharacter}
            className="px-5 py-2.5 bg-gradient-to-r from-[#5C3317] to-[#8B4513] text-[#FFD700] rounded-lg font-bold border border-[#8B4513]/50 hover:border-[#FFD700]/40 hover:from-[#6C4317] hover:to-[#9B5523] transition-all text-sm flex items-center gap-2 shadow-lg"
          >
            <SparklesIcon size={16} />
            <span>Gerar Aleatório</span>
          </button>
        </div>

        {/* Edit Form */}
        {isEditing ? (
          <div className="nordestino-card rounded-xl overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-[#1a0f08] to-[#0d0805] px-6 py-4 border-b border-[#8B4513]/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B4513] to-[#5C3317] flex items-center justify-center shadow-lg shadow-[#8B4513]/30">
                  <EditIcon size={20} className="text-[#FFD700]" />
                </div>
                <div>
                  <h3 className="medieval-title text-xl text-[#FFD700]">
                    {selectedCharacter ? "Editar Herói" : "Novo Herói"}
                  </h3>
                  <p className="text-[#8B4513] text-xs">
                    {selectedCharacter ? "Modifique os atributos do personagem" : "Crie uma nova lenda para o sertão"}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[#D4A574] font-bold text-xs uppercase tracking-wider">Nome do Herói</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full input-medieval rounded-lg px-4 py-2.5 text-sm"
                    placeholder="Digite o nome..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[#D4A574] font-bold text-xs uppercase tracking-wider">Classe</label>
                  <select
                    value={editForm.characterClass}
                    onChange={(e) => setEditForm({ ...editForm, characterClass: e.target.value })}
                    className="w-full input-medieval rounded-lg px-4 py-2.5 text-sm text-[#FFD700] font-bold"
                  >
                    {classes.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[#D4A574] font-bold text-xs uppercase tracking-wider">Altura</label>
                  <input
                    type="text"
                    value={editForm.height}
                    onChange={(e) => setEditForm({ ...editForm, height: e.target.value })}
                    className="w-full input-medieval rounded-lg px-4 py-2.5 text-sm"
                    placeholder="1,70m"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[#D4A574] font-bold text-xs uppercase tracking-wider">Idade</label>
                  <input
                    type="text"
                    value={editForm.age}
                    onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                    className="w-full input-medieval rounded-lg px-4 py-2.5 text-sm"
                    placeholder="25"
                  />
                </div>
              </div>

              {/* Decorative Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#8B4513]/40 to-transparent"></div>
                <span className="text-[#8B4513]/60 text-xs uppercase tracking-widest">Vitalidade</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#8B4513]/40 to-transparent"></div>
              </div>

              {/* HP & DT */}
              <div className="grid sm:grid-cols-2 gap-4">
                <ResourceBar
                  label="HP"
                  current={editForm.hp}
                  max={editForm.maxHp}
                  color="text-amber-500"
                  gradient="bg-gradient-to-r from-amber-700 to-amber-400"
                  onAdjustCurrent={adjustHp}
                  onAdjustMax={adjustMaxHp}
                  icon={<ShieldIcon size={16} />}
                />
                <ResourceBar
                  label="DT"
                  current={editForm.mana}
                  max={editForm.maxMana}
                  color="text-purple-400"
                  gradient="bg-gradient-to-r from-purple-700 to-purple-400"
                  onAdjustCurrent={adjustMana}
                  onAdjustMax={adjustMaxMana}
                  icon={<SparklesIcon size={16} />}
                />
              </div>

              {/* Decorative Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#8B4513]/40 to-transparent"></div>
                <span className="text-[#8B4513]/60 text-xs uppercase tracking-widest">Atributos</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#8B4513]/40 to-transparent"></div>
              </div>

              {/* Stats */}
              <div className="grid sm:grid-cols-2 gap-3">
                <StatBar label="Força" color="bg-amber-800" statKey="strength" />
                <StatBar label="Intelecto" color="bg-[#5C3317]" statKey="intellect" />
                <StatBar label="Resistência" color="bg-amber-800" statKey="endurance" />
                <StatBar label="Agilidade" color="bg-[#5C3317]" statKey="agility" />
                <StatBar label="Sanidade" color="bg-amber-800" statKey="sanity" />
                <StatBar label="Mana" color="bg-[#5C3317]" statKey="manaStat" />
              </div>

              {/* Decorative Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#8B4513]/40 to-transparent"></div>
                <span className="text-[#8B4513]/60 text-xs uppercase tracking-widest">História</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#8B4513]/40 to-transparent"></div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-[#D4A574] font-bold text-xs uppercase tracking-wider">Descrição</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full input-medieval rounded-lg px-4 py-3 resize-none text-sm"
                  rows={3}
                  placeholder="Conte a história deste herói, suas origens, motivações e lendas que o cercam..."
                />
              </div>

              {/* Images */}
              <div className="space-y-2">
                <label className="block text-[#D4A574] font-bold text-xs uppercase tracking-wider">Imagens</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="imageUrlInput"
                    className="flex-1 input-medieval rounded-lg px-4 py-2.5 text-sm"
                    placeholder="Cole a URL da imagem..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = document.getElementById('imageUrlInput') as HTMLInputElement;
                        if (input.value.trim()) {
                          setEditForm({ ...editForm, images: [...editForm.images, input.value.trim()] });
                          input.value = '';
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('imageUrlInput') as HTMLInputElement;
                      if (input.value.trim()) {
                        setEditForm({ ...editForm, images: [...editForm.images, input.value.trim()] });
                        input.value = '';
                      }
                    }}
                    className="px-4 py-2.5 bg-gradient-to-br from-[#8B4513] to-[#5C3317] text-white rounded-lg font-bold text-sm hover:from-[#9B5523] hover:to-[#6C4317] transition-all flex items-center gap-2 shadow-lg"
                  >
                    <PlusIcon size={16} />
                    <span className="hidden sm:inline">Adicionar</span>
                  </button>
                </div>
                {editForm.images.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto pb-2 pt-2">
                    {editForm.images.map((img, index) => (
                      <div key={index} className="relative flex-shrink-0 group">
                        <img
                          src={img}
                          alt={`Img ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border-2 border-[#8B4513] cursor-pointer hover:border-[#FFD700] transition-all shadow-lg"
                          onClick={() => setEnlargedImage(img)}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = editForm.images.filter((_, i) => i !== index);
                            setEditForm({ ...editForm, images: newImages });
                          }}
                          className="absolute -top-2 -right-2 bg-[#8B4513] text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-all shadow-lg opacity-0 group-hover:opacity-100"
                        >
                          <XIcon size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons at Bottom */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#8B4513]/20">
                <button
                  onClick={() => { setIsEditing(false); setSelectedCharacter(null); }}
                  className="flex-1 px-6 py-3 bg-[#1a0f08] text-[#D4A574] rounded-lg font-bold hover:bg-[#2a1f18] hover:text-[#F5DEB3] transition-all text-sm border border-[#8B4513]/30"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveCharacter}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#8B4513] to-[#9B5523] text-[#FFD700] rounded-lg font-bold hover:from-[#9B5523] hover:to-[#AB6533] transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#8B4513]/30"
                >
                  <PlusIcon size={18} />
                  <span>{selectedCharacter ? "Salvar Alterações" : "Criar Personagem"}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="nordestino-card rounded-xl p-12 flex-1 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#0d0805] border-2 border-[#8B4513]/40 flex items-center justify-center">
                <SwordIcon size={40} className="text-[#8B4513]/60" />
              </div>
              <h3 className="medieval-title text-2xl text-[#8B4513] mb-2">Nenhum Herói Selecionado</h3>
              <p className="text-[#D4A574]/60 font-serif italic mb-6">Crie um novo personagem ou selecione um existente</p>
              <button
                onClick={createNewCharacter}
                className="gold-button px-8 py-3 rounded-lg font-bold text-base inline-flex items-center gap-2"
              >
                <PlusIcon size={20} />
                <span>Criar Novo Herói</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Saved Characters - Right Side */}
      <div className="lg:w-72 xl:w-80 flex-shrink-0">
        <div className="glass-card rounded-xl p-4 lg:sticky lg:top-20">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#8B4513]/20">
            <h3 className="medieval-title text-lg text-[#FFD700] flex items-center gap-2">
              <DaggerIcon size={18} />
              <span>Personagens</span>
            </h3>
            <span className="text-xs bg-[#8B4513]/30 text-[#FFD700] px-2 py-1 rounded-full font-bold">
              {savedCharacters.length}
            </span>
          </div>

          {savedCharacters.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0d0805] border border-[#8B4513]/30 flex items-center justify-center">
                <ShieldIcon size={28} className="text-[#8B4513]/40" />
              </div>
              <p className="text-[#D4A574]/40 italic text-sm">Nenhum personagem criado</p>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-200px)] lg:max-h-none scroll-parchment">
              {savedCharacters.map((char) => (
                <div
                  key={char.id}
                  onClick={() => editCharacter(char)}
                  className={`group relative p-3 rounded-xl cursor-pointer transition-all duration-300 border ${
                    selectedCharacter?.id === char.id 
                      ? "bg-[#8B4513]/20 border-[#FFD700]/50 shadow-lg shadow-[#8B4513]/20" 
                      : "bg-[#0d0805]/40 border-[#8B4513]/20 hover:border-[#8B4513]/40 hover:bg-[#0d0805]/60"
                  }`}
                >
                  <div className="flex gap-3">
                    {char.images && char.images.length > 0 ? (
                      <img
                        src={char.images[0]}
                        alt={char.name}
                        className="w-12 h-12 rounded-lg object-cover border-2 border-[#8B4513] flex-shrink-0 cursor-pointer transition-transform group-hover:scale-105"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEnlargedImage(char.images[0]);
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-[#1a0f08] border-2 border-[#8B4513]/40 flex items-center justify-center flex-shrink-0">
                        <SwordIcon size={20} className="text-[#8B4513]/60" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <h4 className="font-bold text-white text-sm truncate group-hover:text-[#FFD700] transition-colors">{char.name}</h4>
                          <p className="text-[#8B4513] text-xs font-bold truncate">{char.characterClass}</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteCharacter(char.id); }}
                          className="text-[#8B4513]/60 hover:text-red-400 text-xs flex-shrink-0 p-1 hover:bg-red-500/10 rounded transition-all"
                          title="Excluir"
                        >
                          <XIcon size={14} />
                        </button>
                      </div>
                      <div className="flex gap-4 mt-2 text-xs">
                        <span className="text-amber-500 flex items-center gap-1">
                          <ShieldIcon size={12} />
                          {char.hp}/{char.maxHp}
                        </span>
                        <span className="text-purple-400 flex items-center gap-1">
                          <SparklesIcon size={12} />
                          {char.mana}/{char.maxMana}
                        </span>
                      </div>
                    </div>
                  </div>
                  {selectedCharacter?.id === char.id && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#FFD700] to-[#8B4513] rounded-r-full"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de imagem ampliada */}
      {enlargedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative max-w-[95vw] max-h-[95vh] p-2">
            <img
              src={enlargedImage}
              alt="Imagem ampliada"
              className="max-w-full max-h-[90vh] rounded-xl border-4 border-[#8B4513] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute -top-3 -right-3 bg-gradient-to-br from-[#8B4513] to-[#5C3317] text-white rounded-full w-10 h-10 flex items-center justify-center hover:from-red-600 hover:to-red-800 transition-all shadow-lg"
            >
              <XIcon size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
