# ⚔️ RPG Table Manager

Uma mesa de RPG digital para aventuras épicas com tema Nordestino brasileiro!

## Funcionalidades

### 🎲 Rolador de Dados 3D
- Dados 3D com física realista usando BabylonJS e Ammo.js
- Todos os tipos de dados: d4, d6, d8, d10, d12, d20, d100
- Múltiplos dados por rolagem com modificadores
- Histórico completo com estatísticas (maior, menor, média)
- Tema Nordestino: vermelho escuro (#8B0000) e dourado (#FFD700)

### ⚔️ Gerador de Personagens
- Classes temáticas: Cangaceiro, Retirante, Soldado da Volante, Bendezeiro, Ex-Escravo, Padre, Descrente
- Atributos calculados com bônus
- Barras dePV e DT (mana) com visual estilizado

### 📜 Gerador de Nomes
- Nomes temáticos para diferentes raças
- Copy-to-clipboard comum clique

### 📝 Bloco de Notas
- Organize suas aventuras
- Categorização automática
- Persistência local no navegador

## Como Executar

### Instalar dependências
```bash
bun install
```

### Iniciar servidor de desenvolvimento
```bash
bun run src/index.ts
```

Acesse: http://localhost:3000

### Para produção
```bash
bun run build
bun run start
```

## Tecnologias

- **Bun** - Runtime JavaScript rápido
- **React** - Interface do usuário
- **Tailwind CSS** - Estilização moderna
- **TypeScript** - Tipagem estática
- **@3d-dice/dice-box** - Dados 3D com física (BabylonJS + Ammo.js)

## Estrutura do Projeto

```
src/
├── App.tsx                    # Componente principal
├── index.ts                   # Servidor Bun
├── index.html                 # Página HTML
├── index.css                  # Estilos Tailwind
├── frontend.tsx                # Entry point React
└── components/
    ├── ThreeDice.tsx          # Componente 3D DiceBox
    ├── DiceRoller.tsx         # Rolador de dados
    ├── CharacterGenerator.tsx # Gerador de personagens
    ├── NameGenerator.tsx      # Gerador de nomes
    └── Notes.tsx              # Bloco de notas

public/assets/
├── ammo/ammo.wasm.wasm        # Physics engine
└── themes/default/            # Dice textures
```

## Créditos

- **@3d-dice/dice-box** - [GitHub](https://github.com/3d-dice/dice-box)
- **BabylonJS** - 3D engine
- **Ammo.js** - Physics simulation

## Licença

MIT License - Copyright (c) 2026 Êndrell Jeronimo

---

Feito com ⚔️ para jogadores de RPG