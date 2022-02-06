---
title: Postgres roles are hard (part 2)
---
In [part 1] we tried to set up a database for a small bookstore.
Let's try that again. Last time we did things in a very one-off kind of way, but
we're smarter now and we know that our part-time bookstore clerks will come and
go over the lifetime of our bookstore.

So let's create a "group" called `bookstore_employees` that'll have the
privileges that we want each employee to have. In Postgres everything
is a role so the group is really just a role. We use `NOLOGIN` on the
group/role so that you can't log in as the group, mimicing a group in
UNIX:

    > psql -U malthe postgres
    postgres=# CREATE ROLE "bookstore_employees" NOLOGIN;
    CREATE ROLE
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

<!-- postgres=# ALTER DATABASE "bookstore" OWNER TO "bookstore_employees"; -->
<!-- ALTER DATABASE -->


I have a couple of employees in my bookstore. They each get a user to select and
insert rows in the `books` table:

    postgres=# CREATE ROLE "susan" WITH PASSWORD 'abc123' IN GROUP "bookstore_employees" LOGIN;
    CREATE ROLE
    postgres=# CREATE ROLE "bobby" WITH PASSWORD 'def456' IN GROUP "bookstore_employees" LOGIN;
    CREATE ROLE

`IN GROUP` is really an alias for `IN ROLE`, but I'm using the old "group"
nomenclature to illustrate my thinking here.

We know from part 1 that we need to `GRANT` some different permissions before
we can get things to work.

    bookstore=# GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO bookstore_employees;
    GRANT
    bookstore=# GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO bookstore_employees;
    GRANT

    > psql -U susan bookstore
    bookstore=> INSERT INTO "books" (title, in_stock) VALUES ('Atra-Hasis', 1), ('Gilgamesh', 4);
    INSERT 0 2

Great! I feel like we've learned something. Maybe?
<!-- bookstore=# GRANT SELECT, INSERT, UPDATE, DELETE ON books TO bookstore_employees; -->

Let's create a new table:

    > psql -U malthe bookstore
    bookstore=# CREATE TABLE "sales" (
    bookstore(#   id SERIAL PRIMARY KEY,
    bookstore(#   amount DECIMAL(6, 2) NOT NULL,
    bookstore(#   date DATE NOT NULL
    bookstore(# );
    CREATE TABLE

    > psql -U susan bookstore
    bookstore=> INSERT INTO "sales" (amount, date) VALUES (99.95, TODAY());
    ERROR:  permission denied for table sales

If we don't want to grant privileges for every table we create, we need to 

    ALTER DEFAULT PRIVILEGES GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO bookstore_employees;
    ALTER DEFAULT PRIVILEGES GRANT USAGE, SELECT ON SEQUENCES TO bookstore_employees;

These apply to the current database, but not other databases.

Okay, I'll `DROP TABLE sales` and `CREATE TABLE sales ...` again, and voilà!:

    > psql -U susan bookstore
    bookstore=> INSERT INTO "sales" (amount, date) VALUES (99.95, TODAY());
    INSERT 0 1

So far so good!

And what about `bobby`?:

    > psql -U bobby bookstore
    bookstore=> INSERT INTO books (title, in_stock) VALUES ('Illiad', 1);
    INSERT 0 1
    bookstore=> INSERT INTO sales (amount, date) VALUES (21.50, CURRENT_DATE);
    INSERT 0 1
    bookstore=> SELECT * FROM sales;
     id | amount |    date
    ----+--------+------------
      1 |  99.95 | 2022-01-23
      2 |  21.50 | 2022-01-23

Great!

As the distraught businessperson I am, I'm too busy to do things myself.
I figure out that we need to expand into the vintage vinyl business, and ask
`susan` to set that up for us:

    > psql -U susan bookstore
    bookstore=> CREATE TABLE "vinyls" (
    bookstore(>   id SERIAL PRIMARY KEY,
    bookstore(>   title VARCHAR(300) NOT NULL,
    bookstore(>   artist VARCHAR(300) NOT NULL,
    bookstore(>   in_stock INTEGER NOT NULL
    bookstore(> );
    CREATE TABLE

    bookstore=> INSERT INTO vinyls (title, artist, in_stock) VALUES ('Let It Be', 'Beatles', 4);
    INSERT 0 1

Let's have `bobby` have a look at that:

    > psql -U bobby bookstore
    bookstore=> SELECT * FROM vinyls;
    ERROR:  permission denied for table vinyls

Sadness :(
It turns out that `ALTER DEFAULT PRIVILEGES` only has an effect on things created by
the role who runs it. From the [Postgres docs](https://www.postgresql.org/docs/14/sql-alterdefaultprivileges.html#SQL-ALTERDEFAULTPRIVILEGES-DESCRIPTION):

> ALTER DEFAULT PRIVILEGES allows you to set the privileges that will be applied to objects created in the future.  
> [...]  
> You can change default privileges only for objects that will be created by yourself or by roles that you are a member of.

The Postgres docs are quite good and thorough, however reading the docs here I misunderstood what was
meant. Even if `malthe` had been a part of `bookstore_employees` (`GRANT bookstore_employees TO malthe;`)
it would not have worked!

Here's what I would have liked the docs to say:

> ALTER DEFAULT PRIVILEGES allows you to set the privileges that will be applied to objects created **by your current role** in the future.

So in order to get a functioning setup here, we either need to manually grant permissions
to every table that we create. Or we can run the `SET ROLE` to the use right role before
`ALTER DEFAULT PRIVILEGES` as well as before creating every table:

1. `SET ROLE table_creator; ALTER DEFAULT PRIVILEGES GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO bookstore_employees;`
2. `SET ROLE table_creator; CREATE TABLE books (...);`

The reason I'm not just doing `SET ROLE bookstore_employees` is that it kind of defeats the point.
It would make `bookstore_employees` the owner of every table and in that case you wouldn't need
to set any permissions at all! `susan` and `bobby` would have access automatically!
Perhaps that's what I should have done in the first place?

Even with the `table_creator` there's a Catch-22. We'd need `susan` to do `SET ROLE table_creator`
before creating the `vinyls` table. In order to do that she'd need to be part of the `table_creator`
role. Which leaves us back at employees being the owner of every table.

### Grievances
- `ALTER DEFAULT PRIVILEGES` could be more clearly documented

### Niceties
- The `\dp`-command in `psql` is quite nice for figuring what out privileges are currently set
  and shows both tables and sequences)

### Conclusion
As soon as you want to let the employees create tables, you're effectively granting
them owner rights to all of the tables. Which kind of makes sense, since in that case they could
have been the creators of all the tables.

_... in [part 3] we'll get to why all of this matters to you!_

[part 1]: /2021/11/10/postgres-roles-are-hard-part-1
[part 3]: /2021/11/10/postgres-roles-are-hard-part-3
... 
\<THIS IS WHERE I'M AT IN MY WRITING\>


    bookstore=> SELECT * FROM "books";
     id |   title
    ----+------------
      1 | Atra-Hasis
      2 | Gilgamesh
    (2 rows)

    > psql -U bobby bookstore

    bookstore=> SELECT * FROM "books";
    ERROR:  permission denied for table books
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
https://www.postgresql.org/docs/14/sql-altertable.html

    postgres=# ALTER DATABASE "bookstore" OWNER TO "bookstore_employees";
    ALTER DATABASE

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
- The user [Brett Widmeier on StackOverflow](https://stackoverflow.com/questions/9325017/error-permission-denied-for-sequence-cities-id-seq-using-postgres#comment69247035_9325195)
  expresses my frustration with the sequence permissions quite well.

### Further reading

- https://www.prisma.io/dataguide/postgresql/authentication-and-authorization/role-management