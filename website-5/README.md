# Website 5 — A breath of fresh care

An editorial Breeze concept using the shared curve sketch as a single flowing accent. The design uses paper tones, brand blue, a darker orange for readable white button labels, large typography, rectangular photography and an interactive service directory.

Open `index.html` through a local static server or deploy the complete `website-5` folder. Assets and placeholder routes are self-contained. The logo is the Home link, carrying forward the requested navigation preference.

## Request form

The concept prepares an email; it does not submit to a backend or claim an appointment is booked. The optional SMS checkbox starts unchecked. The email includes the choice, exact consent wording, wording version, UTC preparation time, source and request ID. No personal form data is saved in browser storage.

When adding a production endpoint, persist the request and consent together, including the actual checkbox boolean, wording and version, source, request ID, and server receipt timestamp. Keep this record even when consent is false. A phone number or form submission must never imply SMS permission. Keep appointment messaging consent separate from marketing consent and honor opt-out requests.

## Routes

All non-home navigation destinations have independent directories containing only the requested `Comming Soon` placeholder text.
