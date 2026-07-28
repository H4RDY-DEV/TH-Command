# TH Command v8.3.1 — QR Scan Fix

This patch replaces the long encoded QR payload with a normal, shorter web URL.

## Fixed

- QR codes now point to `/scan`
- Native phone cameras recognise the code as a web link
- The asset details are passed as normal URL parameters
- Existing v8.3 encoded QR links remain supported
- The built-in TH Command camera scanner still works

## Deployment

Replace the current TH-Command repository contents with this ZIP and redeploy on Vercel.

After deployment, regenerate and print any QR labels created with v8.3.
