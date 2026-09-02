/* AUTO-GENERATED from data/*.json by tools/build-data.js — do not edit by hand.
   Offline snapshot so the site also works when opened via file://          */
window.APEX_DATA = {
  "clients": {
    "_note": "Real Apex client list. Eight of the ten entries now carry a logo file. Wipro and Garuda Mall came from those companies' own websites; INOX, VR Bengaluru, Raymond, St Peter's Hospital, Swasya Living were supplied by Apex and trimmed to a transparent PNG 72px tall. Sannidhi Eco Farms, Tanzior Jewels and Transit Food Court still render a monogram — see assets/images/clients/README.md for why. To add one: get written permission from the client, ask for their logo file at the same time, drop it into assets/images/clients/ at about 72px tall with a transparent background, set the `logo` path below, then run `node tools/build-data.js`. Set confirmed:false on any client not yet cleared to name publicly and the caveat under the strip returns.",
    "clients": [
      {
        "name": "Wipro Enterprises",
        "sector": "Corporate, Bengaluru",
        "logo": "assets/images/clients/wipro.png",
        "confirmed": true
      },
      {
        "name": "INOX",
        "sector": "Cinema, multiplex",
        "logo": "assets/images/clients/inox.png",
        "confirmed": true
      },
      {
        "name": "VR Bengaluru",
        "sector": "Mall, Whitefield",
        "logo": "assets/images/clients/vr-bengaluru.png",
        "confirmed": true
      },
      {
        "name": "Garuda Mall",
        "sector": "Mall, Magrath Road",
        "logo": "assets/images/clients/garuda-mall.png",
        "confirmed": true
      },
      {
        "name": "Raymond Retail",
        "sector": "Apparel retail",
        "logo": "assets/images/clients/raymond.png",
        "confirmed": true
      },
      {
        "name": "St Peter's Hospital",
        "sector": "Healthcare, Bengaluru",
        "logo": "assets/images/clients/st-peters-hospital.png",
        "confirmed": true
      },
      {
        "name": "Swasya Living",
        "sector": "Residential developer",
        "logo": "assets/images/clients/swasya-living.png",
        "confirmed": true
      },
      {
        "name": "Sannidhi Eco Farms",
        "sector": "Managed farmland, Sakleshpur",
        "logo": "",
        "confirmed": true
      },
      {
        "name": "Tanzior Jewels",
        "sector": "Manufacturing, Bellandur",
        "logo": "",
        "confirmed": true
      },
      {
        "name": "Transit Food Court",
        "sector": "Food and beverage",
        "logo": "",
        "confirmed": true
      }
    ]
  },
  "faq": {
    "_note": "Questions and answers for the FAQ accordion. Add, edit or remove freely.",
    "faq": [
      {
        "q": "What is integrated facility management?",
        "a": "It means one company takes responsibility for the services that keep a building working — cleaning, security, maintenance, grounds, pest control and support staff — instead of you holding a separate contract and a separate argument with each of them. One scope, one supervisor structure, one point of contact when something goes wrong."
      },
      {
        "q": "What services can Apex provide?",
        "a": "Housekeeping, security, technical maintenance, landscaping, pest management and support manpower. These can be taken as a full integrated contract or individually. If your requirement includes something not listed here, ask — the answer is either yes, or an honest no."
      },
      {
        "q": "Can services be customised to our facility?",
        "a": "Yes, and they have to be. A warehouse and a corporate floor need different headcount, different timings and different cleaning schedules. Scope, deployment and shift pattern are written for your site after a walkthrough, not selected from a package."
      },
      {
        "q": "How do I request a proposal?",
        "a": "Send an enquiry through the contact form with your facility type, location and rough size. We arrange a site walkthrough, then issue a written proposal covering scope, deployment, supervision and commercials."
      },
      {
        "q": "What types of facilities can Apex support?",
        "a": "Corporate offices, commercial buildings, residential communities, IT campuses, industrial units, warehousing, retail, healthcare, education and hospitality. The service mix changes considerably between them; the way we structure and supervise the work does not."
      },
      {
        "q": "How is quality actually checked?",
        "a": "Through supervision on site rather than a form filled in afterwards. Supervisors work to a written checklist for each area, escalate what they cannot resolve the same day, and review recurring issues with you on a fixed cycle."
      },
      {
        "q": "What about statutory compliance for deployed staff?",
        "a": "Staff placed at your site are engaged on Apex's rolls. Wage, PF, ESI and welfare obligations for those staff sit with us, and the supporting records can be produced for your audits. Please confirm current registration details with us directly before contracting."
      },
      {
        "q": "How do I contact Apex?",
        "a": "Use the enquiry form on the contact page, or the phone and email listed there once those details are confirmed. Enquiries are answered within one working day."
      }
    ]
  },
  "feedback": {
    "_note": "PLACEHOLDER FEEDBACK. Written to describe outcomes facility managers ask for, attributed to roles rather than to named individuals. Nothing here is a real quote from a real client. Replace `quote`, `name` and `role`, then set `confirmed: true`. While confirmed is false the section carries a visible note saying so.",
    "feedback": [
      {
        "quote": "One number to call when something breaks, and a report at month end that tells us what actually happened. That is the whole ask, and it is harder to find than it sounds.",
        "name": "Facility manager",
        "role": "Corporate office, Bengaluru",
        "initials": "FM",
        "rating": 5,
        "confirmed": false
      },
      {
        "quote": "Consistency matters more than intensity. We want the same standard on a Tuesday afternoon as on an audit morning, without anyone being told an inspection is coming.",
        "name": "Administration head",
        "role": "Healthcare facility",
        "initials": "AH",
        "rating": 5,
        "confirmed": false
      },
      {
        "quote": "Safety paperwork has to be ready before the inspector asks, not assembled afterwards. Statutory records are the first thing we check when we review a contract.",
        "name": "Plant operations lead",
        "role": "Industrial facility",
        "initials": "PO",
        "rating": 5,
        "confirmed": false
      },
      {
        "quote": "The supervisor knowing our building matters more than the size of the company behind them. We had four vendors before; the handover between them was where everything fell through.",
        "name": "Estate manager",
        "role": "Residential township",
        "initials": "EM",
        "rating": 5,
        "confirmed": false
      },
      {
        "quote": "Attendance you can verify, consumables logged against a rate, and open issues carried forward instead of quietly dropped. That is what a monthly review should contain.",
        "name": "Finance controller",
        "role": "Logistics facility",
        "initials": "FC",
        "rating": 4,
        "confirmed": false
      }
    ]
  },
  "industries": {
    "_note": "Facility types Apex can support. Delete any that do not apply. `image` paths point at assets/images/.",
    "industries": [
      {
        "id": "corporate",
        "title": "Corporate offices",
        "image": "assets/images/ind-corporate.jpg",
        "alt": "Modern corporate office building",
        "brief": "Occupied floors where cleanliness and uptime are noticed hourly.",
        "needs": [
          "Daytime housekeeping without disruption",
          "Reception and visitor handling",
          "HVAC comfort through the working day",
          "Meeting-room turnaround"
        ]
      },
      {
        "id": "commercial",
        "title": "Commercial buildings",
        "image": "assets/images/hero-towers.jpg",
        "alt": "Commercial high-rise buildings",
        "brief": "Multi-tenant buildings with shared services and separate accountabilities.",
        "needs": [
          "Common-area upkeep",
          "Lift lobbies and parking",
          "Shared plant maintenance",
          "Tenant coordination"
        ]
      },
      {
        "id": "residential",
        "title": "Residential communities",
        "image": "assets/images/ind-residential.jpg",
        "alt": "Residential apartment community",
        "brief": "Apartments and gated communities where residents are the daily audit.",
        "needs": [
          "Common-area cleaning",
          "Gate and visitor control",
          "STP, pumps and water systems",
          "Landscape and amenity upkeep"
        ]
      },
      {
        "id": "itpark",
        "title": "IT parks and campuses",
        "image": "assets/images/hub-facility.jpg",
        "alt": "Multi-block IT campus with shared services and shift-based cover",
        "brief": "Multi-block campuses running long shifts across large footprints.",
        "needs": [
          "Multi-block coordination",
          "Shift-based deployment",
          "Cafeteria and pantry support",
          "Campus landscape"
        ]
      },
      {
        "id": "industrial",
        "title": "Industrial facilities",
        "image": "assets/images/ind-industrial.jpg",
        "alt": "Industrial facility interior",
        "brief": "Plants and units where housekeeping is a safety control, not a finish.",
        "needs": [
          "Shopfloor housekeeping",
          "Safety-led working practice",
          "Utility area upkeep",
          "Waste handling discipline"
        ]
      },
      {
        "id": "warehouse",
        "title": "Warehousing and logistics",
        "image": "assets/images/ind-warehouse.jpg",
        "alt": "Warehouse racking interior",
        "brief": "Large-volume spaces with constant material and vehicle movement.",
        "needs": [
          "High-bay and floor cleaning",
          "Gate and material movement records",
          "Dock and yard upkeep",
          "Pest control at scale"
        ]
      },
      {
        "id": "retail",
        "title": "Retail",
        "image": "assets/images/ind-retail.jpg",
        "alt": "Retail store interior",
        "brief": "Trading hours that leave a narrow window to get everything right.",
        "needs": [
          "Pre-open and post-close cleaning",
          "Front-of-house presentation",
          "Washroom servicing at peak",
          "Waste removal"
        ]
      },
      {
        "id": "healthcare",
        "title": "Healthcare",
        "image": "assets/images/ind-hospital.jpg",
        "alt": "Healthcare facility exterior",
        "brief": "Environments where cleaning protocol and documentation both matter.",
        "needs": [
          "Protocol-led cleaning",
          "Segregated waste handling",
          "High-touch surface routines",
          "Documented service records"
        ]
      },
      {
        "id": "education",
        "title": "Education",
        "image": "assets/images/ind-education.jpg",
        "alt": "Education campus building",
        "brief": "Campuses that fill and empty on a timetable, with safeguarding in mind.",
        "needs": [
          "Between-period cleaning",
          "Washroom servicing at scale",
          "Gate and visitor control",
          "Grounds maintenance"
        ]
      },
      {
        "id": "hospitality",
        "title": "Hospitality",
        "image": "assets/images/ind-hotel.jpg",
        "alt": "Hospitality property exterior",
        "brief": "Guest-facing standards where presentation is the product.",
        "needs": [
          "Public-area upkeep",
          "Back-of-house support",
          "Landscape and pool surrounds",
          "Discreet daytime working"
        ]
      }
    ]
  },
  "projects": {
    "_note": "DEMO CONTENT. Every entry is marked demo:true and renders with a DEMO PROJECT tag. These describe realistic scopes of work, not work Apex has performed. Replace with real sites once the client supplies them, then set demo:false to drop the tag.",
    "projects": [
      {
        "id": "p1",
        "demo": true,
        "category": "Corporate",
        "title": "Multi-floor corporate office",
        "meta": "Bengaluru · Illustrative scope",
        "image": "assets/images/staff/staff-team.jpg",
        "alt": "Apex teams deployed across a corporate campus",
        "scope": "Housekeeping, front office, technical maintenance",
        "brief": "A single-tenant office across several floors, occupied through standard business hours with meeting rooms in near-continuous use.",
        "approach": "Daytime housekeeping sized to footfall rather than floor area, with meeting-room turnaround handled between bookings. A resident technician covers lighting, plumbing and HVAC complaints so small faults never reach a vendor queue.",
        "outcome": "Illustrative scope only — no performance figures are claimed."
      },
      {
        "id": "p2",
        "demo": true,
        "category": "Residential",
        "title": "Gated residential community",
        "meta": "Bengaluru · Illustrative scope",
        "image": "assets/images/ind-residential.jpg",
        "alt": "Residential apartment community",
        "scope": "Housekeeping, security, technical, landscaping",
        "brief": "A community where residents see every lapse immediately and raise it the same evening.",
        "approach": "Fixed gate posts with written duty instructions, a common-area cleaning schedule published to residents, and planned upkeep of pumps, STP and lighting rather than reactive call-outs.",
        "outcome": "Illustrative scope only — no performance figures are claimed."
      },
      {
        "id": "p3",
        "demo": true,
        "category": "Industrial",
        "title": "Manufacturing unit",
        "meta": "Karnataka · Illustrative scope",
        "image": "assets/images/ind-industrial.jpg",
        "alt": "Industrial facility interior",
        "scope": "Shopfloor housekeeping, waste handling, support manpower",
        "brief": "A production environment where housekeeping is a safety control rather than a cosmetic finish.",
        "approach": "Cleaning routines built around the production schedule and safety induction for every deployed operative. Waste segregation and removal on a fixed cycle, with utility areas on the same calendar as the shopfloor.",
        "outcome": "Illustrative scope only — no performance figures are claimed."
      },
      {
        "id": "p4",
        "demo": true,
        "category": "Retail",
        "title": "Retail store network",
        "meta": "Bengaluru · Illustrative scope",
        "image": "assets/images/ind-retail.jpg",
        "alt": "Retail store interior",
        "scope": "Pre-open cleaning, washroom servicing, waste removal",
        "brief": "Several stores whose only free window is before opening and after close.",
        "approach": "Fixed pre-open teams working to a common standard across the network, with peak-hour washroom servicing and a single coordinator across all sites instead of store-by-store escalation.",
        "outcome": "Illustrative scope only — no performance figures are claimed."
      },
      {
        "id": "p5",
        "demo": true,
        "category": "Healthcare",
        "title": "Diagnostic and day-care centre",
        "meta": "Bengaluru · Illustrative scope",
        "image": "assets/images/ind-hospital.jpg",
        "alt": "Healthcare facility exterior",
        "scope": "Protocol-led cleaning, waste segregation, support staff",
        "brief": "A clinical environment where cleaning method and its documentation carry equal weight.",
        "approach": "Written protocols per area type, colour-coded equipment to prevent cross-use, segregated waste handling, and a signed record for every high-touch cleaning round.",
        "outcome": "Illustrative scope only — no performance figures are claimed."
      },
      {
        "id": "p6",
        "demo": true,
        "category": "Corporate",
        "title": "Shared business centre",
        "meta": "Bengaluru · Illustrative scope",
        "image": "assets/images/staff/staff-housekeeping-lobby.jpg",
        "alt": "Apex housekeeping operative maintaining a shared building lobby",
        "scope": "Common-area housekeeping, reception, helpdesk",
        "brief": "A multi-tenant floor where shared areas belong to everybody and therefore to nobody.",
        "approach": "A single accountable supervisor for all shared space, a published cleaning frequency per zone, and a helpdesk that logs tenant requests so recurring problems become visible instead of repeating quietly.",
        "outcome": "Illustrative scope only — no performance figures are claimed."
      }
    ]
  },
  "services": {
    "_note": "Edit, reorder or delete any service here. The home page scroll sequence and the services page both read this file. Remove an entry and it disappears from both. `active: false` hides a service without deleting it.",
    "services": [
      {
        "id": "housekeeping",
        "number": "01",
        "active": true,
        "title": "Housekeeping",
        "short": "Daily upkeep that holds its standard on the three-hundredth day, not just the first.",
        "description": "Trained, uniformed housekeeping teams working to a written scope for your building — floors, restrooms, workstations, common areas, glass and waste. Each site gets a cleaning schedule matched to its footfall, a checklist the supervisor signs, and a named person accountable for the result.",
        "labels": [
          "Daily cleaning",
          "Restroom hygiene",
          "Waste segregation",
          "Glass and facade",
          "Deep cleaning"
        ],
        "image": "assets/images/staff/staff-housekeeping.jpg",
        "alt": "Apex housekeeping team maintaining a corporate office atrium",
        "applications": [
          "Corporate floors and workstations",
          "Restrooms and pantry areas",
          "Lobbies, lifts and common corridors",
          "Periodic deep cleaning and floor restoration"
        ]
      },
      {
        "id": "security",
        "number": "02",
        "active": true,
        "title": "Security",
        "short": "Uniformed, briefed and posted to a written duty chart — not just present, but accountable.",
        "description": "Manned guarding with documented post instructions for every position. Access control, visitor handling, gate and material movement records, patrol rounds and shift handover in writing. Supervisors check posts through the shift rather than only at the start of it.",
        "labels": [
          "Manned guarding",
          "Access control",
          "Visitor management",
          "Patrol rounds",
          "Shift handover"
        ],
        "image": "assets/images/staff/staff-security-team.jpg",
        "alt": "Apex security team managing access control at a building entrance",
        "applications": [
          "Main gate and reception posts",
          "Visitor and contractor entry control",
          "Material inward and outward records",
          "Night patrol and incident escalation"
        ]
      },
      {
        "id": "technical",
        "number": "03",
        "active": true,
        "title": "Technical maintenance",
        "short": "Planned work that stops breakdowns being the only time anyone looks at the plant.",
        "description": "Electrical, plumbing, HVAC and general upkeep run on a planned preventive schedule rather than a call-out queue. Meter readings, filter changes, pump checks and DG runs recorded against a calendar, with breakdown response and escalation defined before anything fails.",
        "labels": [
          "Electrical",
          "Plumbing",
          "HVAC",
          "Preventive schedule",
          "Breakdown response"
        ],
        "image": "assets/images/staff/staff-technical-team.jpg",
        "alt": "Apex maintenance technicians testing building services plant",
        "applications": [
          "Planned preventive maintenance calendar",
          "Electrical panels, lighting and DG sets",
          "Plumbing, pumps and water systems",
          "HVAC servicing and filter management"
        ]
      },
      {
        "id": "landscaping",
        "number": "04",
        "active": true,
        "title": "Landscaping",
        "short": "The first thing a visitor sees, maintained on a schedule instead of on request.",
        "description": "Lawn care, pruning, seasonal planting, irrigation checks and indoor plant upkeep. Grounds are worked to a maintenance calendar so a campus looks the same in the week before an audit as it does in the week after one.",
        "labels": [
          "Lawn care",
          "Pruning",
          "Irrigation",
          "Seasonal planting",
          "Indoor plants"
        ],
        "image": "assets/images/staff/staff-landscape-team.jpg",
        "alt": "Apex landscaping team maintaining the grounds of a corporate campus",
        "applications": [
          "Campus lawns and garden beds",
          "Tree pruning and green waste removal",
          "Irrigation checks and water management",
          "Indoor and lobby plant maintenance"
        ]
      },
      {
        "id": "pest",
        "number": "05",
        "active": true,
        "title": "Pest management",
        "short": "Scheduled, documented treatment — with a record you can produce during an audit.",
        "description": "Treatment programmes for cockroaches, rodents, termites and mosquitoes using approved chemicals, applied on a schedule and logged. Every visit produces a service record showing what was treated, with what, where and by whom.",
        "labels": [
          "General pest",
          "Rodent control",
          "Termite treatment",
          "Mosquito management",
          "Service records"
        ],
        "image": "assets/images/staff/staff-pest.jpg",
        "alt": "Pest management treatment being carried out in a warehouse",
        "applications": [
          "Kitchens, pantries and waste areas",
          "Basements, ducts and service shafts",
          "Perimeter and landscape treatment",
          "Documented records for audits"
        ]
      },
      {
        "id": "manpower",
        "number": "06",
        "active": true,
        "title": "Manpower and support",
        "short": "Front office, pantry, helpdesk and general support staff, deployed and supervised.",
        "description": "Trained support roles placed on site and managed by Apex — front office, pantry and cafeteria support, helpdesk, mailroom, office assistants and general operatives. Attendance, replacement cover and statutory paperwork are handled by us, not by your admin team.",
        "labels": [
          "Front office",
          "Pantry support",
          "Helpdesk",
          "Office assistants",
          "Replacement cover"
        ],
        "image": "assets/images/staff/staff-pantry-team.jpg",
        "alt": "Apex pantry and support staff running an office refreshment counter",
        "applications": [
          "Reception and front office",
          "Pantry and cafeteria support",
          "Facility helpdesk and coordination",
          "Mailroom and office assistance"
        ]
      }
    ]
  },
  "team": {
    "_note": "Roles shown in the People section. These describe positions in a facility team, NOT named individuals — no person is invented anywhere on this site. Add real people only with their consent and a real photograph.",
    "roles": [
      {
        "id": "supervisor",
        "role": "Facility supervisor",
        "label": "Supervision",
        "line": "Walks the site, signs the checklist, and owns what did not get done.",
        "image": "assets/images/staff/staff-supervisor.jpg",
        "alt": "Apex facility supervisor on a corporate office floor"
      },
      {
        "id": "housekeeping",
        "role": "Housekeeping operative",
        "label": "Care",
        "line": "Holds the same standard on an ordinary Tuesday as on an audit day.",
        "image": "assets/images/staff/staff-housekeeping-detail.jpg",
        "alt": "Apex housekeeping operative cleaning an office workspace"
      },
      {
        "id": "security",
        "role": "Security personnel",
        "label": "Control",
        "line": "Knows the post instructions without being asked for them.",
        "image": "assets/images/staff/staff-security.jpg",
        "alt": "Apex security officer at a building reception desk"
      },
      {
        "id": "technician",
        "role": "Maintenance technician",
        "label": "Uptime",
        "line": "Finds the fault on the schedule, not on the complaint.",
        "image": "assets/images/staff/staff-technician.jpg",
        "alt": "Apex maintenance technician inspecting an HVAC panel"
      },
      {
        "id": "landscape",
        "role": "Landscape operative",
        "label": "Presentation",
        "line": "Maintains the first thing every visitor forms an opinion about.",
        "image": "assets/images/staff/staff-landscape.jpg",
        "alt": "Apex landscape operative maintaining a campus garden"
      },
      {
        "id": "pantry",
        "role": "Pantry and support staff",
        "label": "Hospitality",
        "line": "Keeps the everyday things stocked, clean and ready before anyone asks.",
        "image": "assets/images/staff/staff-pantry.jpg",
        "alt": "Apex pantry service staff member preparing refreshments in an office pantry"
      }
    ]
  },
  "uniform": {
    "_note": "Drives the uniform showcase. `spec` items become the interactive hotspots on the uniform photograph. `x` / `y` are percentages of the image. Update the measurements once the client confirms their uniform standard.",
    "intro": {
      "eyebrow": "The Apex standard",
      "headline": "Every detail represents a standard.",
      "body": "A uniform is the first thing anyone in your building reads about the people working in it. Shirt colour identifies the service line, the chest logo identifies the company, and the name badge and photo ID identify the person — so nobody in your facility ever has to wonder who is on their floor or why."
    },
    "photo": {
      "image": "assets/images/staff/uniform-full.jpg",
      "alt": "Apex facility supervisor in uniform walking a client office floor with a checklist"
    },
    "spec": [
      {
        "id": "colour",
        "code": "A",
        "title": "Service-line colour",
        "detail": "Shirt colour says which team a person belongs to before anyone reads a badge — blue for housekeeping, green for landscaping, navy for technical, black for security, white for pantry and grey for supervision.",
        "image": "assets/images/staff/staff-team.jpg",
        "alt": "Apex teams in service-line uniform colours",
        "x": 50,
        "y": 36
      },
      {
        "id": "logo",
        "code": "B",
        "title": "Chest logo",
        "detail": "Wearer's left chest, 70 mm wide, embroidered flat stitch. The same mark on every shirt, every site, every service line.",
        "image": "assets/images/staff/uniform-logo.jpg",
        "alt": "Close crop of the embroidered Apex chest logo",
        "x": 72,
        "y": 31
      },
      {
        "id": "badge",
        "code": "C",
        "title": "Name badge",
        "detail": "Wearer's right chest, 75 x 24 mm. Name over role, so the person in front of you can be addressed by name rather than flagged down.",
        "image": "assets/images/staff/uniform-logo.jpg",
        "alt": "Close crop of the Apex name badge",
        "x": 48,
        "y": 32
      },
      {
        "id": "id",
        "code": "D",
        "title": "Photo ID",
        "detail": "86 x 54 mm card on a breakaway lanyard. Photo, name, staff ID, site, and a colour band matching the service line.",
        "image": "assets/images/staff/uniform-id.jpg",
        "alt": "Close crop of an Apex photo ID card on a lanyard",
        "x": 58,
        "y": 45
      },
      {
        "id": "epaulette",
        "code": "E",
        "title": "Supervisor grade",
        "detail": "Supervisors carry a shoulder marking, so the person accountable on site is identifiable at a glance rather than by asking around.",
        "image": "assets/images/staff/uniform-full.jpg",
        "alt": "Apex supervisor shoulder detail",
        "x": 76,
        "y": 24
      },
      {
        "id": "tape",
        "code": "F",
        "title": "Service tape",
        "detail": "Left sleeve, service line printed in full — housekeeping, security, technical, landscape, pest or pantry.",
        "image": "assets/images/staff/uniform-full.jpg",
        "alt": "Apex sleeve service tape detail",
        "x": 40,
        "y": 38
      },
      {
        "id": "hem",
        "code": "G",
        "title": "Reflective hem",
        "detail": "Technical and night-shift grades carry a 20 mm reflective band, because plant rooms and basements are not lit like offices.",
        "image": "assets/images/staff/staff-technician.jpg",
        "alt": "Apex technician working in a plant room",
        "x": 60,
        "y": 62
      }
    ]
  }
};
