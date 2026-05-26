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
  status TEXT NOT NULL DEFAULT 'SENT',
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
('Furosemide', 'C03CA01', 'tablet', '40mg', 55, 10, NOW() - INTERVAL '1 day', NOW()),
('Aspirin', 'B01AC06', 'tablet', '100mg', 3, 10, NOW() - INTERVAL '11 days', NOW() - INTERVAL '1 day'),
('Diazepam', 'N05BA01', 'tablet', '5mg', 2, 5, NOW() - INTERVAL '12 days', NOW() - INTERVAL '2 days'),
('Atorvastatin', 'C10AA05', 'tablet', '20mg', 90, 15, NOW() - INTERVAL '13 days', NOW() - INTERVAL '3 days'),
('Warfarin', 'B01AA03', 'tablet', '5mg', 4, 10, NOW() - INTERVAL '14 days', NOW() - INTERVAL '1 day'),
('Prednisolone', 'H02AB06', 'tablet', '5mg', 60, 10, NOW() - INTERVAL '15 days', NOW() - INTERVAL '2 days'),
('Enoxaparin', 'B01AB05', 'injection', '40mg/0.4ml', 3, 8, NOW() - INTERVAL '16 days', NOW() - INTERVAL '1 day'),
('Ondansetron', 'A04AA01', 'injection', '4mg/2ml', 22, 5, NOW() - INTERVAL '17 days', NOW() - INTERVAL '3 days'),
('Lorazepam', 'N05BA06', 'injection', '4mg/ml', 4, 5, NOW() - INTERVAL '18 days', NOW() - INTERVAL '2 days'),
('Fluticasone', 'R03BA05', 'inhalation', '250mcg', 35, 8, NOW() - INTERVAL '19 days', NOW() - INTERVAL '1 day'),
('Ipratropium', 'R03BB01', 'inhalation', '20mcg', 6, 8, NOW() - INTERVAL '20 days', NOW() - INTERVAL '2 days'),
('Metronidazole', 'J01XD01', 'tablet', '400mg', 75, 10, NOW() - INTERVAL '21 days', NOW() - INTERVAL '3 days'),
('Ciprofloxacin', 'J01MA02', 'tablet', '500mg', 40, 10, NOW() - INTERVAL '22 days', NOW() - INTERVAL '1 day'),
('Vancomycin', 'J01XA01', 'injection', '500mg', 3, 5, NOW() - INTERVAL '23 days', NOW() - INTERVAL '2 days'),
('Dexamethasone', 'H02AB02', 'injection', '4mg/ml', 28, 5, NOW() - INTERVAL '24 days', NOW() - INTERVAL '1 day'),
('Amlodipine', 'C08CA01', 'tablet', '5mg', 110, 20, NOW() - INTERVAL '25 days', NOW() - INTERVAL '2 days');

-- =========================
-- SEED DATA: ORDERS (time-based realism)
-- =========================
INSERT INTO orders (status, unit, created_at, updated_at)
VALUES
('DRAFT',     'WARD B', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
('SENT',      'ICU',    NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('SENT',      'WARD B', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
('CONFIRMED', 'ER',     NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),
('CONFIRMED', 'ICU',    NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day'),
('DELIVERED', 'WARD A', NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 day'),
('DELIVERED', 'ER',     NOW() - INTERVAL '2 days', NOW()),
('SENT',      'WARD C', NOW() - INTERVAL '1 day',  NOW() - INTERVAL '1 day'),
('DELIVERED', 'ICU',    NOW() - INTERVAL '6 days', NOW() - INTERVAL '3 days');
-- =========================
-- SEED DATA: ORDER ITEMS
-- =========================
INSERT INTO order_items (order_id, medicine_id, quantity)
VALUES
(1,  1, 20),
(2,  8, 5),
(3,  2, 10),
(3,  5, 3),
(4,  3, 8),
(4,  6, 2),
(5,  4, 15),
(5,  7, 4),
(6,  9, 6),
(6, 10, 12),
(7,  1, 30),
(7,  3, 5),
(8,  2, 8),
(8,  4, 7),
(9,  5, 4),
(9,  6, 10);
