CREATE USER node WITH PASSWORD "password" WITH LOGIN;

-- TRUNCATE TABLE and UPDATE SEQUENCES sbould on a separate role
GRANT USAGE, CREATE ON SCHEMA "public" TO "node";
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA "public" to "node";
GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE ON ALL TABLES IN SCHEMA public TO "node";
