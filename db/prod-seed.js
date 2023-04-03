const { seed } = require("./seed");

seed(`
INSERT INTO tasks
  (task_slug, description)
VALUES
  ('water', 'one of the most important tasks for your garden'),
  ('prune', 'clean plants up to keep them happier'),
  ('look for bugs', 'not all bugs are bad though!'),
  ('health check', 'look out for signs of disease'),
  ('harvest', 'enjoy your garden''s bounty')
`);
