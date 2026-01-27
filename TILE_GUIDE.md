# Tile Component Guide (`src/components/ui/primitives/Tile.tsx`)

Komponent `Tile` to uniwersalny "kafelek" w stylu Apple/Bento grid, zaprojektowany do tworzenia nowoczesnych układów (np. sekcje Feature, Grid, Portfolio). Obsługuje różne warianty stylistyczne, rozmiary oraz teksturę "noise".

## Import

```tsx
import { 
  Tile, 
  TileNumber, 
  TileTitle, 
  TileDescription, 
  TileContent, 
  TileFooter 
} from '@/components/ui/primitives/Tile';
```

## Podstawowe użycie

Struktura kafelka jest zorientowana na `flex-col`. Używaj podkomponentów do zachowania spójnych odstępów i typografii.

```tsx
<Tile variant="solid-dark" size="md">
  <TileNumber>01</TileNumber>
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
| `variant` | `TitleVariant` | `'solid-dark'` | Styl kafelka (patrz tabela poniżej) |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Padding i zaokrąglenie rogów |
| `withNoise` | `boolean` | `false` | Dodaje subtelną teksturę szumu (grain) |
| `className` | `string` | `undefined` | Dodatkowe klasy Tailwind |

### Dostępne Warianty (`variant`)

| Wariant | Wygląd | Zastosowanie |
|---------|--------|--------------|
| `solid-dark` | Ciemne tło (brand-surface), jasny tekst | Główne kafelki informacyjne |
| `solid-light` | Białe tło, ciemny tekst | Kafelki wyróżniające się wysokim kontrastem |
| `glass` | Gradient (Pink -> Purple) + Blur | **Główne akcenty** (jak na ref "Marketing Agencies") |
| `glass-light` | Oszronione szkło (białe), lekko przezroczyste | Subtelne elementy tła lub nakładki |
| `outline` | Przezroczyste, tylko obrys | Elementy drugoplanowe |
| `gradient-dark` | Ciemny gradient (Surface -> Black) | Głębsze, "bogatsze" tło niż solid-dark |

## Przykłady (na podstawie referencji)

### 1. Różowy gradient ("Marketing Agencies")

Ten wariant używa kolorów `brand-accent` zdefiniowanych w `tailwind.config.js`.

```tsx
<Tile variant="glass" size="lg" withNoise>
  <TileNumber>03</TileNumber>
  <TileContent className="mt-8">
    <TileTitle>Marketing Agencies</TileTitle>
  </TileContent>
</Tile>
```

### 2. Biały kafelek ("Small Business")

```tsx
<Tile variant="solid-light" size="md">
  <TileNumber className="text-brand-accent">01</TileNumber>
  <TileContent>
    <TileTitle>Small and Medium-Sized Businesses</TileTitle>
  </TileContent>
</Tile>
```

### 3. Ciemny kafelek ("Corporate Clients")

```tsx
<Tile variant="solid-dark" size="md" className="hover:border-brand-accent/50">
  <TileNumber>05</TileNumber>
  <TileContent>
    <TileTitle>Corporate Clients</TileTitle>
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
    withNoise={tile.withNoise}
  >
    {tile.number && <TileNumber>{tile.number}</TileNumber>}
    <TileTitle>{tile.title}</TileTitle>
    <TileDescription>{tile.description}</TileDescription>
  </Tile>
))}
```
