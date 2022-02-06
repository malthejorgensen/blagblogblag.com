---
title: Credential rotation with Django and Postgres
---
_Note that Postgres doesn't distuinguish between "users" and "roles".
They are one and the same. I'll use the terms interchangibly._

Another thing that is hard to grok is Postgres roles.

```
> psql postgres
psql (14.0)
Type "help" for help.
```


Let's start by listing the users (`\du`):

```
postgres=# \du
                                    List of roles
  Role name  |                         Attributes                         | Member of
-------------+------------------------------------------------------------+-----------
 malthe      | Superuser, Create role, Create DB, Replication, Bypass RLS | {}
 postgres    |                                                            | {}
```

Any who am I logged in as? (`\conninfo`)

```
postgres-# \conninfo
You are connected to database "postgres" as user "malthe" via socket in "/tmp" at port "5432".
```
<!-- SELECT CURRENT_USER, SESSION_USER; -->

Let's create a test database.

    postgres=# CREATE ROLE "bookstore_owner" NOLOGIN;
    CREATE ROLE
    postgres=# CREATE DATABASE "bookstore";
    CREATE DATABASE
    postgres=# ALTER DATABASE "bookstore" OWNER TO "bookstore_employees";
    ALTER DATABASE


And switch to it (`\connect` or just `\c`)

    postgres=# \connect bookstore
    You are now connected to database "bookstore" as user "malthe".

### Enter credential rotations

Let's create a "executing" role, the thinking with this example is to allow
easy credential rotation. There's an owner role that has no password, and then
a current executing role that is granted the owning role.
When credentials need to be rotated, we create a new "executing" role with a
new password, grant it the owner role. We then switch to that new role, and
afterwards we delete the previous executing role.

Now, one of the important parts of the setup is that the owner role doesn't
have a password -- otherwise we would need to rotate that as well.
So this means that the "executing" role will have to run migrations, meaning
that it will create tables, indexes, counters etc.

    postgres=# CREATE USER "bookstore_user_0001" WITH PASSWORD 'abc123' LOGIN;
    CREATE ROLE
    postgres=# GRANT "bookstore_owner" TO "bookstore_user_0001";
    GRANT ROLE

Let's log in as our new "executing" user:

    > psql -U bookstore_user_0001 bookstore

<!-- why doesn't the above require a password? -->

As explained [here](https://github.com/jdelic/django-postgresql-setrole) the
owner role won't automatically have access to the objects created by the
"executing" role (tables etc.) won't be accessible by the next executing role.

    bookstore=> CREATE TABLE "books" (
    bookstore(>   id SERIAL PRIMARY KEY,
    bookstore(>   title character varying(2000) NOT NULL
    bookstore(> );
    CREATE TABLE

    bookstore=> INSERT INTO "books" (title) VALUES ('Atra-Hasis'), ('Gilgamesh');
    INSERT 0 2
    bookstore=> SELECT * FROM "books";
     id |   title
    ----+------------
      1 | Atra-Hasis
      2 | Gilgamesh
    (2 rows)




    postgres=# CREATE USER "bookstore_user_0002" WITH PASSWORD 'def456' LOGIN;
    CREATE ROLE
    postgres=# GRANT "bookstore_owner" TO "bookstore_user_0002";
    GRANT ROLE


    psql -U bookstore_user_0002 bookstore
    bookstore=> SELECT * FROM "books";
    ERROR:  permission denied for table books

So that didn't work.

You need to do `SET ROLE "bookstore_owner";`. Every time you log in. In your
web app you need to execute this as the first SQL statement you do in every
connection to your database.

Or -- you can change the default role for that role:

    > psql -U bookstore_user_0001 bookstore

    bookstore=> SELECT CURRENT_USER, SESSION_USER;
        current_user     |    session_user
    ---------------------+---------------------
     bookstore_user_0001 | bookstore_user_0001
    (1 row)

    bookstore=> ALTER ROLE "bookstore_user_0001" SET role="bookstore_owner";
    ALTER ROLE
    bookstore=>
    \q

    > psql -U bookstore_user_0001 bookstore

    bookstore=> SELECT CURRENT_USER, SESSION_USER;
      current_user   |    session_user
    -----------------+---------------------
     bookstore_owner | bookstore_user_0001


<!--

psql -h 'eduflow-postgres-staging.cwfrbet8cw0x.eu-west-1.rds.amazonaws.com' -U eduflowuser-2020-11-04-5gkqdg eduflow                   23:20
Password for user eduflowuser-2020-11-04-5gkqdg:
psql (14.0, server 10.17)
SSL connection (protocol: TLSv1.2, cipher: ECDHE-RSA-AES256-GCM-SHA384, bits: 256, compression: off)
Type "help" for help.

eduflow=> SELECT CURRENT_USER, SESSION_USER;
 current_user  |         session_user
---------------+-------------------------------
 eduflow_owner | eduflowuser-2020-11-04-5gkqdg

eduflow=> SELECT * FROM pg_user;
            usename            | usesysid | usecreatedb | usesuper | userepl | usebypassrls |  passwd  | valuntil |
-------------------------------+----------+-------------+----------+---------+--------------+----------+----------+------------------------------------------------------------------
 rdsadmin                      |       10 | t           | t        | t       | t            | ******** | infinity | {TimeZone=utc,log_statement=all,log_min_error_statement=debug5,lo
 eduflowuser-2020-11-04-5gkqdg |    21137 | f           | f        | f       | f            | ******** |          | {role=eduflow_owner}
 eduflowstaging                |    16393 | t           | f        | f       | f            | ******** | infinity |
 rotater-temp-user-V80CWA      |    21111 | f           | f        | f       | f            | ******** |          |
 eduflow_owner                 |    21132 | f           | f        | f       | f            | ******** |          |
 rotater-temp-user-_rFWXg      |    21117 | f           | f        | f       | f            | ******** |          |

-->

### Further reading

- https://www.prisma.io/dataguide/postgresql/authentication-and-authorization/role-management