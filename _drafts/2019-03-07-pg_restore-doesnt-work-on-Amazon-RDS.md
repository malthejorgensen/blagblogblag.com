

**tl;dr** You can't `pg_restore` a dump made with `pgdump -Fc` that has foreign keys on Amazon RDS.
You have do a `.sql` (without `-Fc`) instead, plugging in `SET session_replication_role = replica;`
at the start of the SQL file and `SET session_replication_role = DEFAULT;` at the end of the file.
