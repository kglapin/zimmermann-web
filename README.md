# Ubezpieczenia Zimmermann

Strona główna multiagencji ubezpieczeniowej w Kaliszu i Krotoszynie, zbudowana w Astro.

## Uruchomienie

```bash
npm ci
npm run dev
```

Kontrola przed publikacją:

```bash
npm test
```

Polecenie uruchamia walidator struktury oraz produkcyjny build Astro.

## Struktura

```text
src/
├── components/        # sekcje i elementy strony
├── data/site.ts       # oferta, biura, FAQ, opinie i dane firmy
├── layouts/Layout.astro
├── pages/
│   ├── index.astro
│   └── polityka-prywatnosci.astro
└── styles/global.css  # jeden skonsolidowany system CSS
public/
└── site.js            # menu, FAQ, zakładki, animacje, mapy i formularz
api/
└── contact.js         # funkcja serwerowa formularza dla Vercel
```

## Formularz kontaktowy

Endpoint `/api/contact` wysyła wiadomości przez Resend. W projekcie Vercel trzeba dodać:

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

Adres nadawcy musi należeć do domeny zweryfikowanej w Resend. Gdy endpoint lub konfiguracja poczty są niedostępne, formularz automatycznie przechodzi do trybu awaryjnego: na telefonie przygotowuje SMS, a na komputerze kopiuje treść zgłoszenia.

## SEO

Ustaw `PUBLIC_SITE_URL` na docelowy adres strony. Zmienna jest używana do generowania:

- canonical URL,
- Open Graph,
- Twitter Cards,
- danych strukturalnych `InsuranceAgency`.

Przykład znajduje się w `.env.example`.

## Mapy

Mapy korzystają z Leaflet i OpenStreetMap. Współrzędne biur są zapisane statycznie w `src/data/site.ts`, dlatego strona nie wykonuje zapytań do publicznych usług geokodowania przy każdym wejściu.

## Automatyczna kontrola

Workflow `.github/workflows/quality.yml` uruchamia przy każdym pushu i pull requeście:

1. `npm ci`,
2. `npm run validate`,
3. `npm run build`.
