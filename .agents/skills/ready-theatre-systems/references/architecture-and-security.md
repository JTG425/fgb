# RTS architecture, infrastructure, and security

## Product role

Ready Theatre Systems is a Windows cinema-management platform combining:

- box-office and concession point of sale;
- film, auditorium, performance, ticket, and price configuration;
- cash, card, deposit, inventory, loyalty, and membership accounting;
- online, kiosk, mobile, API, reporting, restaurant, and signage channels;
- a local operational database and services that publish or accept external data.

Linux is not supported as an RTS host. Treat cloud services as extensions of the theater system, not as evidence that the primary operational database is a generic cloud-native service.

## Core topology

| Component | Responsibility | Critical notes |
|---|---|---|
| RTS Server | Hosts the operational database and core RTS services | Normally on-premises; identify it before service, backup, or network work. |
| Replication partner | Provides on-site resilience/replication | RTS recommends an on-site partner where supported. Do not assume replication equals off-site backup. |
| Selling workstation | Box office/concessions/kiosk/restaurant client | Connects to the server over the theater LAN and has terminal/station identity. |
| Office workstation | Management, setup, and reporting client | Can connect locally by server IP or remotely through the RTN host. |
| Internet Server | RTS background web/integration service | Feeds online sales, schedules, API consumers, apps, and some signage behavior. |
| External RTS/cloud services | RTN-hosted routing, licensing, updates, remote/corporate uses | Depend on Internet connectivity and correct routing. |
| Third-party consumers | Apps, website transformers, distributors, accounting, reporting | Give each only the access and data it needs. |

The RTS title bar distinguishes Server from Workstation and displays terminal and RTN information. `Help > About` is a documented place to confirm local/server IP and RTN. Verify identity there instead of relying on a Windows computer name or a remembered address.

## Identity model

- **RTN:** theater/location identity used in `*.formovietickets.com` routing and external integration. It is not a chain ID.
- **Chain/application ID:** groups locations in an RTS-hosted WebApp/mobile experience.
- **Terminal number:** identifies the RTS computer/client instance.
- **Station number:** identifies a logical selling, kiosk, inventory, or restaurant station.
- **Schedule location/place:** connects a performance to an auditorium/online `placeId` concept.
- **Performance/show ID:** identifies a scheduled showing; it is venue-specific and time-specific.
- **Film code:** identifies a film record but must not substitute for a performance ID.
- **Transaction/purchase number:** identifies a sale/refund/pickup workflow.

Do not join data on display title alone. Titles may be translated, shortened, duplicated for premium formats, or changed after sales.

## Networking

- Give the RTS Server a stable LAN address. The maintained knowledge base permits workstations to use DHCP or static addressing; use DHCP reservations where operationally appropriate.
- Legacy documentation often recommends static addresses for all RTS devices. Prefer the current KB unless a specific device requires a stable IP.
- Keep POS traffic off public, guest, or open Wi-Fi. Do not bridge guest wireless into the RTS network.
- Keep server and LAN workstations on a compatible local subnet/routing design.
- Networked EMV readers, remote printers, and signage require reliable addressing and reachability.
- Chromecasts normally need DHCP and Internet access plus the correct local network visibility.

Documented external ports:

- `2235`: RTS external communication, online ticketing/API, licensing, updates, and remote database-related services.
- `80`: HTTP; used for some routing and should redirect/block unencrypted access as configured.
- `443`: HTTPS.
- `2237`: obsolete in current PCI guidance; remove old forwarding rather than preserving it “just in case.”

Port forwarding exposes the RTS Server. Limit it to documented needs, use the current server IP, and confirm both firewall and router behavior. Do not expose database protocols or remote desktop merely to solve an RTS routing issue.

## Internet Server lifecycle

The Internet Server is a background RTS service/web server, not the Windows machine itself. It supports RTN web pages, showtime XML, APIs, WebApp/mobile app, third-party schedule/sales access, and some Chromecast discovery/signage updates.

A documented Internet Server restart:

1. Must be initiated on the RTS Server.
2. Briefly interrupts web/schedule/API availability, commonly for several seconds.
3. Refreshes or republishes schedules and external availability.
4. Can repair stale online schedules or RTS-side Chromecast discovery.
5. Does not mean rebooting the PC.

`Sent=True` means the restart command was acknowledged; a continuing log is not evidence that the operation failed. Do not repeat the command solely because log output continues.

## Installation and connection

Current installation guidance uses the RTS installer from `readyticket.net` and requires running it as Administrator. For a production installation:

- reject demo configuration;
- select the correct computer type because printer and power behavior depend on it;
- install the required .NET Framework version;
- on a LAN, select the detected server and verify the server IP in RTS;
- for an off-site office client, configure the RTN-based `RTN.formovietickets.com` connection and test it;
- where needed, keep both local-IP and away/RTN connection definitions, with clear operator labels;
- assign terminals and selling stations deliberately.

New installations normally sequence database/setup forms, payment processing, hardware, static server networking/port forwarding, gift-card migration, online/app/signage/reserved-seat configuration, reporting, and schedule exports. Processor and network work should happen early because many later tests depend on them.

## Backup and recovery

- RTS performs a nightly database backup.
- Optional Google Drive cloud backup uploads the nightly artifact after it is created.
- The documented Drive folder is `rts_backup` and filenames follow `Backup-RTN-YYYYMMDD.RtsBackup`.
- Retention is configurable; `-1` disables the optional retention cleanup behavior described by RTS.
- Verify that backups are recent, non-zero, and associated with the correct RTN.
- Replication, a local backup, and off-site backup solve different failure modes.
- Coordinate restores with RTS Support. Do not overwrite or open a production database with ad hoc tools.

## Users and authorization

RTS has application users and password groups with granular permissions. Relevant permission families include:

- selling, void, refund, comp, discounts, and tender operations;
- station, drawer, deposit, and card-batch close;
- schedule, film, ticket, concession, inventory, and stock changes;
- database restore/SQL and high-risk setup functions;
- report, web/API, timeclock, membership, and restaurant-tab access.

Create individual users, clone narrowly scoped groups, and apply least privilege. Disable users when audit/history must be retained instead of deleting identities indiscriminately. Use separate secure credit-card users for protected card settings and applicable deposit-close actions.

Web/API accounts are separate from ordinary RTS operator accounts. Schedule access and selling access can be distinct, and API access can be enabled per ticket/integrator. Never reuse an administrator or employee password in a website integration.

## Card processing and PCI

RTS integrates with processors including Heartland and WorldPay/Vantiv. Exact support depends on account type, reader model, Windows version, middleware, and whether the reader is direct USB, network, Wi-Fi, or cloud-connected.

- Direct readers can require middleware on every terminal.
- Network/cloud readers require stable LAN connectivity and often a stable reader address.
- Windows XP is not an EMV platform. Current RTS material associates triPOS Direct with Windows 10+ and DataCap with Windows 7+; recheck before deployment.
- Do not substitute one processor's device initialization or key-loading procedure for another's.

Current PCI-oriented RTS settings include:

- expose only required ports (`2235`, `80`, `443`) and remove obsolete `2237` forwarding;
- scan both the host name and relevant IP/e-commerce host;
- configure web port `80` and SSL port `443`;
- block unencrypted traffic and force TLS 1.2 or newer behavior supported by RTS;
- disable weak ciphers where supported;
- enable HSTS (including subdomains where appropriate), `X-Content-Type-Options: nosniff`, and XSS-protection headers described by RTS;
- restart the Internet Server after changing applicable RTN/web settings.

Do not treat these product settings as a complete PCI program. The merchant, network, endpoints, access controls, logging, scans, policies, processor, and applicable PCI DSS version all matter.

Credit surcharging is a distinct EMV retail feature. RTS may treat debit cards as credit in this flow, so legal/card-brand/processor constraints require explicit merchant validation. Do not infer compliance from the presence of a checkbox.

## Email and secrets

Current documentation says Microsoft Outlook SMTP is no longer supported in RTS. Gmail configuration uses two-factor authentication and an application password, with the documented Gmail SMTP host and TLS/SSL port choices. Configure ticketing and online gift email separately as required, then restart the Internet Server.

Store app passwords and all RTS/API/processor credentials outside the repository. Public documentation may show defaults, examples, or test secrets; never transfer them into project files or a response.
