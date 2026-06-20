# Fall Engineering Career Fair 2026

Website for the UMich Fall Engineering Career Fair (Sep 15–16, 2026). We migrated off Wix and rebuilt everything from scratch.

## Running it

No install needed. The only gotcha is that the nav and footer are loaded via `fetch()`, so if you just double-click an HTML file it won't work. Run a local server instead:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/homepage.html`.

## Structure

Pretty straightforward — each page is its own HTML file with a matching CSS file in `/css`. The nav and footer are in `nav.html` / `footer.html` and get injected into every page by `main.js`, so you only need to edit them in one place.

The company list on the homepage comes from a Google Sheet (published as CSV). The link is at the top of `main.js`. You can update companies just by editing the spreadsheet, no code needed.

## Making changes

- **Nav or footer** → `nav.html` / `footer.html`
- **Company list** → the Google Sheet
- **Event dates** → update the hero in `homepage.html` and the date objects in `main.js` (`highlightCurrentTimelineItem`)
- **Directors / committee** → `about-us.html`
- **Volunteer shifts** → `volunteer.html`
- **Global styles** → `css/homestyle.css`

## Deploying

Just push to `main`. It's all static files so there's nothing to build.
