-- Cap nhat hoac tao role plasmic
DO $$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'plasmic') THEN
      CREATE ROLE plasmic LOGIN PASSWORD '112233' SUPERUSER;
   ELSE
      ALTER ROLE plasmic WITH PASSWORD '112233' SUPERUSER;
   END IF;
END
$$;

-- Tao database plasmic
CREATE DATABASE plasmic WITH OWNER = plasmic;
