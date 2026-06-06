CREATE TABLE IF NOT EXISTS recruiter_details (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(180) NOT NULL,
    company_name VARCHAR(180) NOT NULL,
    designation VARCHAR(120) NOT NULL,
    reason TEXT NOT NULL,
    otp_hash VARCHAR(255),
    otp_expires_at TIMESTAMPTZ,
    otp_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resume_downloads (
    id BIGSERIAL PRIMARY KEY,
    recruiter_id BIGINT NOT NULL REFERENCES recruiter_details(id) ON DELETE CASCADE,
    download_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address VARCHAR(80)
);

CREATE TABLE IF NOT EXISTS admin_users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(80) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_messages (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(180) NOT NULL,
    message TEXT NOT NULL,
    created_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS visitor_events (
    id BIGSERIAL PRIMARY KEY,
    path VARCHAR(255) NOT NULL,
    ip_address VARCHAR(80),
    user_agent TEXT,
    visited_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recruiter_details_email ON recruiter_details(email);
CREATE INDEX IF NOT EXISTS idx_recruiter_details_created_date ON recruiter_details(created_date DESC);
CREATE INDEX IF NOT EXISTS idx_resume_downloads_time ON resume_downloads(download_time DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_events_visited_at ON visitor_events(visited_at DESC);
