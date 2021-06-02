DROP TABLE IF EXISTS customers CASCADE;

CREATE TABLE customers (
  id SERIAL PRIMARY KEY NOT NULL,
  created_by INT NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name  VARCHAR(255) NOT NULL,
  date_created TIMESTAMP NOT NULL,
  profession VARCHAR(255) NOT NULL,
  uid uuid DEFAULT uuid_generate_v4 ()
);