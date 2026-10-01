# Breeze landing page concepts

Build new landing page concepts as separate `website-N` folders so earlier concepts remain available for comparison. Use standalone `index.html` and `style.css`; add `script.js` and local `assets/` when useful. The source material is the existing Breeze website at https://www.breezehc.com/ and the brand assets in `../breeze-web/public/`.

## Content and section order for website-2 and future concepts

Keep the content and order below unless the user changes the brief. The visual design can be original and more creative than the old site.

1. **Hero:** Create an original hero that clearly introduces Breeze Heating & Cooling and gives visitors an immediate way to contact the company.
2. **Cooling and Heating:** Feature both services prominently, using the original website's wording:
   - **Cooling:** “Our expert technicians work to cool your TN home efficiently and affordably with high-quality Middle Tennessee cooling systems, maintenance and emergency repairs. Trust us with your comfort.”
   - **Heating:** “From new installations and retrofits to emergency repairs and maintenance, Breeze delivers award-winning Middle Tennessee heating services to TN customers. Your satisfaction is our priority.”
3. **1st Class Service With A Smile:** Use this heading and body text:

   > Welcome to Breeze Heating & Cooling: where quality and service never go out of style. Serving Middle Tennessee, Breeze delivers client–focused service. Throughout every visit, we treat your property and family with respect. And, when it comes to indoor comfort–there’s nothing we can’t handle. We’re a Middle Tennessee’s mainstay, and a trusted partner for all of your HVAC needs.

4. **Professional HVAC Services:** Show Heating, Cooling, Repairs & Services, Mini-split Systems, Water heater solutions, and Indoor quality. The reference is the old site's diagram with six circular service images arranged around a central shape. Reinterpret it creatively while keeping the six services easy to scan.
5. **Nashville's Best Heating and Cooling Company:** Use this exact heading and body text, with an HVAC repair technician image:

   > Residents of Nashville, Brentwood and surrounding areas have relied on the reliable services provided by Breeze for more than two decades. When our loyal customers call us for a furnace repair on a cold winter’s night or a hot summer’s day, we know that they need our help right away, not next week. Our core values of honesty, integrity, and service guide us in our mission to provide the very best to you and the local community.

6. **Company History and Our Philosophy:** Use these headings and paragraphs:
   - **Company History:** “Our company has been family owned and operated on both residential and commercial jobs for more than two decades. You can count on us to stand behind our work and provide the solid result you expect. Our commitment to ensuring our customer’s comfort all throughout the years garnered the respect and loyalty of residents all around the middle Tennessee area.”
   - **Our Philosophy:** “Our mission is to provide the highest quality HVAC service to all our customers. We proudly serve our customers in a timely manner at a reasonable price. All of our services are matched by quality workmanship, trusted results, and long term peace of mind.”
7. **Nashville map:** Include a Google Map of Nashville.
8. **Contact form:** End the page with the request form. Place an optional, unchecked checkbox at the end that lets a client agree to SMS contact from Breeze about their request and appointment updates. Include the checkbox selection in the submitted request and preserve a clear record of consent when a production backend is added.

## Navigation and interaction

- Treat these concepts as home pages for a multi-page website, not as single-page websites. Keep the original Breeze navigation structure and labels: **Home**, **HVAC** (dropdown), **Promotions**, **Emergency**, **Client**, and **About us** (dropdown).
- The **HVAC** dropdown contains, in order: Heating; Cooling; Repairs & Services; Indoor quality; Water heater solutions; Mini-split systems; Energy audits; Commercial & Industrial; Residential; Property manager; Comfort club; Financing; Wi-Fi and Learning Thermostats.
- The **About us** dropdown contains, in order: Meet the HVAC experts; Contact us; Why Choose Breeze; Careers.
- Home returns to the landing page. Each other top-level item and each dropdown item has its own route. Until those pages are built, each route shows only the text **“Comming Soon”** (this spelling is intentional for the current placeholder request). Apply this navigation pattern to `website-2` and future landing page concepts.
- Make dropdowns work with mouse, keyboard, and touch. Use distinct submenu controls so the HVAC and About us labels can remain links to their own routes.
- Keep the navigation visible while scrolling on desktop and mobile, with a call or contact action always available.
- Buttons stay still on hover. A small color change is welcome; an arrow inside a button may grow without shifting the button or its label.
- Make every concept responsive and accessible, with working route links and clear form labels.
