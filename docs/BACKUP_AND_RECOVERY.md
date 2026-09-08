# Lanka Luxe Journeys — Production Database Backup & Disaster Recovery Runbook

This document defines the operational procedures for database backups, automated scheduling, emergency restoration, migration rollback, and asset failover.

---

## 1. Managed MySQL Production Strategy (Recommended for Vercel Deployments)

When deploying to Vercel or cloud serverless, the database is hosted on a managed external database provider. Rely on provider-native automated backups and Point-In-Time Recovery (PITR):

### AWS RDS / Aurora MySQL
- **Automated Backup Window:** Enabled daily (Retention: 35 days).
- **Point-In-Time Recovery (PITR):** Continuous binlog streaming allows restoring to any specific second within the 35-day window.
- **Cross-Region Snapshots:** Copy snapshots to a secondary AWS region weekly for geo-redundancy.
- **Multi-AZ Deployment:** Provides synchronous physical standby replication with automatic failover (< 60s RTO).

### PlanetScale MySQL
- **Branch-level Daily Backups:** Automated daily snapshots retained for 30 days.
- **Safe Migrations:** Online, non-blocking schema migrations with instantaneous zero-downtime cutover.
- **Connection Pooling:** Native serverless connection pooling via PlanetScale proxy.

### Aiven MySQL
- **Continuous Backups:** Automated full backups taken every 24 hours with continuous WAL/binlog archiving.
- **PITR:** Instant restoration to any minute within the retention window.

---

## 2. Self-Hosted / Bare-Metal MySQL Automation Strategy

For self-hosted MySQL instances, automated scheduled logical dumps are managed via [`scripts/backup-database.mjs`](../scripts/backup-database.mjs).

### Automated Execution via Cron
Schedule nightly backups at 02:00 AM UTC with logging:
```bash
0 2 * * * cd /var/www/lanka-luxe && /usr/bin/node scripts/backup-database.mjs >> /var/log/lankaluxe-backup.log 2>&1
```

### Automation Script Details
- **Consistent Reads:** Uses `mysqldump --single-transaction --quick --routines --triggers` ensuring zero write lock contention on InnoDB tables during live traffic.
- **Zero-Secret CLI:** Passes `MYSQL_PWD` via sub-process environment rather than shell arguments, preventing credential leakage in `ps aux` process tables.
- **Compression:** Gzip level 9 compression streams directly from `mysqldump` to reduce disk footprint by 80–90%.
- **Retention Policy:** Automatically purges archives older than 30 days.
- **Exit Codes:** Returns non-zero exit codes on failure for integration with uptime monitors and alerting systems.

### Off-Site Immutable Replication
Sync the daily compressed `.sql.gz` files to an off-site AWS S3 bucket with Object Lock (WORM compliance):
```bash
aws s3 sync ./backups s3://lanka-luxe-backups-secure/mysql/ \
  --sse AES256 \
  --storage-class STANDARD_IA
```

---

## 3. Emergency Restoration Drill & Verification

### Step-by-Step Recovery Procedure
1. **Identify Target Backup Archive:**
   ```bash
   ls -lt ./backups/lanka_luxe_db_*.sql.gz | head -n 1
   ```

2. **Verify Archive Integrity:**
   ```bash
   gzip -t ./backups/lanka_luxe_db_20260908_020000.sql.gz
   ```

3. **Provision or Recreate Database:**
   ```sql
   DROP DATABASE IF EXISTS lanka_luxe_db;
   CREATE DATABASE lanka_luxe_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

4. **Restore Database from Compressed Archive:**
   ```bash
   gunzip -c ./backups/lanka_luxe_db_20260908_020000.sql.gz | mysql -u root -p"${DB_PASSWORD}" lanka_luxe_db
   ```

5. **Run Automated Integrity Checks:**
   ```bash
   node scripts/inspect-records.mjs
   node scripts/verify-remediation.mjs
   ```

6. **Target Metrics:**
   - **RTO (Recovery Time Objective):** < 30 minutes.
   - **RPO (Recovery Point Objective):** < 1 hour (with continuous binlogs) or < 24 hours (with nightly dumps).

---

## 4. Prisma Schema Rollback Procedure

- All schema modifications are version-controlled in `prisma/schema.prisma`.
- If a schema deployment fails:
  1. Roll back the git commit to the previous stable release.
  2. Run `npx prisma db push` to re-align table structures.
  3. Run `npm run db:init` and `npm run db:seed` if default seed records require re-synchronization.

---

## 5. Security Checklist for Backups

- [x] Zero plaintext passwords stored in scripts or git commits.
- [x] Single-transaction dumps used to prevent database locking during business hours.
- [x] Off-site replication uses AES-256 server-side encryption.
- [x] Restorations tested regularly in a staging environment.
