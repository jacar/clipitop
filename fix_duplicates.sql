-- Script para limpiar perfiles duplicados y asegurar unicidad

-- 1. Eliminar duplicados, manteniendo solo el más reciente para cada usuario
-- Usamos una CTE para identificar los IDs que no son el más reciente
WITH duplicates AS (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rnum
    FROM biolink_profiles
  ) t
  WHERE t.rnum > 1
)
DELETE FROM biolink_profiles
WHERE id IN (SELECT id FROM duplicates);

-- 2. Agregar restricción UNIQUE para evitar futuros duplicados
ALTER TABLE biolink_profiles ADD CONSTRAINT unique_user_profile UNIQUE (user_id);

-- 3. Confirmar
SELECT 'Duplicados eliminados y restricción agregada' as result;
