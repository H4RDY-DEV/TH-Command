# TH Command v8.3 — Asset QR Codes

This release adds QR labels and a mobile asset-scanning page.

## New features

- Generate a QR code for every asset
- Print asset QR labels
- Copy each QR link
- Mobile camera scanner at `/scan.html`
- QR codes can also be opened directly using the phone's normal camera app
- Read-only mobile asset record display
- QR payload contains a compact snapshot of the asset, so scanning works before a shared database is connected

## Existing modules

- Dashboard
- Jobs
- Assets
- Placeholder routes for Warehouse, CRM, Crew, Finance and Settings

## Important limitation

The current application stores editable data in each browser's localStorage. QR codes therefore include a read-only asset snapshot so another phone can display the record.

For live updates, check-in/out history and shared inventory across desktop and phone, the next infrastructure stage should connect TH Command to Supabase.

## Deployment

Upload the contents of this ZIP to the root of the dedicated TH-Command repository and redeploy on Vercel.
