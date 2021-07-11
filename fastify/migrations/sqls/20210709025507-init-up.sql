/* Replace with your SQL commands */

CREATE TABLE "user" (
  "uid"         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "email"       VARCHAR NOT NULL UNIQUE,
  "hash"        VARCHAR NOT NULL,
  "created_at"  TIMESTAMP DEFAULT NOW(),
  "updated_at"  TIMESTAMP
);
CREATE INDEX "idx_user_email" ON "user"("email");


CREATE TABLE "note" (
  "id"          SERIAL PRIMARY KEY,
  "user_uid"    UUID NOT NULL,
  "title"       VARCHAR NOT NULL,
  "body"        VARCHAR NOT NULL,
  "body_tsv"    TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', substring("body", 1, 1000000))) STORED,
  "created_at"  TIMESTAMP DEFAULT NOW(),
  "updated_at"  TIMESTAMP,

  CONSTRAINT "fk_note_user_uid"
    FOREIGN KEY("user_uid")
    REFERENCES "user"("uid")
    ON DELETE CASCADE
);
CREATE INDEX "idx_note_body_tsv_gin" ON "note" USING GIN(body_tsv);
CREATE INDEX "idx_note_user_uid" ON "user"("email");
