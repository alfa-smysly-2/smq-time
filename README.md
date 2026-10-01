# SMQ TIME

Static watch catalog for GitHub Pages. The site keeps the SMQ TIME name and uses the dark navy and muted gold palette from the supplied McQueen Shop PDFs.

## Catalog content

- `catalog.json`: 44 Rolex and 49 Audemars Piguet variants, with source PDF and page for each item.
- `assets/watches/`: 93 transparent product images extracted from the corresponding PDF pages and converted to WebP.
- `scripts/import_catalog.py`: repeatable importer. Run with `pypdf` and `Pillow` installed:

  ```sh
  python3 scripts/import_catalog.py "mcqueen catalog.pdf" "mcqueen AP catalog.pdf"
  ```

The source PDFs do not state prices, stock, delivery terms, warranty, or independent authentication results. The site therefore presents those details as matters to confirm with the seller and links to the contacts printed in the PDFs. It does not collect or submit orders.

## Preview

```sh
python3 -m http.server 8765
```

Open `http://localhost:8765/#/`.
