---
title: Postgres roles are hard
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

    postgres=# CREATE ROLE "bookstore_employees" NOLOGIN;
    CREATE ROLE
    postgres=# CREATE DATABASE "bookstore";
    CREATE DATABASE
    postgres=# ALTER DATABASE "bookstore" OWNER TO "bookstore_employees";
    ALTER DATABASE


And switch to it (`\connect` or just `\c`)

    postgres=# \connect bookstore
    You are now connected to database "bookstore" as user "malthe".

I have a couple of different employees in my bookstore, and as a security shark
I of course know they shouldn't have the same credentials to the database.

    postgres=# CREATE ROLE "susan" WITH PASSWORD 'abc123' LOGIN IN ROLE "bookstore_employees";
    postgres=# CREATE ROLE "bobby" WITH PASSWORD 'def456' LOGIN IN ROLE "bookstore_employees";

<!--
    postgres=# GRANT "bookstore_employees" TO "susan";
    GRANT ROLE
    postgres=# GRANT "bookstore_employees" TO "bobby";
    GRANT ROLE
-->

Note I'm using `IN ROLE "bookstore_employees"` -- this used to be called `IN GROUP`.
Postgres roles can also be used as [groups], where users can be members of that group.
Since it's all just roles it ends up looking a bit funky.

[groups]: https://www.postgresql.org/docs/14/sql-createrole.html

My intention with this setup is that I can let `susan` and `bobby` do their
work and create tables, rows, indexes etc. and go about their business.
But of course I want them to be able to use and inspect eachother's work.
We can't have silos in a three-person shop!

However, it doesn't end up working as I intended (thinking both are in the same group `bookstore_employees`):

    > psql -U susan bookstore

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

    > psql -U bobby bookstore

    bookstore=> SELECT * FROM "books";
    ERROR:  permission denied for table books

Well, there's a way to fix that. Every time an employee logs in we can ask them
to execute `SET ROLE "bookstore_employees";`. That way they'll be creating things
as the "group" and other employees will be able to access it.
Did I mention they have to do this every time they log in?

(Luckily, simple audit trails logs with `log_statement = "all"` and
`log_line_prefix = "%u"` does show what you want here -- `susan`/`bobby` and
not `bookstore_employees`)

Well, to make the change permanent you can do

    bookstore=# ALTER ROLE "susan" SET role="bookstore_employees":
    ALTER ROLE

    bookstore=# SELECT * FROM pg_user;
       usename   | usesysid | usecreatedb | usesuper | userepl | usebypassrls |  passwd  | valuntil |                                     useconfig
    -------------+----------+-------------+----------+---------+--------------+----------+----------+------------------------------------------------------------------------------------
     malthe      |       10 | t           | t        | t       | t            | ******** |          |
     postgres    |    16385 | f           | f        | f       | f            | ******** |          |
     susan       |   452006 | f           | f        | f       | f            | ******** |          | {role=bookstore_employees}
     bobby       |   452007 | f           | f        | f       | f            | ******** |          |
    (4 rows)


    $ psql -U susan bookstore
    psql (14.0)
    Type "help" for help.

    bookstore=> SELECT CURRENT_USER, SESSION_USER;
        current_user     | session_user
    ---------------------+--------------
     bookstore_employees | susan
    (1 row)

Yay!

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


### Notes
- `\c` / `\connect` will reset your role, and you'll have to run `SET ROLE <role>` again.
- The opposite of `ALTER ROLE  susan SET role=bobby` is `ALTER ROLE susan RESET role`

### Further reading

- https://www.prisma.io/dataguide/postgresql/authentication-and-authorization/role-management