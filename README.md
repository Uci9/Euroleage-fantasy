# EuroLeague Fantasy Balkan

Sajt za fantasy ligu, pravljen prvo za telefon jer ljudi dolaze sa Instagrama.

## Pokretanje

```bash
pnpm install
pnpm run dev
```

Otvara se na `http://localhost:5173`. Server sluša i na mreži, pa se adresa
`http://<ip-ovog-racunara>:5173` može otvoriti na telefonu koji je na istom
wifiju — jedini pošten način da se provjeri sajt pravljen za telefon.

## Gdje se šta mijenja

**`src/lib/content.ts`** — sav tekst sa sajta na jednom mjestu. Sve što piše
`TODO` čeka vaš tekst i na sajtu je označeno narandžastom crtom, da se vidi
šta još nije popunjeno. Logo ide u `public/logo.png`; dok ga nema, stoje
inicijali u istoj boji.

Ostalo se ne mora dirati da bi se sajt popunio sadržajem.

## Odakle podaci

Tabela i raspored idu direktno sa zvaničnog EuroLeague servisa, iz browsera.
Nema servera, nema baze, nema mjesečnog troška hostinga — sajt su samo fajlovi.
Tabela se računa iz odigranih utakmica, pa je prazna dok sezona ne počne i
popunjava se sama.

## Šta još nije riješeno

**Prijava se ne čuva nigdje.** Forma provjeri podatke i preda ih preko mejla
ili Instagrama, jer bez servera nema gdje da ih upiše. Za pravo čuvanje
prijava i naloge treba baza — recimo Supabase, koji ima besplatan nivo i ne
traži da se održava server.

**Reklame** se dodaju kad bude posjeta; mjesta za njih se lako ubace između
sekcija.
