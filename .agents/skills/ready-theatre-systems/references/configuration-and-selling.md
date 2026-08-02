# RTS configuration and selling model

## Configuration graph

Think of RTS configuration as a dependency graph:

`Distributor -> Film -> Auditorium/Schedule Location -> Performance -> Price Category -> Ticket Types -> Selling Channels`

Concessions follow a parallel graph:

`Subtotal/Tax -> Item/Modifier -> Stock Source -> Selling Station -> Register/App Layout -> Order Routing`

A visible symptom can originate several nodes upstream. Trace the graph before changing a website label or sale rule.

## Films and distributors

- Create the distributor before assigning it to a film.
- Prefer the Internet Film List when creating a film. Ask RTS Support when the correct film is missing instead of fabricating distributor/reporting identity.
- Distinguish the short/database `Title` from the customer-facing `Display Title`.
- Film configuration includes length, rating, distributor/reporting codes, story code, synopsis/content, format/amenity flags, and per-channel display/sale flags.
- Relevant channel flags can independently control third-party display/sale, kiosk display, RTN display/sale, distributor reporting, and signage.
- A story code groups related versions in the app. A custom or premium-format version may need a distinct title and no shared story code to prevent incorrect grouping.
- For IMAX/PLF or simultaneous standard/premium runs, use distinct film records when required. Include the format in both title fields because different reports may use different names.
- Changing a title after sales requires the supported title-translation workflow; do not delete/recreate a sold performance to correct display text.

## Auditoriums, schedule locations, and performances

- A physical auditorium/place and an RTS schedule location are related but distinct configuration concepts.
- A schedule location owns defaults such as price category, places, capacity, warnings, and possibly a reserved-seat layout.
- Seat capacity protects against oversell, subject to privileged overrides and channel-specific sold-out thresholds.
- Add amenities/formats to both the film and the applicable auditorium/schedule location. Existing performances may require manual editing after the defaults change.
- Use the current/new scheduler described by RTS when feature propagation depends on it.

Performance states are operational:

- scheduled/green: created but not yet open for sale;
- open/yellow: on sale;
- sold/red: contains sales.

Open performances for deliberate date ranges. A performance can override price category, ticket-class rule, ticket availability, title translation, and amenities. Inspect the specific show when a single time behaves differently from its neighbors.

## Ticket pricing

- A price category groups ticket types for a performance. RTS recommends keeping the number of categories small enough to manage reliably.
- A ticket type can have different database, employee, printed, Internet, kiosk, and app names.
- Configure pre-tax price, tax fields, loyalty points, channel enable flags, and per-integrator API access separately.
- A ticket can be linked to a concession item for packages or special programs.
- Ticket-class rules determine eligibility and availability, not just display order.
- Special-event and National Cinema Day configurations must preserve reporting, tax, fee, and distributor requirements.

Do not hard-code current ticket prices from the website as if they are authoritative. The selected RTS performance and checkout determine the actual sale.

## Concessions and modifiers

A complete concession item requires:

- an item definition and customer/employee naming;
- a revenue or deduction subtotal;
- tax, fee, points, and other settings;
- assignment to the applicable selling stations;
- stock source/inventory behavior;
- placement in register, kiosk, app, or restaurant layouts;
- remote printer/pickup routing when relevant.

Clone a similar item when that safely preserves station and subtotal configuration. Use `Create` for non-inventory items and a stockroom/inventory station for tracked products.

Modifier/recipe behavior includes a main item, subitems, minimum/maximum selections, stock sources, quantity, discount, hidden/helper/special/reward flags, and channel layout. The effective price follows the main price plus selected subitem prices less modifier discounts. Ensure modifier stock depletion points at the intended inventory source.

## Inventory

RTS supports two common control models:

1. All selling stations draw from a central stockroom. This is simpler but provides less cashier-level accountability.
2. Each selling station draws from its own inventory station, replenished from the stockroom. This provides tighter accountability with more transfer/count work.

Operational actions:

- `Receive/Return`: record stock received or returned; the transaction is not final until `Finish`.
- `Correct Inventory`: set actual counted quantities.
- `Transfer`: move stock between locations/stations in the building.
- `Waste`: remove stock with a documented reason.
- `Current Details`: inspect real-time movement.

Some sales-versus-inventory and station reports settle or update after deposit close. Do not “fix” an apparent discrepancy before checking that close boundary and all unfinished receive/return operations.

## Amount-entry items, fees, surcharges, and tips

- A variable positive charge can use a revenue item with a small positive unit value and amount entry.
- An offset/deduction can use a negative item with the correct deduction subtotal.
- Assign sensitive adjustments only to intended stations/layouts and protect amount entry with permissions.
- Use traceable items for rentals, donations, tax offsets, and adjustments; never hide money outside reporting.

A convenience/transaction fee uses a zero-price item, a subtotal, transaction-fee rules, station/item-group assignment, and optional ticket/tax behavior. Permissions govern removal for cash/gift tenders. Disabling an online fee can require an RTN option change and Internet Server restart.

A credit-card surcharge is separate from a transaction fee and affects the card grand total. Validate processor and legal requirements. Tip retention moves card tips into the retained-tip accounting flow so they do not incorrectly reduce a station deposit.

## Gift cards, loyalty, and memberships

RTS Mag Cards can represent gift value, loyalty/rewards, Super Savers, or registered customer cards. Card numbers must be generated or imported into RTS.

- Local cards are maintained at one location; remote/chain cards can use a central Mag Card Server.
- Registered cards may hold money, passes, item credits, points, and member identity.
- Manual value or point changes, transfers, and clearing require permission and remain auditable.

Membership configuration includes:

- tiers, default program, price, duration, renewal, and fee waivers;
- concession discounts, with items explicitly opted into membership discounting;
- point earning and item upgrades;
- ladder/achievement points versus spendable points as distinct ledgers;
- registration, automatic rewards, point exchange, and required membership tickets;
- optional third-party auto-pay/auto-renewal flows.

Do not convert ladder and spendable points as though they are the same balance. A membership refund may prompt whether to expire the membership; include that decision in the procedure.

## Online, mobile, kiosk, and API channels

RTS channels have different configuration surfaces:

- **Legacy RTN website:** served by the RTS Internet Server; HTML/CSS/JS customization is separate from WebApp/mobile customization and requires an Internet Server restart.
- **WebApp/mobile app:** location-branded ticket/concession sales, loyalty, saved hosted payment, geolocation, and messaging features configured with RTS.
- **Third-party/API:** links, iframe-style handoff, schedule access, or selling access governed by API users and per-ticket permissions.
- **Kiosk:** separate station, ticket/item availability, thresholds, layout, card reader, and receipt behavior.
- **Usher app:** validates tickets and supports the current RTS usher workflow.

Advanced online pickup search can use performance/purchase date, email, last four digits when available, and pickup status. Hosted payment flows can make last-four data unavailable. Confirmation email can be resent.

Pay At Counter generates a short-lived six-digit/QR code from a signed-in app. The code expires after about five minutes. Depending on selection order, stored gift/card value may be applied first. Do not persist the code as a reusable customer token.

Customer-initiated mobile/desktop refunds are governed by RTS configuration, device/session constraints, processor settlement, and theater policy. Current canceled-performance refund tooling is preferable to asking every customer to self-refund.

## Online concessions

To sell concessions in the app:

- assign items to the RTS App station;
- build app menu groups and item/modifier presentation;
- configure availability schedules—an item without an applicable schedule may not appear;
- configure pickup methods and timing;
- add customer questionnaires with type, required state, and pre-purchase placement;
- route orders to Order Manager, Pickup Viewer, or remote printers.

Order state normally progresses `Not Checked In -> Checked In -> Completed`. Order Manager can see all orders; pickup viewers and remote production may show only checked-in orders. Text messaging can communicate order-ready/finished status when licensed and configured.

## Restaurant operations

- Quick Service tabs use `Pick Tab`, add/send items, optionally capture a card, and settle/tip later.
- The table-service Restaurant Interface uses a reserved/table layout and a `Reserved Seat Tabs` station type, often with local PIN login.
- Tabs can be assigned to a seat/table/user, routed to kitchen printers/viewers, split, transferred, combined, renamed, and paid with captured or multiple tenders.
- Order routing uses Windows TCP/IP printers, RTS remote-printer configuration, server or per-station print hosting, and item routing. The older concessions item-routing menu is deprecated.
- Pickup Viewer supports item/station filters, expeditor behavior, finish/print, and bump-bar operation. Item-group routing takes precedence where documented.

At restaurant close, servers finish tabs, tips, and cash; a manager finalizes server activity; ordinary stations close; then the deposit closes. Do not close the deposit around open tabs.

## Reserved seating

- RTS Support commonly builds layouts from blueprints showing rows, seats, wheelchair/companion positions, counts, and room orientation.
- A seat hold applies to a specific performance/time and removes that seat from online/kiosk availability while active.
- Marking a seat broken is global/immediate but does not automatically refund or relocate existing purchasers.
- Seat swap records a void/new ticket and can print replacement output.
- Seat history is the diagnostic trail for double-booking, holds, and moves.
- Ticket exchange changes ticket type and settles the price difference.
- Automatic seat buffering can use row/radius rules and layout-specific tuning. Online buyers cannot override it; authorized employees may have an override.
- Seat-buffer changes can require restarting the server, kiosk, and workstations according to the installed RTS version.

Never manipulate reserved inventory with a generic “available” flag in the public website. Let RTS checkout enforce real-time seat state.

## Signage, messaging, and timeclock

- Assign signs to Chromecast devices from RTS digital-signage setup.
- Confirm a Chromecast is visible in Chrome first. If Chrome sees it but RTS does not, run RTS discovery and then restart the Internet Server from the server/signage host.
- Disable unwanted HDMI-CEC power behavior and enable stay-awake behavior on compatible Chromecast devices when needed.
- Licensed text messaging can handle customer communication and order-ready workflows; collect phone data only for the intended use.

Legacy timeclock details include departments, employees with multiple department roles, local station/fingerprint/login-only settings, break/lunch policy, schedule lockouts, pay rates, graphical scheduling, punches, and payroll reports. Verify menu paths and payroll behavior in the current installed version. Pay-rate changes are not necessarily retroactive.
