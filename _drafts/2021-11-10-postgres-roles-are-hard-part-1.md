---
title: Postgres roles are hard (part 1)
---
_Note that Postgres doesn't distuinguish between "users" and "roles".
They are one and the same. I'll use the terms interchangibly._

Another thing that is hard to grok is Postgres roles.

First, some basics. Let's connect to default database called `postgres`:

```
> psql postgres
psql (14.0)
Type "help" for help.
```

and take a look at the users (`\du`):

```
postgres=# \du
                                    List of roles
  Role name  |                         Attributes                         | Member of
-------------+------------------------------------------------------------+-----------
 malthe      | Superuser, Create role, Create DB, Replication, Bypass RLS | {}
 postgres    |                                                            | {}
```

Who am I logged in as? (`\conninfo`)

```
postgres-# \conninfo
You are connected to database "postgres" as user "malthe" via socket in "/tmp" at port "5432".
```
<!-- SELECT CURRENT_USER, SESSION_USER; -->

### A small scenario

Let's say I'm the owner of a bookstore.

    postgres=# CREATE DATABASE "bookstore";
    CREATE DATABASE
    postgres=# \connect bookstore
    You are now connected to database "bookstore" as user "malthe".

    bookstore=> CREATE TABLE "books" (
    bookstore(>   id SERIAL PRIMARY KEY,
    bookstore(>   title character varying(2000) NOT NULL,
    bookstore(>   in_stock integer NOT NULL
    bookstore(> );
    CREATE TABLE

I have a couple of employees in my bookstore. They each get a user to select and
insert rows in the `books` table:

    postgres=# CREATE ROLE "susan" WITH PASSWORD 'abc123' LOGIN;
    postgres=# CREATE ROLE "bobby" WITH PASSWORD 'def456' LOGIN;

    > psql -U susan bookstore
    bookstore=> INSERT INTO "books" (title, in_stock) VALUES ('Atra-Hasis', 1), ('Gilgamesh', 4);
    ERROR:  permission denied for table books

<!-- CREATE ROLE "susan" ... IN ROLE "bookstore_employees" -->
<!-- CREATE ROLE "bobby" ... IN ROLE "bookstore_employees" -->

Makes sense -- we should give `susan` some permissions

    > psql -U malthe bookstore
    bookstore=# GRANT SELECT, INSERT, UPDATE, DELETE ON books TO susan;
    GRANT

    > psql -U susan bookstore
    bookstore=> INSERT INTO "books" (title, in_stock) VALUES ('Atra-Hasis', 1), ('Gilgamesh', 4);
    ERROR:  permission denied for sequence books_id_seq

Hmm, I would have thought that `GRANT INSERT` would have allowed `susan` to `INSERT`.
How about `GRANT ALL PRIVILEGES`?

    > psql -U malthe bookstore
    bookstore=> GRANT ALL PRIVILEGES ON books TO susan;
    GRANT

    > psql -U susan bookstore
    bookstore=> INSERT INTO "books" (title, in_stock) VALUES ('Atra-Hasis', 1), ('Gilgamesh', 4);
    ERROR:  permission denied for sequence books_id_seq

Didn't really "grant all privileges", did we now Postgres?  
Let's try `GRANT ALL PRIVILEGES ON DATABASE`:

    > psql -U malthe bookstore
    bookstore=# GRANT ALL PRIVILEGES ON DATABASE bookstore TO susan;
    GRANT

    > psql -U susan bookstore
    bookstore=> INSERT INTO "books" (title, in_stock) VALUES ('Atra-Hasis', 1), ('Gilgamesh', 4);
    ERROR:  permission denied for sequence books_id_seq

Still no.

What we need is `GRANT USAGE, SELECT ON SEQUENCE books_id_seq TO susan;`

    > psql -U malthe bookstore
    bookstore=# GRANT USAGE, SELECT ON SEQUENCE books_id_seq TO susan;
    GRANT

    > psql -U susan bookstore
    bookstore=> INSERT INTO "books" (title, in_stock) VALUES ('Atra-Hasis', 1), ('Gilgamesh', 4);
    INSERT 0 2

Great! Or, well, I'd say not that great. We'd have to this manually for every
sequence in every table relevant to the `susan` user.
The closest thing you'll get in Postgres (at least up to the current version 14) is

    GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO susan;

There's no `IN TABLE books` or `IN DATABASE bookstore` equivalent. So we'll be
exposing all sequences to `susan`. Perhaps not that big of deal, but still feels
like a deficiency. At any rate, the user-friendliness of Postgres is severely
lacking in this area.

Even having done the last one, you'll still need to alter the defaults to make this
work for tables that will be created in the future 

    ALTER DEFAULT PRIVILEGES GRANT USAGE, SELECT ON SEQUENCES TO susan;

I'm not even gonna try and clean up the permissions here.
Let's start over.

    > psql -U malthe bookstore
    bookstore=# DROP ROLE susan;
    ERROR:  role "susan" cannot be dropped because some objects depend on it
    DETAIL:  privileges for database bookstore
    privileges for sequence books_id_seq
    privileges for table books

    bookstore=# DROP ROLE bobby;
    DROP ROLE

Hmm... Looks like I _do_ have to clean up the permissions. At least to some extent.

    bookstore=# REASSIGN OWNED BY susan TO malthe;
    REASSIGN OWNED
    bookstore=# DROP OWNED BY susan;
    DROP OWNED
    bookstore=# DROP ROLE susan;
    DROP ROLE

There is no parameter to `DROP ROLE` that allows me to do this without running
`REASSIGN OWNED` and `DROP OWNED` first.
And yes, both `REASSIGN OWNED` and `DROP OWNED` are required. `REASSIGN OWNED`
doesn't really do anything in this particular scenario, but `DROP OWNED` drops
the privileges that were created by the calls to `GRANT ...`.

### Grievances so far

- `GRANT INSERT` will almost never work since it doesn't cover sequences
- `GRANT ALL PRIVILEGES` doesn't actually grant all privileges
- `DROP ROLE` doesn't have a parameter to force dropping a role
- `DROP OWNED` is quite an odd name for something needed to drop privileges.
   I understand that it does drop owned things like tables, but why not
    a separate command like `DROP PRIVILEGES` to avoid the ambiguity?
    `DROP PRIVILEGES susan; DROP ROLE susan;` is much less scary than
    `DROP OWNED susan; DROP ROLE susan;`.

I assume a lot of this is due to backwards-compatibility and some semblance
of SQL standards compliance, but in the end it makes for a hard-to-use
permissions system in Postgres.

Let's close the books on this one:

    > psql -U malthe postgres
    postgres=# DROP DATABASE bookstore;
    DROP DATABASE

What I really want is for Postgres to clean up their permissions system.
Because the current system is nuts!

_More on that in [part 2]..._

[part 2]: /2021/11/10/postgres-roles-are-hard-part-2

