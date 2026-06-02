# Kantinen in Zürich

Interaktive React/Vite-App, die kuratierte Schul-Mensas in der Stadt Zürich mit Suchfunktion, Filtern, schematischer Karte, Favoriten und Links zu den offiziellen Menüplänen anzeigt.

## Entwicklung

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Datenmodell

Die Mensa-Daten liegen in `src/mensas.js`. Tagesmenüs ändern häufig; deshalb verlinkt die App bewusst auf die offiziellen Menüplan-Seiten oder PDF-Pläne der Schulen und Betreiber.
