# Public reserved seating data

The Momentum app reads **`data/seating.json`** when visitors open the `Find My Church` page.

The data file is deliberately **unpublished**. The 2026 seating workbook still labels assignments as **DRAFT**, including unresolved accessibility follow-ups. Do not publish draft assignments to a public GitHub Pages site.

When the seating team has explicitly approved the final assignments, replace the file with public-only fields:

```json
{
  "schema": 1,
  "published": true,
  "updated": "2026-11-19",
  "churches": [
    {
      "church": "Example Church",
      "city": "Example City",
      "allocations": [
        {"section": "101", "rows": "A-C"}
      ]
    }
  ]
}
```

**Important:** The example above is synthetic and is *not* a real seating assignment. Replace it completely with approved data. Preserve original full church names and cities to differentiate similarly named groups.

For split or partial seating areas, use multiple allocations, optionally including seat ranges:

```json
"allocations": [
  {"section":"101", "rows":"A-B", "seats":"1-4"},
  {"section":"101", "rows":"C-D"}
]
```

Only publish **church, city, section, row range, and seat range**. Do not publish registration headcounts, names of individuals, contact information, accessibility needs, or administrative comments. A church's absence from the public finder does not prove it is ineligible.

**Approved source:** 2026 Reserved Seating workbook, final approved version of the `Draft Seat Assignments` tab. The Nov 17 sheet is still a working draft. Cross-check totals and special seating needs privately with the event team before finalizing. Updating this JSON updates the public finder without any HTML/code changes.
