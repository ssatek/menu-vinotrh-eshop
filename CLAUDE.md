# CLAUDE.md — Enotéka znojemských vín — Digitální nápojový lístek

## O projektu
Jednostránkový digitální nápojový lístek pro **Enotéku znojemských vín** (Hradní ulice — areál pivovaru, Znojmo).
Stránka je určena k otevření **přes QR kód na mobilu** u stolu — proto je mobile-first, bez fotek, rychlá, s jednoduchou navigací mezi kategoriemi.

Design vychází ze **skutečné vizuální identity vinotrh.cz/enoteka** (ne z Wine Trucku): černá + krémová + olivově zelená paleta, tělový font **Source Sans 3** (skutečný font webu vinotrh.cz). Zjištěno analýzou živého webu (Playwright — computed styles, screenshoty homepage i /enoteka), ne z předpokladu. Kruhový grape-cluster SVG mark v hlavičce odkazuje na kruhovou ikonu v „O" loga Enotéky.

Hlavička používá **skutečné vektorové logo Enotéky** (ne textovou aproximaci fontem Jost) — viz sekce **Logo Enotéky** níže.

## Stack
- Čisté HTML/CSS/JS — žádný framework, žádné build nástroje
- Fonty: **Jost** (display — nadpisy, navigace, ceny) + **Source Sans 3** (tělo) — Google Fonts
- Deploy: Vercel (auto-deploy z GitHub)

## Deploy & URL
- GitHub: https://github.com/ssatek/menu-vinotrh-eshop
- Vercel: https://menuvinotrheshop.vercel.app
- Produkční doména: https://menu.vinotrh.cz — DNS propagováno (CNAME na Websupport), doména živá, SSL aktivní
- Workflow: `git push` → Vercel automaticky deployuje (GitHub repo propojen s Vercel projektem)
- **Vercel Web Analytics:** zapnuto (`npx vercel project web-analytics`), tracking script `/_vercel/insights/script.js` v `index.html` — ověřeno na produkci (200).

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
│   └── images/logo/
│       ├── vinotrh_logo.png     # Logo Vinotrh (patička)
│       └── enoteka-logo.png     # Logo Enotéky (hlavička) — viz sekce Logo Enotéky
└── docs/
    ├── napojovy-listek-zdroj-2026-05.pdf   # Zdrojový PDF lístek (květen 2026) — z něj vychází obsah
    ├── qr/
    │   ├── qr-menu-vinotrh.png   # QR kód → https://menu.vinotrh.cz (1200×1200, tisk)
    │   └── qr-menu-vinotrh.svg   # Stejný QR kód jako vektor
    ├── stolni-karticka-print.html   # Zdrojová šablona stolní kartičky (tisk)
    └── stolni-karticka.pdf          # Vygenerovaná stolní kartička A5 — tisk/odeslání do tiskárny
```

## QR kód
Vygenerován lokálně (`npx qrcode`, error correction H, barvy `#1E1F21` na bílé), ověřen dekódováním přes OpenCV — odpovídá přesně `https://menu.vinotrh.cz`. Pro regeneraci (např. po změně domény):
```
npx qrcode -o docs/qr/qr-menu-vinotrh.png -t png -e H -w 1200 -q 2 -d 1E1F21FF -l FFFFFFFF "https://menu.vinotrh.cz"
```

## Logo Enotéky
`assets/images/logo/enoteka-logo.png` — skutečný vektorový wordmark „ENOTÉKA znojemských vín" (kruhové „O", geometrický sans), použitý v hlavičce (`.menu-header__logo`) místo dřívější textové aproximace fontem Jost.

Zdroj: `Enotéka LOGO.pdf` (dodaný uživatelem, vektorové PDF). Extrahováno lokálně přes `pypdfium2` (Python) — vyrenderováno ve vysokém rozlišení (scale 8, ~4700×6700 px), ořízlé na obrys inkoustu a bílé pozadí převedené na alfa kanál (RGB inkoustu `#2A2A29` zachováno, alpha = inverzní luminozita). Výsledek: 3486×1137 px transparentní PNG.

V hlavičce (tmavé pozadí `--color-black`) se zobrazuje invertované na bílou přes `filter: brightness(0) invert(1)` — stejný trik jako logo Vinotrh v patičce (`.menu-footer__logo`). Pro regeneraci z PDF (např. při dodání nové verze loga):
```python
import pypdfium2 as pdfium
from PIL import Image
import numpy as np

pdf = pdfium.PdfDocument("cesta/k/logu.pdf")
page = pdf[0]
img = np.array(page.render(scale=8).to_pil().convert("RGB"))

gray = img.mean(axis=2)
mask = gray < 250
ys, xs = np.where(mask)
pad = 20
x0, x1 = max(xs.min()-pad, 0), min(xs.max()+pad, img.shape[1])
y0, y1 = max(ys.min()-pad, 0), min(ys.max()+pad, img.shape[0])
cropped = img[y0:y1, x0:x1]
gray_c = cropped.mean(axis=2)
ink_rgb = cropped[np.unravel_index(np.argmin(gray_c), gray_c.shape)]

alpha = np.clip((255 - gray_c), 0, 255)
alpha = (alpha / alpha.max() * 255).astype(np.uint8)
rgba = np.zeros((*gray_c.shape, 4), dtype=np.uint8)
rgba[..., :3] = ink_rgb
rgba[..., 3] = alpha
Image.fromarray(rgba, mode="RGBA").save("assets/images/logo/enoteka-logo.png")
```
Stolní kartička (`docs/stolni-karticka-print.html`) zatím používá starý textový wordmark (Jost Bold) — nebylo aktualizováno, na výměnu loga tam čeká samostatné zadání.

## Stolní kartička (table tent)
`docs/stolni-karticka.pdf` — QR kartička na stůl, formát A5 na výšku (148×210 mm), určená k **přeložení na půl vodorovně** — vznikne tak stojící „stan" o rozměru cca 148×105 mm, čitelný z obou stran. Horní panel je v normální orientaci, spodní panel je otočený o 180°, aby po přeložení četl správně z druhé strany. Přerušovaná olivová čára uprostřed = vodítko pro přeložení.

Obsah panelu: značka Vinotrh (kruhový grape mark), wordmark „ENOTÉKA znojemských vín", QR kód, „Naskenujte pro nápojový lístek", `menu.vinotrh.cz`, adresa.

Regenerace po úpravě `stolni-karticka-print.html` — Playwright (headless Chromium), ad-hoc skript (není součástí repa):
```js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('file:///' + path.resolve('docs/stolni-karticka-print.html').split(path.sep).join('/'), { waitUntil: 'networkidle' });
  await page.pdf({ path: 'docs/stolni-karticka.pdf', width: '148mm', height: '210mm', printBackground: true, margin: { top: '0', right: '0', bottom: '0', left: '0' } });
  await browser.close();
})();
```
Spuštění: `NODE_PATH="$(npm root -g)" node gen_pdf.js` (Playwright je nainstalovaný globálně).
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
- Hlavička nese skutečné logo Enotéky (viz sekce **Logo Enotéky**) — obrázek, ne textový nadpis, invertovaný na bílou pro tmavé pozadí.
- Sticky quick-nav s pilulkami kategorií nahoře — `assets/js/main.js` přes `IntersectionObserver` zvýrazňuje aktivní kategorii při scrollu (aktivní stav = černé pozadí, stejně jako CTA tlačítka na vinotrh.cz) a scrolluje pilulku do viewu.
- Sekce Víno má jemně odlišené pozadí (`--color-cream-deep`), protože víno je jádro identity Enotéky.
- Ceny odděleny od názvu tečkovanou linkou (`.menu-item__dots`) — klasický formát jídelního/nápojového lístku.
