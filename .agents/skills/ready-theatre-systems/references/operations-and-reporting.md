# RTS operations, reconciliation, reports, and support

## Daily opening

Opening establishes selling readiness rather than a new accounting period by itself.

- Confirm server, Internet, printers, card readers, cash drawers, scanners, and applicable kitchen/signage devices.
- Confirm the correct date, theater, terminal, and station.
- Open intended stations with the configured starting bank.
- Verify current performances are open and channel-visible.
- Verify a representative online show reaches the correct RTS checkout before traffic begins.

The starting cash bank is included in station-close accounting but is removed from the actual bank deposit calculation. Do not treat it as sales revenue.

## Daily close and accounting boundary

Use this order:

1. Complete or resolve open restaurant tabs, servers, tips, and cash where applicable.
2. Close every selling station and count its drawer, including over/short handling.
3. Confirm no open stations remain.
4. Close the deposit, entering the physical bank deposit net of starting banks.
5. Batch/settle cards with the required secure user.
6. Close tickets.
7. Confirm configured box-office reports, EBOR/data exports, accounting exports, and report emails.

Deposit close is a material accounting boundary. Inventory reports, automated reporting, accounting exports, and ticket/distributor transfers can depend on it. Do not edit closed data casually or close a deposit merely to make a report update.

## Canceled performance and batch refunds

Use the maintained `Cancel a Performance and Refund all Purchases` procedure for a canceled show:

1. Open `Show Schedule` and choose the performance.
2. Use `Close Performance (Refund All)`.
3. Enter a reason and verify the transaction count and performance identity.
4. Start once and leave the progress window open.
5. Review every transaction status.

Documented statuses include:

- `Refunded`: completed to the original supported tender.
- `Cash Queued`: customer cash must be paid and then marked paid in the cash-refund queue.
- `Partial Refund`: some components require review.
- `Manual Action Required`: complete that transaction separately.
- `Failed`: diagnose and retry only through the supported individual path.
- `Skipped`: inspect the reason and current transaction state.

Cancellation blocks further sales even if some refunds require manual action. Do not close the window during processing and do not run refund-all twice. Emails are sent where a transaction has an email address.

For cash queue items, use the documented `Refund Transaction > Customer Cash Refund` flow and mark paid only after cash is actually delivered.

Legacy documentation describes manual voiding by turning `Void` on, selecting general-admission tickets or reserved seats, and tendering the offset. It also describes pickup-before-void behavior for old online sales. Use this only when the current installed version and current transaction type require it; do not override the maintained batch-cancel flow.

## Individual online/mobile refunds

- Follow the current RTS app/desktop refund feature and theater policy.
- Confirm transaction, performance, tender, amount, fee policy, and settlement state.
- Customer self-service may require the same device and an authenticated account.
- Settlement can take multiple days.
- Service/convenience fees may follow a different refund policy from ticket value.
- Never convert an online card refund into untracked cash because the original transaction is inconvenient to locate.

## Reporting map

### Deposit reports

The customizable `Deposit - Total` report is the broadest close/reconciliation report. It can include:

- tickets by performance, type, title, and show;
- shifts, cash drops, stations, and tenders;
- items, discounts, waste, and subtotals;
- inventory corrections, receive/return, sales-versus-inventory, and station inventory;
- card authorization and batch detail;
- daily sales and reconciliation sections.

Report groups control included sections and automatic email distribution. Deposit notes/memos can explain anomalies without changing underlying transactions.

Other deposit-family reports include API sales, advance ticketing, restaurant guests, bank deposit, comps, concession hourly/totals, card search, deposit breakdown/recap, discounts, employee/item sales, gift-card station sales, kitchen times, location item sales, pass logs, sales classification/log, tax by subtotal, ticket hourly, tip/tip-share, void, and waste detail.

### Ticket reports

Use ticket reports for:

- advance sales and sales channel;
- box-office/checker/daily/open-ticket views;
- film admissions, gross summary, hourly sales, and Internet ticket sales;
- ticket logs, occupancy, Screenvision attendance, breakdowns, top films, vehicle admissions, weekly, and year-over-year attendance.

An open/daily ticket report is not identical to a closed deposit. Choose the date basis—sale date, performance date, open ticket date, or deposit date—deliberately.

### Inventory reports

Available current report families include circuit details, concession sales versus inventory, cost, cost on hand, count sheets, current details, inventory remaining, order lookup, and terminal sales versus inventory. Reconcile stock source, station, unfinished receives/transfers, waste, and deposit timing before treating a difference as shrinkage.

### Mag Card and membership reports

Use activity/daily logs for movement, individual card lookup for customer investigation, current balances/system total for liability, expired and outstanding-loyalty summaries, registered-card/member information, membership sales, and online gift purchases.

### Operational monitors and logs

- Monitors: Chromecast, sales, tickets, and future kitchen orders.
- Schedules: employee, usher, and showtime.
- Stations: open, closed, and drawer status.
- System logs: drink, held seats, Internet ticketing card events, and ping logs.
- Timeclock: current status/hours, daily/details/employee, labor/payroll cost, payroll, and questionnaire.

### Web reporting

RTS provides remote web reporting when configured. Give reporting users only required access. Treat remotely downloaded reports as sensitive business data and avoid exposing customer/card information.

## Distributor and accounting outputs

- Fandango deposits must be reconciled to external vendor settlement and sales-channel reports, not assumed to equal a local card batch.
- Comscore/Rentrak/Swift/Maccs-style transfers can be tied to ticket close or deposit close.
- MaccsBox EBOR can auto-send when tickets close and may refuse a date with open tickets. Credentials are case-sensitive and provider-supplied.
- Numero supports hourly automatic reporting and a multi-day nightly catch-up, plus preview/test/manual send.
- QuickBooks desktop uses account allocation and IIF export. Current documentation requires short subtotal names compatible with the export.
- QuickBooks Online uses OAuth, a deposit account/class, fail-email, optional split by subtotal, account import/allocation, and automatic export at deposit close. A red/manual error commonly indicates missing allocation.

Do not copy sample/provider credentials from public articles. After configuration, use a report/export preview and reconcile totals before enabling automation.

## Troubleshooting by symptom

| Symptom | First checks | Avoid |
|---|---|---|
| Website schedule stale/missing | Correct RTN; performance open; film/channel flags; Internet Server status; upstream transformer timestamp/eTag; API Gateway payload | Editing the React display before confirming source data |
| Sale link opens wrong show/venue | RTN, show ID, place ID, chain ID, payload origin | Reconstructing links from film title/time |
| Checkout unavailable | Server/Internet Server; ports/TLS; performance state; API/web account; RTS status | Repeated purchases or disabling TLS |
| One channel misses a film | Film and ticket channel flags; performance override; kiosk/app/API access; schedule refresh | Assuming all channels share one flag |
| Chromecast absent | Same network; Chrome cast discovery; RTS discovery; Internet Server restart on server/signage host | Rebooting every device without checking network visibility |
| Card reader unavailable | Processor/account/device match; middleware; network/IP; Windows support; cabling/power | Factory reset or key injection without provider guidance |
| Inventory off | Stock source; unfinished receive/return; transfers/waste; station close/deposit timing | Arbitrary inventory correction before reconciliation |
| Deposit off | Open stations/tabs; starting banks; tender/card batch; tips; queued cash refunds; fees/offsets | Editing closed transactions to force the report |
| Duplicate/double seat concern | Seat history; holds; swaps; performance identity; transaction IDs | Freeing or reselling a seat before audit |
| Refund appears stuck | Batch status; original tender; processor settlement; manual/cash queue | Running refund-all again |
| Email missing | Address captured; SMTP/app password; ticket/gift settings; Internet Server | Logging or sharing the app password |

## Failure and recovery boundaries

- **Workstation failure:** preserve station/terminal identity and determine whether transactions reached the server before re-selling.
- **Internet outage:** local POS may differ from online/API availability; prevent duplicate customer attempts and reconcile queued/failed transactions.
- **Internet Server failure:** external schedules/sales/API may fail while local clients remain usable.
- **Primary server failure:** use the RTS-supported replication/recovery procedure and contact Support.
- **Database corruption or restore:** stop ad hoc changes and involve RTS Support.
- **Processor outage:** follow processor/RTS offline guidance; do not invent card storage or manually retain card data.
- **Partial integration response:** query by stable transaction identity before retrying a state-changing command.

## Escalation packet

Before contacting RTS Support, collect non-sensitive facts:

- RTN, theater, server/workstation role, terminal, and station;
- RTS version and Windows version;
- local time/time zone and exact time of failure;
- performance/show ID, place/auditorium, film code, and transaction number when relevant;
- exact error/status text and whether it is reproducible;
- whether local selling, WebApp, third parties, and the public fgb site are affected;
- recent configuration, network, processor, or update changes;
- relevant report/log name without cardholder data;
- backup/replication freshness for server incidents.

Use the current `Contacting RTS` article for current support channels and hours. Contact the processor directly for processor-hosted/device/account incidents when RTS guidance points there.
