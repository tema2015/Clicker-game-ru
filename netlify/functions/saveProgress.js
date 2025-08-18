import { Client } from "pg";

const client = new Client({ connectionString: process.env.NEON_DATABASE_URL });

export async function handler(event) {
  await client.connect();
  const { userId, data } = JSON.parse(event.body);

  await client.query(`
    CREATE TABLE IF NOT EXISTS click_game (
      user_id TEXT PRIMARY KEY,
      clicks INT,
      clicksPerClick INT,
      autoClicks INT,
      prestige INT,
      buyCost INT,
      autoCost INT
    );
  `);

  await client.query(`
    INSERT INTO click_game(user_id, clicks, clicksPerClick, autoClicks, prestige, buyCost, autoCost)
    VALUES($1,$2,$3,$4,$5,$6,$7)
    ON CONFLICT(user_id) DO UPDATE SET
      clicks=EXCLUDED.clicks,
      clicksPerClick=EXCLUDED.clicksPerClick,
      autoClicks=EXCLUDED.autoClicks,
      prestige=EXCLUDED.prestige,
      buyCost=EXCLUDED.buyCost,
      autoCost=EXCLUDED.autoCost;
  `,[userId,data.clicks,data.clicksPerClick,data.autoClicks,data.prestige,data.buyCost,data.autoCost]);

  await client.end();
  return { statusCode:200, body:JSON.stringify({success:true}) };
}
