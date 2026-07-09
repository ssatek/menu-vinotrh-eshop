# CLAUDE.md — Enotéka znojemských vín — Digitální nápojový lístek

## O projektu
Jednostránkový digitální nápojový lístek pro **Enotéku znojemských vín** (Hradní ulice — areál pivovaru, Znojmo).
Stránka je určena k otevření **přes QR kód na mobilu** u stolu — proto je mobile-first, bez fotek, rychlá, s jednoduchou navigací mezi kategoriemi.

Design vychází ze **skutečné vizuální identity vinotrh.cz/enoteka** (ne z Wine Trucku): černá + krémová + olivově zelená paleta, wordmark font **Jost** (stejný jako logo VINOTRH), tělový font **Source Sans 3** (skutečný font webu vinotrh.cz). Zjištěno analýzou živého webu (Playwright — computed styles, screenshoty homepage i /enoteka), ne z předpokladu. Kruhový grape-cluster SVG mark v hlavičce odkazuje na kruhovou ikonu v „O" wordmarku VINOTRH.

## Stack
- Čisté HTML/CSS/JS — žádný framework, žádné build nástroje
- Fonty: **Jost** (display — nadpisy, navigace, ceny) + **Source Sans 3** (tělo) — Google Fonts
- Deploy: Vercel (auto-deploy z GitHub)

## Deploy & URL
- Produkční doména: **menu.vinotrh.cz** (zatím nenastaveno — DNS CNAME + Vercel doména potřeba doplnit)
- Workflow: `git push` → Vercel automaticky deployuje (stejný postup jako u `auto_vinotrh.eshop`)

## Spuštění
Otevřít `index.html` přímo v prohlížeči nebo přes live server:
```
npx live-server .
```

## Struktura
```
menu_vinotrh.eshop/
├── index.html                 # Jediná stránka — celý lístek
├── assets/
│   ├── css/style.css          # Styly, CSS proměnné (barvy, fonty)
│   ├── js/main.js             # Scroll-spy pro quick-nav (zvýraznění aktivní kategorie)
│   └── images/logo/vinotrh_logo.png
└── docs/
    └── napojovy-listek-zdroj-2026-05.pdf   # Zdrojový PDF lístek (květen 2026) — z něj vychází obsah
```
Pozn.: projekt vědomě nepoužívá `data/`/`output`/`src/` z obecné PARA konvence workspace — je to jednoduchý statický web nasazovaný na Vercel z kořene repozitáře, struktura kopíruje sesterský `auto_vinotrh.eshop`.

## Barevná paleta (z vinotrh.cz/enoteka — ne z Wine Trucku)
| Proměnná              | Hex       | Použití                                  |
|------------------------|-----------|--------------------------------------------|
| `--color-black`         | `#1E1F21` | Header, tmavé pozadí                      |
| `--color-black-soft`    | `#252729` | Footer (skutečná barva textu webu vinotrh.cz) |
| `--color-olive`         | `#8CA334` | Akcent (odpovídá „VINOS" slevovým štítkům) |
| `--color-olive-dark`    | `#6E8028` | Ceny, číslování kategorií                 |
| `--color-cream`         | `#F6F3EC` | Pozadí stránky (skutečná bg barva sekcí)  |
| `--color-cream-deep`    | `#EFEADD` | Zvýrazněná sekce Víno                     |

Zdroj hodnot: `getComputedStyle` extrakce ze živého webu (rgb(163,188,61) → olivová, rgb(246,243,236) → krémová, rgb(37,39,41) → černá/tmavý text).

## Obsah lístku — zdroj dat
Zdroj: `docs/napojovy-listek-zdroj-2026-05.pdf` (Enotéka kavárna, Nápojový lístek, květen 2026, zadní strana).
Kategorie a pořadí na stránce: Káva a čaj → Nealkoholické nápoje → Pivo → **Víno** (zvýrazněná sekce) → Destiláty, lihoviny, rumy → Drobné občerstvení → Lokální suroviny + alergeny.

**Při aktualizaci cen/položek:** uprav přímo `index.html` (sekce `<section class="menu-cat">`), žádný externí datový soubor se nepoužívá — obsah je staticky vepsaný do HTML.

## Kontaktní info na stránce
- Adresa: Hradní ulice — areál pivovaru, Znojmo
- Telefon: 702 203 232
- E-mail: enoteka@vinotrh.cz
- Web: vinotrh.cz/enoteka

## Poznámky k designu
- Mobile-first, žádné fotky (viz rozhodnutí uživatele — stránka slouží čistě jako QR menu).
- Hlavička napodobuje skutečnou brandovou dlaždici „ENOTÉKA znojemských vín" z homepage vinotrh.cz (velký bold uppercase wordmark + „znojemských vín" pod ním jako podtitulek).
- Sticky quick-nav s pilulkami kategorií nahoře — `assets/js/main.js` přes `IntersectionObserver` zvýrazňuje aktivní kategorii při scrollu (aktivní stav = černé pozadí, stejně jako CTA tlačítka na vinotrh.cz) a scrolluje pilulku do viewu.
- Sekce Víno má jemně odlišené pozadí (`--color-cream-deep`), protože víno je jádro identity Enotéky.
- Ceny odděleny od názvu tečkovanou linkou (`.menu-item__dots`) — klasický formát jídelního/nápojového lístku.
