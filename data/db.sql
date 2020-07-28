DROP TABLE IF EXISTS jokes;

CREATE TABLE jokes(
    id serial PRIMARY KEY,
    type VARCHAR(255),
    setup VARCHAR(255),
    punchline VARCHAR(255)
);


INSERT INTO jokes(type,setup,punchline)VALUES('test','test','test');
INSERT INTO jokes(type,setup,punchline)VALUES('ahmad','111','222');