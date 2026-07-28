# TH Command v8.2

Standalone static application prepared for `command.th-technical.co.uk`.

## Included modules

- Dashboard with live local metrics
- Jobs module with create, edit, delete, search and status filters
- Assets module with:
  - Equipment records
  - Categories and manufacturers
  - Quantities and availability
  - Storage locations
  - Daily hire rates
  - Service dates
  - Create, edit, delete, search and filters
- Navigation placeholders for Warehouse, CRM, Crew, Finance and Settings

## Deployment

Replace the contents of the dedicated `TH-Command` repository with the contents of this ZIP, commit, and redeploy through Vercel.

Existing locally-created jobs remain in the same browser because this release keeps the same localStorage keys.

## Temporary authentication

Any valid email and any password will sign in. Replace this with Supabase authentication before production use.
