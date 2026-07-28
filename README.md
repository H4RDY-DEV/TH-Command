# TH Command v8.3.5 — Asset Actions

This release adds three clear actions to every asset row:

- Edit
- QR Label
- Remove

## Remove workflow

Selecting **Remove** now offers two options:

### Archive asset
- Keeps the asset record
- Changes its status to `Archived`
- Stores an archive timestamp
- Allows the record to remain available for future restoration/history work

### Delete permanently
- Requires typing `DELETE`
- Removes the asset from localStorage
- Updates the asset list and dashboard totals immediately
- Cannot be undone

## Existing QR functionality

The complete v8.3.4 asset-data QR format remains included.
