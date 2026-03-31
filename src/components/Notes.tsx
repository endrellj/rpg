import { useState, useEffect } from "react";
import {
  SwordIcon, TargetIcon, HeartIcon,
  SunIcon, FeatherIcon, ScrollIcon, Feather,
  XIcon, PlusIcon, EditIcon
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
    { id: "npc", label: "NPC", icon: <HeartIcon size={16} /> },
    { id: "location", label: "Lugar", icon: <SunIcon size={16} /> },
    { id: "other", label: "Outro", icon: <FeatherIcon size={16} /> },
  ];

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
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Notes List - Left Side */}
      <div className="lg:w-72 xl:w-80 flex-shrink-0">
        <div className="nordestino-card rounded-xl p-3 lg:sticky lg:top-20">
          <div className="flex justify-between items-center mb-3">
            <h3 className="medieval-title text-sm text-[#FFD700]/80 flex items-center gap-2">
              <FeatherIcon size={16} />
              <span>Páginas</span>
            </h3>
            <button
              onClick={createNote}
              className="gold-button px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1"
            >
              <PlusIcon size={14} />
              <span>Nova</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-1 mb-3">
            <button
              onClick={() => setFilter("all")}
              className={`px-2 py-1 rounded text-xs font-bold transition-all flex items-center gap-1
                ${filter === "all" ? "gold-button" : "bg-[#2a2a2a] text-[#D4A574] border border-[#D4A574]/30"}`}
            >
              Todas
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-2 py-1 rounded text-xs font-bold transition-all flex items-center gap-1
                  ${filter === cat.id ? "gold-button" : "bg-[#2a2a2a] text-[#D4A574] border border-[#D4A574]/30"}`}
                title={cat.label}
              >
                {cat.icon}
              </button>
            ))}
          </div>

          {filteredNotes.length === 0 ? (
            <p className="text-[#D4A574]/40 italic text-center py-6 text-sm">Nenhuma página</p>
          ) : (
            <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-220px)] scroll-parchment">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => startEditing(note)}
                  className={`stat-box rounded-lg p-3 cursor-pointer transition-all ${
                    selectedNote?.id === note.id ? "border-[#FFD700]" : "border-[#8B4513]/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#FFD700]">{categories.find((c) => c.id === note.category)?.icon}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                      className="text-[#CD853F] hover:text-[#D4A574]"
                    >
                      <XIcon size={14} />
                    </button>
                  </div>
                  <h5 className="font-bold text-white text-sm truncate">{note.title}</h5>
                  <p className="text-[#D4A574]/60 text-xs truncate mt-1">{note.content || "Em branco"}</p>
                  <p className="text-[#D4A574]/40 text-xs mt-2">
                    {note.updatedAt.toLocaleDateString("pt-BR")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Editor - Right Side */}
      <div className="flex-1">
        {isEditing && selectedNote ? (
          <div className="nordestino-card rounded-xl p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="medieval-title text-lg text-[#8B4513] flex items-center gap-2">
                <EditIcon size={18} />
                <span>Editando</span>
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={() => { setIsEditing(false); setSelectedNote(null); }}
                  className="px-3 py-1 text-[#D4A574] hover:text-[#F5DEB3] text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveNote}
                  className="px-4 py-1 bg-[#8B4513] text-[#FFD700] rounded-lg font-bold hover:bg-[#9B5523] text-sm flex items-center gap-1"
                >
                  <PlusIcon size={14} />
                  <span>Salvar</span>
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[#8B4513] font-bold text-xs mb-1">Título</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full input-medieval rounded px-3 py-2 text-sm"
                  placeholder="Título..."
                />
              </div>
              <div>
                <label className="block text-[#8B4513] font-bold text-xs mb-1">Categoria</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as Note["category"])}
                  className="w-full input-medieval rounded px-3 py-2 text-sm text-[#8B4513] font-bold"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[#8B4513] font-bold text-xs mb-1">Imagens</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  id="noteImageUrlInput"
                  className="flex-1 input-medieval rounded px-3 py-2 text-xs"
                  placeholder="Cole URL da imagem..."
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
                  className="px-3 py-2 bg-[#8B4513] text-white rounded font-bold text-sm hover:bg-[#9B5523] flex items-center gap-1"
                >
                  <PlusIcon size={14} />
                </button>
              </div>
              {editImages.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {editImages.map((img, index) => (
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
                          const newImages = editImages.filter((_, i) => i !== index);
                          setEditImages(newImages);
                        }}
                        className="absolute -top-2 -right-2 bg-[#8B4513] text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-700 transition-colors"
                      >
                        <XIcon size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[#8B4513] font-bold text-xs mb-1">Conteúdo</label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={12}
                className="w-full input-medieval rounded px-4 py-3 resize-none text-sm"
                placeholder="Escreva a história..."
              />
            </div>
          </div>
        ) : (
          <div className="nordestino-card rounded-xl p-8 flex-1 flex items-center justify-center">
            <div className="text-center text-[#D4A574]/50">
              <p className="mb-3 text-[#8B4513]"><FeatherIcon size={48} /></p>
              <p className="text-lg font-serif">Selecione uma página</p>
              <p className="text-[#D4A574]/50 mt-1 italic font-serif text-sm">ou crie uma nova</p>
            </div>
          </div>
        )}
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
              alt="Imagem"
              className="max-w-full max-h-[95vh] rounded-lg border-4 border-[#8B4513]"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setEnlargedImage(null)}
              className="absolute -top-4 -right-4 bg-[#8B4513] text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-700 transition-colors"
            >
              <XIcon size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
