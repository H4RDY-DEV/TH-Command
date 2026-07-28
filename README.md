# TH Command v8.3.3 — Mobile Scanner Fix

This release changes newly generated asset QR codes to a compact plain-text TH Command format:

`THCMD|ASSET|1|...`

This is more reliable inside the TH Command mobile scanner than long URLs with encoded query parameters.

## Important

After deploying this version, generate a new QR code for the asset. Old printed labels can still be read where possible, but the new compact QR format is the recommended format.

## Scanner address

Open:

`https://command.th-technical.co.uk/scan.html`

Press **Start camera**, then scan the newly generated asset QR code.

## Also fixed

- Reads the decoded value from multiple html5-qrcode callback fields.
- Supports rear-camera fallback behaviour on mobile browsers.
- Displays the exact decoded value when recognition fails.
- Retains support for older URL and encoded QR formats.
