# Tile Component Guide (`src/components/ui/primitives/Tile.tsx`)

Komponent `Tile` to uniwersalny "kafelek" w stylu Apple/Bento grid, zaprojektowany do tworzenia nowoczesnych układów (np. sekcje Feature, Grid, Portfolio). Obsługuje różne warianty stylistyczne, rozmiary siatki oraz teksturę "noise".

## Import

```tsx
import { 
  Tile, 
  TileNumber, 
  TileTitle, 
  TileDescription, 
  TileContent, 
  TileHeader,
  TileFooter 
} from '@/components/ui/primitives/Tile';
```

## Podstawowe użycie

Struktura kafelka jest zorientowana na `flex-col`. Używaj podkomponentów do zachowania spójnych odstępów i typografii.

```tsx
<Tile variant="transparent" gridSize="2x2">
  <TileHeader>
    <TileNumber>01</TileNumber>
  </TileHeader>
  <TileContent>
    <TileTitle>Tytuł sekcji</TileTitle>
    <TileDescription>
      Krótki opis funkcjonalności dostępnej w tym kafelku.
    </TileDescription>
  </TileContent>
</Tile>
```

## Props (`Tile`)

| Prop | Typ | Domyślnie | Opis |
|------|-----|-----------|------|
| `variant` | `TileVariant` | `'transparent'` | Styl kafelka (patrz tabela poniżej) |
| `gridSize` | `'2x2' \| '4x2'` | `'2x2'` | Rozmiar kafelka w siatce (col/row span) |
| `withNoise` | `boolean` | `false` | Dodaje subtelną teksturę szumu (grain) |
| `className` | `string` | `undefined` | Dodatkowe klasy Tailwind |

### Dostępne Warianty (`variant`)

| Wariant | Wygląd | Zastosowanie |
|---------|--------|--------------|
| `solid-white` | Białe tło, ciemny tekst | Kafelki wyróżniające się wysokim kontrastem |
| `transparent` | Przezroczyste tło, jasny tekst | Główne kafelki na ciemnym tle |
| `solid-black` | Czarne tło, jasny tekst | Mocny kontrast, akcenty |
| `texture` | Tło z teksturą (obraz + połysk) | Kafelki premium / hero |

## Przykłady (zgodnie z obecnym układem)

### 1. Kafelek 2x2 (tylko tytuł + liczba)

```tsx
<Tile variant="solid-white" gridSize="2x2">
  <TileHeader>
    <TileNumber className="animate-gradient-x">03</TileNumber>
  </TileHeader>
  <TileContent>
    <TileTitle>Marketing Agencies</TileTitle>
  </TileContent>
</Tile>
```

### 2. Kafelek 4x2 (opis w prawym górnym rogu)

```tsx
<Tile variant="transparent" gridSize="4x2">
  <div className="flex justify-between items-start w-full">
    <div>
      <TileNumber className="animate-gradient-x">02</TileNumber>
    </div>
    <div className="pl-4 max-w-60 text-right">
      <TileDescription className="text-xs sm:text-sm text-balance">
        High-level targeted advertising attracts students and clients seeking professional education.
      </TileDescription>
    </div>
  </div>

  <TileContent>
    <TileTitle>Educational Consulting Services</TileTitle>
  </TileContent>
</Tile>
```

## Integracja z TinaCMS

Został przygotowany gotowy obiekt schematu w `tina/schemas/objects/tile.ts`. Możesz go użyć w definicji sekcji (np. w `tina/schemas/sections.ts`):

```typescript
// tina/schemas/sections.ts
import { tileFields } from "./objects/tile";

// W definicji pól sekcji:
{
  type: "object",
  name: "tiles",
  label: "Grid Tiles",
  list: true,
  fields: tileFields 
}
```

Pamiętaj, aby w komponencie pobierającym dane (np. `FeatureSection.tsx`) zmapować pola z Tiny na komponent:

```tsx
{data.tiles.map((tile, i) => (
  <Tile 
    key={i} 
    variant={tile.variant} 
    gridSize={tile.size}
    withNoise={tile.withNoise}
    style={tile.colStart && tile.rowStart ? {
      gridColumn: `${tile.colStart} / span ${tile.size === '4x2' ? 4 : 2}`,
      gridRow: `${tile.rowStart} / span 2`,
    } : undefined}
  >
    {tile.number && <TileNumber>{tile.number}</TileNumber>}
    <TileTitle>{tile.title}</TileTitle>
    {tile.description && <TileDescription>{tile.description}</TileDescription>}
  </Tile>
))}
```

## Układ treści (ważne zasady)

- **Kafelki 2x2:** tylko `number` + `title` (bez opisu).
- **Kafelki 4x2:** opis powinien być wyświetlany w **prawym górnym rogu**, liczba po lewej, tytuł na dole.
- W razie potrzeby specjalnego układu (np. opis w prawym górnym rogu), realizuj to w komponencie sekcji (np. `Statistics.tsx`).
