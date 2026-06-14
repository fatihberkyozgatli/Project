# Aldofa - Database

Plain SQL for the Aldofa database (Supabase Postgres). Design and rationale live in
[`../Documentation/architecture.md`](../Documentation/architecture.md) and the runbook in
[`../Documentation/database.md`](../Documentation/database.md). This folder is the runnable SQL.

## How to apply

Not deployed yet. When ready, open the Supabase project's **SQL Editor** and run the files
**in numeric order**, top to bottom:

1. `0001_extensions_enums.sql`
2. `0002_tables.sql`
3. `0003_indexes.sql`
4. `0004_triggers.sql`
5. `0005_rls.sql`
6. `0006_transaction_functions.sql`
7. `0007_storage.sql`
8. `0008_seed_nonprofits.sql` — placeholder nonprofits; replace before launch.

Run `0008` as the project owner / service role (it bypasses RLS).

## Scope

First cut: the no-money core loop (list → browse → chat → meetup → dual-code → simulated
donation). Payments, ratings, reports, and admin tables are deferred.
