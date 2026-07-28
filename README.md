# TH Command v8.3.6 — Full Asset Details Fix

This release fixes missing Category, Manufacturer, Model and other asset information.

## Improvements

- Main Assets table now visibly shows Category, Manufacturer and Model.
- Asset records are normalised to support older field names.
- New `THA2` QR format uses shorter property names while retaining the full record.
- QR is generated larger with lower error correction, making dense asset records easier for mobile cameras to scan.
- QR modal shows the exact asset details being encoded before the label is printed.
- Mobile scanner displays a warning when an old QR label contains only basic information.
- Existing v8.3.3, v8.3.4 and URL QR formats remain supported.

## Important

Deploy this version, then click **QR Label** and create a fresh label. A previously printed QR cannot gain fields that were not encoded into it.
