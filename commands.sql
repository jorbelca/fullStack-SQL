
On the command-line, create a blogs table for the application with the following columns

id (unique, incrementing id)
author (string)
url (string that cannot be empty)
title (string that cannot be empty)
likes (integer with default value zero)
Add at least two blogs to the database.

CREATE TABLE notes (
    id SERIAL PRIMARY KEY INTEGER ,
    url text NOT NULL,
    author text ,
    title text NOT NULL
    likes INTEGER,
);


