-- Example relational schema for a My Stay portal backend (Azure SQL / SQL Server syntax).
-- Illustrative starting point only: adapt to your property-management system.
-- Authorisation rule: every query is scoped to the booking(s) linked to the signed-in guest.

CREATE TABLE guest (
  guest_id        UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  identity_sub    NVARCHAR(200) NULL UNIQUE,        -- subject id from your identity provider
  email           NVARCHAR(254) NOT NULL,
  first_name      NVARCHAR(80)  NOT NULL,
  last_name       NVARCHAR(80)  NOT NULL,
  phone           NVARCHAR(30)  NULL,
  country         NVARCHAR(80)  NULL,
  created_at      DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE booking (
  booking_id      UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  reference       NVARCHAR(20)  NOT NULL UNIQUE,    -- e.g. SOL-ABC123 (not a secret; never sufficient on its own)
  guest_id        UNIQUEIDENTIFIER NOT NULL REFERENCES guest(guest_id),
  villa_id        NVARCHAR(40)  NOT NULL,           -- matches a villa id in data.js
  status          NVARCHAR(20)  NOT NULL,           -- Confirmed, Cancelled, …
  confirmed_on    DATE          NULL,
  arrival         DATE          NOT NULL,
  departure       DATE          NOT NULL,
  rate            DECIMAL(12,2) NOT NULL,
  currency        CHAR(3)       NOT NULL,
  adults          TINYINT       NOT NULL,
  children        TINYINT       NOT NULL DEFAULT 0,
  infants         TINYINT       NOT NULL DEFAULT 0,
  flight          NVARCHAR(40)  NULL,
  dietary         NVARCHAR(500) NULL,
  occasion        NVARCHAR(200) NULL,
  planner_id      UNIQUEIDENTIFIER NULL
);

CREATE TABLE booking_document (
  document_id     NVARCHAR(40)  PRIMARY KEY,        -- e.g. INV-0001
  booking_id      UNIQUEIDENTIFIER NOT NULL REFERENCES booking(booking_id),
  kind            NVARCHAR(10)  NOT NULL,           -- invoice | document
  title           NVARCHAR(120) NOT NULL,
  issued          DATE          NOT NULL,
  amount          DECIMAL(12,2) NULL,
  status          NVARCHAR(20)  NULL,               -- Paid, Due
  paid_on         DATE          NULL,
  due_on          DATE          NULL,
  blob_path       NVARCHAR(400) NULL                -- private container path; never exposed directly
);

CREATE TABLE itinerary_item (
  item_id         UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  booking_id      UNIQUEIDENTIFIER NOT NULL REFERENCES booking(booking_id),
  item_date       DATE          NOT NULL,
  item_time       CHAR(5)       NOT NULL,
  title           NVARCHAR(120) NOT NULL,
  detail          NVARCHAR(500) NULL,
  status          NVARCHAR(20)  NOT NULL
);

CREATE TABLE concierge_request (
  request_id      NVARCHAR(20)  PRIMARY KEY,
  booking_id      UNIQUEIDENTIFIER NOT NULL REFERENCES booking(booking_id),
  service         NVARCHAR(120) NOT NULL,
  request_date    DATE          NULL,
  detail          NVARCHAR(1500) NOT NULL,
  status          NVARCHAR(20)  NOT NULL DEFAULT 'Received',
  created_at      DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE message (
  message_id      UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
  booking_id      UNIQUEIDENTIFIER NOT NULL REFERENCES booking(booking_id),
  sender          NVARCHAR(10)  NOT NULL,           -- guest | planner
  body            NVARCHAR(2000) NOT NULL,
  sent_at         DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE checklist_item (
  booking_id      UNIQUEIDENTIFIER NOT NULL REFERENCES booking(booking_id),
  item_key        NVARCHAR(40)  NOT NULL,
  label           NVARCHAR(200) NOT NULL,
  done            BIT           NOT NULL DEFAULT 0,
  PRIMARY KEY (booking_id, item_key)
);

CREATE TABLE portal_audit (
  audit_id        BIGINT IDENTITY PRIMARY KEY,
  at              DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
  booking_id      UNIQUEIDENTIFIER NULL,
  event           NVARCHAR(40)  NOT NULL,           -- signin_ok, signin_fail, document_view, …
  ip_hash         VARBINARY(32) NULL
);
