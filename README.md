# Blended Family Devotional - 365 days

Bilingual (EN/ES) year-long devotional web app for blended families. Static site, mobile-first, deployable to GitHub Pages. Design follows `design-preview.html` (wine #5E1F2E, Caveat handwritten headlines, Georgia serif verses).

## Files

- `index.html` - app shell
- `styles.css` - wine brand styling, mobile-first, bottom tab bar
- `devotionals.js` - all 365 devotionals embedded (generated from `content/*.json`)
- `app.js` - day view, language toggle (ES / EN / Ambos), streaks, favorites, per-day notes journal, search, month grids, share-to-image card, Supabase magic-link auth with localStorage fallback
- `schema.sql` - run once in the Supabase dashboard (SQL Editor) to create `devotional_progress`, `devotional_favorites`, and `devotional_notes` with RLS
- `design-preview.html` - design direction mockup (reference only)
- `content/days-*.json` - source devotionals, 365 total in 12 themed months

## Months

1. Days 1-31: Foundations for the Blended Home / Fundamentos para el Hogar Ensamblado
2. Days 32-61: Love and Patience / Amor y Paciencia
3. Days 62-91: Grace for the Hard People / Gracia para las Personas Difíciles
4. Days 92-121: Unity as a Couple / Unidad como Pareja
5. Days 122-151: Mothers and Fathers in Blended Homes / Madres y Padres en Hogares Ensamblados
6. Days 152-181: The Kids' Hearts / El Corazón de los Hijos
7. Days 182-211: Rest and Rhythms / Descanso y Ritmos
8. Days 212-241: Discipline as a Team / Disciplina en Equipo
9. Days 242-271: New Mercies for New Seasons / Nuevas Misericordias para Nuevas Temporadas
10. Days 272-301: Gratitude / Gratitud
11. Days 302-331: Forgiveness / Perdón
12. Days 332-365: Hope and Traditions / Esperanza y Tradiciones

## What Pat needs to do

1. **Run `schema.sql`** in the Supabase dashboard (SQL Editor > New query > paste > Run) — only if she has not run it before. It only creates three new tables; it does not touch anything existing.
2. **If she already ran an earlier schema:** run `migration-journeys.sql` instead (same steps). It adds a `journey` column (mom / family) to all three tables so progress, favorites, and notes track separately per journey. Existing rows become mom's journey. (Do NOT run the old `migration-roles.sql`; the role idea was replaced by journeys.)
3. **Allow the site URL for magic-link redirects:** Supabase dashboard > Authentication > URL Configuration > add the GitHub Pages URL to Redirect URLs.
4. **Deploy:** push this folder to a GitHub repo and enable GitHub Pages (Settings > Pages > Deploy from branch).
5. **Test the login** with her own email before sharing the link.

## Two journeys

The app opens on **For me** (mom's personal reading, 365 days). The toggle at the top switches to **For family** (365 read-aloud devotionals for the whole family). Each journey has its own year of content, its own progress, streak, favorites, and notes. Switching journeys loads that year's content on demand. Works fully offline; one shared login syncs both journeys across phones, or skip the login entirely.

## Notes

- The devotional text is bundled in the app, so Supabase only stores tiny progress/favorite/note rows. Thousands of users fit on the free tier.
- The app works fully logged out (localStorage). Signing in syncs progress, favorites, and notes across devices.
- Notes are private per user (RLS).
- No brand name appears anywhere in the UI yet (neutral "Blended Family Devotional" title) until she chooses one.
- No em dashes anywhere in content or UI.
