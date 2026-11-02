// Reads the book recommendations sent from /shelf. Run through Doppler, which supplies DATABASE_URL:
//   npm run recs              the 30 newest
//   npm run recs -- done 7    mark #7 read
//   npm run recs -- schema    create the table (safe to run again)
import { readFileSync } from "node:fs";
import postgres from "postgres";
import { formatRecs } from "./format.mjs";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Run this through Doppler: npm run recs");
  process.exit(1);
}

const sql = postgres(process.env.DATABASE_URL, { ssl: "require", max: 1, onnotice: () => {} });
const [command = "list", arg] = process.argv.slice(2);

try {
  if (command === "schema") {
    await sql.unsafe(readFileSync(new URL("./schema.sql", import.meta.url), "utf8"));
    console.log("recommendations table ready.");
  } else if (command === "done") {
    const id = Number(arg);
    if (!Number.isInteger(id)) throw new Error("Give the number to mark read, e.g. npm run recs -- done 7");
    const rows = await sql`update recommendations set status = 'read' where id = ${id} returning id`;
    console.log(rows.length ? `#${id} marked read.` : `No recommendation #${id}.`);
  } else if (command === "list") {
    console.log(formatRecs(await sql`select * from recommendations order by created_at desc limit 30`));
  } else {
    throw new Error(`Unknown command "${command}". Use list, done <id> or schema.`);
  }
} catch (err) {
  console.error(err.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
