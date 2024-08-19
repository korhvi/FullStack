CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  url VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes) VALUES ('Matti Meikäläinen', 'http://blogsite.fi/kaunis-syksy', 'Kaunis Syksy', 0);
INSERT INTO blogs (author, url, title, likes) VALUES ('Liisa Virtanen', 'http://virtasenajatuksia.fi/viisauden-alkupera', 'Viisauden Alkuperä', 0);
