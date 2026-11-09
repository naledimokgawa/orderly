CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user';
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users
  ADD CONSTRAINT users_role_check CHECK (role IN ('admin', 'staff', 'user'));

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  order_date DATE NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'done', 'cancelled')),
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Migrate existing databases to the pending -> preparing -> done lifecycle.
ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'pending';
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders
  ADD CONSTRAINT orders_status_check CHECK (status IN ('pending', 'preparing', 'done', 'cancelled'));

INSERT INTO users (name, email, password_hash, role)
VALUES
  ('Admin User', 'admin@gmail.com', '$2b$10$kvUr7s8lWaaBSr.RiTSW3.b6Pg9h3FFWHJrShBuncYsg2/bIJIkuK', 'admin'),
  ('Staff Member 1', 'staffmember1@gmail.com', '$2b$10$PzOmzncK5XXA2A7FQih7LuVQ7uO7A/3RxlRl2nzbojEWqsLGwG1qy', 'staff'),
  ('Staff Member 2', 'staffmember2@gmail.com', '$2b$10$dqFBiKaNey7I9p7zM4QvxOdRdl0K3JrWAUt78H5kMGN8XTOHpdkti', 'staff'),
  ('Staff Member 3', 'staffmember3@gmail.com', '$2b$10$B9duKpOtw.6rDAKug2JF/eOyK4R8S3yTTKyc0MDwFLZcBXrLAcBO.', 'staff')
ON CONFLICT (email) DO UPDATE
SET name = EXCLUDED.name,
    password_hash = EXCLUDED.password_hash,
    role = EXCLUDED.role,
    updated_at = NOW();

INSERT INTO orders (customer_name, description, order_date, status, created_by)
VALUES
  ('Alicia Stone', '2 grilled chicken wraps and 1 lemonade', '2026-10-09', 'pending', 2),
  ('Marcus Lee', 'Family meal: 4 burgers, fries, 2 soft drinks', '2026-10-09', 'preparing', 3),
  ('Nia Brown', 'Pizza combo with salad and bottled water', '2026-10-09', 'done', 4)
ON CONFLICT DO NOTHING;
