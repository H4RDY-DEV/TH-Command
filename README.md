# TH Command v8.3.4 — Asset Data Fix

This patch fixes QR scans that recognised an asset but displayed empty information.

## Changes

- New QR payload format: `THCMD-ASSET-V1:`
- Stores a compact Base64URL JSON snapshot of the complete asset record
- Includes:
  - Asset ID and name
  - Category
  - Manufacturer and model
  - Serial/reference
  - Location
  - Status
  - Quantity and available quantity
  - Daily rate
  - Service due date
  - Notes
- Keeps support for older pipe-delimited, URL and encoded QR formats
- Mobile scan result now displays the complete asset snapshot

## Required

After deployment, open each asset and generate a new QR code. Previously generated labels do not contain all of the new fields.
