import { useState, useEffect } from "react";
import { DaggerIcon, SwordIcon } from "./Icons";

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
      <div className="flex items-center gap-2">
        <span className="w-20 text-xs font-bold text-[#8B4513] truncate">{label}</span>
        
        {/* Point buttons */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => adjustPoints(-1)}
            className="w-5 h-5 rounded bg-[#0d0805] border border-[#8B4513]/40 text-[#FFD700] text-xs hover:bg-[#8B4513]/30"
          >
            −
          </button>
          <span className="w-6 text-center text-white text-sm font-bold">{points}</span>
          <button
            onClick={() => adjustPoints(1)}
            className="w-5 h-5 rounded bg-[#0d0805] border border-[#8B4513]/40 text-[#FFD700] text-xs hover:bg-[#8B4513]/30"
          >
            +
          </button>
        </div>

        {/* Roll button */}
        <button
          onClick={rollStat}
          className="px-2 py-0.5 bg-[#8B4513]/60 text-white rounded text-xs font-bold hover:bg-[#8B4513]"
        >
          ◆
        </button>

        {/* Modifier */}
        <input
          type="number"
          value={modifier}
          onChange={(e) => {
            setModifiers({ ...modifiers, [statKey]: parseInt(e.target.value) || 0 });
          }}
          className="w-10 bg-[#0d0805] border border-[#8B4513]/40 rounded px-1 py-0.5 text-center text-white text-xs"
          placeholder="mod"
        />

        {/* Result */}
        {result && (
          <div className="flex-1 min-w-0 text-right">
            <span className="text-[#FFD700] text-xs font-bold">
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

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Main Content - Left Side */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-wrap gap-3 justify-center lg:justify-start items-center">
          <button
            onClick={createNewCharacter}
            className="gold-button px-5 py-2 rounded-lg font-bold text-sm"
          >
            + Novo
          </button>
          <button
            onClick={generateRandomCharacter}
            className="px-4 py-2 bg-[#8B4513]/80 text-[#FFD700] rounded-lg font-bold hover:bg-[#8B4513] border border-[#8B4513]/50 hover:border-[#FFD700]/30 transition-all text-sm"
          >
            ◆ Aleatório
          </button>
        </div>

        {/* Edit Form */}
        {isEditing ? (
          <div className="nordestino-card rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="medieval-title text-lg text-[#8B4513]">
                {selectedCharacter ? "Editando" : "Novo Personagem"}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => { setIsEditing(false); setSelectedCharacter(null); }}
                  className="px-3 py-1 text-[#D4A574] hover:text-[#F5DEB3] text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveCharacter}
                  className="px-4 py-1 bg-[#8B4513] text-[#FFD700] rounded-lg font-bold hover:bg-[#9B5523] text-sm"
                >
                  Salvar
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[#8B4513] font-bold text-xs mb-1">Nome</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full input-medieval rounded px-3 py-1.5 text-sm"
                  placeholder="Nome..."
                />
              </div>
              <div>
                <label className="block text-[#8B4513] font-bold text-xs mb-1">Classe</label>
                <select
                  value={editForm.characterClass}
                  onChange={(e) => setEditForm({ ...editForm, characterClass: e.target.value })}
                  className="w-full input-medieval rounded px-3 py-1.5 text-sm text-[#8B4513] font-bold"
                >
                  {classes.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[#8B4513] font-bold text-xs mb-1">Altura</label>
                <input
                  type="text"
                  value={editForm.height}
                  onChange={(e) => setEditForm({ ...editForm, height: e.target.value })}
                  className="w-full input-medieval rounded px-3 py-1.5 text-sm"
                  placeholder="1,70m"
                />
              </div>
              <div>
                <label className="block text-[#8B4513] font-bold text-xs mb-1">Idade</label>
                <input
                  type="text"
                  value={editForm.age}
                  onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                  className="w-full input-medieval rounded px-3 py-1.5 text-sm"
                  placeholder="25"
                />
              </div>
            </div>

            {/* HP & DT bars */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[#8B4513] font-bold text-xs mb-1">HP</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-4 bg-[#0d0805] rounded-full overflow-hidden border border-[#8B4513]/40">
                    <div
                      className="h-full bg-gradient-to-r from-[#8B4513] to-[#CD853F] transition-all"
                      style={{ width: `${(editForm.hp / editForm.maxHp) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-[#F5DEB3] w-16 text-center">
                    {editForm.hp}/{editForm.maxHp}
                  </span>
                </div>
                <div className="flex gap-1 mt-1">
                  <input
                    type="number"
                    min="0"
                    value={editForm.hp}
                    onChange={(e) => setEditForm({ ...editForm, hp: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-12 bg-[#0d0805] border border-[#8B4513]/40 rounded px-1 py-0.5 text-center text-white text-xs"
                  />
                  <span className="text-[#8B4513]/50 text-xs self-center">/</span>
                  <input
                    type="number"
                    min="1"
                    value={editForm.maxHp}
                    onChange={(e) => setEditForm({ ...editForm, maxHp: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-12 bg-[#0d0805] border border-[#8B4513]/40 rounded px-1 py-0.5 text-center text-white text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-purple-400 font-bold text-xs mb-1">DT</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-4 bg-[#0d0805] rounded-full overflow-hidden border border-purple-600/40">
                    <div
                      className="h-full bg-gradient-to-r from-purple-700 to-purple-400 transition-all"
                      style={{ width: `${(editForm.mana / editForm.maxMana) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-[#F5DEB3] w-16 text-center">
                    {editForm.mana}/{editForm.maxMana}
                  </span>
                </div>
                <div className="flex gap-1 mt-1">
                  <input
                    type="number"
                    min="0"
                    value={editForm.mana}
                    onChange={(e) => setEditForm({ ...editForm, mana: Math.max(0, parseInt(e.target.value) || 0) })}
                    className="w-12 bg-[#0d0805] border border-purple-900/40 rounded px-1 py-0.5 text-center text-white text-xs"
                  />
                  <span className="text-purple-400/50 text-xs self-center">/</span>
                  <input
                    type="number"
                    min="1"
                    value={editForm.maxMana}
                    onChange={(e) => setEditForm({ ...editForm, maxMana: Math.max(1, parseInt(e.target.value) || 1) })}
                    className="w-12 bg-[#0d0805] border border-purple-900/40 rounded px-1 py-0.5 text-center text-white text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mb-4">
              <h4 className="medieval-title text-sm text-[#8B4513] mb-2">✦ Atributos</h4>
              <div className="grid grid-cols-2 gap-2">
                <StatBar label="Força" color="bg-amber-800" statKey="strength" />
                <StatBar label="Intelecto" color="bg-[#5C3317]" statKey="intellect" />
                <StatBar label="Resistência" color="bg-amber-800" statKey="endurance" />
                <StatBar label="Agilidade" color="bg-[#5C3317]" statKey="agility" />
                <StatBar label="Sanidade" color="bg-amber-800" statKey="sanity" />
                <StatBar label="Mana" color="bg-[#5C3317]" statKey="manaStat" />
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-[#8B4513] font-bold text-xs mb-1">Descrição</label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="w-full input-medieval rounded px-3 py-1.5 resize-none text-sm"
                rows={2}
                placeholder="História do personagem..."
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-[#8B4513] font-bold text-xs mb-1">Imagens</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  id="imageUrlInput"
                  className="flex-1 input-medieval rounded px-3 py-1.5 text-xs"
                  placeholder="Cole URL da imagem..."
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
                  className="px-3 py-1.5 bg-[#8B4513] text-white rounded font-bold text-sm hover:bg-[#9B5523]"
                >
                  +
                </button>
              </div>
              {editForm.images.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {editForm.images.map((img, index) => (
                    <div key={index} className="relative flex-shrink-0">
                      <img
                        src={img}
                        alt={`Img ${index + 1}`}
                        className="w-16 h-16 object-cover rounded-lg border border-[#8B4513] cursor-pointer hover:border-[#FFD700]/50"
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
                        className="absolute -top-2 -right-2 bg-[#8B4513] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="nordestino-card rounded-xl p-8 flex-1 flex items-center justify-center">
            <div className="text-center text-[#F5DEB3]/50">
              <p className="mb-3 text-[#8B4513]"><SwordIcon size={48} /></p>
              <p className="text-base font-serif text-[#8B4513]">Crie ou selecione um personagem</p>
            </div>
          </div>
        )}
      </div>

      {/* Saved Characters - Right Side */}
      <div className="lg:w-72 xl:w-80 flex-shrink-0">
        <div className="nordestino-card rounded-xl p-3 lg:sticky lg:top-20">
          <h3 className="medieval-title text-sm text-[#FFD700]/80 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2"><DaggerIcon size={16} /> Personagens</span>
            <span className="text-xs text-[#D4A574]/50">{savedCharacters.length}</span>
          </h3>

          {savedCharacters.length === 0 ? (
            <p className="text-[#D4A574]/40 italic text-center py-6 text-sm">Nenhum personagem</p>
          ) : (
            <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-180px)] lg:max-h-none scroll-parchment">
              {savedCharacters.map((char) => (
                <div
                  key={char.id}
                  onClick={() => editCharacter(char)}
                  className={`stat-box rounded-lg p-3 cursor-pointer transition-all ${
                    selectedCharacter?.id === char.id ? "border-[#D4A574]" : "border-[#8B4513]/30"
                  }`}
                >
                  <div className="flex gap-2">
                    {char.images && char.images.length > 0 && (
                      <img
                        src={char.images[0]}
                        alt={char.name}
                        className="w-10 h-10 rounded object-cover border border-[#8B4513] flex-shrink-0 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEnlargedImage(char.images[0]);
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0">
                          <h4 className="font-bold text-white text-sm truncate">{char.name}</h4>
                          <p className="text-[#8B4513] text-xs font-bold truncate">{char.characterClass}</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteCharacter(char.id); }}
                          className="text-[#D4A574] hover:text-[#CD853F] text-xs flex-shrink-0"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex gap-3 mt-1 text-xs text-[#F5DEB3]/60">
                        <span className="text-amber-600">HP {char.hp}/{char.maxHp}</span>
                        <span className="text-purple-400">DT {char.mana}/{char.maxMana}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de imagem ampliada */}
      {enlargedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative max-w-[95vw] max-h-[95vh]">
            <img
              src={enlargedImage}
              alt="Imagem ampliada"
              className="max-w-full max-h-[95vh] rounded-lg border-4 border-[#8B4513] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute -top-4 -right-4 bg-[#8B4513] text-white rounded-full w-10 h-10 flex items-center justify-center font-bold hover:bg-amber-800 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
