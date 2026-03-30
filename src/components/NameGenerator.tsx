import { useState } from "react";

interface NameCategory {
  name: string;
  icon: string;
  male: string[];
  female: string[];
  surnames: string[];
}

export function NameGenerator() {
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("nordestino");

  const categories: NameCategory[] = [
    {
      name: "Nordestino",
      icon: "🌵",
      male: ["Antonio", "Francisco", "Jose", "Joao", "Pedro", "Paulo", "Carlos", "Luís", "Marcos", "Gabriel", "Miguel", "Rafael", "Mateus", "Lucas", "Severino", "Jeronimo", "Bernardo", "Vicente", "Feliciano", "Baltazar"],
      female: ["Maria", "Ana", "Francisca", "Antonia", "Adriana", "Juliana", "Marcia", "Fernanda", "Patricia", "Aline", "Carla", "Cristina", "Rosalia", "Lucia", "Beatriz", "Isabel", "Gertrudes", "Quiteria", "Perpetua", "Esmeralda"],
      surnames: ["da Silva", "dos Santos", "de Oliveira", "da Costa", "Lima", "de Sousa", "Cardoso", "de Almeida", "Ribeiro", "Mendes", "Barbosa", "de Carvalho", "Goncalves", "Moreira", "Correia", "Pereira", "Fernandes", "Soares", "Araujo", "Machado"]
    },
    {
      name: "Cangaço",
      icon: "🤠",
      ["male"]: ["Lampiao", "Virgolino", "Corisco", "Delmiro", "Sinhozinho", "Sabino", "Joaquim", "Gato", "Balao", "Pototo", "Cacique", "Barroso", "Ferreira", "Capoeira", "Massape"],
      ["female"]: ["Maria", "Bonita", "Neguinha", "Cicera", "Luiza", "Rita", "Carmem", "Iracema", "Tereza", "Francisca", "Flor", "Luna", "Estrela", "Dama", "Vaidade"],
      surnames: ["Gordo", "Ferreira", "da Hora", "Degas", "Feitosa", "Cavalcanti", "de Meneses", "de Albuquerque", "Bandeira", "Rego"]
    },
    {
      name: "Índio",
      icon: "🪶",
      male: ["Caiapo", "Tupinamba", "Tamoio", "Arapua", "Jaci", "Turi", "Ibiuna", "Maues", "Manaus", "Tefe", "Para", "Ceara", "Piaui", "Maranhao", "Goias"],
      female: ["Iracema", "Tupi", "Guarani", "Caitite", "Jarara", "Curumim", "Maracuja", "Araucaria", "Sabia", "Tucano"],
      surnames: ["Silva", "Oliveira", "Santos", "Souza", "Lima", "Carvalho", "Ribeiro", "Alves", "Machado", "Pereira"]
    },
    {
      name: "Angola",
      icon: "🥁",
      male: ["Quilombo", "Kanda", "Kakana", "Mukasa", "Kibugi", "Mabiala", "Muteba", "Kabanga", "Domingos", "Bento", "Joaquim", "Baltazar", "Gaspar", "Belchior", "Afonso"],
      female: ["Quiteria", "Esperanca", "Lucrecia", "Benedita", "Filomena", "Rosa", "Flor", "Luz", "Paz", "Concordia", "Catarina", "Apolonia", "Agostinha", "Margarida", "Violeta"],
      surnames: ["dos Anjos", "da Cruz", "de Sao", "Bento", "dos Santos", "de Oxum", "de Iansa", "de Ogum", "de Xango", "de Iemanja"]
    },
    {
      name: "Portugal",
      icon: "⛵",
      male: ["Joao", "Pedro", "Paulo", "Miguel", "Antonio", "Francisco", "Jose", "Carlos", "Luis", "Fernando", "Ricardo", "Tomas", "Bruno", "Daniel", "Andre"],
      female: ["Maria", "Ana", "Francisca", "Joana", "Catarina", "Sofia", "Beatriz", "Leonor", "Isabel", "Helena", "Rosa", "Margarida", "Teresa", "Paula", "Ines"],
      surnames: ["Silva", "Santos", "Oliveira", "Sousa", "Costa", "Pereira", "Rodrigues", "Almeida", "Nunes", "Couto", "Lima", "Ferreira", "Gomes", "Correia", "Martins"]
    },
    {
      name: "Elfico",
      icon: "🧝",
      male: ["Aelindra", "Caladrel", "Elorindor", "Faerondil", "Galathil", "Haladriel", "Ithildor", "Laerindel", "Mithrandir", "Nimrodel", "Orophin", "Quelindar", "Rivendel", "Sylvaris", "Thalion"],
      female: ["Aelindra", "Caladrielle", "Elorinde", "Faerondis", "Galadrielle", "Haladrielle", "Ithilde", "Laerinde", "Mithrandie", "Nimrodel", "Orophina", "Quelindra", "Rivende", "Sylvaria", "Thalia"],
      surnames: ["Dawnwhisper", "Moonbrook", "Starleaf", "Sunweaver", "Windrunner", "Silverleaf", "Moonbow", "Stargazer", "Nightbreeze", "Dawnpetal", "Moonshadow", "Starweaver", "Sunfire", "Windwhisper", "Silvermist"]
    }
  ];

  const generateNames = () => {
    const category = categories.find(c => c.name.toLowerCase() === selectedCategory);
    if (!category) return;

    const names: string[] = [];
    const count = 12;

    for (let i = 0; i < count; i++) {
      const isMale = Math.random() > 0.5;
      const firstNames = isMale ? category.male : category.female;
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const surname = category.surnames[Math.floor(Math.random() * category.surnames.length)];
      names.push(`${firstName} ${surname}`);
    }

    setGeneratedNames(names);
  };

  const copyToClipboard = (name: string) => {
    navigator.clipboard.writeText(name);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="medieval-title text-4xl md:text-5xl text-[#D4A574] mb-2">
          📜 Almanaque de Nomes
        </h2>
        <p className="text-[#F5DEB3]/60 italic font-serif">
          Um nome carrega o destino de seu portador...
        </p>
      </div>

      <div className="nordestino-card rounded-2xl p-8">
        {/* Categorias */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name.toLowerCase())}
              className={`px-5 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 font-serif
                ${selectedCategory === cat.name.toLowerCase()
                  ? "gold-button"
                  : "bg-[#2a2a2a] text-[#D4A574] border-2 border-[#D4A574]/30 hover:border-[#D4A574]"}`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Botão gerar */}
        <div className="text-center mb-8">
          <button
            onClick={generateNames}
            className="gold-button px-8 py-4 rounded-xl font-bold text-xl"
          >
            🎲 Sortear Nomes
          </button>
        </div>

        {/* Nomes gerados */}
        {generatedNames.length > 0 && (
          <div className="bg-[#F5DEB3]/50 rounded-xl p-8 border-2 border-[#8B0000]/30">
            <h3 className="medieval-title text-2xl text-[#8B0000] mb-6 text-center">
              Nomes Revelados pelo Destino:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedNames.map((name, index) => (
                <div
                  key={index}
                  onClick={() => copyToClipboard(name)}
                  className="stat-box rounded-xl p-4 flex items-center justify-between 
                    hover:border-[#FFD700] cursor-pointer group"
                >
                  <span className="text-lg font-serif text-[#F5DEB3]">{name}</span>
                  <span className="text-[#D4A574] opacity-0 group-hover:opacity-100 transition-opacity text-xl">
                    📋
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[#8B0000]/50 text-sm mt-6 text-center italic">
              Clique em um nome para copiar
            </p>
          </div>
        )}
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="stat-box rounded-xl p-4 text-center"
          >
            <p className="text-3xl mb-2">{cat.icon}</p>
            <p className="font-bold text-[#FFD700] text-sm">{cat.name}</p>
            <p className="text-[#D4A574]/60 text-xs">
              {cat.male.length + cat.female.length} nomes
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
