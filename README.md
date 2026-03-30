# ⚔️ RPG Table Manager

Sua mesa de RPG digital - Ferramentas épicas para aventuras épicas!

## Funcionalidades

### 🎲 Rolador de Dados
- Role dados de todos os tipos (d4, d6, d8, d10, d12, d20, d100)
- Adicione modificadores e role múltiplos dados
- Histórico de rolagens com estatísticas
- Efeitos visuais de animação

### ⚔️ Gerador de Personagens
- Gere personagens aleatórios completos
- Raças: Humano, Elfo, Anão, Halfling, Draconato, Gnomo, Meio-elfo, Meio-orc, Tiefling
- Classes: Guerreiro, Mago, Ladino, Clérigo, Bárbaro, Bardo, Druida, Feiticeiro, Monge, Paladino, Patrulheiro
- Atributos calculados com bônus raciais
- Pontos de vida e classe de armadura

### 📜 Gerador de Nomes
- Nomes para diferentes raças de RPG
- Categorias: Fantasia Medieval, Élfico, Anão, Orc/Goblin, Humano, Tiefling
- Copie nomes com um clique

### 📝 Bloco de Notas
- Salve suas aventuras e anotações
- Categorize por tipo: Sessão, Personagem, Missão, NPC, Local
- Persistência automática no navegador

## Como Executar

### Instalar dependências
```bash
bun install
```

### Iniciar servidor de desenvolvimento
```bash
bun dev
```

Acesse: http://localhost:3001

### Para produção
```bash
bun start
```

## Tecnologias

- **Bun** - Runtime JavaScript rápido
- **React** - Interface do usuário
- **Tailwind CSS** - Estilização moderna
- **TypeScript** - Tipagem estática

## Estrutura do Projeto

```
src/
├── App.tsx              # Componente principal com navegação
├── index.ts             # Servidor Bun
├── index.html           # Página HTML
├── index.css            # Estilos CSS com Tailwind
├── frontend.tsx         # Entry point do React
└── components/
    ├── DiceRoller.tsx      # Rolador de dados
    ├── CharacterGenerator.tsx  # Gerador de personagens
    ├── NameGenerator.tsx   # Gerador de nomes
    └── Notes.tsx          # Bloco de notas
```

## Screenshots

O site possui:
- Header com gradiente roxo/rosa
- Navegação por abas com ícones
- Cards com efeito glassmorphism
- Animações suaves
- Design responsivo para mobile e desktop

## Dicas de Uso

1. **Dados**: Clique nos botões de dados para rolar. Use quantidade e modificadores para rolar múltiplos dados.
2. **Personagem**: Clique em "Gerar Personagem" para criar um novo. Use "Salvar" para guardar seus favoritos.
3. **Nomes**: Selecione uma raça e clique em "Gerar Nomes". Clique em um nome para copiar.
4. **Notas**: Suas notas são salvas automaticamente no navegador.

## Feito com ⚔️ para jogadores de RPG
