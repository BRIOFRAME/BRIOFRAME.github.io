/*!
 * BRIOFRAME · SOLARA Private Villas Master · BF-SOLARA-PV-M1 · v1.1.0
 *
 * CONTENT DATA — villas, destinations, experiences, events, wellness, journal,
 * testimonials and the guest-portal demo.
 * Every listing, filter, gallery, related-villa rail and form option is generated from
 * this file. Add a villa by copying one object in `villas` and changing its values.
 * Villa photographs: `images` is the full set (used by "All photographs"); entries with
 * `hero: true` fill the headline gallery, and `spaces[].image` / `suites[].image` place the
 * rest. A villa page never shows the same photograph twice.
 * Image values are slugs from assets/img/photo (e.g. "aurelia-01" → aurelia-01-1280.webp);
 * run the image tool in README.md after adding photography so images.js knows the sizes.
 * All brand, property and people names here are fictional demo content.
 */
window.SOLARA_DATA = {
  amenities: {
    "infinity-pool": "Infinity pool",
    "private-pool": "Private pool",
    "sea-view": "Sea view",
    "beach": "Beach or lagoon access",
    "chef": "Private chef",
    "staff": "Full-time staff",
    "spa": "Spa room",
    "gym": "Fitness room",
    "family": "Family-friendly",
    "events": "Events considered",
    "studio": "Work studio"
  },

  regions: ["Mediterranean", "Indian Ocean", "Southeast Asia"],

  /* Labels for villa `spaces[].type`. Only types a villa actually uses appear as filters. */
  spaceTypes: {
    arrival: "Arrival & grounds", living: "Living", dining: "Dining", kitchen: "Kitchen", bar: "Bar",
    pool: "Pool & terrace", spa: "Spa & wellness", fitness: "Fitness", studio: "Studio", bath: "Bathrooms"
  },

  /* Labels for villa `wellness.facilities`. */
  wellnessFacilities: {
    treatment: "Treatment room", therapists: "Resident therapists", yoga: "Yoga deck",
    fitness: "Fitness room", heat: "Hammam or sauna", pool: "Pool or plunge pool", visiting: "Visiting therapists"
  },

  destinations: [
    {
      id: "amalfi", name: "Amalfi Coast", country: "Italy", region: "Mediterranean", timezone: "Europe/Rome",
      image: "dest-amalfi-01",
      alt: "Pastel houses stacked above the harbour on the Amalfi Coast",
      around: [
        { src: "exp-sail", alt: "A sailing yacht under full sail on open blue water", place: "Out on the bay by private boat" },
        { src: "dest-amalfi-02", alt: "Ripe grapes on the vine in late-summer light", place: "Campania vineyards, inland from the coast" }
      ],
      line: "Lemon terraces, sea-cut cliffs and long lunches that turn into dinner.",
      intro: "The coast between Positano and Ravello rewards slowness: mornings on the terrace, afternoons by boat, evenings in a village piazza. Our villas sit above the road noise, with steps down to the water and staff who know which trattoria still cooks on wood.",
      bestMonths: [5, 6, 7, 8, 9, 10], shoulderMonths: [4, 11],
      access: "Naples (NAP) · 75 min by car, 40 min by boat",
      highlights: [
        { title: "Coast by private boat", text: "Positano, Amalfi and the Li Galli islets in a single unhurried day." },
        { title: "Ravello at dusk", text: "Villa gardens, cloister concerts and the long view to Salerno." },
        { title: "Campania vineyards", text: "Falanghina and Aglianico tastings in the hills above the coast." }
      ]
    },
    {
      id: "cyclades", name: "Cyclades", country: "Greece", region: "Mediterranean", timezone: "Europe/Athens",
      image: "dest-cyclades-01",
      alt: "White houses and blue domes of Oia on Santorini above the Aegean",
      around: [
        { src: "dest-cyclades-05", alt: "A blue-domed chapel and bell tower above the caldera", place: "Santorini caldera" },
        { src: "dest-cyclades-04", alt: "Waterfront tables beside whitewashed houses on Mykonos", place: "Little Venice, Mykonos town" },
        { src: "dest-cyclades-06", alt: "Blue domes and white houses stepping down to the sea at Oia", place: "Oia, Santorini" },
        { src: "dest-cyclades-02", alt: "Oia's clifftop houses lit at dusk above the caldera", place: "Oia at dusk" },
        { src: "dest-cyclades-03", alt: "Whitewashed steps leading down towards the Aegean", place: "Island lanes" }
      ],
      line: "Whitewashed calm, caldera light and the meltemi at dusk.",
      intro: "Santorini for the caldera and the sunsets; Mykonos for its beaches and a table that stays lively late. We keep a small number of homes on each island, chosen for privacy first — no shared terraces, no crowds at the door.",
      bestMonths: [5, 6, 7, 8, 9], shoulderMonths: [4, 10],
      access: "Santorini (JTR) · Mykonos (JMK) · direct seasonal flights",
      highlights: [
        { title: "Caldera sailing", text: "Hot springs, volcanic beaches and dinner on board as the sun drops." },
        { title: "Island-hopping by tender", text: "Delos, Rhenia and quiet coves out of reach from the road." },
        { title: "Assyrtiko at the source", text: "Old-vine tastings in Santorini's basket-trained vineyards." }
      ]
    },
    {
      id: "bali", name: "Bali", country: "Indonesia", region: "Southeast Asia", timezone: "Asia/Makassar",
      image: "dest-bali-01",
      alt: "Pura Ulun Danu Bratan temple on Lake Bratan with mountains behind",
      around: [
        { src: "dest-bali-07", alt: "Rice terraces below Mount Agung in early morning light", place: "East Bali highlands, towards Mount Agung" },
        { src: "dest-bali-05", alt: "The cliffs of Nusa Penida above a turquoise bay", place: "Nusa Penida, by boat from the south" },
        { src: "dest-bali-08", alt: "Terraced rice fields framed by coconut palms", place: "Rice-terrace valleys" },
        { src: "dest-bali-06", alt: "A traveller between the carved split gates of a Balinese temple", place: "Temple gates, East Bali" },
        { src: "dest-bali-03", alt: "A jungle river gorge lined with palms", place: "River valleys inland" }
      ],
      line: "Clifftop surf breaks, temple ceremonies and rice-terrace valleys.",
      intro: "Two very different Balis: the Bukit peninsula's cliffs and surf in the south, and the green highland valleys around Sidemen to the east. Villa staffing here is generous by tradition, and every stay begins with a blessing from the household.",
      bestMonths: [4, 5, 6, 7, 8, 9, 10], shoulderMonths: [3, 11],
      access: "Denpasar (DPS) · 35 min to Uluwatu, 90 min to Sidemen",
      highlights: [
        { title: "Temple at sunset", text: "Uluwatu's clifftop temple and the kecak fire dance at dusk." },
        { title: "Sidemen rice valleys", text: "Walks through working terraces with a village guide." },
        { title: "Ceremony and craft", text: "Private visits to weaving, silver and offering-making households." }
      ]
    },
    {
      id: "maldives", name: "Maldives", country: "Maldives", region: "Indian Ocean", timezone: "Indian/Maldives",
      image: "dest-maldives-01",
      alt: "A small forested island rising from turquoise water in the Maldives",
      around: [
        { src: "kanu-06", alt: "Thatched overwater villas above a turquoise lagoon", place: "Lagoon living across the atolls" },
        { src: "dest-maldives-03", alt: "A tiny sand island and a boat on a turquoise reef flat from above", place: "Sandbanks of Baa Atoll" },
        { src: "dest-maldives-05", alt: "Reef fish over hard corals in clear blue water", place: "Reefs of the atoll" },
        { src: "dest-maldives-04", alt: "Half-underwater view of a coral reef below a palm island", place: "Lagoon snorkelling" },
        { src: "dest-maldives-02", alt: "A curve of white beach and turquoise shallows from the air", place: "Atoll beaches" }
      ],
      line: "Lagoon-edge living on a UNESCO biosphere atoll.",
      intro: "Baa Atoll is a protected biosphere reserve, known for manta aggregations from June to November. Our residences stand over the lagoon on their own jetties, with a dedicated host, a boat on call and the reef a few strokes from the deck.",
      bestMonths: [1, 2, 3, 4, 11, 12], shoulderMonths: [5, 10],
      access: "Malé (MLE) · 35 min by seaplane",
      highlights: [
        { title: "Hanifaru Bay mantas", text: "Seasonal snorkelling with marine biologists in the protected bay." },
        { title: "Sandbank dinners", text: "A table set on a private sandbank, reached by dhoni at sunset." },
        { title: "Reef by night", text: "Guided night snorkels with the resident marine team." }
      ]
    },
    {
      id: "andaman", name: "Andaman Coast", country: "Thailand", region: "Southeast Asia", timezone: "Asia/Bangkok",
      image: "dest-andaman-01",
      alt: "Limestone karsts and turquoise water in the Andaman Sea",
      around: [
        { src: "dest-andaman-02", alt: "Longtail boats pulled up on a beach below a limestone tower", place: "Railay, by longtail from Ao Nang" },
        { src: "dest-andaman-03", alt: "Mountainous islands and twin bays seen from a viewpoint at sunset", place: "Phi Phi islands" },
        { src: "dest-andaman-04", alt: "A turquoise lagoon enclosed by sheer green cliffs", place: "Hidden lagoons of the outer islands" }
      ],
      line: "Limestone karsts, longtail boats and warm, clear water.",
      intro: "Between Krabi and Phang Nga Bay, limestone towers rise straight from the sea. Our beach villa sits on a quiet stretch north of Ao Nang, with its own longtail for early departures to the islands before the day boats arrive.",
      bestMonths: [11, 12, 1, 2, 3, 4], shoulderMonths: [5, 10],
      access: "Krabi (KBV) · 30 min · Phuket (HKT) · 2 hr",
      highlights: [
        { title: "Phang Nga by longtail", text: "Sea caves and hidden lagoons at first light, before the crowds." },
        { title: "Island picnics", text: "Hong and Phi Phi islands with a private crew and a packed lunch." },
        { title: "Southern Thai kitchen", text: "Market mornings and a cooking session with the villa chef." }
      ]
    }
  ],

  villas: [
    {
      id: "aurelia", name: "Villa Aurelia", destination: "amalfi", area: "Praiano",
      type: "Estate", bedrooms: 6, baths: 7, guests: 12, size: 780, priceFrom: 4800, minNights: 7,
      featured: true, tags: ["private-pool", "sea-view", "chef", "staff", "gym", "events"],
      summary: "A glass-walled clifftop estate with a long pool, a vine-covered dining terrace and steps to a private sea platform.",
      description: [
        "Villa Aurelia sits on three terraces above the bay of Praiano, far enough from the coast road that you hear the sea before anything else. The main pavilion opens completely to the pool deck, and the dining terrace looks straight across to Positano.",
        "Inside, beamed salons and arched windows keep the Amalfi character; the suites are calm and generous, each with its own view. A resident house manager, chef and housekeeping team look after the estate, and a boat can collect you from the private platform below."
      ],
      highlights: ["Private sea platform with boat pick-up", "Heated 18-metre pool", "Dining terrace for 16", "Resident chef and house manager"],
      images: [
        { src: "aurelia-01", alt: "Glass pavilion opening onto the pool deck at Villa Aurelia", hero: true },
        { src: "aurelia-03", alt: "Beamed salon with arched windows and a fireplace", hero: true },
        { src: "aurelia-04", alt: "Great room with long clerestory windows and soft seating", hero: true },
        { src: "aurelia-05", alt: "Principal suite with an upholstered bed and garden light" },
        { src: "aurelia-08", alt: "Garden suite with a rust linen throw and woven bedside table" },
        { src: "aurelia-06", alt: "Stone bathroom with a freestanding bath" },
        { src: "aurelia-11", alt: "An aperitivo garnished with dried citrus on the terrace bar" },
        { src: "aurelia-10", alt: "Fitness room with free weights and a rack beside tall windows" }
      ],
      spaces: [
        { type: "arrival", title: "Three terraces above the bay", text: "Arrive by car at the upper gate, or by boat at the private sea platform and climb the garden stair through the lemon grove. Each terrace has its own purpose: arrival and salons above, pool pavilion in the middle, gardens and sea platform below." },
        { type: "living", title: "Two salons with fireplaces", text: "Beamed ceilings, arched windows and deep sofas keep the Amalfi character. The great room opens onto the pool deck; the smaller salon is kept for reading and late conversations." },
        { type: "dining", title: "The vine-covered dining terrace", text: "One long table for sixteen under a pergola of vines, set for lunch in the shade and lit by lanterns at night. The chef serves from the kitchen directly behind." },
        { type: "kitchen", title: "A chef's kitchen", text: "A working kitchen with a wood-fired oven and a separate service entrance, so the chef and house team can prepare without passing through the salons." },
        { type: "bar", title: "The terrace bar", text: "An aperitivo bar at the edge of the pool terrace, stocked with Campanian wines and local limoncello, with a bartender available for evenings.", image: "aurelia-11" },
        { type: "pool", title: "Pool and sea platform", text: "The heated 18-metre pool runs beside the glass pavilion. Below, a private stone platform gives straight access to the sea and the villa's boat pick-up." },
        { type: "fitness", title: "Fitness room", text: "Free weights, a rack and a bench beside tall windows, with a trainer available through the concierge.", image: "aurelia-10" },
        { type: "bath", title: "Stone bathrooms", text: "Every suite has its own bathroom; the principal bathroom has a freestanding bath in local stone and a walk-in shower.", image: "aurelia-06" }
      ],
      suites: [
        { name: "Principal suite", bed: "King", ensuite: "Bath and walk-in shower", view: "Sea view to Positano", outdoor: "Private terrace", sleeps: 2, image: "aurelia-05", detail: "Dressing room, writing desk and terrace doors that open to the whole bay." },
        { name: "Positano suite", bed: "King", ensuite: "Walk-in shower", view: "Sea view", outdoor: "Private terrace", sleeps: 2, detail: "On the upper terrace, with a daybed on the balcony for early coffee." },
        { name: "Garden suites", count: 2, bed: "King or twin", ensuite: "Walk-in shower", view: "Garden and sea", outdoor: "Garden terrace", sleeps: 2, image: "aurelia-08", detail: "Beside the lemon grove, each with a shaded seating area." },
        { name: "Lemon grove rooms", count: 2, bed: "Queen or twin", ensuite: "Shower", view: "Garden", outdoor: "Shared garden", sleeps: 2, detail: "A quieter pair close to the pool, often chosen for children." }
      ],
      floorPlan: { image: null, levels: [
        { name: "Upper terrace", spaces: ["Arrival court", "Two salons", "Chef's kitchen", "Principal suite", "Positano suite"] },
        { name: "Pool terrace", spaces: ["Glass pavilion", "Dining terrace", "Terrace bar", "18 m pool", "Fitness room", "Cinema room"] },
        { name: "Garden terrace", spaces: ["Garden suites ×2", "Lemon grove rooms ×2", "Herb garden", "Stair to sea platform"] }
      ] },
      wellness: { facilities: ["fitness", "pool", "visiting"], text: "Therapists and a personal trainer come to the villa by arrangement; treatments are set up in your suite or in the pool pavilion." },
      events: { mode: "hosted", types: ["wedding", "welcome", "celebration", "dining", "buyout"], seated: 40, standing: 60, ceremony: "Lemon-grove lawn above the sea", reception: "Vine-covered dining terrace and pool deck", notes: "Events require the owner's approval. The house rules end amplified music at 23:00." },
      amenities: {
        "Outdoor": ["Heated 18 m pool", "Dining terrace for 16", "Private sea platform", "Lemon grove and herb garden"],
        "Indoor": ["Two salons with fireplaces", "Chef's kitchen", "Cinema room", "Fitness room"],
        "Service": ["House manager", "Private chef (breakfast and one meal daily)", "Daily housekeeping", "Boat pick-up on request"]
      },
      distances: [["Praiano village", "8 min walk"], ["Positano", "15 min by car"], ["Naples airport", "75 min"]],
      coords: [40.612, 14.524],
      policies: { checkin: "From 16:00", checkout: "By 11:00", deposit: "$5,000 refundable", cancellation: "Full refund up to 60 days before arrival" }
    },
    {
      id: "lefka", name: "Casa Lefka", destination: "cyclades", area: "Oia, Santorini",
      type: "Caldera house", bedrooms: 4, baths: 4, guests: 8, size: 320, priceFrom: 2900, minNights: 5,
      featured: true, tags: ["private-pool", "sea-view", "staff", "spa"],
      summary: "A whitewashed caldera house cut into the cliff at Oia, with a heated plunge pool and the island's best sunset terrace.",
      description: [
        "Casa Lefka is built into the caldera wall below Oia's lanes, so the terraces face nothing but water and the islands of Thirasia and Aspronisi. The lime-washed rooms stay cool through the afternoon, and every bedroom opens to the view.",
        "A heated plunge pool is set into the lowest terrace, beside a small hammam. Breakfast arrives each morning, and the house host arranges boats, tables and transfers so you never need to climb the steps for anything."
      ],
      highlights: ["Uninterrupted caldera sunset terrace", "Heated plunge pool", "Private hammam", "Daily breakfast and host service"],
      images: [
        { src: "lefka-01", alt: "Whitewashed terrace table facing the Santorini caldera", hero: true },
        { src: "lefka-06", alt: "Sun loungers on a whitewashed terrace above the caldera, with bougainvillea", hero: true },
        { src: "lefka-02", alt: "Brilliant white Cycladic facade under a clear sky", hero: true },
        { src: "lefka-04", alt: "White bedroom opening onto a terrace through black-framed doors" },
        { src: "lefka-08", alt: "Low timber bed with white linen in a lime-washed room" },
        { src: "lefka-07", alt: "White bathroom with a freestanding bath and a tall slot window" }
      ],
      spaces: [
        { type: "arrival", title: "Down through the lanes", text: "Casa Lefka is reached on foot from Oia's upper lane. A porter carries luggage down from the car; after that, everything is on the terraces below." },
        { type: "living", title: "A vaulted living room", text: "The main room is cut into the caldera wall, with a lime-washed barrel vault and built-in seating. It stays cool through the afternoon and opens straight onto the terrace." },
        { type: "dining", title: "The sunset terrace", text: "A table for eight at the edge of the caldera. Breakfast is served here every morning; in the evening the house host can arrange a private chef." },
        { type: "kitchen", title: "Kitchen for a private chef", text: "A compact, well-equipped kitchen used by the chef or for simple breakfasts. Provisioning before arrival can be arranged." },
        { type: "pool", title: "Heated plunge pool", text: "Set into the lowest terrace beside the sun deck, heated from April to October and facing Thirasia across the water." },
        { type: "spa", title: "Private hammam", text: "A small marble hammam beside the plunge pool, prepared by the host on request, with a therapist available for scrubs and massage." },
        { type: "bath", title: "Lime-washed bathrooms", text: "Every bedroom has its own bathroom; the caldera suite has a freestanding bath.", image: "lefka-07" }
      ],
      suites: [
        { name: "Caldera suite", bed: "King", ensuite: "Bath and rain shower", view: "Caldera view", outdoor: "Private terrace", sleeps: 2, image: "lefka-04", detail: "Black-framed doors open onto a terrace facing Thirasia and Aspronisi." },
        { name: "Sunset suite", bed: "King", ensuite: "Rain shower", view: "Caldera view", outdoor: "Window seat", sleeps: 2, image: "lefka-08", detail: "A deep window seat faces west for the sunset." },
        { name: "Cave rooms", count: 2, bed: "Queen or twin", ensuite: "Shower", view: "Terrace", outdoor: "Shared terrace", sleeps: 2, detail: "Traditional vaulted rooms set into the cliff, cool and quiet." }
      ],
      floorPlan: { image: null, levels: [
        { name: "Lane level", spaces: ["Entrance", "Cave rooms ×2"] },
        { name: "Main terrace", spaces: ["Vaulted living room", "Kitchen", "Sunset terrace", "Caldera suite", "Sunset suite"] },
        { name: "Lower terrace", spaces: ["Heated plunge pool", "Hammam", "Sun deck"] }
      ] },
      wellness: { facilities: ["heat", "pool", "visiting"], text: "The hammam is prepared by the house host; massage and scrub treatments are brought to the terrace by a visiting therapist." },
      events: { mode: "in-house", types: ["celebration", "dining"], seated: 8, notes: "Casa Lefka does not host outside guests. Private dinners and proposals for in-house guests are arranged by the concierge." },
      amenities: {
        "Outdoor": ["Heated plunge pool", "Sunset dining terrace", "Sun deck with daybeds"],
        "Indoor": ["Hammam", "Vaulted living room", "Kitchen for private chef"],
        "Service": ["House host", "Daily breakfast", "Daily housekeeping", "Porter service from the lane"]
      },
      distances: [["Oia village", "3 min walk"], ["Ammoudi Bay", "10 min"], ["Santorini airport", "25 min"]],
      coords: [36.461, 25.376],
      policies: { checkin: "From 15:00", checkout: "By 11:00", deposit: "$2,500 refundable", cancellation: "Full refund up to 45 days before arrival" }
    },
    {
      id: "oriel", name: "Villa Oriel", destination: "cyclades", area: "Agios Lazaros, Mykonos",
      type: "Villa", bedrooms: 5, baths: 5, guests: 10, size: 540, priceFrom: 3600, minNights: 5,
      featured: false, tags: ["private-pool", "sea-view", "chef", "gym", "family", "events"],
      summary: "A crisp modern villa above Psarou Bay with a lawned pool garden, open kitchen and room for two families.",
      description: [
        "Villa Oriel is Mykonos in its modern register: white volumes, deep shade and a pool garden that runs the full width of the house. The beaches of Psarou and Platis Gialos are five minutes away, and the town is close enough for dinner without a long drive home.",
        "The layout splits cleanly into two wings, which makes it easy for two families or a group of friends to share. A chef-ready kitchen opens to the terrace, and the lower level has a fitness room and a media lounge."
      ],
      highlights: ["Two independent sleeping wings", "Lawned pool garden with cabana", "Chef-ready open kitchen", "Five minutes to Psarou beach"],
      images: [
        { src: "oriel-01", alt: "Modern white villa with a pool garden and sun loungers", hero: true },
        { src: "oriel-03", alt: "Two-storey white villa with timber soffits reflected in the pool", hero: true },
        { src: "oriel-06", alt: "Courtyard pool lit at dusk beside the lower terrace", hero: true },
        { src: "oriel-09", alt: "White arrival facade with glass doors beside a narrow pool" },
        { src: "oriel-04", alt: "Living room with a white sofa and a warm timber feature wall" },
        { src: "oriel-05", alt: "Open kitchen with a marble island and oak cabinetry" },
        { src: "oriel-11", alt: "Bar corner with a wine wall, pendant light and stools" },
        { src: "oriel-10", alt: "A guest training on a mat in a bright fitness room" },
        { src: "oriel-12", alt: "Grey stone bathroom with a round mirror and freestanding bath" },
        { src: "oriel-08", alt: "Quiet white bedroom with a grey headboard and garden light" }
      ],
      spaces: [
        { type: "arrival", title: "An arrival court", text: "A walled court with parking for three cars leads to glass doors and the double-height hall. Both sleeping wings are reached from here, which keeps the house easy to share.", image: "oriel-09" },
        { type: "living", title: "Living room and media lounge", text: "A long living room with a timber feature wall opens to the pool garden; downstairs, a media lounge doubles as a rainy-day den for children.", image: "oriel-04" },
        { type: "kitchen", title: "A chef-ready open kitchen", text: "A marble island, oak cabinetry and a second prep kitchen behind, so a private chef can cook for twelve without taking over the house.", image: "oriel-05" },
        { type: "bar", title: "Wine wall and bar", text: "A temperature-controlled wine wall and bar at the end of the kitchen, stocked to your list before arrival.", image: "oriel-11" },
        { type: "dining", title: "Outdoor dining for twelve", text: "A shaded table beside the pool garden with a barbecue station, set for long lunches and late dinners." },
        { type: "pool", title: "Pool garden and cabana", text: "A 16-metre pool runs the width of the lawned garden, with a cabana for shade and a lower courtyard lit at night." },
        { type: "fitness", title: "Fitness room", text: "Mats, weights and a bike on the lower level, with a trainer or yoga teacher available through the concierge.", image: "oriel-10" },
        { type: "bath", title: "Stone bathrooms", text: "Five bathrooms, one for every bedroom; the principal bathroom has a freestanding bath and twin basins.", image: "oriel-12" }
      ],
      suites: [
        { name: "Principal suite", bed: "King", ensuite: "Bath and double shower", view: "Sea view to Psarou", outdoor: "Private terrace", sleeps: 2, detail: "Upstairs in the east wing, with a dressing room and a terrace over the bay." },
        { name: "East wing suites", count: 2, bed: "King", ensuite: "Walk-in shower", view: "Garden", outdoor: "Garden access", sleeps: 2, detail: "Doors open straight onto the pool garden." },
        { name: "West wing rooms", count: 2, bed: "Queen or twin", ensuite: "Shower", view: "Garden", outdoor: "Shared terrace", sleeps: 2, image: "oriel-08", detail: "A self-contained wing, ideal for a second family." }
      ],
      floorPlan: { image: null, levels: [
        { name: "Upper floor", spaces: ["Principal suite", "East wing suites ×2"] },
        { name: "Garden floor", spaces: ["Arrival court and hall", "Living room", "Open kitchen", "Wine wall and bar", "West wing rooms ×2", "Pool garden and cabana"] },
        { name: "Lower floor", spaces: ["Media lounge", "Fitness room", "Children's bunk room", "Lit courtyard"] }
      ] },
      wellness: { facilities: ["fitness", "pool", "visiting"], text: "A trainer, yoga teacher or massage therapist can come to the villa daily; the lower courtyard is quiet enough for morning practice." },
      events: { mode: "hosted", types: ["wedding", "welcome", "celebration", "dining", "buyout"], seated: 30, standing: 50, ceremony: "Pool-garden lawn facing the sea", reception: "Pool terrace and lit lower courtyard", notes: "Events require the owner's approval and a neighbour notice. Amplified music ends at 23:00 under the house rules." },
      amenities: {
        "Outdoor": ["16 m pool", "Pool cabana", "Outdoor dining for 12", "Barbecue station"],
        "Indoor": ["Open kitchen", "Media lounge", "Fitness room", "Children's bunk room"],
        "Service": ["Villa manager", "Private chef on request", "Daily housekeeping", "Car and driver on request"]
      },
      distances: [["Psarou beach", "5 min"], ["Mykonos town", "12 min"], ["Mykonos airport", "10 min"]],
      coords: [37.418, 25.345],
      policies: { checkin: "From 16:00", checkout: "By 11:00", deposit: "$4,000 refundable", cancellation: "Full refund up to 60 days before arrival" }
    },
    {
      id: "serai", name: "Villa Serai", destination: "bali", area: "Uluwatu",
      type: "Estate", bedrooms: 7, baths: 8, guests: 14, size: 1100, priceFrom: 3900, minNights: 5,
      featured: true, tags: ["infinity-pool", "sea-view", "chef", "staff", "spa", "family", "events"],
      summary: "A clifftop estate on the Bukit with a 30-metre infinity pool, draped cabanas and a household of twelve.",
      description: [
        "Villa Serai stands on the limestone cliffs of Uluwatu, where the Indian Ocean fills the whole horizon. A 30-metre infinity pool runs the length of the lawn, lined with draped cabanas that become the social centre of every stay.",
        "Seven suites are arranged in pavilions around tropical gardens, so large groups keep their privacy. The household — chef, butlers, spa therapists and drivers — follows Balinese tradition, and the villa's own temple is blessed at the start of each visit."
      ],
      highlights: ["30 m clifftop infinity pool", "Seven pavilion suites", "Household of twelve", "Spa pavilion with two treatment beds"],
      images: [
        { src: "serai-02", alt: "Draped cabanas beside an infinity pool at dusk", hero: true },
        { src: "serai-03", alt: "Thatched pool pavilion among palms", hero: true },
        { src: "serai-06", alt: "Pool deck with loungers in front of a thatched lodge", hero: true },
        { src: "serai-04", alt: "Pavilion suite with timber bed frame and garden doors" },
        { src: "serai-10", alt: "Garden bathroom with a stone bath and a potted palm" },
        { src: "bar-01", alt: "A cocktail with a rosemary sprig on the pavilion bar at night" }
      ],
      spaces: [
        { type: "arrival", title: "Gate, garden and temple", text: "A carved gate opens onto tropical gardens and the family temple, where the household offers a blessing at the start of every stay. Pavilions are spread along garden paths so large groups keep their privacy." },
        { type: "living", title: "The open-sided bale", text: "The main living pavilion has no walls on the ocean side: a thatched roof, deep sofas and ceiling fans, looking straight over the lawn to the horizon." },
        { type: "dining", title: "Dining for fourteen", text: "A long table in the bale for dinner, and breakfast served by the pool. The chef cooks Balinese and Indonesian menus as readily as grilled fish and salads." },
        { type: "kitchen", title: "Kitchen and kitchen team", text: "A full kitchen with its own team and a separate staff entrance, set behind the bale so service is quiet and quick." },
        { type: "bar", title: "The pavilion bar", text: "A bar beside the cabanas for sunset drinks, with a bartender on request and a menu built around local arak and tropical fruit.", image: "bar-01" },
        { type: "pool", title: "30-metre infinity pool", text: "The pool runs the length of the clifftop lawn, lined with four draped cabanas that become the social centre of every stay." },
        { type: "spa", title: "Spa pavilion", text: "Two treatment beds, an outdoor shower and a garden bath, with resident therapists available every day." },
        { type: "fitness", title: "Fitness pavilion", text: "An open-sided pavilion with weights and mats, used for early yoga and training before the heat." },
        { type: "bath", title: "Garden bathrooms", text: "Every pavilion has its own bathroom, several with outdoor baths and garden showers.", image: "serai-10" }
      ],
      suites: [
        { name: "Ocean pavilion", bed: "King", ensuite: "Outdoor bath and garden shower", view: "Ocean view", outdoor: "Private garden", sleeps: 2, detail: "The principal pavilion, closest to the cliff edge." },
        { name: "Cliff pavilions", count: 2, bed: "King", ensuite: "Bath and shower", view: "Ocean view", outdoor: "Private terrace", sleeps: 2, image: "serai-04", detail: "Timber-framed beds and doors that fold back to the garden." },
        { name: "Garden pavilions", count: 3, bed: "King or twin", ensuite: "Garden shower", view: "Garden", outdoor: "Garden terrace", sleeps: 2, detail: "Set among frangipani and palms, a short walk from the pool." },
        { name: "Bunk pavilion", bed: "Two bunk sets and a single", ensuite: "Shower", view: "Garden", outdoor: "Shared lawn", sleeps: 5, detail: "Built for children, close to the family pavilions." }
      ],
      floorPlan: { image: null, levels: [
        { name: "Clifftop", spaces: ["30 m infinity pool", "Four cabanas", "Clifftop lawn", "Ocean pavilion", "Cliff pavilions ×2"] },
        { name: "Central garden", spaces: ["Open-sided bale", "Pavilion bar", "Kitchen", "Media room", "Family temple"] },
        { name: "Garden paths", spaces: ["Garden pavilions ×3", "Bunk pavilion", "Spa pavilion", "Fitness pavilion"] }
      ] },
      wellness: { facilities: ["treatment", "therapists", "yoga", "fitness", "pool"], text: "Resident therapists work from the spa pavilion every day; a yoga teacher can lead sunrise practice on the lawn." },
      events: { mode: "hosted", types: ["wedding", "welcome", "celebration", "dining", "buyout"], seated: 80, standing: 120, ceremony: "Clifftop lawn above the Indian Ocean", reception: "Cabana lawn and pool deck", notes: "Weddings follow a traditional blessing by the household priest if you wish. Events require owner approval; amplified music ends at 23:00." },
      amenities: {
        "Outdoor": ["30 m infinity pool", "Four draped cabanas", "Clifftop lawn", "Family temple"],
        "Indoor": ["Open-sided living bale", "Media room", "Fitness pavilion"],
        "Wellness": ["Spa pavilion", "Daily yoga on request", "Massage by resident therapists"],
        "Service": ["Villa manager", "Private chef and kitchen team", "Butlers", "Two drivers"]
      },
      distances: [["Uluwatu temple", "10 min"], ["Padang Padang beach", "8 min"], ["Denpasar airport", "35 min"]],
      coords: [-8.829, 115.086],
      policies: { checkin: "From 14:00", checkout: "By 11:00", deposit: "$4,000 refundable", cancellation: "Full refund up to 60 days before arrival" }
    },
    {
      id: "lumen", name: "Villa Lumen", destination: "bali", area: "Sidemen valley",
      type: "Retreat", bedrooms: 4, baths: 4, guests: 8, size: 420, priceFrom: 1850, minNights: 4,
      featured: false, tags: ["private-pool", "chef", "staff", "spa", "studio", "family"],
      summary: "A highland retreat above the Sidemen rice terraces, with a sunrise sleeping deck and a quiet work studio.",
      description: [
        "Villa Lumen looks across the Sidemen valley to Mount Agung. Mornings begin on the sleeping deck, where a daybed faces the sunrise; evenings end by the pool pavilion as the valley lights up below.",
        "It is a place for rest and for focused work: a separate studio with fast connectivity sits at the edge of the garden, while the chef cooks from the villa's own kitchen garden. Walks through working rice terraces start at the gate."
      ],
      highlights: ["Sunrise deck facing Mount Agung", "Separate work studio", "Kitchen-garden cooking", "Rice-terrace walks from the gate"],
      images: [
        { src: "lumen-05", alt: "Timber veranda with rattan chairs above a forested valley at sunrise", hero: true },
        { src: "lumen-01", alt: "Pool pavilion lit at blue hour under a tropical sky", hero: true },
        { src: "lumen-08", alt: "Long pool beside a thatched guest pavilion among palms", hero: true },
        { src: "lumen-03", alt: "Living and dining room opening onto a timber terrace" },
        { src: "lumen-04", alt: "Sunlit library lounge with leather sofas and a gallery wall" },
        { src: "lumen-07", alt: "A guest meditating on a mat in the treatment room" },
        { src: "lumen-09", alt: "Plunge pool and a cushioned daybed in a planted courtyard" },
        { src: "lumen-06", alt: "White bedroom with linen bedding and tall garden windows" }
      ],
      spaces: [
        { type: "arrival", title: "Through the rice terraces", text: "The lane from Sidemen village climbs between working rice terraces to a stone gate. From there a garden path leads to the main house and the pool pavilion below." },
        { type: "living", title: "Living and dining room", text: "One long room opening onto a timber terrace, with a dining table for eight and views to Mount Agung on clear mornings.", image: "lumen-03" },
        { type: "studio", title: "Library lounge and work studio", text: "A quiet lounge lined with books, and a separate studio at the garden edge with fast connectivity and a desk facing the valley.", image: "lumen-04" },
        { type: "kitchen", title: "Kitchen-garden cooking", text: "An open kitchen supplied by the villa's own garden. The chef cooks Balinese dishes and will teach a morning class on request." },
        { type: "pool", title: "Pool pavilion and courtyard plunge", text: "A long pool below the house, and a small plunge pool with a daybed in a planted courtyard for the hottest part of the day.", image: "lumen-09" },
        { type: "spa", title: "Treatment room and yoga deck", text: "A calm room for massage and meditation, and an open deck for sunrise yoga facing the valley.", image: "lumen-07" }
      ],
      suites: [
        { name: "Agung suite", bed: "King", ensuite: "Outdoor shower", view: "Valley and Mount Agung", outdoor: "Veranda", sleeps: 2, image: "lumen-06", detail: "The principal suite, with a veranda facing the sunrise." },
        { name: "Valley suite", bed: "King", ensuite: "Shower", view: "Valley view", outdoor: "Private balcony", sleeps: 2, detail: "Upstairs, with a balcony over the rice terraces." },
        { name: "Garden rooms", count: 2, bed: "Queen or twin", ensuite: "Garden shower", view: "Garden", outdoor: "Garden terrace", sleeps: 2, detail: "Close to the pool and kitchen garden, good for families." }
      ],
      floorPlan: { image: null, levels: [
        { name: "Main house", spaces: ["Living and dining room", "Open kitchen", "Library lounge", "Agung suite", "Valley suite"] },
        { name: "Garden", spaces: ["Garden rooms ×2", "Work studio", "Kitchen garden", "Courtyard plunge pool"] },
        { name: "Lower terrace", spaces: ["Pool pavilion", "Treatment room", "Yoga deck"] }
      ] },
      wellness: { facilities: ["treatment", "yoga", "pool", "visiting"], text: "A therapist from the village can visit daily, and a teacher leads yoga on the deck at sunrise." },
      events: { mode: "in-house", types: ["celebration", "dining"], seated: 8, notes: "Villa Lumen is a retreat and does not host outside guests. Vow renewals and small ceremonies for in-house guests can be arranged." },
      amenities: {
        "Outdoor": ["Pool pavilion", "Sunrise sleeping deck", "Kitchen garden"],
        "Indoor": ["Work studio", "Library lounge", "Open kitchen"],
        "Wellness": ["Treatment room", "Yoga deck"],
        "Service": ["Villa manager", "Private chef", "Daily housekeeping", "Driver on request"]
      },
      distances: [["Sidemen village", "5 min"], ["Ubud", "60 min"], ["Denpasar airport", "90 min"]],
      coords: [-8.476, 115.443],
      policies: { checkin: "From 14:00", checkout: "By 11:00", deposit: "$1,500 refundable", cancellation: "Full refund up to 30 days before arrival" }
    },
    {
      id: "kanu", name: "Kanu Water Residence", destination: "maldives", area: "Baa Atoll",
      type: "Overwater residence", bedrooms: 3, baths: 3, guests: 6, size: 410, priceFrom: 6200, minNights: 4,
      featured: true, tags: ["private-pool", "sea-view", "beach", "chef", "staff", "spa"],
      summary: "Three overwater pavilions on a private jetty, with glass floors, a lagoon deck and a host on call.",
      description: [
        "Kanu stands at the end of its own jetty on the edge of a Baa Atoll lagoon, three pavilions linked by boardwalks over glass-clear water. The main pavilion has a curved wall of windows to the ocean and steps straight down into the lagoon.",
        "A dedicated host, chef and boat crew look after the residence. Mornings are for the house reef and the sandbank; evenings for dinner on the deck, with the manta season bringing some of the atoll's best snorkelling from June."
      ],
      highlights: ["Private jetty and lagoon steps", "Glass-floor living pavilion", "Dedicated host, chef and boat", "Seaplane transfer included"],
      images: [
        { src: "kanu-01", alt: "Aerial view of overwater pavilions on a turquoise lagoon", hero: true },
        { src: "kanu-02", alt: "Curved window wall looking out to the ocean deck", hero: true },
        { src: "kanu-03", alt: "Timber jetty leading to a small palm island", hero: true },
        { src: "kanu-04", alt: "Overwater pavilions curving along the reef edge from above" },
        { src: "kanu-07", alt: "Sun deck with white parasols above clear turquoise water" },
        { src: "kanu-08", alt: "A therapist's hands warming massage oil" }
      ],
      spaces: [
        { type: "arrival", title: "By seaplane, then jetty", text: "The seaplane lands beside the atoll, and the residence's boat brings you to the end of Kanu's private jetty, where the host is waiting. Luggage goes ahead; you walk the boardwalk over the lagoon.", image: "kanu-04" },
        { type: "living", title: "Glass-floor living pavilion", text: "A curved wall of windows to the ocean and a glass floor panel over the lagoon. Steps from the deck lead straight into the water." },
        { type: "dining", title: "Dining pavilion", text: "A separate pavilion for dinner, with a table on the deck for evenings and a chef who plans menus around the day's catch." },
        { type: "pool", title: "Sunset deck and plunge pool", text: "A wide deck with parasols and daybeds, an overwater plunge pool and lagoon steps for the house reef.", image: "kanu-07" },
        { type: "spa", title: "Overwater treatment deck", text: "Treatments are given on a shaded deck over the lagoon by the resident therapist, morning or evening.", image: "kanu-08" }
      ],
      suites: [
        { name: "Lagoon pavilion", bed: "King", ensuite: "Outdoor bath", view: "Lagoon view", outdoor: "Glass floor panel and deck", sleeps: 2, detail: "The principal pavilion, joined to the living pavilion by a covered boardwalk." },
        { name: "Sunrise pavilion", bed: "King", ensuite: "Shower", view: "East over the lagoon", outdoor: "Private deck", sleeps: 2, detail: "Faces the sunrise, with a daybed on the deck." },
        { name: "Reef pavilion", bed: "Twin or king", ensuite: "Shower", view: "Reef view", outdoor: "Lagoon steps", sleeps: 2, detail: "Steps from the deck lead straight down to the house reef." }
      ],
      floorPlan: { image: null, levels: [
        { name: "Jetty", spaces: ["Boat landing", "Covered boardwalks"] },
        { name: "Pavilions", spaces: ["Glass-floor living pavilion", "Dining pavilion", "Lagoon pavilion", "Sunrise pavilion", "Reef pavilion"] },
        { name: "Decks", spaces: ["Sunset deck", "Overwater plunge pool", "Treatment deck", "Lagoon steps"] }
      ] },
      wellness: { facilities: ["treatment", "therapists", "pool"], text: "A resident therapist works from the overwater treatment deck, and sunrise yoga can be arranged on the sunset deck." },
      events: { mode: "in-house", types: ["celebration", "dining"], seated: 6, notes: "Kanu hosts in-house guests only. Sandbank dinners, proposals and vow renewals are arranged by the concierge." },
      amenities: {
        "Outdoor": ["Overwater plunge pool", "Lagoon steps", "Sunset deck with daybeds"],
        "Indoor": ["Glass-floor living room", "Dining pavilion"],
        "Wellness": ["Overwater treatment deck"],
        "Service": ["Dedicated host", "Private chef", "Boat and crew on call", "Seaplane transfers"]
      },
      distances: [["House reef", "From the deck"], ["Hanifaru Bay", "20 min by boat"], ["Malé airport", "35 min by seaplane"]],
      coords: [5.12, 73.07],
      policies: { checkin: "On seaplane arrival", checkout: "On seaplane departure", deposit: "$6,000 refundable", cancellation: "Full refund up to 60 days before arrival" }
    },
    {
      id: "halden", name: "Villa Halden", destination: "andaman", area: "Krabi",
      type: "Villa", bedrooms: 5, baths: 5, guests: 10, size: 600, priceFrom: 2400, minNights: 4,
      featured: false, tags: ["infinity-pool", "beach", "sea-view", "chef", "staff", "family"],
      summary: "A beach villa facing the Krabi karsts, with an infinity pool, a longtail on call and sand at the garden gate.",
      description: [
        "Villa Halden faces the limestone islands off Krabi, with a thatched pool pavilion and an infinity edge that seems to run into the Andaman Sea. The garden gate opens directly onto a quiet beach.",
        "The villa's own longtail boat leaves at first light for Phang Nga Bay and the Hong islands, well ahead of the day trips. Back at the house, the chef cooks southern Thai dishes from the morning market."
      ],
      highlights: ["Infinity pool facing the karsts", "Direct beach access", "Private longtail boat", "Southern Thai chef"],
      images: [
        { src: "halden-01", alt: "Infinity pool among palms with limestone peaks behind", hero: true },
        { src: "halden-08", alt: "Timber pool deck with loungers at the infinity edge above the sea", hero: true },
        { src: "halden-06", alt: "Timber sun deck and parasol above a calm sea", hero: true },
        { src: "halden-07", alt: "Garden deck and palms leading down to the beach" },
        { src: "halden-04", alt: "Open living room flowing onto a covered terrace" },
        { src: "halden-09", alt: "Three tropical cocktails on the bar at sunset" },
        { src: "halden-05", alt: "Dark timber bedroom with doors to a tropical garden" }
      ],
      spaces: [
        { type: "arrival", title: "Garden and beach gate", text: "A driveway through coconut palms reaches the house; on the other side, a garden deck leads down to the gate and the beach.", image: "halden-07" },
        { type: "living", title: "Open living room", text: "A high-ceilinged room with doors that fold back to a covered terrace, so the living space runs straight out to the pool.", image: "halden-04" },
        { type: "dining", title: "Terrace dining", text: "A long table on the covered terrace for dinner, and breakfast in the thatched pool pavilion." },
        { type: "kitchen", title: "Chef's kitchen", text: "A full kitchen where the chef cooks southern Thai dishes from the morning market, with a cooking class on request." },
        { type: "bar", title: "Sunset bar", text: "A bar in the pool pavilion for sunset drinks, with fresh fruit, Thai herbs and a bartender for evenings.", image: "halden-09" },
        { type: "pool", title: "Infinity pool facing the karsts", text: "An infinity edge that seems to run into the Andaman Sea, with a thatched pool pavilion and a timber sun deck." }
      ],
      suites: [
        { name: "Sea suite", bed: "King", ensuite: "Bath and shower", view: "Sea view", outdoor: "Balcony", sleeps: 2, image: "halden-05", detail: "The principal suite, with doors to a balcony over the garden and sea." },
        { name: "Karst suites", count: 2, bed: "King", ensuite: "Walk-in shower", view: "Pool and karsts", outdoor: "Pool terrace", sleeps: 2, detail: "Terraces facing the pool and the limestone islands." },
        { name: "Garden rooms", count: 2, bed: "Queen or twin", ensuite: "Garden shower", view: "Garden", outdoor: "Garden terrace", sleeps: 2, detail: "Quiet rooms among the palms, close to the games room." }
      ],
      floorPlan: { image: null, levels: [
        { name: "Upper floor", spaces: ["Sea suite", "Karst suites ×2"] },
        { name: "Ground floor", spaces: ["Open living room", "Covered terrace", "Chef's kitchen", "Games room", "Garden rooms ×2"] },
        { name: "Garden", spaces: ["Infinity pool", "Thatched pool pavilion", "Sun deck", "Beach gate"] }
      ] },
      wellness: { facilities: ["pool", "visiting"], text: "Thai massage therapists visit the villa by arrangement, and treatments can be set up in the pool pavilion." },
      events: { mode: "in-house", types: ["celebration", "dining"], seated: 10, notes: "Villa Halden hosts in-house guests only. Beach dinners and celebrations for your own party are arranged by the concierge." },
      amenities: {
        "Outdoor": ["Infinity pool", "Thatched pool pavilion", "Beach gate", "Private longtail boat"],
        "Indoor": ["Open living room", "Games room", "Chef's kitchen"],
        "Service": ["Villa manager", "Private chef", "Daily housekeeping", "Boat captain"]
      },
      distances: [["Beach", "From the garden"], ["Ao Nang", "12 min"], ["Krabi airport", "30 min"]],
      coords: [8.03, 98.82],
      policies: { checkin: "From 14:00", checkout: "By 11:00", deposit: "$2,000 refundable", cancellation: "Full refund up to 45 days before arrival" }
    }
  ],

  experienceCategories: {
    water: "On the water", dining: "Dining", wellness: "Wellness",
    adventure: "Excursions", transfers: "Arrivals & transfers", occasions: "Occasions"
  },

  experiences: [
    { id: "yacht", name: "Private yacht charter", category: "water", image: "exp-yacht", duration: "Half or full day", where: ["amalfi", "cyclades", "bali", "andaman"], summary: "A crewed motor yacht for coves, lunch at anchor and a swim stop far from the day boats." },
    { id: "sail", name: "Sunset sailing", category: "water", image: "exp-sail", duration: "3 hours", where: ["cyclades", "amalfi", "maldives"], summary: "A classic sailing yacht, a skipper and an open bottle as the light goes gold." },
    { id: "dive", name: "Guided reef diving", category: "water", image: "exp-dive", duration: "Half day", where: ["maldives", "andaman", "bali"], summary: "Private dives and snorkels with a marine guide, for beginners and certified divers." },
    { id: "chef", name: "Private chef residency", category: "dining", image: "exp-chef", duration: "Your whole stay", where: ["amalfi", "cyclades", "bali", "maldives", "andaman"], summary: "A chef who shops the morning market and cooks around your table, day after day." },
    { id: "dining", name: "Chef's table evening", category: "dining", image: "exp-dining", duration: "One evening", where: ["amalfi", "cyclades", "bali", "maldives", "andaman"], summary: "A tasting menu cooked in the villa, paired with local wines and served on the terrace." },
    { id: "wine", name: "Vineyard & cellar visits", category: "dining", image: "exp-wine", duration: "Half day", where: ["amalfi", "cyclades"], summary: "Private tastings with growers in Campania and on Santorini's old-vine slopes." },
    { id: "cocktail", name: "In-villa mixology", category: "occasions", image: "exp-cocktail", duration: "One evening", where: ["amalfi", "cyclades", "bali", "maldives", "andaman"], summary: "A bartender, a menu built around local spirits, and a terrace bar for the night." },
    { id: "celebration", name: "Celebration dinners", category: "occasions", image: "exp-table", duration: "One evening", where: ["amalfi", "cyclades", "bali", "maldives", "andaman"], summary: "Long tables, flowers and music for birthdays, anniversaries and reunions." },
    { id: "spa", name: "In-villa massage", category: "wellness", image: "exp-spa", duration: "60–120 min", where: ["amalfi", "cyclades", "bali", "maldives", "andaman"], summary: "Therapists who come to you, with treatments set up in your room or by the pool." },
    { id: "ritual", name: "Signature wellness ritual", category: "wellness", image: "exp-stones", duration: "2 hours", where: ["bali", "maldives", "andaman"], summary: "Warm-stone and traditional massage rituals drawn from local healing practice." },
    { id: "yoga", name: "Sunrise yoga", category: "wellness", image: "exp-yoga", duration: "75 min", where: ["bali", "maldives", "andaman", "cyclades"], summary: "Private practice on the deck with a teacher who adapts to every level." },
    { id: "excursion", name: "Guided excursions", category: "adventure", image: "dest-bali-08", duration: "Half or full day", where: ["amalfi", "cyclades", "bali", "andaman"], summary: "Path of the Gods, volcano rims and rice-terrace trails with a private guide." },
    { id: "seaplane", name: "Seaplane & helicopter transfers", category: "transfers", image: "exp-seaplane", duration: "On arrival", where: ["maldives", "amalfi", "cyclades"], summary: "Straight from the airport to the villa, with luggage handled for you." },
    { id: "chauffeur", name: "Chauffeured arrivals", category: "transfers", image: "exp-car", duration: "On arrival", where: ["amalfi", "cyclades", "bali", "andaman"], summary: "A driver waiting at arrivals, cold towels and the villa briefing on the way." }
  ],

  /*
   * Concierge request builder. Each service becomes a selectable card; its `fields`
   * appear when the service is chosen. Field types: text, number, date, textarea,
   * select, radio, checks. Add `required: true` to make a field mandatory.
   */
  conciergeServices: [
    { id: "transfer", name: "Airport transfer", note: "Car, boat, seaplane or helicopter", fields: [
      { name: "airport", label: "Arrival airport", type: "text", required: true, placeholder: "e.g. Naples (NAP)" },
      { name: "flight", label: "Flight number", type: "text", placeholder: "Optional" },
      { name: "passengers", label: "Passengers", type: "number", min: 1, max: 20, value: 2, required: true }
    ] },
    { id: "chef", name: "Private chef", note: "Daily residency or single evenings", fields: [
      { name: "meals", label: "Meals", type: "checks", options: ["Breakfast", "Lunch", "Dinner"], min: 1 },
      { name: "days", label: "Number of days", type: "number", min: 1, max: 30, value: 3, required: true },
      { name: "diet", label: "Dietary notes", type: "textarea", placeholder: "Allergies, preferences, children's favourites" }
    ] },
    { id: "yacht", name: "Yacht or boat day", note: "Crewed motor yacht, sailing yacht or longtail", fields: [
      { name: "duration", label: "Duration", type: "radio", options: ["Half day", "Full day"], required: true },
      { name: "guests", label: "Guests on board", type: "number", min: 1, max: 20, value: 4, required: true }
    ] },
    { id: "provisioning", name: "Pre-arrival provisioning", note: "The fridge, cellar and nursery ready on arrival", fields: [
      { name: "list", label: "What should be waiting?", type: "textarea", required: true, placeholder: "Groceries, wine, flowers, baby equipment…" }
    ] },
    { id: "wellness", name: "Wellness & spa", note: "Therapists, teachers and trainers in the villa", fields: [
      { name: "treatment", label: "Treatment", type: "select", options: ["Massage", "Signature ritual", "Facial", "Yoga or movement session", "Personal training", "Recovery session"], required: true },
      { name: "people", label: "Number of guests", type: "number", min: 1, max: 14, value: 2, required: true }
    ] },
    { id: "childcare", name: "Childcare", note: "Vetted nannies and activity hosts", fields: [
      { name: "ages", label: "Children's ages", type: "text", required: true, placeholder: "e.g. 3 and 7" },
      { name: "hours", label: "Hours per day", type: "number", min: 1, max: 12, value: 4, required: true }
    ] },
    { id: "celebration", name: "Celebration", note: "Birthdays, anniversaries and proposals", fields: [
      { name: "occasion", label: "Occasion", type: "select", options: ["Birthday", "Anniversary", "Proposal", "Family reunion", "Other"], required: true },
      { name: "date", label: "Date", type: "date" }
    ] },
    { id: "excursion", name: "Guided excursion", note: "Private guides, walks and cultural visits", fields: [
      { name: "interest", label: "Interest", type: "select", options: ["Walking & hiking", "Culture & history", "Food & wine", "Wildlife & marine"], required: true },
      { name: "notes", label: "Anything specific?", type: "text", placeholder: "Optional" }
    ] }
  ],

  /*
   * Weddings & private events. Venue capacity lives on each villa (`events`); these types
   * drive the event page, the venue finder and the event enquiry form.
   * Villa `events.mode`: "hosted" accepts outside guests up to `seated`/`standing`;
   * "in-house" allows celebrations for the staying party only (up to `seated`).
   */
  eventTypes: [
    { id: "wedding", name: "Intimate weddings", image: "event-03", summary: "A ceremony on the lawn or by the sea, dinner under the stars and the whole villa for your guests.", detail: "Ceremony and reception settings, celebrant, flowers, music and a planner who manages the day." },
    { id: "buyout", name: "Villa buyouts", image: "event-04", summary: "The estate for your party alone — suites, gardens and household — for three nights or more.", detail: "Room plans, arrival logistics and a timetable for every guest." },
    { id: "welcome", name: "Rehearsal & welcome dinners", image: "event-05", summary: "The night before, or the night everyone arrives: long tables, local wine and a toast.", detail: "Menus with the villa chef, seating plans and transfers from nearby hotels." },
    { id: "celebration", name: "Celebrations", image: "event-08", summary: "Milestone birthdays, anniversaries, proposals and vow renewals, for a few or for many.", detail: "Surprises, musicians, photographers and cakes, arranged quietly in advance." },
    { id: "dining", name: "Event dining", image: "event-02", summary: "Chef's tables, feasts and tasting menus served where the view is best.", detail: "Tastings in advance, wine pairing, and service staff sized to your party." }
  ],

  /* Wellness menu. `treatment` must match an option in the concierge wellness form. */
  wellnessCategories: { massage: "Massage", movement: "Movement", ritual: "Rituals", recovery: "Recovery", beauty: "Skin & beauty" },
  wellnessServices: [
    { id: "deep-tissue", name: "Deep-tissue massage", category: "massage", duration: "60 or 90 min", treatment: "Massage", where: ["amalfi", "cyclades", "bali", "maldives", "andaman"], summary: "Firm, focused work on the back, shoulders and legs, ideal after travel or long walks." },
    { id: "balinese", name: "Balinese massage", category: "massage", duration: "90 min", treatment: "Massage", where: ["bali"], summary: "Long strokes, acupressure and warm oils in the island's own tradition." },
    { id: "thai", name: "Thai massage", category: "massage", duration: "90 min", treatment: "Massage", where: ["andaman"], summary: "Assisted stretching and pressure work on a mat, fully clothed." },
    { id: "yoga", name: "Sunrise yoga", category: "movement", duration: "75 min", treatment: "Yoga or movement session", where: ["cyclades", "bali", "maldives", "andaman"], summary: "Private practice on the deck with a teacher who adapts to every level." },
    { id: "pilates", name: "Pilates & mobility", category: "movement", duration: "60 min", treatment: "Yoga or movement session", where: ["amalfi", "cyclades", "bali"], summary: "Mat work for posture and core strength, with small equipment brought to the villa." },
    { id: "training", name: "Personal training", category: "movement", duration: "60 min", treatment: "Personal training", where: ["amalfi", "cyclades", "bali", "andaman"], summary: "Strength, conditioning or a coastal run, planned around your usual routine." },
    { id: "stones", name: "Warm-stone ritual", category: "ritual", duration: "2 hours", treatment: "Signature ritual", where: ["bali", "maldives", "andaman"], summary: "Heated stones, a full-body massage and a scalp treatment to finish." },
    { id: "boreh", name: "Boreh spice ritual", category: "ritual", duration: "2 hours", treatment: "Signature ritual", where: ["bali"], summary: "A warming Balinese body wrap of spices and rice, followed by massage and a flower bath." },
    { id: "hammam", name: "Hammam ritual", category: "ritual", duration: "90 min", treatment: "Signature ritual", where: ["cyclades"], summary: "Steam, a traditional scrub and a foam wash in Casa Lefka's private hammam." },
    { id: "lymphatic", name: "Post-flight lymphatic massage", category: "recovery", duration: "60 min", treatment: "Recovery session", where: ["amalfi", "cyclades", "bali", "maldives", "andaman"], summary: "Light, rhythmic massage to ease swelling and stiffness after a long flight." },
    { id: "stretch", name: "Assisted stretch & cold plunge", category: "recovery", duration: "45 min", treatment: "Recovery session", where: ["amalfi", "cyclades", "bali", "maldives", "andaman"], summary: "Guided stretching followed by contrast water in the villa pool." },
    { id: "facial", name: "Hydrating facial", category: "beauty", duration: "60 min", treatment: "Facial", where: ["amalfi", "cyclades", "bali", "maldives", "andaman"], summary: "Cleansing, massage and masks chosen for sun-exposed skin." }
  ],

  /*
   * My Stay — demonstration data for the guest portal (my-stay/index.html).
   * Dates are relative to today so the demo never goes stale. Replace this whole object
   * by connecting a backend adapter (see README.md → Guest portal).
   */
  portalDemo: {
    reference: "SOL-DEMO24",
    guest: { firstName: "Eleanor", lastName: "Marsh", email: "eleanor.marsh@example.com", phone: "+44 7700 900123", country: "United Kingdom", dietary: "One guest is vegetarian", occasion: "Anniversary" },
    party: { adults: 6, children: 2, infants: 0 },
    villa: "aurelia",
    arrivalInDays: 62, nights: 7,
    status: "Confirmed", confirmedDaysAgo: 18,
    planner: { name: "Giulia Ferraro", role: "Your planner", email: "planner@solara-villas.example", phone: "+44 20 7946 0180" },
    rate: 4800, currency: "USD",
    documents: [
      { id: "INV-DEMO-0001", kind: "invoice", title: "Deposit invoice", issuedDaysAgo: 18, amount: 16800, status: "Paid", paidDaysAgo: 16, lines: [["Villa Aurelia — 50% deposit, 7 nights at $4,800", 16800]] },
      { id: "INV-DEMO-0002", kind: "invoice", title: "Balance invoice", issuedDaysAgo: 2, amount: 16800, status: "Due", dueInDays: 17, lines: [["Villa Aurelia — 50% balance, 7 nights at $4,800", 16800]] },
      { id: "INV-DEMO-0003", kind: "invoice", title: "Experiences — pre-arrival", issuedDaysAgo: 5, amount: 2450, status: "Paid", paidDaysAgo: 4, lines: [["Private yacht charter, full day", 1850], ["Chef's table evening, 8 guests", 600]] },
      { id: "DOC-DEMO-01", kind: "document", title: "Booking confirmation", issuedDaysAgo: 18 },
      { id: "DOC-DEMO-02", kind: "document", title: "Rental agreement", issuedDaysAgo: 18 },
      { id: "DOC-DEMO-03", kind: "document", title: "Security deposit authorisation ($5,000)", issuedDaysAgo: 16 }
    ],
    itinerary: [
      { day: 1, time: "14:30", title: "Private transfer from Naples airport", detail: "Driver waiting at arrivals with a name board.", status: "Confirmed" },
      { day: 1, time: "19:30", title: "Welcome dinner on the terrace", detail: "Chef's menu for eight, one vegetarian.", status: "Confirmed" },
      { day: 2, time: "10:00", title: "Private yacht charter", detail: "From the sea platform. Positano, Li Galli islets and lunch at anchor.", status: "Confirmed" },
      { day: 3, time: "08:00", title: "Path of the Gods with a guide", detail: "Pick-up at the villa gate. Walking shoes recommended.", status: "Requested" },
      { day: 4, time: "20:00", title: "Chef's table evening", detail: "Anniversary dinner with wine pairing.", status: "Confirmed" },
      { day: 7, time: "11:00", title: "Departure transfer", detail: "Timing to be confirmed with your flight.", status: "Requested" }
    ],
    requests: [
      { id: "REQ-DEMO-1", service: "Pre-arrival provisioning", detail: "Fruit, oat milk, two cases of Falanghina.", status: "In progress", day: 1, daysAgo: 9 },
      { id: "REQ-DEMO-2", service: "Childcare", detail: "Two afternoons, ages 5 and 8.", status: "Confirmed", day: 3, daysAgo: 12 }
    ],
    checklist: [
      { id: "agreement", label: "Review and sign the rental agreement", done: true },
      { id: "dietary", label: "Confirm dietary requirements for the chef", done: true },
      { id: "flight", label: "Add your arrival flight to Guest details", done: false },
      { id: "balance", label: "Pay the balance invoice", done: false },
      { id: "insurance", label: "Arrange travel insurance", done: false }
    ],
    messages: [
      { from: "planner", daysAgo: 16, text: "Welcome, Eleanor — your deposit is received and Villa Aurelia is confirmed. I'll be your planner from now until you fly home." },
      { from: "guest", daysAgo: 15, text: "Wonderful, thank you. Could we arrange a boat day early in the week?" },
      { from: "planner", daysAgo: 14, text: "Of course. I've pencilled the yacht for your second day and added it to your itinerary." }
    ],
    arrival: {
      address: "The exact address and gate code are shared 14 days before arrival.",
      checkin: "From 16:00 — early arrival can be requested",
      checkout: "By 11:00",
      host: "Marco, house manager — introduced on your arrival day",
      wifi: "Shared at check-in",
      directions: "Your driver takes the coast road from Naples to Praiano (about 75 minutes). Boat arrivals land at the villa's private sea platform."
    }
  },

  journalCategories: { destinations: "Destinations", living: "Villa living", food: "Food & wine", guides: "Guides" },

  journal: [
    {
      slug: "liguria-to-amalfi-by-sea", title: "By sea from Liguria to Amalfi", category: "destinations",
      date: "2026-08-18", read: 7, image: "ed-liguria", destination: "amalfi",
      excerpt: "Ten days down Italy's western coast by boat, and why the approach from the water changes everything.",
      body: [
        { p: "Arriving by sea is the oldest way to see the Italian coast, and still the best. From the water, the villages make sense: every house turned towards the harbour, every stair leading down to a landing." },
        { h: "Start in the north" },
        { p: "The Cinque Terre is easiest in May or late September, when the ferries run and the paths are quiet. Take a private tender between the five villages and stop wherever lunch looks good." },
        { h: "The long middle" },
        { p: "South of Portofino the coast opens out. Most guests fly this stretch and rejoin the water at Naples, where a boat can take you across the bay to Capri and on to the Amalfi Coast in an afternoon." },
        { h: "Arriving at the villa" },
        { p: "At Villa Aurelia, the house manager meets boats at the private sea platform below the estate. Luggage goes up by the service lift; you go up by the garden stair, with the whole bay opening behind you." }
      ]
    },
    {
      slug: "a-slow-week-in-the-cyclades", title: "A slow week in the Cyclades", category: "destinations",
      date: "2026-07-30", read: 6, image: "dest-cyclades-02", destination: "cyclades",
      excerpt: "Santorini at dawn, Mykonos after dark, and the quiet islands in between.",
      body: [
        { p: "Most visitors race through the Cyclades. The better way is to choose two islands and stay long enough for the rhythm to change your own." },
        { h: "Santorini, early" },
        { p: "The caldera belongs to the early risers. Walk the path from Oia towards Imerovigli before eight and you'll have it largely to yourself; by the time the crowds arrive, you'll be back on the terrace with breakfast." },
        { h: "Mykonos, late" },
        { p: "Mykonos is known for its nights, but its beaches in the morning are the real luxury. Psarou and Agios Sostis are calm until noon, and a villa five minutes away means you can come and go as you like." },
        { h: "In between" },
        { p: "A tender from Mykonos reaches Delos in half an hour. Go on the first boat and you'll walk the ancient harbour with only the lizards for company." }
      ]
    },
    {
      slug: "planning-a-harvest-week", title: "Planning a harvest week", category: "food",
      date: "2026-07-12", read: 5, image: "dest-amalfi-02", destination: "amalfi",
      excerpt: "When the grapes come in, the countryside celebrates. How to time a villa stay around the vendemmia.",
      body: [
        { p: "Harvest is the most generous time of year in wine country. The light softens, the crowds thin and every village seems to have a festa." },
        { h: "Timing" },
        { p: "In Campania, white grapes are usually picked from mid-September and reds into October. Growers can rarely give dates far ahead, so we book tastings with flexibility built in." },
        { h: "At the villa" },
        { p: "Ask your chef to build a menu around the week's picking. Many estates will send a case of the previous vintage to the villa, and some will invite guests to join the last morning of the harvest." }
      ]
    },
    {
      slug: "choosing-a-villa-for-three-generations", title: "Choosing a villa for three generations", category: "living",
      date: "2026-06-26", read: 6, image: "ed-cooking", destination: "cyclades",
      excerpt: "Layouts, staffing and the small details that make a multi-generation stay work for everyone.",
      body: [
        { p: "The best family villas are really two or three houses under one roof. Look first at the plan, not the photographs." },
        { h: "Separate wings" },
        { p: "Grandparents value a ground-floor suite away from the pool; teenagers want a room of their own and a door that closes. Villas like Oriel on Mykonos are designed in wings for exactly this reason." },
        { h: "Shared spaces" },
        { p: "One long table matters more than any other feature. A chef who cooks for twelve without fuss turns dinner into the best part of the day." },
        { h: "Ask about the details" },
        { p: "Pool fencing, cots, stair gates and a babysitter who speaks your language are all easy to arrange in advance — and hard to find at short notice." }
      ]
    },
    {
      slug: "maldives-by-seaplane", title: "The Maldives by seaplane: a first-timer's guide", category: "guides",
      date: "2026-06-04", read: 5, image: "dest-maldives-02", destination: "maldives",
      excerpt: "What to pack, when to fly and how the transfer from Malé really works.",
      body: [
        { p: "Seaplanes only fly in daylight, so international arrivals after mid-afternoon usually mean a night in Malé. We time flights to avoid that wherever possible." },
        { h: "Luggage" },
        { p: "Seaplanes weigh every bag. Soft luggage travels best, and anything you won't need can be stored at the Malé lounge until you return." },
        { h: "The flight" },
        { p: "Ask for a seat on the right side leaving Malé for Baa Atoll. The atolls appear as rings of turquoise below — the view alone is worth the early start." }
      ]
    },
    {
      slug: "bali-highland-valleys", title: "Bali beyond the coast: the highland valleys", category: "destinations",
      date: "2026-05-15", read: 6, image: "dest-bali-03", destination: "bali",
      excerpt: "Rice terraces, river walks and the slower Bali that still exists an hour from the beach.",
      body: [
        { p: "An hour east of the busy south, Bali becomes green and quiet. The Sidemen valley still farms the way it always has, and the rhythm of the day follows the fields." },
        { h: "Walking" },
        { p: "The best way to see the valley is on foot. A village guide will take you along the irrigation channels, past shrines and working terraces, to a lunch cooked in a family compound." },
        { h: "Staying" },
        { p: "Combine a few nights in the highlands with the clifftop south. Villa Lumen and Villa Serai are ninety minutes apart, and we arrange the transfer with a stop at a temple on the way." }
      ]
    },
    {
      slug: "packing-for-coastline-days", title: "Packing for coastline days", category: "guides",
      date: "2026-04-28", read: 4, image: "ed-cove", destination: "andaman",
      excerpt: "A short list for boat days, cliff paths and long lunches by the water.",
      body: [
        { p: "Villa holidays are simpler to pack for than hotels: the house has most of what you need. What you bring should work for the boat, the path and the dinner table." },
        { h: "The essentials" },
        { p: "Reef-safe sunscreen, a light layer for evenings on the water, shoes that grip on wet rock and a dry bag for the tender. Everything else can be found locally or arranged by your host." },
        { h: "Leave room" },
        { p: "Most guests go home with ceramics, linen or wine. Your concierge can ship larger purchases so you travel light." }
      ]
    },
    {
      slug: "mountains-between-stays", title: "Mountains between stays", category: "living",
      date: "2026-04-09", read: 5, image: "ed-dolomites", destination: "amalfi",
      excerpt: "Why a few alpine days before the coast make the best Italian summers.",
      body: [
        { p: "Before the heat of the coast, a few days in the mountains resets the whole trip. The Dolomites are a short flight from Naples, and the contrast is the point." },
        { h: "Cool mornings" },
        { p: "Lake walks at first light, a rowing boat on still water and a long lunch in a mountain hut make the perfect prelude to a week by the sea." },
        { h: "Joining it up" },
        { p: "Your concierge can arrange the whole route — mountain hotel, transfers and the flight south — so the villa is ready and the chef has the fridge stocked when you arrive." }
      ]
    }
  ],

  testimonials: [
    { quote: "The house was extraordinary, but it was the people who made it. By the second day the chef knew exactly how our children liked their eggs.", name: "Eleanor M.", stay: "Villa Aurelia · Amalfi Coast" },
    { quote: "We have stayed in many villas. This was the first time everything — the boat, the tables, the transfers — simply happened.", name: "James & Priya R.", stay: "Kanu Water Residence · Maldives" },
    { quote: "Fourteen of us, three generations, and not a single logistical conversation. We have already booked next summer.", name: "The Lindqvist family", stay: "Villa Serai · Bali" }
  ]
};
