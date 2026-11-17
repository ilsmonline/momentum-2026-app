# Momentum 2026 · public reserved seating data

**Current state:** `data/seating.json` is published for attendees and contains 26 churches' section and row assignments, plus open seating zones. Source was the updated November 17, 2026 Reserved Seating workbook.

## Updating after changes

1. Make changes in the authoritative 2026 Reserved Seating workbook first.
2. Re-export the approved church, section, row and seat ranges into `data/seating.json`, update the `updated` date, and commit the changes.
3. Refresh the app. Both the **Find My Church** directory and the **interactive arena map** read from this same file; there is no second copy of the assignments to change.

**The JSON is not automatically synced with Google Sheets.** After changes, republish the data.

Public church entries have this structure:

```json
{
  "church": "Example Church",
  "city": "Example City",
  "allocations": [
    {"section":"101","rows":"A–B","seats":"1–4"},
    {"section":"101","rows":"C–D"}
  ]
}
```

The example is synthetic. `seats` is optional and used for partial-row reservations, shown as striped bands on the schematic map. The map does not infer which end of a row the partial seats occupy.

Open-seating data lives in `openSeating.sections` (numbered sections and open row ranges), and `openSeating.areas` (all floor seating and rear middle seating). **First-come, first-served** does not mean seats are available in real time.

Publish only church, city, section, row, and seat allocations. **Never publish** participant names, contact data, headcounts, ADA/accessibility needs, follow-up notes, or internal production details. Confirm special access accommodations directly with event staff, without putting that information into the public map.

Both the styled arena map and the directory show a schematic; always follow event signage for final seat selection.
