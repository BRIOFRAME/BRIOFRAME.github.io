/*!
 * BRIOFRAME · SOLARA Private Villas Master · BF-SOLARA-PV-M1 · v1.1.0
 * EXAMPLE live adapter for the My Stay guest portal. Not loaded by default.
 *
 * Copy to assets/js/portal-adapter.js, point API at YOUR backend, then in my-stay/index.html
 * load it after portal.js and before pages.js:
 *   <script src="../assets/js/portal-adapter.js" defer></script>
 * and set SOLARA_CONFIG.portal.mode = "live" in assets/js/config.js.
 *
 * Assumptions (see docs/portal/README.md):
 *  - The API is same-origin (e.g. Azure Static Web Apps managed /api, or a reverse proxy),
 *    so the CSP can stay at connect-src 'self'. For another origin, add it to connect-src.
 *  - Sessions are HttpOnly, Secure, SameSite cookies set by the backend or its identity
 *    provider. Nothing secret is stored in this file, localStorage or sessionStorage.
 *  - Every endpoint authorises on the server: a guest can only read and change their own stay.
 */
(() => {
  "use strict";
  const API = "/api/portal";

  async function call(path, { method = "GET", body } = {}) {
    const res = await fetch(`${API}${path}`, {
      method,
      credentials: "same-origin",
      headers: body ? { "Content-Type": "application/json", Accept: "application/json" } : { Accept: "application/json" },
      body: body ? JSON.stringify(body) : undefined
    });
    if (res.status === 204) return null;
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      // Messages are shown to guests: the backend should return short, non-revealing text.
      const err = new Error(data.message || "Something went wrong. Please try again or contact reservations.");
      err.code = data.code || String(res.status);
      throw err;
    }
    return data;
  }

  window.SOLARA_PORTAL_ADAPTER = {
    // Option A (recommended): start passwordless sign-in. The backend emails a one-time link or code
    // and responds 202 { code: "check_email", message: "…" }; throw it so the page shows the message.
    // Option B: redirect to your identity provider, e.g.
    //   window.location.assign("/.auth/login/entraExternalId?post_login_redirect_uri=/my-stay/");
    async signIn({ reference, email }) {
      const r = await call("/sign-in", { method: "POST", body: { reference: reference.trim().toUpperCase(), email: email.trim() } });
      if (r && r.code === "check_email") throw Object.assign(new Error(r.message), { code: r.code });
      return r;
    },
    getSession: () => call("/session").catch(() => null),
    signOut: () => call("/session", { method: "DELETE" }),
    getStay: () => call("/stay"),
    updateGuest: (fields) => call("/stay/guest", { method: "PATCH", body: fields }),
    createRequest: (req) => call("/stay/requests", { method: "POST", body: req }),
    sendMessage: (text) => call("/stay/messages", { method: "POST", body: { text } }),
    setChecklist: (id, done) => call(`/stay/checklist/${encodeURIComponent(id)}`, { method: "PUT", body: { done } }),
    getDocument: (id) => call(`/stay/documents/${encodeURIComponent(id)}`)
  };
})();
