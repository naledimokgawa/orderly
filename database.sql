CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  order_date DATE NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'preparing' CHECK (status IN ('preparing', 'done', 'cancelled')),
  created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO users (name, email, password_hash, role)
VALUES
  ('Admin User', 'admin@gmail.com', '$2b$10$nfypYvLER0NxfJyaDMnameoKtx19ItchoysoH0bkOZ4qNLSNfaPEy', 'admin'),
  ('Staff Member 1', 'staffmember1@gmail.com', '$2b$10$NeOe/RZBj0kLm78TSFFS4.TMyS682QOz08KpXUvVEnClk02nWwXhm', 'staff'),
  ('Staff Member 2', 'staffmember2@gmail.com', '$2b$10$eSxDMhRX/xgXlHAH/T6QI.FtPslpnhM3JuY3A74GG23yhs2Y7lmP6', 'staff'),
  ('Staff Member 3', 'staffmember3@gmail.com', '$2b$10$Xrawt4hYhQftlM9/XzkZ3.7sM0SN2oDyt7U68HLUgmRiRBV2WK9eC', 'staff')
ON CONFLICT (email) DO NOTHING;

INSERT INTO orders (customer_name, description, order_date, status, created_by)
VALUES
  ('Alicia Stone', '2 grilled chicken wraps and 1 lemonade', '2026-10-09', 'preparing', 2),
  ('Marcus Lee', 'Family meal: 4 burgers, fries, 2 soft drinks', '2026-10-09', 'preparing', 3),
  ('Nia Brown', 'Pizza combo with salad and bottled water', '2026-10-09', 'done', 4)
ON CONFLICT DO NOTHING;
