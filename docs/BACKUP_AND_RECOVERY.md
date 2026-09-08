# Lanka Luxe Journeys — Backup & Disaster Recovery Runbook

This document defines the operational procedures for data backup, emergency restoration, database migration rollback, and asset failover.

---

## 1. MySQL Database Backup Strategy

### Automated Nightly Logical Dumps
Use `mysqldump` to create compressed, timestamped backups of `lanka_luxe_db`:

```bash
# Nightly backup script (Linux/cron or Windows Task Scheduler)
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/var/backups/lankaluxe"
mkdir -p "$BACKUP_DIR"

mysqldump \
  --single-transaction \
  --quick \
  --routines \
  --triggers \
  -u root -p"${DB_PASSWORD}" \
  lanka_luxe_db | gzip > "${BACKUP_DIR}/lanka_luxe_backup_${TIMESTAMP}.sql.gz"

# Retain backups for 30 days
find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +30 -delete
```

### Offsite Replication
Sync the daily compressed `.sql.gz` files to encrypted S3/Cloud Storage:
```bash
aws s3 sync /var/backups/lankaluxe s3://lanka-luxe-backups/mysql/ --sse AES256
```

---

## 2. Database Restoration Drill

In the event of database corruption or hardware failure:

1. **Provision New MySQL Instance** or connect to existing server.
2. **Recreate Database**:
   ```sql
   CREATE DATABASE lanka_luxe_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. **Restore from Compressed Dump**:
   ```bash
   gunzip < lanka_luxe_backup_20260908.sql.gz | mysql -u root -p"${DB_PASSWORD}" lanka_luxe_db
   ```
4. **Verify Table Integrity**:
   ```bash
   node scripts/inspect-db.mjs
   ```

---

## 3. Prisma Migration Rollback Strategy

- All schema modifications are tracked in `prisma/schema.prisma`.
- When rolling back a schema change:
  1. Revert `prisma/schema.prisma` in Git: `git checkout HEAD~1 prisma/schema.prisma`.
  2. Regenerate Prisma client: `npx prisma generate`.
  3. Validate database schema state: `npx prisma db pull`.

---

## 4. CMS Content Disaster Recovery

The application features a **Two-Tier Resilient Content Architecture**:
1. **Tier 1 (Authoritative Live MySQL Database)**: All real-time admin edits, custom journeys, golf packages, and customer CRM leads reside in `lanka_luxe_db`.
2. **Tier 2 (Static Fallback Bundle)**: The codebase preserves static fallback definitions in `src/data/site.ts`. If MySQL becomes unreachable, `getLiveContent()` and `ContentProvider` gracefully degrade to the static luxury defaults without throwing 500 crashes to website visitors.

---

## 5. Image & ImgBB Asset Recovery

- All uploaded images are mirrored with direct URLs stored in MySQL `image` fields.
- If ImgBB is temporarily unavailable:
  - Public pages fall back to static Unsplash CDN assets or local cached URLs.
  - Image URLs stored in database are immutable.
  - Periodic backup of ImgBB image metadata is maintained in the `tour`, `golfcourse`, and `destination` records.
