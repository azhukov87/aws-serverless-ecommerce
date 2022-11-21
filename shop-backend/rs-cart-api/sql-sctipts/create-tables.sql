CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE IF NOT EXISTS carts (
	id uuid DEFAULT uuid_generate_v4 (),
    user_id uuid NOT NULL UNIQUE,
 	created_at DATE NOT NULL,
    updated_at DATE NOT NULL,

	PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS cart_items (
	cart_id uuid,
	product_id uuid,
 	count smallserial NOT NULL,

	PRIMARY KEY (cart_id, product_id),
	  FOREIGN KEY (cart_id)
      REFERENCES carts (id)
);