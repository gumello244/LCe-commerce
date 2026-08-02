# Storefront Guidelines & Design System

## Brand & Palette (Louise Castelatto)

Abaixo estão as cores oficiais da marca registradas para o storefront. Todas estão configuradas em `apps/storefront/tailwind.config.js` sob a chave `brand`.

### Logo & Identidade Principal (Louise Castelatto)
- **`brand-pink` / `bg-brand-pink` / `text-brand-pink`**: `#E88BA9` (Rosa característico da marca Louise)
- **`brand-teal` / `bg-brand-teal` / `text-brand-teal`**: `#52998F` (Verde petróleo/sálvia da marca Castelatto)
- **`brand-bg` / `bg-brand-bg`**: `#E1E8EB` (Off-white / Cinza gelo de fundo)

### Paleta de Cores Complementar (Verão / Tintas)
- **`brand-ronronar`**: `#84A999` (PPG1139-4 - Verde sálvia)
- **`brand-hortela`**: `#C8DCD3` (PPG1139-2 - Verde menta suave)
- **`brand-cubo-rosa`**: `#F7D4CE` (PPG1050-2 - Rosa blush / pêssego)
- **`brand-rosa-pink`**: `#EED7DF` (PPG1189-3 - Rosa bebê suave)
- **`brand-biscoito`**: `#D3B691` (PPG1087-5 - Bege / Nude areia)

## Uso no Tailwind

Para utilizar qualquer cor nos componentes React:
```tsx
<div className="bg-brand-teal text-white">
  <h1 className="text-brand-pink font-bold">Louise</h1>
  <p className="text-brand-biscoito">Castelatto</p>
</div>
```
