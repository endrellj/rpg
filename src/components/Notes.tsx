import { useState, useEffect } from "react";
import {
  SwordIcon, TargetIcon, DiamondIcon, HeartIcon,
  SunIcon, FeatherIcon, ScrollIcon, EyeIcon
} from "./Icons";

interface Note {
  id: string;
  title: string;
  content: string;
  category: "session" | "character" | "quest" | "npc" | "location" | "other";
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState<Note["category"]>("session");
  const [filter, setFilter] = useState<Note["category"] | "all">("all");
  const [editImages, setEditImages] = useState<string[]>([]);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("rpg-notes");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotes(parsed.map((n: any) => ({
          ...n,
          createdAt: new Date(n.createdAt),
          updatedAt: new Date(n.updatedAt),
        })));
      } catch (e) {
        console.error("Erro ao carregar notas:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("rpg-notes", JSON.stringify(notes));
  }, [notes]);

  const categories: { id: Note["category"]; label: string; icon: React.ReactNode }[] = [
    { id: "session", label: "Sessão", icon: <ScrollIcon size={16} /> },
    { id: "character", label: "Herói", icon: <SwordIcon size={16} /> },
    { id: "quest", label: "Missão", icon: <TargetIcon size={16} /> },
    { id: "npc", label: "Personagem", icon: <HeartIcon size={16} /> },
    { id: "location", label: "Lugar", icon: <SunIcon size={16} /> },
    { id: "other", label: "Outro", icon: <FeatherIcon size={16} /> },
  ];

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Nova Página em Branco",
      content: "",
      category: "session",
      images: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setIsEditing(true);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
    setEditCategory(newNote.category);
    setEditImages([]);
  };

  const saveNote = () => {
    if (!selectedNote) return;

    const updated = notes.map((n) =>
      n.id === selectedNote.id
        ? { ...n, title: editTitle, content: editContent, category: editCategory, images: editImages, updatedAt: new Date() }
        : n
    );

    setNotes(updated);
    setSelectedNote({ ...selectedNote, title: editTitle, content: editContent, category: editCategory, images: editImages, updatedAt: new Date() });
    setIsEditing(false);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
      setIsEditing(false);
    }
  };

  const startEditing = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(true);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditCategory(note.category);
    setEditImages(note.images || []);
  };

  const filteredNotes = filter === "all" ? notes : notes.filter((n) => n.category === filter);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="medieval-title text-4xl md:text-5xl text-[#D4A574] mb-2">
          ✎ Diário do Aventureiro
        </h2>
        <p className="text-[#F5DEB3]/60 italic font-serif">
          "As palavras escritas têm o poder de mudar o destino..."
        </p>
      </div>

      <div className="nordestino-card rounded-2xl p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <h3 className="medieval-title text-2xl text-[#8B4513]">
            Páginas do Diário
          </h3>
          <button
            onClick={createNote}
            className="gold-button px-6 py-3 rounded-xl font-bold"
          >
            + Nova Página
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`px-5 py-3 rounded-xl font-bold transition-all font-serif
              ${filter === "all" ? "gold-button" : "bg-[#2a2a2a] text-[#D4A574] border-2 border-[#D4A574]/30 hover:border-[#D4A574]"}`}
          >
            ◇ Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-2 font-serif
                ${filter === cat.id ? "gold-button" : "bg-[#2a2a2a] text-[#D4A574] border-2 border-[#D4A574]/30 hover:border-[#D4A574]"}`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Lista de notas */}
          <div className="md:col-span-1 space-y-4">
            <h4 className="medieval-title text-xl text-[#8B4513]">Suas Páginas</h4>
            {filteredNotes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-6xl mb-4 text-[#8B4513]">✎</p>
                <p className="text-[#8B4513]/60 italic font-serif">
                  Nenhuma página escrita
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto scroll-parchment pr-2">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => startEditing(note)}
                    className={`stat-box rounded-xl p-5 cursor-pointer transition-all duration-200
                      ${selectedNote?.id === note.id ? "border-[#FFD700]" : "border-[#D4A574]/30 hover:border-[#D4A574]"}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{categories.find((c) => c.id === note.category)?.icon}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                        className="text-[#CD853F] hover:text-[#D4A574] text-lg font-bold"
                      >
                        ✕
                      </button>
                    </div>
                    <h5 className="font-bold text-[#F5DEB3] text-lg truncate">{note.title}</h5>
                    <p className="text-[#D4A574]/60 text-sm truncate mt-1">{note.content || "Página em branco"}</p>
                    <p className="text-[#D4A574]/40 text-xs mt-3">
                      {note.updatedAt.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Editor */}
          <div className="md:col-span-2">
            {isEditing && selectedNote ? (
              <div className="bg-[#1a0f08]/80 rounded-xl p-8 border border-[#8B4513]/25 space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <h4 className="medieval-title text-2xl text-[#8B4513]">Editando Página</h4>
                  <div className="flex gap-3">
                    <button
                      onClick={saveNote}
                      className="px-6 py-3 bg-[#8B4513] text-[#FFD700] rounded-xl font-bold hover:bg-[#9B5523] transition-colors"
                    >
                      ⊕ Salvar
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 bg-[#2a2a2a] text-[#D4A574] rounded-xl font-bold hover:bg-[#3a3a3a]"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[#8B4513] mb-2 font-bold">Título</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full input-medieval rounded-lg px-5 py-3 font-serif text-lg"
                    placeholder="Título da história..."
                  />
                </div>

                <div>
                  <label className="block text-[#8B4513] mb-2 font-bold">Categoria</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as Note["category"])}
                    className="w-full input-medieval rounded-lg px-5 py-3 font-serif"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#8B4513] mb-2 font-bold">Imagens</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      id="noteImageUrlInput"
                      className="flex-1 input-medieval rounded-lg px-4 py-2"
                      placeholder="URL da imagem (ex: https://exemplo.com/imagem.jpg)"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = document.getElementById('noteImageUrlInput') as HTMLInputElement;
                          if (input.value.trim()) {
                            setEditImages([...editImages, input.value.trim()]);
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('noteImageUrlInput') as HTMLInputElement;
                        if (input.value.trim()) {
                          setEditImages([...editImages, input.value.trim()]);
                          input.value = '';
                        }
                      }}
                      className="px-4 py-2 bg-[#8B4513] text-white rounded-lg font-bold hover:bg-[#9B5523]"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-[#D4A574]/50 text-xs mb-3">Pressione Enter ou clique em + para adicionar</p>
                  {editImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                      {editImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={img}
                            alt={`Imagem ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border-2 border-[#8B4513] cursor-zoom-in"
                            onClick={() => setEnlargedImage(img)}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = editImages.filter((_, i) => i !== index);
                              setEditImages(newImages);
                            }}
                            className="absolute -top-2 -right-2 bg-[#8B4513] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[#8B4513] mb-2 font-bold">Conteúdo</label>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={14}
                    className="w-full input-medieval rounded-lg px-5 py-4 font-serif resize-none"
                    placeholder="Escreva a história aqui..."
                  />
                </div>
              </div>
            ) : (
              <div className="stat-box rounded-xl p-12 flex items-center justify-center h-[500px]">
                <div className="text-center text-[#D4A574]">
                  <p className="text-8xl mb-6 text-[#8B4513]">✎</p>
                  <p className="text-xl font-serif">Selecione uma página</p>
                  <p className="text-[#D4A574]/50 mt-2 italic font-serif">ou escreva uma nova história</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {enlargedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
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
