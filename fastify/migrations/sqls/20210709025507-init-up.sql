/* Replace with your SQL commands */

CREATE TABLE "note" (
  "id"          SERIAL PRIMARY KEY,
  "title"       VARCHAR NOT NULL,
  "body"        VARCHAR NOT NULL,
  "body_tsv"    TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', substring("body", 1, 1000000))) STORED,
  "created_at"  TIMESTAMP DEFAULT NOW(),
  "updated_at"  TIMESTAMP
);

CREATE INDEX "idx_body_tsv_gin" ON "note" USING GIN(body_tsv);
