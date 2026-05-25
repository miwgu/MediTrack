-- =========================
-- MEDICINES
-- =========================
CREATE TABLE medicines (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  atc_code TEXT NOT NULL,
  form TEXT,
  strength TEXT,
  stock INT NOT NULL DEFAULT 0,
  threshold INT NOT NULL DEFAULT 10,
  
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- ORDERS
-- =========================
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  unit TEXT NOT NULL,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- ORDER ITEMS
-- =========================
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INT NOT NULL,
  medicine_id INT NOT NULL,
  quantity INT NOT NULL,

  CONSTRAINT fk_order
    FOREIGN KEY (order_id)
    REFERENCES orders(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_medicine
    FOREIGN KEY (medicine_id)
    REFERENCES medicines(id)
);

-- =========================
-- SEED DATA: MEDICINES
-- =========================
INSERT INTO medicines (name, atc_code, form, strength, stock, threshold, created_at, updated_at)
VALUES
('Paracetamol', 'N02BE01', 'tablet', '500mg', 120, 10, NOW() - INTERVAL '10 days', NOW() - INTERVAL '2 days'),
('Ibuprofen', 'M01AE01', 'tablet', '200mg', 60, 10, NOW() - INTERVAL '9 days', NOW() - INTERVAL '1 day'),
('Amoxicillin', 'J01CA04', 'capsule', '250mg', 30, 5, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
('Omeprazole', 'A02BC01', 'capsule', '20mg', 80, 10, NOW() - INTERVAL '7 days', NOW() - INTERVAL '3 days'),
('Insulin Glargine', 'A10AE04', 'injection', '100 IU/ml', 25, 5, NOW() - INTERVAL '6 days', NOW() - INTERVAL '1 day'),
('Morphine', 'N02AA01', 'injection', '10 mg/ml', 15, 5, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('Salbutamol', 'R03AC02', 'inhalation', '100 mcg', 40, 8, NOW() - INTERVAL '4 days', NOW() - INTERVAL '2 days'),
('Metformin', 'A10BA02', 'tablet', '500mg', 200, 20, NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day'),
('Ceftriaxone', 'J01DD04', 'injection', '1g', 18, 5, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('Furosemide', 'C03CA01', 'tablet', '40mg', 55, 10, NOW() - INTERVAL '1 day', NOW());

-- =========================
-- SEED DATA: ORDERS (time-based realism)
-- =========================
INSERT INTO orders (status, unit, created_at, updated_at)
VALUES
('DRAFT', 'ICU', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('SENT', 'ER', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('CONFIRMED', 'WARD A', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
('DELIVERED', 'ICU', NOW(), NOW());

-- =========================
-- SEED DATA: ORDER ITEMS
-- =========================
INSERT INTO order_items (order_id, medicine_id, quantity)
VALUES
(2, 1, 2),
(2, 2, 1),
(3, 3, 5),
(4, 4, 2);
