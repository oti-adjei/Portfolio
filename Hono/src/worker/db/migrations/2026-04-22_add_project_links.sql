-- Add links column to projects table
-- Stores JSON array of {label, url} objects
ALTER TABLE projects ADD COLUMN links TEXT DEFAULT '[]';

-- Populate links for projects that have live sites
UPDATE projects SET links = '[{"label":"Live Site","url":"https://senvon.studio"}]' WHERE id = '1';
UPDATE projects SET links = '[{"label":"Live Site","url":"https://royalpark-web.pages.dev"}]' WHERE id = '2';
UPDATE projects SET links = '[{"label":"Live Site","url":"https://lobabkids-web.pages.dev"}]' WHERE id = '3';
UPDATE projects SET links = '[{"label":"Live Site","url":"https://mummysdarl-web.pages.dev"}]' WHERE id = '7';
UPDATE projects SET links = '[{"label":"Live Site","url":"https://flexdown.com"}]' WHERE id = '8';
UPDATE projects SET links = '[{"label":"Live Site","url":"https://envoyergh.com"}]' WHERE id = '11';
UPDATE projects SET links = '[{"label":"Live Site","url":"https://purplepay.app"}]' WHERE id = '12';
UPDATE projects SET links = '[{"label":"Live Site","url":"https://nagyiqueboutique.ca"}]' WHERE id = '9';
UPDATE projects SET links = '[{"label":"Live Site","url":"https://dear-akua-web.pages.dev"}]' WHERE id = '10';
UPDATE projects SET links = '[{"label":"Live Site","url":"https://gulliverstravelhotelgh.com"}]' WHERE id = '14';
