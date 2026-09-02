/* ==========================================================================
   APEX — SITE CONFIGURATION
   --------------------------------------------------------------------------
   Every company detail on the site is read from this one file. Change a value
   here and it updates in the navigation, the footer, the contact page and the
   WhatsApp button on all seven pages at once.

   Anything still reading "TBC" is a real gap — the client has not confirmed it
   yet. Placeholders are rendered in a muted style and marked in the HTML, so a
   half-filled site never looks like it is claiming something untrue.
   ========================================================================== */

window.APEX_CONFIG = {

  /* ── Identity ───────────────────────────────────────────────────────── */
  companyName:  'Apex Integrated Facility Management',
  companyShort: 'Apex',
  tagline:      'Your Facilities, Our Responsibility',

  /* Logo files. These are the real Apex artwork, lifted off the signage
     render and cut out to transparent PNG. The white version is for dark
     backgrounds (footer, overlays). */
  logo:      'assets/brand/apex-logo.png',
  logoWhite: 'assets/brand/apex-logo-white.png',
  logoMark:  'assets/brand/apex-mark.png',
  logoMono:  'assets/brand/apex-mark-white.png',
  favicon:   'assets/icons/favicon.png',

  /* ── Contact ────────────────────────────────────────────────────────── */
  /* Set `confirmed: false` on anything the client has not supplied. Those
     values render greyed out with a "to be confirmed" note instead of
     appearing as though they are real. */
  phone:     { value: '+91 00000 00000',            confirmed: false },
  email:     { value: 'hello@example.com',          confirmed: false },
  /* ►► THE ONE THING STILL MISSING ►►
     Put the real WhatsApp number here in full international form, no plus,
     no spaces — e.g. '919876543210'. The floating WhatsApp button reads it
     from here. While it is all zeros the button still shows, but it opens
     the contact page instead of a dead wa.me link. */
  whatsapp:  { value: '910000000000',               confirmed: false },

  /* From the company signage. */
  address:   {
    line1: '#52, 2nd Main, RMS Colony, near Ganesh Temple',
    line2: 'Bhattarahalli, KR Puram',
    city:  'Bangalore',
    state: 'Karnataka',
    pin:   '560049',
    confirmed: true
  },
  gst:       { value: '29EUTPR9062Q1Z1',            confirmed: true },
  hours:     { value: 'Operations desk — 24 x 7',   confirmed: true },
  mapEmbed:  '',   /* paste a Google Maps embed URL to replace the placeholder */

  /* Domain — used for canonical + Open Graph. Update before launch, and
     also update robots.txt and sitemap.xml to match. */
  domain: 'https://example.com',

  /* ── Social ─────────────────────────────────────────────────────────── */
  socialLinks: [
    { label: 'LinkedIn',  url: '', confirmed: false },
    { label: 'Instagram', url: '', confirmed: false },
    { label: 'Facebook',  url: '', confirmed: false }
  ],

  /* ── Calls to action ────────────────────────────────────────────────── */
  ctaText:      'Request a consultation',
  ctaTextAlt:   'Request a proposal',
  ctaSecondary: 'Explore services',

  /* ── Service area ───────────────────────────────────────────────────── */
  serviceArea: 'Bengaluru and surrounding Karnataka',

  /* ── Demo mode ──────────────────────────────────────────────────────── */
  /* true  → shows the "demonstration site" notices and DEMO tags.
     false → hides every one of them in a single switch, for launch day. */
  demoMode: true
};
