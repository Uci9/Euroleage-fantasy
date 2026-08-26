# EL Fantasy Balkan

Sajt fantasy lige, pravljen prvo za telefon jer ljudi dolaze sa Instagrama.

## Pokretanje

```bash
pnpm install
pnpm run dev
```

Otvara se na `http://localhost:5173`. Server sluša i na mreži, pa se sa telefona
na istom wifiju otvara `http://<ip-racunara>:5173` — jedini pošten način da se
provjeri sajt pravljen za telefon.

## Gdje se šta mijenja

**`src/lib/content.ts`** — sav tekst na jednom mjestu. Sve što piše `TODO` čeka
vaš podatak i na sajtu je označeno narandžastom crtom, da se vidi šta fali:
kotizacija, broj mjesta, pravila, nagrade, Instagram, Viber i mejl.

Logo je `public/logo.jpg` (i `logo-small.jpg` za zaglavlje).

## Ekrani

Bočni meni: Početna, Kako funkcioniše, Pravila, Live rezultati, Kalendar,
EuroLeague tabela, Ko smo mi, Prijavi se. Donja traka drži pet najkorišćenijih.

Statistika igrača, statistika timova i novosti namjerno nisu tu.

## Odakle podaci

Kalendar, live rezultati i tabela idu direktno sa zvaničnog EuroLeague servisa,
iz browsera. Nema servera, nema baze, nema mjesečnog troška — sajt su samo
fajlovi. Raspored se dohvata jednom i dijeli između ekrana.

Tabela se računa iz odigranih utakmica, pa je prazna dok sezona ne počne i
popunjava se sama. Live je utakmica koja je počela a nije završena.

## Šta još nije riješeno

**Prijava se ne čuva nigdje.** Forma provjeri podatke i preda ih preko mejla ili
Instagrama, jer bez servera nema gdje da ih upiše. Za prave naloge i listu
prijava treba baza — Supabase ima besplatan nivo i ne traži održavanje servera.

**Reklame** se dodaju kad bude posjeta; mjesta između sekcija su spremna.
