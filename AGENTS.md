# AGENTS.md

## Project Overview

This is a Brazilian Northeastern-themed RPG web application built with:
- **Bun** - Runtime
- **React** + **TypeScript** - Frontend
- **Tailwind CSS** - Styling
- **@3d-dice/dice-box** - 3D physics dice (BabylonJS + Ammo.js)

## Key Files

- `src/components/ThreeDice.tsx` - 3D dice wrapper
- `src/components/DiceRoller.tsx` - Dice UI
- `src/components/CharacterGenerator.tsx` - Character sheet
- `src/components/NameGenerator.tsx` - Name generator
- `src/components/Notes.tsx` - Notes section
- `public/assets/` - Dice textures and physics assets

## Commands

```bash
bun run src/index.ts   # Development server (port 3000)
bun run build          # Production build
bun run start          # Serve production build
```

## Theme

- Primary: Dark Red `#8B0000`
- Accent: Gold `#FFD700`
- Mana stat called "DT" (purple)

## Character Classes

Cangaceiro, Retirante, Soldado da Volante, Bendezeiro, Ex-Escravo, Padre, Descrente

## Development Notes

- The 3D dice box creates its own fullscreen canvas overlay
- Assets must be served from `public/assets/`
- Use SSH for git remote: `git@github.com:endrellj/rpg.git`
