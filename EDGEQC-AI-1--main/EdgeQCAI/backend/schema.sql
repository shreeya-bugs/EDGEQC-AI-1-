CREATE DATABASE IF NOT EXISTS edgeqc_ai
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE edgeqc_ai;

CREATE TABLE IF NOT EXISTS machines (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  line_name VARCHAR(80),
  status ENUM('running', 'warning', 'stopped', 'maintenance') NOT NULL DEFAULT 'running',
  defect_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  throughput_ppm INT NOT NULL DEFAULT 0,
  pass_rate DECIMAL(5,2) NOT NULL DEFAULT 100.00,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inspection_runs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255),
  source ENUM('file_upload', 'base64') NOT NULL,
  status VARCHAR(40) NOT NULL,
  defect_type VARCHAR(160),
  severity VARCHAR(40),
  confidence DECIMAL(7,5),
  defect_count INT NOT NULL DEFAULT 0,
  annotated_image_base64 LONGTEXT,
  raw_result JSON,
  error_message TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS detected_defects (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  inspection_run_id BIGINT NOT NULL,
  label VARCHAR(120) NOT NULL,
  confidence DECIMAL(7,5),
  x1 DECIMAL(10,2),
  y1 DECIMAL(10,2),
  x2 DECIMAL(10,2),
  y2 DECIMAL(10,2),
  raw_detection JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_detected_defects_inspection
    FOREIGN KEY (inspection_run_id) REFERENCES inspection_runs(id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_message TEXT NOT NULL,
  language VARCHAR(16) NOT NULL DEFAULT 'en',
  response_json JSON,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS whatsapp_reports (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  recipient_phone VARCHAR(32) NOT NULL,
  machine_name VARCHAR(120) NOT NULL,
  defect_count INT NOT NULL,
  top_issue VARCHAR(160) NOT NULL,
  recommended_action TEXT NOT NULL,
  estimated_loss DECIMAL(12,2) NOT NULL,
  alert_type VARCHAR(80) NOT NULL,
  provider_message_id VARCHAR(120),
  status VARCHAR(40) NOT NULL DEFAULT 'success',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS dataset_samples (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  image_base64 LONGTEXT NOT NULL,
  expected_issue VARCHAR(160),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO machines (id, name, line_name, status, defect_rate, throughput_ppm, pass_rate)
VALUES
  ('m1', 'Machine 1', 'Line 1', 'running', 1.20, 1420, 98.80),
  ('m2', 'Machine 2', 'Line 3', 'warning', 3.80, 1340, 96.20),
  ('m3', 'Machine 3', 'Line 2', 'running', 2.10, 1410, 97.90)
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  line_name = VALUES(line_name),
  status = VALUES(status),
  defect_rate = VALUES(defect_rate),
  throughput_ppm = VALUES(throughput_ppm),
  pass_rate = VALUES(pass_rate);


