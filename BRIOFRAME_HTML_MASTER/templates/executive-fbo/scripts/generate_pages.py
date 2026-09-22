#!/usr/bin/env python3
"""Generate Executive FBO HTML family pages from Diffui build lYgauvXzh4a4."""
from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BUILD = "lYgauvXzh4a4"
BUILD_NOTE = (
    "BRIOFRAME HTML master · Executive FBO · Measured Leg Identity B · "
    f"Diffui authToken {BUILD} · Forms are simulated · Not published"
)

HEAD = """<!doctype html>
<html lang="en" data-bf-template="executive-fbo" data-bf-identity="measured-leg" data-bf-auth="{build}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="{desc}">
  <title>{title} | BRIOFRAME Executive FBO</title>
  <link rel="icon" href="/assets/brand/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/components.css">
  <script src="js/main.js" defer></script>
</head>
<body class="bf-shell{body_class}">
  <p class="bf-master-note" role="note">{note}</p>
  <a class="skip-link" href="#main-content">Skip to main content</a>
"""

WING = '<img class="bf-brand__wing" src="assets/images/brand/wing.svg" alt="" width="28" height="28">'

HEADER = """
  <header class="bf-header{header_mod}">
    <div class="bf-container bf-header__inner">
      <a class="bf-brand" href="index.html" aria-label="BRIOFRAME home">
        {wing}
        <span class="bf-brand__text">BRIOFRAME</span>
      </a>
      <button type="button" class="bf-nav-toggle" data-bf-nav-toggle aria-expanded="false" aria-controls="site-nav">Menu</button>
      <nav id="site-nav" class="bf-nav" data-bf-nav data-open="false" aria-label="Primary">
        <ul class="bf-nav__list">
          <li class="bf-nav__item bf-nav__item--dropdown">
            <details>
              <summary class="bf-nav__summary">Services <span aria-hidden="true">▾</span></summary>
              <ul class="bf-nav__sub">
                <li><a href="services.html">Services overview</a></li>
                <li><a href="aircraft-arrival.html">Aircraft arrival</a></li>
                <li><a href="concierge.html">Concierge</a></li>
                <li><a href="passenger-services.html">Passenger services</a></li>
                <li><a href="crew-services.html">Crew services</a></li>
                <li><a href="ground-handling.html">Ground handling</a></li>
                <li><a href="fueling.html">Fueling</a></li>
                <li><a href="ground-transportation.html">Transportation</a></li>
                <li><a href="hangar-services.html">Hangar</a></li>
              </ul>
            </details>
          </li>
          <li><a class="bf-nav__link"{amenities_cur} href="hospitality-amenities.html">Amenities</a></li>
          <li><a class="bf-nav__link"{hangar_cur} href="hangar-services.html">Hangar</a></li>
          <li><a class="bf-nav__link"{contact_cur} href="contact.html">Contact</a></li>
        </ul>
        <a class="bf-btn bf-btn--gold" href="service-request.html">Service Request <span class="bf-btn__icon" aria-hidden="true">→</span></a>
      </nav>
    </div>
  </header>
"""

TERMINAL_HEADER = """
  <header class="bf-header bf-header--editorial">
    <div class="bf-container bf-header__inner">
      <a class="bf-brand" href="private-terminal.html" aria-label="BRIOFRAME private terminal">
        <span class="bf-brand__text">BRIOFRAME</span>
      </a>
      <button type="button" class="bf-nav-toggle" data-bf-nav-toggle aria-expanded="false" aria-controls="site-nav">Menu</button>
      <nav id="site-nav" class="bf-nav" data-bf-nav data-open="false" aria-label="Primary">
        <ul class="bf-nav__list">
          <li><a class="bf-nav__link" href="#terminal-experience">Terminal Experience</a></li>
          <li><a class="bf-nav__link" href="#hospitality">Hospitality</a></li>
          <li><a class="bf-nav__link" href="#destinations">Destinations</a></li>
          <li><a class="bf-nav__link" href="#experience">Experience</a></li>
        </ul>
        <span class="bf-nav-divider" aria-hidden="true"></span>
        <a class="bf-text-cta" href="service-request.html">Service Request</a>
      </nav>
    </div>
  </header>
"""

FOOTER = """
  <footer class="bf-footer">
    <div class="bf-container bf-footer__inner">
      <div class="bf-footer__brand">
        {wing}
        <span>BRIOFRAME</span>
      </div>
      <nav class="bf-footer__nav" aria-label="Footer">
        <a href="services.html">Services</a>
        <a href="hospitality-amenities.html">Amenities</a>
        <a href="hangar-services.html">Hangar</a>
        <a href="contact.html">Contact</a>
        <a href="private-terminal.html">Private Terminal</a>
      </nav>
      <p class="bf-footer__copy">© 2026 BRIOFRAME. All rights reserved. Working demonstration — not a live FBO.</p>
    </div>
  </footer>
</body>
</html>
"""

JOURNEY_STRIP = """
    <nav class="bf-journey-strip" aria-label="Service journey">
      <a class="bf-journey-strip__item{a1}" href="aircraft-arrival.html"><span>01</span> Aircraft Arrival</a>
      <a class="bf-journey-strip__item{a2}" href="concierge.html"><span>02</span> Concierge</a>
      <a class="bf-journey-strip__item{a3}" href="passenger-services.html"><span>03</span> Passenger Services</a>
      <a class="bf-journey-strip__item{a4}" href="crew-services.html"><span>04</span> Crew Services</a>
      <a class="bf-journey-strip__item{a5}" href="ground-handling.html"><span>05</span> Ground Handling</a>
      <a class="bf-journey-strip__item{a6}" href="fueling.html"><span>06</span> Fueling</a>
      <a class="bf-journey-strip__item{a7}" href="hospitality-amenities.html"><span>07</span> Amenities</a>
      <a class="bf-journey-strip__item{a8}" href="ground-transportation.html"><span>08</span> Transportation</a>
      <a class="bf-journey-strip__item{a9}" href="hangar-services.html"><span>09</span> Hangar/Services</a>
    </nav>
"""

CTA_ARRIVAL = """
    <section class="bf-cta-band" aria-labelledby="cta-title">
      <div class="bf-container bf-cta-band__inner">
        <div class="bf-cta-band__mark" aria-hidden="true">{wing}</div>
        <div>
          <h2 id="cta-title" class="bf-heading-serif bf-cta-band__title">Let Us Know You're Arriving</h2>
          <p class="bf-cta-band__copy">Notify us of your arrival or request a service, and we'll take care of the rest.</p>
        </div>
        <a class="bf-btn bf-btn--gold" href="service-request.html">Service Request <span class="bf-btn__icon" aria-hidden="true">→</span></a>
      </div>
    </section>
"""

CTA_DARK = """
    <section class="bf-cta-band bf-cta-band--ink" aria-labelledby="cta-title">
      <div class="bf-container bf-cta-band__inner">
        <div class="bf-cta-band__mark" aria-hidden="true">{wing}</div>
        <div>
          <h2 id="cta-title" class="bf-heading-serif bf-cta-band__title">{title}</h2>
          <p class="bf-cta-band__copy">{copy}</p>
        </div>
        <a class="bf-btn bf-btn--gold" href="{href}">{btn} <span class="bf-btn__icon" aria-hidden="true">→</span></a>
      </div>
    </section>
"""

SERVICES = [
    ("01", "Aircraft Arrival", "aircraft-arrival.html", "assets/images/services/aircraft-arrival.webp",
     "Efficient arrivals with personalized ramp service, marshalling, and coordination."),
    ("02", "Concierge", "concierge.html", "assets/images/services/concierge-desk.webp",
     "Dedicated concierge support for travel, dining, transportation, and special requests."),
    ("03", "Passenger Services", "passenger-services.html", "assets/images/services/passenger-lounge.webp",
     "Comfortable lounges, private spaces, and personalized assistance for every traveler."),
    ("04", "Crew Services", "crew-services.html", "assets/images/services/crew-ops.webp",
     "Dedicated crew lounges, workspaces, and amenities designed for your team."),
    ("05", "Ground Handling", "ground-handling.html", "assets/images/services/ground-handling.webp",
     "Experienced ramp and line service professionals for safe, efficient aircraft handling."),
    ("06", "Fueling", "fueling.html", "assets/images/services/fueling.webp",
     "Quick, reliable fueling coordinated around your departure window with quality assurance."),
    ("07", "Amenities", "hospitality-amenities.html", "assets/images/services/amenities-dining.webp",
     "Refined amenities including gourmet dining, private lounges, showers, and more."),
    ("08", "Transportation", "ground-transportation.html", "assets/images/services/transport-suv.webp",
     "Ground transportation arrangements and on-site vehicles for your convenience."),
    ("09", "Hangar Services", "hangar-services.html", "assets/images/services/hangar.webp",
     "Short and long-term hangar options with full-service support."),
]


def header(active: str = "", overlay: bool = False) -> str:
    return HEADER.format(
        wing=WING,
        header_mod=" bf-header--overlay" if overlay else "",
        amenities_cur=' aria-current="page"' if active == "amenities" else "",
        hangar_cur=' aria-current="page"' if active == "hangar" else "",
        contact_cur=' aria-current="page"' if active == "contact" else "",
    )


def journey(active: int = 0) -> str:
    flags = {f"a{i}": " is-active" if i == active else "" for i in range(1, 10)}
    return JOURNEY_STRIP.format(**flags)


def head(title: str, desc: str, body_class: str = "") -> str:
    return HEAD.format(
        build=BUILD,
        title=title,
        desc=desc,
        note=BUILD_NOTE,
        body_class=body_class,
    )


def footer() -> str:
    return FOOTER.format(wing=WING)


def write(name: str, html: str) -> None:
    path = ROOT / name
    path.write_text(html, encoding="utf-8")
    print(f"wrote {path.relative_to(ROOT)} ({len(html)} bytes)")


def index_page() -> None:
    panels = [
        ("arrival", "Aircraft arrival coordination", "Share your ETA, tail number, and handling preferences so our team prepares ramp access, chocks, and a smooth path to the terminal.", "aircraft-arrival.html", "Open aircraft arrival page"),
        ("concierge", "Concierge support", "From dining to hotels and ground arrangements, concierge coordinates the details that keep your schedule composed.", "concierge.html", "Open concierge page"),
        ("passenger", "Passenger services", "Private lounge access, discreet escort to and from the aircraft, and thoughtful amenities for every guest.", "passenger-services.html", "Open passenger services"),
        ("crew", "Crew services", "Dedicated crew rest areas, briefing space, and coordination so turnaround stays on plan.", "crew-services.html", "Open crew services"),
        ("ground", "Ground handling", "Professional marshalling, baggage handling, and ramp safety with clear communication.", "ground-handling.html", "Open ground handling"),
        ("fueling", "Fueling", "Quality fuel services scheduled around your departure window, with documentation for your flight crew.", "fueling.html", "Open fueling"),
        ("amenities", "Terminal amenities", "Refined lounge spaces, refreshments, and business essentials between segments.", "hospitality-amenities.html", "Open amenities"),
        ("transport", "Ground transportation", "Chauffeured vehicles and local partners arranged to your schedule.", "ground-transportation.html", "Open transportation"),
        ("hangar", "Hangar & extended services", "Short- and long-term hangar options with coordinated support.", "hangar-services.html", "Open hangar services"),
    ]
    tab_labels = [
        ("arrival", "01", "Aircraft Arrival"),
        ("concierge", "02", "Concierge"),
        ("passenger", "03", "Passenger Services"),
        ("crew", "04", "Crew Services"),
        ("ground", "05", "Ground Handling"),
        ("fueling", "06", "Fueling"),
        ("amenities", "07", "Amenities"),
        ("transport", "08", "Transportation"),
        ("hangar", "09", "Hangar / Services"),
    ]
    tabs = []
    for i, (jid, num, label) in enumerate(tab_labels):
        sel = "true" if i == 0 else "false"
        tabix = "0" if i == 0 else "-1"
        tabs.append(
            f'<button type="button" class="bf-journey__tab" role="tab" id="tab-{jid}" data-bf-journey-tab data-journey-id="{jid}" aria-selected="{sel}" aria-controls="panel-{jid}" tabindex="{tabix}">'
            f'<span class="bf-journey__tab-num">{num}</span><span class="bf-journey__tab-label">{label}</span></button>'
        )
    panel_html = []
    for i, (jid, title, copy, href, cta) in enumerate(panels):
        hidden = "" if i == 0 else " hidden"
        panel_html.append(
            f'<div class="bf-journey__panel" id="panel-{jid}" role="tabpanel" aria-labelledby="tab-{jid}" data-bf-journey-panel data-journey-id="{jid}"{hidden}>'
            f'<div class="bf-journey__panel-grid">'
            f'<figure class="bf-journey__panel-media"><img src="assets/images/sections/lounge-hospitality.webp" alt="" width="1024" height="768" loading="lazy" decoding="async">'
            f'<figcaption class="bf-hospitality__visual-cap">Private Aviation / Hospitality / Excellence</figcaption></figure>'
            f'<div><p class="bf-eyebrow">Hospitality &amp; Amenities</p>'
            f'<h3 class="bf-heading-serif bf-journey__panel-title">{title}</h3>'
            f'<p class="bf-journey__panel-copy">{copy}</p>'
            f'<ul class="bf-amenity-list">'
            f'<li><span class="bf-amenity-list__icon" aria-hidden="true">◆</span><div><p class="bf-amenity-list__title">Private Lounge</p><p class="bf-amenity-list__desc">Quiet spaces for passengers and crew.</p></div></li>'
            f'<li><span class="bf-amenity-list__icon" aria-hidden="true">◆</span><div><p class="bf-amenity-list__title">Gourmet Dining</p><p class="bf-amenity-list__desc">Thoughtful catering coordinated to your schedule.</p></div></li>'
            f'<li><span class="bf-amenity-list__icon" aria-hidden="true">◆</span><div><p class="bf-amenity-list__title">Crew &amp; Passenger Rooms</p><p class="bf-amenity-list__desc">Rest and briefing spaces when you need them.</p></div></li>'
            f'<li><span class="bf-amenity-list__icon" aria-hidden="true">◆</span><div><p class="bf-amenity-list__title">Ground Transportation</p><p class="bf-amenity-list__desc">Vehicles arranged for onward connections.</p></div></li>'
            f'</ul>'
            f'<p class="bf-inline-cta"><a class="bf-btn bf-btn--ghost" href="{href}">{cta} →</a></p>'
            f'</div></div></div>'
        )

    html = head(
        "Executive FBO",
        "Premium executive FBO aviation services — effortless arrival, concierge, passenger and crew support, and ground handling.",
    )
    html += header(overlay=True)
    html += f"""
  <main id="main-content" class="bf-main">
    <section class="bf-hero" aria-labelledby="hero-title">
      <figure class="bf-hero__media">
        <img src="assets/images/heroes/home-fbo-arrival.webp" alt="Private jet arriving at the executive FBO at golden hour" width="2048" height="1152" fetchpriority="high" decoding="async">
      </figure>
      <div class="bf-hero__scrim" aria-hidden="true"></div>
      <div class="bf-hero__content">
        <h1 id="hero-title" class="bf-heading-serif">Effortless Arrival. Exceptional Service.</h1>
        <p class="bf-lede">From touchdown to takeoff, we ensure your arrival is seamless, refined and stress-free.</p>
        <div class="bf-hero__actions">
          <a class="bf-btn bf-btn--ink" href="service-request.html">Service Request <span class="bf-btn__icon" aria-hidden="true">→</span></a>
          <a class="bf-btn bf-btn--gold" href="arrival-notification.html">Arrival Notification <span class="bf-btn__icon" aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>

    <section id="journey" class="bf-journey" aria-labelledby="journey-heading" data-bf-journey>
      <h2 id="journey-heading" class="bf-sr-only">Service journey</h2>
      <div class="bf-journey__tabs" role="tablist" aria-label="FBO service journey">
        {''.join(tabs)}
      </div>
      <div class="bf-container">
        {''.join(panel_html)}
      </div>
    </section>

    <section class="bf-hospitality" aria-labelledby="hosp-title">
      <div class="bf-container bf-hospitality__grid">
        <figure class="bf-hospitality__visual">
          <img src="assets/images/sections/lounge-hospitality.webp" alt="Private terminal lounge overlooking the tarmac" width="1024" height="768" loading="lazy" decoding="async">
          <figcaption class="bf-hospitality__visual-cap">Private Aviation / Hospitality / Excellence</figcaption>
        </figure>
        <div>
          <p class="bf-eyebrow">Hospitality &amp; Amenities</p>
          <h2 id="hosp-title" class="bf-heading-serif" style="font-size:clamp(1.75rem,3.5vw,2.5rem);margin-bottom:1rem">A More Comfortable Way to Travel</h2>
          <p class="bf-lede">Refined spaces, exceptional dining, and thoughtful amenities designed around your comfort, privacy and schedule.</p>
          <ul class="bf-amenity-list">
            <li><span class="bf-amenity-list__icon" aria-hidden="true">◆</span><div><p class="bf-amenity-list__title">Private Lounge</p><p class="bf-amenity-list__desc">Quiet spaces away from the commercial terminal.</p></div></li>
            <li><span class="bf-amenity-list__icon" aria-hidden="true">◆</span><div><p class="bf-amenity-list__title">Gourmet Dining</p><p class="bf-amenity-list__desc">Catering and refreshments timed to your itinerary.</p></div></li>
            <li><span class="bf-amenity-list__icon" aria-hidden="true">◆</span><div><p class="bf-amenity-list__title">Crew &amp; Passenger Rooms</p><p class="bf-amenity-list__desc">Rest, showers, and briefing rooms as needed.</p></div></li>
            <li><span class="bf-amenity-list__icon" aria-hidden="true">◆</span><div><p class="bf-amenity-list__title">Ground Transportation</p><p class="bf-amenity-list__desc">Chauffeured connections arranged on request.</p></div></li>
          </ul>
        </div>
      </div>
    </section>

    {CTA_ARRIVAL.format(wing=WING)}
  </main>
"""
    html += footer()
    write("index.html", html)


def private_terminal() -> None:
    html = head(
        "Luxury Private Terminal",
        "Editorial private terminal hospitality — arrive into a different sense of time.",
        " bf-page--editorial",
    )
    html += TERMINAL_HEADER
    html += f"""
  <main id="main-content" class="bf-main">
    <section class="bf-editorial-hero" aria-labelledby="hero-title">
      <figure class="bf-editorial-hero__media">
        <img src="assets/images/heroes/private-terminal-interior.webp" alt="Luxury private terminal interior overlooking a private jet on the tarmac" width="2048" height="1152" fetchpriority="high" decoding="async">
      </figure>
      <div class="bf-container bf-editorial-hero__copy">
        <p class="bf-eyebrow">BRIOFRAME</p>
        <h1 id="hero-title" class="bf-heading-serif">Arrive into a different sense of time.</h1>
        <p class="bf-lede">Considered private terminal hospitality, where every detail is designed around you.</p>
        <a class="bf-text-cta bf-text-cta--line" href="service-request.html">Request a reservation</a>
      </div>
    </section>

    <section id="terminal-experience" class="bf-editorial-section" aria-labelledby="term-title">
      <div class="bf-container">
        <div class="bf-editorial-kicker"><span class="bf-rule" aria-hidden="true"></span><p class="bf-eyebrow">The Terminal Experience</p></div>
        <h2 id="term-title" class="bf-heading-serif bf-editorial-h2">More than a terminal.</h2>
        <div class="bf-editorial-split">
          <p class="bf-lede">Spacious interiors, quiet thresholds, and a measured pace from curb to aircraft — hospitality that never feels hurried.</p>
          <figure class="bf-editorial-figure">
            <img src="assets/images/sections/terminal-experience.webp" alt="Private terminal corridor with soft light" width="1024" height="768" loading="lazy" decoding="async">
          </figure>
        </div>
      </div>
    </section>

    <section id="hospitality" class="bf-editorial-section bf-editorial-section--alt" aria-labelledby="hosp-ed-title">
      <div class="bf-container bf-editorial-pair">
        <figure class="bf-editorial-figure">
          <img src="assets/images/sections/lounge-hospitality.webp" alt="Lounge seating with view to the ramp" width="1024" height="768" loading="lazy" decoding="async">
        </figure>
        <div>
          <p class="bf-eyebrow">Hospitality</p>
          <h2 id="hosp-ed-title" class="bf-heading-serif bf-editorial-h2">Warm rooms. Quiet attention.</h2>
          <p class="bf-lede">From arrival refreshments to overnight crew rest, every amenity is arranged with discretion and care.</p>
        </div>
      </div>
    </section>

    <section id="destinations" class="bf-editorial-section" aria-labelledby="dest-title">
      <div class="bf-container">
        <p class="bf-eyebrow">Destinations</p>
        <h2 id="dest-title" class="bf-heading-serif bf-editorial-h2">Wherever you land next.</h2>
        <p class="bf-lede">Ground transportation, hotel partners, and onward flight coordination — connected without noise.</p>
      </div>
    </section>

    <section id="experience" class="bf-editorial-section bf-editorial-section--alt" aria-labelledby="exp-title">
      <div class="bf-container bf-editorial-pair bf-editorial-pair--reverse">
        <div>
          <p class="bf-eyebrow">Passenger &amp; Crew Experience</p>
          <h2 id="exp-title" class="bf-heading-serif bf-editorial-h2">Two paths. One standard.</h2>
          <p class="bf-lede">Passengers move through refined lounges; crews have dedicated briefing and rest spaces — both held to the same quiet excellence.</p>
          <a class="bf-text-cta bf-text-cta--line" href="service-request.html">Request a reservation</a>
        </div>
        <figure class="bf-editorial-figure">
          <img src="assets/images/services/passenger-lounge.webp" alt="Premium passenger lounge seating" width="768" height="512" loading="lazy" decoding="async">
        </figure>
      </div>
    </section>

    {CTA_ARRIVAL.format(wing=WING)}
  </main>
"""
    html += footer()
    write("private-terminal.html", html)


def services_page() -> None:
    cards = []
    for num, title, href, img, copy in SERVICES:
        cards.append(
            f'<article class="bf-service-card">'
            f'<a class="bf-service-card__media" href="{href}"><img src="{img}" alt="" width="768" height="512" loading="lazy" decoding="async"></a>'
            f'<p class="bf-service-card__num">{num}</p>'
            f'<h3 class="bf-heading-serif bf-service-card__title"><a href="{href}">{title}</a></h3>'
            f'<p class="bf-service-card__copy">{copy}</p>'
            f'<a class="bf-text-cta" href="{href}">Learn More <span aria-hidden="true">→</span></a>'
            f'</article>'
        )
    html = head("Services Overview", "Comprehensive FBO services for a seamless journey — arrival through hangar support.")
    html += header()
    html += f"""
  <main id="main-content" class="bf-main">
    <section class="bf-page-hero bf-page-hero--photo" aria-labelledby="page-title">
      <figure class="bf-page-hero__bg"><img src="assets/images/heroes/home-fbo-arrival.webp" alt="" width="2048" height="1152" fetchpriority="high" decoding="async"></figure>
      <div class="bf-page-hero__scrim" aria-hidden="true"></div>
      <div class="bf-container bf-page-hero__content">
        <p class="bf-eyebrow bf-eyebrow--on-dark">Our Services</p>
        <h1 id="page-title" class="bf-heading-serif">Comprehensive FBO Services for a Seamless Journey</h1>
        <p class="bf-lede">From arrival to departure and everything in between, BRIOFRAME delivers an elevated FBO experience with personalized service, precision, and care.</p>
      </div>
    </section>
    <section class="bf-section" aria-labelledby="grid-title">
      <div class="bf-container">
        <h2 id="grid-title" class="bf-sr-only">All services</h2>
        <div class="bf-service-grid">{''.join(cards)}</div>
      </div>
    </section>
    {CTA_DARK.format(wing=WING, title="Ready to Experience the BRIOFRAME Difference?", copy="Let our team take care of the details so you can focus on where you're going next.", href="service-request.html", btn="Request a Service")}
  </main>
"""
    html += footer()
    write("services.html", html)


def service_detail(
    filename: str,
    title: str,
    eyebrow: str,
    headline: str,
    lede: str,
    desc: str,
    active_journey: int,
    hero_img: str,
    steps: list[tuple[str, str, str]],
    aside_title: str,
    aside_copy: str,
    nav_active: str = "",
) -> None:
    step_html = []
    for i, (stitle, scopy, icon) in enumerate(steps, 1):
        step_html.append(
            f'<li class="bf-steps__item"><span class="bf-steps__num">{i:02d}</span>'
            f'<span class="bf-steps__icon" aria-hidden="true">{icon}</span>'
            f'<h3 class="bf-steps__title">{stitle}</h3><p class="bf-steps__copy">{scopy}</p></li>'
        )
    html = head(title, desc)
    html += header(active=nav_active, overlay=True)
    html += f"""
  <main id="main-content" class="bf-main">
    <section class="bf-hero bf-hero--page" aria-labelledby="hero-title">
      <figure class="bf-hero__media">
        <img src="{hero_img}" alt="" width="2048" height="1152" fetchpriority="high" decoding="async">
      </figure>
      <div class="bf-hero__scrim" aria-hidden="true"></div>
      <div class="bf-hero__content">
        <nav class="bf-breadcrumb bf-breadcrumb--on-dark" aria-label="Breadcrumb">
          <ol><li><a href="index.html">Home</a></li><li><a href="services.html">Services</a></li><li aria-current="page">{title}</li></ol>
        </nav>
        <p class="bf-eyebrow bf-eyebrow--on-dark">{eyebrow}</p>
        <h1 id="hero-title" class="bf-heading-serif">{headline}</h1>
        <p class="bf-lede">{lede}</p>
        <div class="bf-hero__actions">
          <a class="bf-btn bf-btn--ink" href="service-request.html">Service Request <span class="bf-btn__icon" aria-hidden="true">→</span></a>
          <a class="bf-btn bf-btn--gold" href="arrival-notification.html">Arrival Notification <span class="bf-btn__icon" aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>
    {journey(active_journey)}
    <section class="bf-section" aria-labelledby="journey-title">
      <div class="bf-container">
        <div class="bf-section__head bf-section__head--split">
          <div>
            <p class="bf-eyebrow">Our Service Journey</p>
            <h2 id="journey-title" class="bf-heading-serif" style="font-size:clamp(1.6rem,3vw,2.25rem)">A Seamless Experience</h2>
          </div>
          <p class="bf-lede">{aside_copy}</p>
        </div>
        <ol class="bf-steps">{''.join(step_html)}</ol>
      </div>
    </section>
    <section class="bf-hospitality" aria-labelledby="aside-title">
      <div class="bf-container bf-hospitality__grid">
        <figure class="bf-hospitality__visual">
          <img src="assets/images/sections/lounge-hospitality.webp" alt="" width="1024" height="768" loading="lazy" decoding="async">
          <figcaption class="bf-hospitality__visual-cap">Private Aviation · Hospitality · Excellence</figcaption>
        </figure>
        <div>
          <p class="bf-eyebrow">Beyond Arrival</p>
          <h2 id="aside-title" class="bf-heading-serif" style="font-size:clamp(1.6rem,3vw,2.25rem);margin-bottom:1rem">{aside_title}</h2>
          <p class="bf-lede">{aside_copy}</p>
          <div class="bf-hero__actions" style="margin-top:1.5rem">
            <a class="bf-btn bf-btn--gold" href="service-request.html">Service Request →</a>
            <a class="bf-btn bf-btn--ghost" href="arrival-notification.html">Arrival Notification →</a>
          </div>
        </div>
      </div>
    </section>
    {CTA_DARK.format(wing=WING, title="Let Us Know You're Arriving", copy="Notify us of your arrival or request a service, and we'll take care of the rest.", href="service-request.html", btn="Service Request")}
  </main>
"""
    html += footer()
    write(filename, html)


def concierge_page() -> None:
    items = [
        ("Dining Reservations", "Preferred tables timed to your itinerary."),
        ("Travel Arrangements", "Hotels, transfers, and schedule changes."),
        ("Special Requests", "Thoughtful details for guests and crew."),
        ("Tickets & Events", "Access arranged with discretion."),
        ("Local Transportation", "Chauffeured vehicles on call."),
        ("Shopping & Deliveries", "Last-minute needs handled quietly."),
    ]
    grid = "".join(
        f'<li><span class="bf-icon-tile" aria-hidden="true">◆</span><div><p class="bf-icon-tile__title">{t}</p><p class="bf-icon-tile__copy">{c}</p></div></li>'
        for t, c in items
    )
    html = head("Concierge Services", "Curated concierge support for dining, travel, transportation, and special requests.")
    html += header(overlay=True)
    html += f"""
  <main id="main-content" class="bf-main">
    <section class="bf-hero bf-hero--page" aria-labelledby="hero-title">
      <figure class="bf-hero__media">
        <img src="assets/images/services/concierge-desk.webp" alt="Concierge reception at the private terminal" width="768" height="512" fetchpriority="high" decoding="async">
      </figure>
      <div class="bf-hero__scrim" aria-hidden="true"></div>
      <div class="bf-hero__content">
        <p class="bf-eyebrow bf-eyebrow--on-dark">Concierge Services</p>
        <h1 id="hero-title" class="bf-heading-serif">Beyond the Expected. Always at Your Service.</h1>
        <p class="bf-lede">Anticipating needs before they arise — creating seamless journeys for every arrival and departure.</p>
        <a class="bf-btn bf-btn--gold" href="service-request.html">Request Concierge Service <span class="bf-btn__icon" aria-hidden="true">→</span></a>
      </div>
    </section>
    {journey(2)}
    <section class="bf-section" aria-labelledby="curated-title">
      <div class="bf-container bf-split-intro">
        <div>
          <div class="bf-editorial-kicker"><p class="bf-eyebrow">Personalized Attention</p><span class="bf-rule" aria-hidden="true"></span></div>
          <h2 id="curated-title" class="bf-heading-serif bf-editorial-h2">Curated Support for Every Journey.</h2>
          <p class="bf-lede">Whether traveling for business or leisure, our concierge team provides personalized assistance tailored to your preferences.</p>
        </div>
        <ul class="bf-icon-grid">{grid}</ul>
      </div>
    </section>
    <section class="bf-hospitality" aria-labelledby="mem-title">
      <div class="bf-container bf-hospitality__grid">
        <figure class="bf-hospitality__visual">
          <img src="assets/images/sections/lounge-hospitality.webp" alt="" width="1024" height="768" loading="lazy" decoding="async">
        </figure>
        <div>
          <div class="bf-editorial-kicker"><p class="bf-eyebrow">At Your Fingertips</p><span class="bf-rule" aria-hidden="true"></span></div>
          <h2 id="mem-title" class="bf-heading-serif bf-editorial-h2">A More Memorable Destination Awaits.</h2>
          <p class="bf-lede">Our concierge team is dedicated to making every stop more considered — from dining to onward plans.</p>
          <div class="bf-callout">
            {WING}
            <h3 class="bf-heading-serif">Ready to Experience the Difference?</h3>
            <a class="bf-btn bf-btn--gold" href="service-request.html">Request Concierge Service →</a>
            <p class="bf-form__note">Available to assist with your journey — demo form only.</p>
          </div>
        </div>
      </div>
    </section>
  </main>
"""
    html += footer()
    write("concierge.html", html)


def form_service_request() -> None:
    html = head("Service Request", "Tell us about your upcoming arrival or service needs — simulated demo form.")
    html += header()
    html += f"""
  <main id="main-content" class="bf-main">
    <section class="bf-page-hero bf-page-hero--photo bf-page-hero--short" aria-labelledby="page-title">
      <figure class="bf-page-hero__bg"><img src="assets/images/heroes/service-request.webp" alt="" width="2048" height="1152" fetchpriority="high" decoding="async"></figure>
      <div class="bf-page-hero__scrim" aria-hidden="true"></div>
      <div class="bf-container bf-page-hero__content">
        <nav class="bf-breadcrumb bf-breadcrumb--on-dark" aria-label="Breadcrumb"><ol><li><a href="index.html">Home</a></li><li aria-current="page">Service Request</li></ol></nav>
        <h1 id="page-title" class="bf-heading-serif">Request a Service</h1>
        <p class="bf-lede">Tell us about your upcoming arrival or service needs and we'll take care of the rest.</p>
      </div>
    </section>
    <section class="bf-section">
      <div class="bf-container bf-form-layout">
        <div>
          <div class="bf-form-head">
            <h2 class="bf-heading-serif">Service Request Form</h2>
            <p class="bf-form__note">* Required field · Simulated demo — nothing is transmitted.</p>
          </div>
          <form class="bf-form bf-form--grid" data-bf-demo-form novalidate>
            <label>Request Type *<select name="request_type" required><option value="">Select a service</option><option>Aircraft Arrival</option><option>Concierge</option><option>Fueling</option><option>Hangar</option><option>Ground Handling</option><option>Other</option></select></label>
            <label>Aircraft Type<select name="aircraft"><option value="">e.g., Gulfstream G650</option><option>Light Jet</option><option>Midsize Jet</option><option>Heavy Jet</option><option>Turboprop</option></select></label>
            <label>Arrival Date *<input type="date" name="arrival_date" required></label>
            <label>Arrival Time (Local) *<input type="time" name="arrival_time" required></label>
            <label>Departure Date<input type="date" name="departure_date"></label>
            <label>Number of Passengers<input type="number" name="pax" min="0" placeholder="e.g., 6"></label>
            <label>Crew Members<input type="number" name="crew" min="0" placeholder="e.g., 2"></label>
            <label>Tail Number (Optional)<input type="text" name="tail" placeholder="e.g., N123AB" autocomplete="off"></label>
            <label class="bf-form__full">Additional Services<select name="additional"><option value="">Select additional services</option><option>Catering</option><option>Ground Transportation</option><option>Hangar Overnight</option><option>Customs Coordination</option></select></label>
            <label class="bf-form__full">Special Instructions<textarea name="notes" maxlength="500" data-bf-char-count placeholder="Let us know any special requests, preferences, or details."></textarea><span class="bf-char-count" data-bf-char-count-label>0 / 500</span></label>
            <label class="bf-form__check bf-form__full"><input type="checkbox" name="consent" required> I agree to be contacted regarding this request. Your information will be kept confidential and used only to fulfill your request.</label>
            <div class="bf-form__full">
              <button type="submit" class="bf-btn bf-btn--gold">Submit Request <span class="bf-btn__icon" aria-hidden="true">→</span></button>
              <p class="bf-form__status" data-bf-form-status hidden role="status"></p>
            </div>
          </form>
        </div>
        <aside class="bf-form-aside" aria-labelledby="aside-title">
          <p class="bf-eyebrow">Exceptional Service</p>
          <h2 id="aside-title" class="bf-heading-serif">Your Journey, Our Priority</h2>
          <p>Our dedicated team is ready to support every detail of your visit with calm, professional hospitality.</p>
          <ul class="bf-amenity-list">
            <li><span class="bf-amenity-list__icon" aria-hidden="true">⏱</span><div><p class="bf-amenity-list__title">Dedicated Support</p><p class="bf-amenity-list__desc">Our team coordinates around your schedule.</p></div></li>
            <li><span class="bf-amenity-list__icon" aria-hidden="true">◆</span><div><p class="bf-amenity-list__title">Personalized Service</p><p class="bf-amenity-list__desc">Tailored to your aircraft, crew and passengers.</p></div></li>
            <li><span class="bf-amenity-list__icon" aria-hidden="true">◇</span><div><p class="bf-amenity-list__title">Discreet &amp; Secure</p><p class="bf-amenity-list__desc">Your privacy is always protected.</p></div></li>
            <li><span class="bf-amenity-list__icon" aria-hidden="true">✦</span><div><p class="bf-amenity-list__title">A Seamless Experience</p><p class="bf-amenity-list__desc">From touchdown to takeoff.</p></div></li>
          </ul>
          <div class="bf-aside-contact">
            <p class="bf-eyebrow">Need Immediate Assistance?</p>
            <p class="bf-phone"><a href="tel:+18005550123">+1 (800) 555-0123</a></p>
            <p class="bf-form__note">Demo contact only · Available 24/7</p>
          </div>
        </aside>
      </div>
    </section>
  </main>
"""
    html += footer()
    write("service-request.html", html)


def form_arrival_notification() -> None:
    html = head("Arrival Notification", "Share your arrival details so we can prepare a seamless experience — simulated demo form.")
    html += header()
    html += f"""
  <main id="main-content" class="bf-main">
    <section class="bf-page-hero bf-page-hero--photo bf-page-hero--short" aria-labelledby="page-title">
      <figure class="bf-page-hero__bg"><img src="assets/images/heroes/home-fbo-arrival.webp" alt="" width="2048" height="1152" fetchpriority="high" decoding="async"></figure>
      <div class="bf-page-hero__scrim" aria-hidden="true"></div>
      <div class="bf-container bf-page-hero__content">
        <p class="bf-eyebrow bf-eyebrow--on-dark">Arrival Notification</p>
        <h1 id="page-title" class="bf-heading-serif">Let Us Know You're Arriving</h1>
        <p class="bf-lede">Share your arrival details and we'll prepare everything for a seamless, exceptional experience.</p>
      </div>
    </section>
    <div class="bf-container"><nav class="bf-breadcrumb" aria-label="Breadcrumb"><ol><li><a href="index.html">Home</a></li><li><a href="services.html">Services</a></li><li aria-current="page">Arrival Notification</li></ol></nav></div>
    <section class="bf-section">
      <div class="bf-container bf-form-layout">
        <div>
          <div class="bf-form-head">
            <div>
              <h2 class="bf-heading-serif">Arrival Information</h2>
              <p class="bf-lede">Please provide your flight details so we can prepare for your arrival.</p>
            </div>
            <p class="bf-form__note">Fields marked with * are required.</p>
          </div>
          <form class="bf-form bf-form--grid" data-bf-demo-form novalidate>
            <label>Aircraft Registration *<input type="text" name="registration" required placeholder="e.g. N123AB" autocomplete="off"></label>
            <label>Flight Number<input type="text" name="flight" placeholder="e.g. DAL123 (if applicable)" autocomplete="off"></label>
            <label>Estimated Arrival Date *<input type="date" name="eta_date" required></label>
            <label>Estimated Arrival Time (Local) *<input type="time" name="eta_time" required></label>
            <label>Origin Airport *<input type="text" name="origin" required placeholder="e.g. KJFK" autocomplete="off"></label>
            <label>Number of Passengers *<select name="pax" required><option value="">Select number</option>{''.join(f'<option>{n}</option>' for n in range(1, 17))}</select></label>
            <label class="bf-form__full">Special Requests<textarea name="notes" maxlength="500" data-bf-char-count placeholder="e.g. catering preferences, ground transportation, accessibility needs, etc."></textarea><span class="bf-char-count" data-bf-char-count-label>0 / 500</span></label>
            <label class="bf-form__check bf-form__full"><input type="checkbox" name="consent" required> I consent to the processing of this information to facilitate my arrival and related services.</label>
            <div class="bf-form__full">
              <button type="submit" class="bf-btn bf-btn--gold">Submit Arrival Notification <span class="bf-btn__icon" aria-hidden="true">→</span></button>
              <p class="bf-form__status" data-bf-form-status hidden role="status"></p>
            </div>
          </form>
        </div>
        <aside class="bf-form-aside" aria-labelledby="next-title">
          <h2 id="next-title" class="bf-heading-serif">What Happens Next?</h2>
          <ul class="bf-amenity-list">
            <li><span class="bf-amenity-list__icon" aria-hidden="true">✉</span><div><p class="bf-amenity-list__title">Confirmation</p><p class="bf-amenity-list__desc">You'll receive an email confirmation shortly after submission.</p></div></li>
            <li><span class="bf-amenity-list__icon" aria-hidden="true">☎</span><div><p class="bf-amenity-list__title">Our Team Prepares</p><p class="bf-amenity-list__desc">We coordinate with ramp and your requested services.</p></div></li>
            <li><span class="bf-amenity-list__icon" aria-hidden="true">✦</span><div><p class="bf-amenity-list__title">A Seamless Arrival</p><p class="bf-amenity-list__desc">Every detail taken care of before you land.</p></div></li>
          </ul>
          <div class="bf-aside-contact">
            <p class="bf-eyebrow">Need Immediate Assistance?</p>
            <p>For urgent requests or last-minute changes, contact our operations team directly.</p>
            <p class="bf-phone"><a href="tel:+15551234567">+1 (555) 123-4567</a></p>
            <p><a href="mailto:ops@brioframe.example">ops@brioframe.example</a></p>
          </div>
        </aside>
      </div>
    </section>
    {CTA_DARK.format(wing=WING, title="Exceptional Journeys Begin Here.", copy="From arrival to departure, we're here to make every moment effortless.", href="services.html", btn="View Our Services")}
  </main>
"""
    html += footer()
    write("arrival-notification.html", html)


def contact_page() -> None:
    html = head("Contact / FBO Information", "Contact BRIOFRAME Executive FBO — phone, email, address, and facility information.")
    html += header(active="contact", overlay=True)
    html += f"""
  <main id="main-content" class="bf-main">
    <section class="bf-hero bf-hero--page" aria-labelledby="hero-title">
      <figure class="bf-hero__media">
        <img src="assets/images/heroes/home-fbo-arrival.webp" alt="Executive FBO terminal at sunset" width="2048" height="1152" fetchpriority="high" decoding="async">
      </figure>
      <div class="bf-hero__scrim" aria-hidden="true"></div>
      <div class="bf-hero__content">
        <p class="bf-eyebrow bf-eyebrow--on-dark">Contact</p>
        <h1 id="hero-title" class="bf-heading-serif">We're Here for a Seamless Experience</h1>
        <p class="bf-lede">Whether you're planning an arrival, requesting a service, or learning more about our facilities, our team is ready to assist you.</p>
      </div>
    </section>
    <section class="bf-info-bar" aria-label="Contact quick information">
      <div class="bf-container bf-info-bar__grid">
        <div><p class="bf-eyebrow">Phone</p><p class="bf-info-bar__primary"><a href="tel:+15551234567">+1 (555) 123-4567</a></p><p class="bf-form__note">Available 24/7 · Demo</p></div>
        <div><p class="bf-eyebrow">Email</p><p class="bf-info-bar__primary"><a href="mailto:operations@brioframe.example">operations@brioframe.example</a></p><p class="bf-form__note">General inquiries &amp; service requests</p></div>
        <div><p class="bf-eyebrow">Address</p><p class="bf-info-bar__primary">5500 Executive Way, Skyport, CA 94035</p><p class="bf-form__note">BRIOFRAME Executive FBO · Skyport International (SKY)</p></div>
        <div><p class="bf-eyebrow">Hours</p><p class="bf-info-bar__primary">Open 24/7, 365 Days</p><p class="bf-form__note">Full FBO services around the clock</p></div>
      </div>
    </section>
    <section class="bf-section" aria-labelledby="fbo-title">
      <div class="bf-container bf-contact-grid">
        <div>
          <div class="bf-editorial-kicker"><p class="bf-eyebrow">FBO Information</p><span class="bf-rule" aria-hidden="true"></span></div>
          <h2 id="fbo-title" class="bf-heading-serif bf-editorial-h2">World-Class Facilities. Unmatched Support.</h2>
          <p class="bf-lede">A premier executive FBO experience spanning handling, hospitality, hangar, and ground connections.</p>
          <ul class="bf-amenity-list">
            <li><span class="bf-amenity-list__icon" aria-hidden="true">◆</span><div><p class="bf-amenity-list__title">Full-Service FBO</p><p class="bf-amenity-list__desc">Handling, concierge and ramp services</p></div></li>
            <li><span class="bf-amenity-list__icon" aria-hidden="true">◇</span><div><p class="bf-amenity-list__title">U.S. Customs &amp; Immigration</p><p class="bf-amenity-list__desc">On-site, by appointment</p></div></li>
            <li><span class="bf-amenity-list__icon" aria-hidden="true">▣</span><div><p class="bf-amenity-list__title">Executive Hangars</p><p class="bf-amenity-list__desc">Short and long-term options available</p></div></li>
            <li><span class="bf-amenity-list__icon" aria-hidden="true">▸</span><div><p class="bf-amenity-list__title">Luxury Ground Transportation</p><p class="bf-amenity-list__desc">Chauffeured vehicles and local partners</p></div></li>
          </ul>
          <a class="bf-btn bf-btn--gold" href="hospitality-amenities.html">View Our Amenities →</a>
        </div>
        <div class="bf-map" role="img" aria-label="Map placeholder for Skyport International Airport FBO location">
          <p class="bf-map__label">Skyport International Airport (SKY)</p>
          <p class="bf-map__pin">{WING}<span>BRIOFRAME Executive FBO</span></p>
          <p class="bf-form__note">Illustrative map for demonstration only</p>
        </div>
        <div>
          <p class="bf-eyebrow">Get Directions</p>
          <p class="bf-lede">Navigate to the executive ramp entrance using the Skyport FBO access road.</p>
          <a class="bf-btn bf-btn--ghost" href="https://maps.example.com" rel="noopener noreferrer">Open in Maps →</a>
          <h3 class="bf-heading-serif" style="font-size:1.25rem;margin:2rem 0 1rem">Frequently Contacted</h3>
          <ul class="bf-directory">
            <li><span>FBO Operations</span><a href="mailto:ops@brioframe.example">ops@brioframe.example</a></li>
            <li><span>Scheduling &amp; Reservations</span><a href="mailto:schedule@brioframe.example">schedule@brioframe.example</a></li>
            <li><span>Ground Transportation</span><a href="mailto:transport@brioframe.example">transport@brioframe.example</a></li>
            <li><span>General Inquiries</span><a href="mailto:hello@brioframe.example">hello@brioframe.example</a></li>
          </ul>
        </div>
      </div>
    </section>
    {CTA_DARK.format(wing=WING, title="Let Us Take Care of the Details", copy="Contact our team today and experience the BRIOFRAME difference.", href="service-request.html", btn="Service Request")}
  </main>
"""
    html += footer()
    write("contact.html", html)


def main() -> None:
    index_page()
    private_terminal()
    services_page()
    concierge_page()
    form_service_request()
    form_arrival_notification()
    contact_page()

    arrival_steps = [
        ("Arrival Coordination", "ETA, tail number, and handling preferences shared before touchdown.", "✈"),
        ("Ramp & Ground Handling", "Marshalling, parking, and secure ramp procedures.", "▣"),
        ("Passenger & Crew Arrival", "Discreet escort into the private terminal.", "◇"),
        ("Fueling & Service Coordination", "Requested services staged around your window.", "◆"),
        ("Onward Hospitality or Transport", "Lounge access and ground connections ready.", "▸"),
    ]
    service_detail(
        "aircraft-arrival.html",
        "Aircraft Arrival",
        "Aircraft Arrival",
        "Aircraft Arrival",
        "A seamless arrival sets the tone for everything that follows.",
        "Seamless aircraft arrival coordination — ramp, passenger, crew, fueling, and onward hospitality.",
        1,
        "assets/images/heroes/aircraft-arrival-marshalling.webp",
        arrival_steps,
        "More Than a Stop. A Higher Standard.",
        "We coordinate every detail so your arrival feels composed — whether landing for business or leisure.",
    )

    service_detail(
        "passenger-services.html", "Passenger Services", "Passenger Services",
        "Passenger Services", "Comfort, privacy, and quiet attention from curb to cabin.",
        "Passenger lounges, private spaces, and personalized assistance for every traveler.",
        3, "assets/images/services/passenger-lounge.webp",
        [
            ("Welcome & Escort", "Discreet meet-and-greet from aircraft to lounge.", "◇"),
            ("Lounge Access", "Refined spaces for work or rest between segments.", "◆"),
            ("Amenities", "Refreshments, showers, and business essentials.", "✦"),
            ("Departure Prep", "Smooth return to the aircraft when you're ready.", "✈"),
        ],
        "Designed Around Every Guest",
        "Thoughtful passenger hospitality without noise or rush.",
    )
    service_detail(
        "crew-services.html", "Crew Services", "Crew Services",
        "Crew Services", "Dedicated spaces and support so your crew stays sharp and rested.",
        "Crew lounges, workspaces, and amenities designed for flight teams.",
        4, "assets/images/services/crew-ops.webp",
        [
            ("Crew Lounge", "Quiet rest areas away from passenger spaces.", "◇"),
            ("Briefing Rooms", "Private rooms for planning and handoffs.", "▣"),
            ("Refresh & Reset", "Showers, snacks, and essentials between legs.", "◆"),
            ("Ops Coordination", "Clear communication with your operations team.", "☎"),
        ],
        "Support That Respects the Schedule",
        "Crew hospitality calibrated to turnaround and rest requirements.",
    )
    service_detail(
        "ground-handling.html", "Ground Handling", "Ground Handling",
        "Ground Handling", "Professional ramp and line service executed with consistent care.",
        "Experienced ramp professionals for safe, efficient aircraft handling.",
        5, "assets/images/services/ground-handling.webp",
        [
            ("Marshalling", "Clear guidance onto the spot.", "▸"),
            ("Baggage & Cargo", "Careful handling for every piece.", "▣"),
            ("Ramp Safety", "Procedures that protect aircraft and people.", "◇"),
            ("Turn Coordination", "Services timed to your departure.", "⏱"),
        ],
        "Precision on the Ramp",
        "Ground handling that feels invisible when everything goes right.",
    )
    service_detail(
        "fueling.html", "Fueling Services", "Fueling",
        "Fueling Services", "Reliable fueling coordinated around your departure window.",
        "Quality fuel services with documentation prepared for your flight crew.",
        6, "assets/images/services/fueling.webp",
        [
            ("Request & Confirm", "Fuel quantity and timing confirmed in advance.", "◆"),
            ("Quality Assurance", "Standards-focused fueling practices.", "◇"),
            ("On-Stand Service", "Coordinated with other ramp activity.", "▣"),
            ("Documentation", "Records ready for your crew.", "✉"),
        ],
        "Fuel Without Friction",
        "Fueling that respects your schedule and your aircraft.",
    )
    service_detail(
        "hospitality-amenities.html", "Hospitality & Amenities", "Amenities",
        "Hospitality & Amenities", "Refined spaces and thoughtful amenities for every stop.",
        "Private lounges, dining, showers, and hospitality amenities at the FBO.",
        7, "assets/images/services/amenities-dining.webp",
        [
            ("Private Lounges", "Calm rooms with views to the ramp.", "◇"),
            ("Dining", "Gourmet options timed to your itinerary.", "◆"),
            ("Rest & Refresh", "Showers and quiet rooms as needed.", "✦"),
            ("Business Essentials", "Wi-Fi, workspaces, and printing.", "▣"),
        ],
        "A More Comfortable Way to Travel",
        "Hospitality designed around comfort, privacy, and schedule.",
        "amenities",
    )
    service_detail(
        "ground-transportation.html", "Ground Transportation", "Transportation",
        "Ground Transportation", "Chauffeured vehicles and local partners arranged to your schedule.",
        "Ground transportation arrangements and on-site vehicles for executive travelers.",
        8, "assets/images/services/transport-suv.webp",
        [
            ("Vehicle Coordination", "SUVs and sedans staged for arrival or departure.", "▸"),
            ("Partner Network", "Trusted local chauffeured partners.", "◇"),
            ("Meet & Transfer", "Seamless curb-to-aircraft connections.", "◆"),
            ("Special Requests", "Child seats, accessibility, multi-stop plans.", "✦"),
        ],
        "The Next Leg, Already Arranged",
        "Transportation that meets you where the aircraft door opens.",
    )
    service_detail(
        "hangar-services.html", "Hangar & Extended Services", "Hangar",
        "Hangar & Extended Services", "Short- and long-term hangar options with full-service support.",
        "Executive hangar storage and extended FBO support services.",
        9, "assets/images/services/hangar.webp",
        [
            ("Hangar Placement", "Secure indoor storage options.", "▣"),
            ("Overnight & Long-Term", "Flexible stays for your aircraft.", "◇"),
            ("Extended Support", "Detailing coordination and owner requests.", "◆"),
            ("Access & Security", "Controlled hangar access for crew and owners.", "✦"),
        ],
        "Protected. Prepared. Ready.",
        "Hangar services that keep your aircraft ready for the next departure.",
        "hangar",
    )


if __name__ == "__main__":
    main()
