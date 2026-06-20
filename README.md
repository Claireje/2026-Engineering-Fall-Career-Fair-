# Fall Engineering Career Fair 2026 — Website

This is the website for UMich's Fall Engineering Career Fair (Sep 15–16, 2026), hosted by SWE and TBP. We rebuilt it from scratch after migrating off Wix.

## Getting started

There's no build step or anything to install. Just open the files in a browser — but use a local server or the nav and footer won't load (they're fetched as separate HTML files at runtime).

```bash
# easiest way
python3 -m http.server 8000
```

Then go to `http://localhost:8000/homepage.html`.

## How the site is structured

Each page is its own HTML file with a page-specific CSS file in `/css`. The nav and footer live in `nav.html` and `footer.html` and get injected into every page via `js/main.js` — so if you need to update a nav link or add something to the footer, you only have to do it in one place.

The company listings on the homepage pull from a Google Sheet (published as CSV). The URL is at the top of `main.js`. To update the company list, just edit the spreadsheet — no code changes needed.

## Pages

- `homepage.html` — hero, company search + filter, event timeline
- `about-us.html` — about the fair, SWE/TBP info, directors + committee
- `student-guide.html` — student prep guide with PDF download
- `volunteer.html` — volunteering info and sign-up
- `career-fair-plus.html` — Career Fair Plus app
- `egl-coat-check.html` — EGL coat check
- `employer-faq.html` — FAQ for employers
- `receptions.html` — employer receptions
- `maps_fall engineering career fair.html` — floor maps

## Design

Colors: `#061929` (navy), `#FFC800` (yellow), `#FAF8F6` (off-white), `#04192A` (dark text)

Fonts: Crimson Text for headings, IBM Plex Mono for everything else. Both loaded from Google Fonts.

All the shared/global styles are in `css/homestyle.css`. Page-specific stuff goes in that page's own CSS file.

## Updating things

- **Company list** → edit the Google Sheet
- **Event dates or stats** → `homepage.html` hero + timeline sections, and the date objects in `highlightCurrentTimelineItem()` in `main.js`
- **Nav links** → `nav.html`
- **Footer** → `footer.html`
- **Directors or committee members** → `about-us.html` leadership section
- **Volunteer time slots** → `volunteer.html`

## Deployment

Push to `main` and it goes live. It's just static files so there's nothing to build.
