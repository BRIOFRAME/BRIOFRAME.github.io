/*!
 * BRIOFRAME · SOLARA Private Villas Master · BF-SOLARA-PV-M1 · v1.1.0
 * Original publisher: BRIOFRAME. See LICENSE.md and BRIOFRAME-PROVENANCE.json.
 *
 * SITE CONFIGURATION — edit this file to rebrand the site.
 * Any element with data-bind="brand.email" (etc.) is filled from these values,
 * and data-bind-href="tel" / "mailto" / "whatsapp" builds the matching link.
 */
window.SOLARA_CONFIG = {
  brand: {
    name: "SOLARA",
    full: "SOLARA Private Villas",
    tagline: "Private villas, quietly extraordinary.",
    email: "reserve@solara-villas.example",
    ownersEmail: "owners@solara-villas.example",
    phone: "+44 20 7946 0180",
    whatsapp: "+44 7700 900180",
    address: "14 Albemarle Street, London W1S 4HW",
    hours: "Reservations 08:00–20:00 UK · Concierge 24 hours"
  },
  currency: { symbol: "$", code: "USD", locale: "en-US" },

  /*
   * FORMS
   * mode "demo"  — validates and shows the success state without sending anything.
   * mode "live"  — POSTs JSON to `endpoint` (your CRM, email service, or serverless function).
   * When you set an endpoint on another origin, add it to connect-src in each page's
   * Content-Security-Policy meta tag (and to your host's security headers).
   */
  forms: { mode: "demo", endpoint: "", timeoutMs: 12000 },

  /*
   * BOOKING / AVAILABILITY
   * No live calendar is included. Plug a provider in via window.SOLARA_HOOKS.availability
   * (see README.md → Extension points). Until then every request is an enquiry.
   */
  booking: { provider: null },

  /*
   * MEDIA — home hero motion.
   * The hero plays a short muted film (heroVideo) on screens 700px and wider, and crossfades
   * its still photographs every `heroInterval` seconds everywhere else. Neither moves under
   * prefers-reduced-motion or Save-Data; the stills are always the fallback.
   * src: 1920×1080 MP4 · srcCompact: 1280×720 MP4 used below 1280px wide · poster: still.
   * No film is bundled in this edition, so the hero crossfades its stills on every screen.
   * To add a film, export your own footage (H.264, no audio, under 8 MB) to assets/video/ and set
   * the three paths below, e.g. "assets/video/hero-1080.mp4". Leave them "" for stills only. Paths are relative to the site root. Video from another origin
   * needs a media-src entry in the Content-Security-Policy.
   */
  media: {
    heroInterval: 5.5,
    heroVideo: {
      src: "",
      srcCompact: "",
      poster: ""
    }
  },

  /*
   * GUEST PORTAL (my-stay/index.html)
   * mode "demo" — signs in with the demo reference and shows sample data from data.js.
   * mode "live" — requires window.SOLARA_PORTAL_ADAPTER, supplied by your own backend
   * integration (see README.md → Guest portal). BRIOFRAME does not provide a backend.
   */
  portal: { mode: "demo" },

  /* ANALYTICS — events are pushed to window.dataLayer when enabled. */
  analytics: { enabled: false },

  /* Visible template attribution in the footer (licence-dependent). */
  attribution: true
};
