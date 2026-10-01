/*!
 * BRIOFRAME · SOLARA Private Villas Master · BF-SOLARA-PV-M1 · v1.1.0
 * Original publisher: BRIOFRAME. Guest-portal DEMO adapter (my-stay/index.html only).
 *
 * This file simulates a booking backend in the browser so the My Stay screens can be
 * reviewed. It is NOT authentication: the "session" is a sessionStorage flag and every
 * record comes from SOLARA_DATA.portalDemo. Nothing is sent anywhere.
 *
 * For a live site, load your own script that defines window.SOLARA_PORTAL_ADAPTER with the
 * same async methods, backed by YOUR booking system / API (server-side sessions, authorisation
 * and document storage), and set SOLARA_CONFIG.portal.mode = "live". See README.md → Guest portal.
 *
 * Adapter contract (all methods async):
 *   signIn({ reference, email })       → session   · throw Error with .code "not_found" | "locked" | …
 *   getSession()                        → session | null
 *   signOut()
 *   getStay()                           → stay (shape below)
 *   updateGuest(fields)                 → guest
 *   createRequest({ service, date, detail }) → request
 *   sendMessage(text)                   → message
 *   setChecklist(id, done)              → checklist
 *   getDocument(id)                     → document (metadata; the page renders the printable copy)
 * Adapters may dispatch `solara:portal-update` on document when data changes server-side.
 *
 * stay = { reference, status, confirmedOn, villa, arrival, departure, nights, rate, currency,
 *          party: {adults, children, infants}, guest: {...}, planner: {...},
 *          documents: [{ id, kind: "invoice"|"document", title, issued, amount?, status?, paidOn?, dueOn?, lines? }],
 *          itinerary: [{ id, date, time, title, detail, status }], requests: [...], messages: [{ id, from, at, text }],
 *          arrivalInfo: { address, checkin, checkout, host, wifi?, directions }, checklist: [{ id, label, done }] }
 * Dates are ISO "YYYY-MM-DD" strings (message `at` is a full ISO timestamp).
 */
(() => {
  "use strict";
  const demo = (window.SOLARA_DATA || {}).portalDemo;
  if (!demo) return;
  const KEY = "solara.portal.demo";
  const DAY = 86400000;
  const pad = (n) => String(n).padStart(2, "0");
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const midnight = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const rel = (n) => iso(new Date(midnight().getTime() + n * DAY));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const id = (p) => `${p}-${Date.now().toString(36).slice(-5).toUpperCase()}`;
  const fail = (message, code) => Object.assign(new Error(message), { code });

  function seed() {
    const arrival = rel(demo.arrivalInDays);
    const onDay = (n) => iso(new Date(new Date(`${arrival}T00:00:00`).getTime() + (n - 1) * DAY));
    return {
      reference: demo.reference, status: demo.status, confirmedOn: rel(-demo.confirmedDaysAgo),
      villa: demo.villa, arrival, departure: rel(demo.arrivalInDays + demo.nights), nights: demo.nights,
      rate: demo.rate, currency: demo.currency, party: { ...demo.party }, guest: { ...demo.guest, flight: "" }, planner: { ...demo.planner },
      documents: demo.documents.map((d) => ({
        ...d, issued: rel(-d.issuedDaysAgo),
        paidOn: d.paidDaysAgo != null ? rel(-d.paidDaysAgo) : null,
        dueOn: d.dueInDays != null ? rel(d.dueInDays) : null
      })),
      itinerary: demo.itinerary.map((it, i) => ({ id: `IT-${i + 1}`, date: onDay(it.day), time: it.time, title: it.title, detail: it.detail, status: it.status })),
      requests: demo.requests.map((r) => ({ ...r, date: r.day ? onDay(r.day) : null, created: rel(-(r.daysAgo || 6)) })),
      messages: demo.messages.map((m, i) => ({ id: `MSG-${i + 1}`, from: m.from, at: new Date(Date.now() - m.daysAgo * DAY).toISOString(), text: m.text })),
      arrivalInfo: { ...demo.arrival },
      checklist: (demo.checklist || []).map((c) => ({ ...c }))
    };
  }

  const read = () => { try { return JSON.parse(sessionStorage.getItem(KEY) || "null"); } catch { return null; } };
  const write = (s) => { try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch { /* storage unavailable: demo still works for this page view */ } memory = s; };
  let memory = null;
  const state = () => read() || memory;
  const authed = () => {
    const s = state();
    if (!s || !s.session) throw fail("Please sign in again.", "unauthenticated");
    if (Date.parse(s.session.expiresAt) < Date.now()) { delete s.session; write(s); throw fail("Your session has ended. Please sign in again.", "expired"); }
    return s;
  };
  const changed = () => document.dispatchEvent(new CustomEvent("solara:portal-update"));

  window.SOLARA_PORTAL_DEMO = {
    name: "demo",
    async signIn({ reference, email }) {
      await wait(450);
      const ref = String(reference || "").trim().toUpperCase().replace(/\s+/g, "");
      const mail = String(email || "").trim().toLowerCase();
      if (ref !== demo.reference || mail !== demo.guest.email.toLowerCase()) {
        throw fail("We couldn't find a booking with that reference and email. Check both, or use the demo details below.", "not_found");
      }
      const s = state() || { stay: seed() };
      const now = new Date();
      s.session = { email: mail, reference: ref, signedInAt: now.toISOString(), expiresAt: new Date(now.getTime() + 2 * 3600000).toISOString(), mode: "demo" };
      write(s);
      return clone(s.session);
    },
    async getSession() {
      const s = state();
      if (!s || !s.session) return null;
      if (Date.parse(s.session.expiresAt) < Date.now()) { delete s.session; write(s); return null; }
      return clone(s.session);
    },
    async signOut() { const s = state(); if (s) { delete s.session; write(s); } },
    async getStay() { await wait(150); return clone(authed().stay); },
    async updateGuest(fields) {
      await wait(400);
      const s = authed();
      const { adults, children, ...guest } = fields;
      Object.assign(s.stay.guest, guest);
      s.stay.party.adults = adults; s.stay.party.children = children;
      write(s);
      return clone(s.stay.guest);
    },
    async createRequest({ service, date, detail }) {
      await wait(450);
      const s = authed();
      const r = { id: id("REQ"), service, date, detail, status: "Received", created: rel(0) };
      s.stay.requests.unshift(r);
      write(s);
      return clone(r);
    },
    async sendMessage(text) {
      await wait(350);
      const s = authed();
      const m = { id: id("MSG"), from: "guest", at: new Date().toISOString(), text };
      s.stay.messages.push(m);
      write(s);
      // Simulated planner acknowledgement so the thread shows a reply state in the demo.
      setTimeout(() => {
        const t = state();
        if (!t || !t.session) return;
        t.stay.messages.push({ id: id("MSG"), from: "planner", at: new Date().toISOString(), text: `Thank you — I've received your message and will reply shortly. (Automatic demo reply.)`, auto: true });
        write(t);
        changed();
      }, 1600);
      return clone(m);
    },
    async setChecklist(itemId, done) {
      const s = authed();
      const c = s.stay.checklist.find((x) => x.id === itemId);
      if (c) c.done = !!done;
      write(s);
      return clone(s.stay.checklist);
    },
    async getDocument(docId) {
      const d = authed().stay.documents.find((x) => x.id === docId);
      if (!d) throw fail("Document not found.", "not_found");
      return clone(d);
    },
    async reset() { try { sessionStorage.removeItem(KEY); } catch { /* ignore */ } memory = null; }
  };
})();
