import { useState, useEffect } from "react";
import {
  SwordIcon, TargetIcon, HeartIcon,
  SunIcon, FeatherIcon, ScrollIcon, Feather,
  XIcon, PlusIcon, EditIcon, SparklesIcon, BookOpenIcon
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
    { id: "session", label: "Sessão", icon: <ScrollIcon size={14} /> },
    { id: "character", label: "Herói", icon: <SwordIcon size={14} /> },
    { id: "quest", label: "Missão", icon: <TargetIcon size={14} /> },
    { id: "npc", label: "NPC", icon: <HeartIcon size={14} /> },
    { id: "location", label: "Lugar", icon: <SunIcon size={14} /> },
    { id: "other", label: "Outro", icon: <FeatherIcon size={14} /> },
  ];

  const getCategoryColor = (catId: Note["category"]) => {
    switch (catId) {
      case "session": return "text-amber-500";
      case "character": return "text-emerald-400";
      case "quest": return "text-red-400";
      case "npc": return "text-pink-400";
      case "location": return "text-cyan-400";
      default: return "text-[#D4A574]";
    }
  };

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Nova Página",
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
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Editor - Left Side (like CharacterGenerator) */}
      <div className="flex-1 flex flex-col">
        {/* Editor */}
        {isEditing && selectedNote ? (
          <div className="nordestino-card rounded-xl overflow-hidden">
            {/* Form Header */}
            <div className="bg-gradient-to-r from-[#1a0f08] to-[#0d0805] px-6 py-4 border-b border-[#8B4513]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B4513] to-[#5C3317] flex items-center justify-center shadow-lg shadow-[#8B4513]/30">
                  <BookOpenIcon size={20} className="text-[#FFD700]" />
                </div>
                <div>
                  <h3 className="medieval-title text-xl text-[#FFD700]">
                    {selectedNote ? "Editar Página" : "Nova Página"}
                  </h3>
                  <p className="text-[#8B4513] text-xs">
                    {selectedNote ? "Modifique os registros da crônica" : "Crie um novo registro de sua jornada"}
                  </p>
                </div>
              </div>
              <button
                onClick={createNote}
                className="gold-button px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg"
              >
                <PlusIcon size={16} />
                <span>Nova</span>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Title & Category Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-[#D4A574] font-bold text-xs uppercase tracking-wider">Título</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full input-medieval rounded-lg px-4 py-2.5 text-sm"
                    placeholder="Digite o título..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[#D4A574] font-bold text-xs uppercase tracking-wider">Categoria</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as Note["category"])}
                    className="w-full input-medieval rounded-lg px-4 py-2.5 text-sm text-[#FFD700] font-bold"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Decorative Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#8B4513]/40 to-transparent"></div>
                <span className="text-[#8B4513]/60 text-xs uppercase tracking-widest">Imagens</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#8B4513]/40 to-transparent"></div>
              </div>

              {/* Images */}
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="noteImageUrlInput"
                    className="flex-1 input-medieval rounded-lg px-4 py-2.5 text-sm"
                    placeholder="Cole a URL da imagem..."
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
                    className="px-4 py-2.5 bg-gradient-to-br from-[#8B4513] to-[#5C3317] text-white rounded-lg font-bold text-sm hover:from-[#9B5523] hover:to-[#6C4317] transition-all flex items-center gap-2 shadow-lg"
                  >
                    <PlusIcon size={16} />
                    <span className="hidden sm:inline">Adicionar</span>
                  </button>
                </div>
                {editImages.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto pb-2 pt-2">
                    {editImages.map((img, index) => (
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
                            const newImages = editImages.filter((_, i) => i !== index);
                            setEditImages(newImages);
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

              {/* Decorative Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#8B4513]/40 to-transparent"></div>
                <span className="text-[#8B4513]/60 text-xs uppercase tracking-widest">Conteúdo</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#8B4513]/40 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={12}
                  className="w-full input-medieval rounded-lg px-4 py-3 resize-none text-sm"
                  placeholder="Escreva sua história, registros de sessão, descrições de NPCs ou qualquer nota importante..."
                />
              </div>

              {/* Action Buttons at Bottom */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#8B4513]/20">
                <button
                  onClick={() => { setIsEditing(false); setSelectedNote(null); }}
                  className="flex-1 px-6 py-3 bg-[#1a0f08] text-[#D4A574] rounded-lg font-bold hover:bg-[#2a1f18] hover:text-[#F5DEB3] transition-all text-sm border border-[#8B4513]/30"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveNote}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#8B4513] to-[#9B5523] text-[#FFD700] rounded-lg font-bold hover:from-[#9B5523] hover:to-[#AB6533] transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#8B4513]/30"
                >
                  <PlusIcon size={18} />
                  <span>{selectedNote ? "Salvar Alterações" : "Criar Página"}</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="nordestino-card rounded-xl overflow-hidden flex-1">
            {/* Card Header with Button */}
            <div className="bg-gradient-to-r from-[#1a0f08] to-[#0d0805] px-6 py-4 border-b border-[#8B4513]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B4513] to-[#5C3317] flex items-center justify-center shadow-lg shadow-[#8B4513]/30">
                  <BookOpenIcon size={20} className="text-[#FFD700]" />
                </div>
                <div>
                  <h3 className="medieval-title text-xl text-[#FFD700]">
                    Crônicas do Sertão
                  </h3>
                  <p className="text-[#8B4513] text-xs">
                    Registre as histórias e lendas de sua jornada
                  </p>
                </div>
              </div>
              <button
                onClick={createNote}
                className="gold-button px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg"
              >
                <PlusIcon size={16} />
                <span>Nova</span>
              </button>
            </div>
            
            {/* Empty State Content */}
            <div className="p-12 flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#0d0805] border-2 border-[#8B4513]/40 flex items-center justify-center">
                  <BookOpenIcon size={40} className="text-[#8B4513]/60" />
                </div>
                <h3 className="medieval-title text-2xl text-[#8B4513] mb-2">Nenhuma Página Selecionada</h3>
                <p className="text-[#D4A574]/60 font-serif italic mb-6">Crie uma nova página ou selecione uma existente</p>
                <button
                  onClick={createNote}
                  className="gold-button px-8 py-3 rounded-lg font-bold text-base inline-flex items-center gap-2"
                >
                  <PlusIcon size={20} />
                  <span>Criar Nova Página</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notes List - Right Side (like CharacterGenerator) */}
      <div className="lg:w-72 xl:w-80 flex-shrink-0">
        <div className="glass-card rounded-xl p-4 lg:sticky lg:top-20">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#8B4513]/20">
            <h3 className="medieval-title text-lg text-[#FFD700] flex items-center gap-2">
              <FeatherIcon size={18} />
              <span>Páginas</span>
            </h3>
            <span className="text-xs bg-[#8B4513]/30 text-[#FFD700] px-2 py-1 rounded-full font-bold">
              {filteredNotes.length}
            </span>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-1 mb-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1
                ${filter === "all" 
                  ? "gold-button" 
                  : "bg-[#0d0805] text-[#D4A574] border border-[#8B4513]/40 hover:border-[#8B4513]/70"
                }`}
            >
              Todas
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1
                  ${filter === cat.id 
                    ? "gold-button" 
                    : "bg-[#0d0805] text-[#D4A574] border border-[#8B4513]/40 hover:border-[#8B4513]/70"
                  }`}
                title={cat.label}
              >
                {cat.icon}
              </button>
            ))}
          </div>

          {filteredNotes.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#0d0805] border border-[#8B4513]/30 flex items-center justify-center">
                <ScrollIcon size={28} className="text-[#8B4513]/40" />
              </div>
              <p className="text-[#D4A574]/40 italic text-sm">Nenhuma página criada</p>
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] lg:max-h-none scroll-parchment">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => startEditing(note)}
                  className={`group relative p-3 rounded-xl cursor-pointer transition-all duration-300 border ${
                    selectedNote?.id === note.id 
                      ? "bg-[#8B4513]/20 border-[#FFD700]/50 shadow-lg shadow-[#8B4513]/20" 
                      : "bg-[#0d0805]/40 border-[#8B4513]/20 hover:border-[#8B4513]/40 hover:bg-[#0d0805]/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={getCategoryColor(note.category)}>
                      {categories.find((c) => c.id === note.category)?.icon}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                      className="text-[#8B4513]/60 hover:text-red-400 text-xs flex-shrink-0 p-1 hover:bg-red-500/10 rounded transition-all opacity-0 group-hover:opacity-100"
                      title="Excluir"
                    >
                      <XIcon size={14} />
                    </button>
                  </div>
                  <h5 className="font-bold text-white text-sm truncate group-hover:text-[#FFD700] transition-colors mb-1">
                    {note.title}
                  </h5>
                  <p className="text-[#D4A574]/60 text-xs truncate mb-2">
                    {note.content || "Em branco"}
                  </p>
                  <p className="text-[#8B4513]/70 text-xs">
                    {note.updatedAt.toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </p>
                  {selectedNote?.id === note.id && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-[#FFD700] to-[#8B4513] rounded-r-full"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {enlargedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative max-w-[95vw] max-h-[95vh] p-2">
            <img
              src={enlargedImage}
              alt="Imagem"
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
