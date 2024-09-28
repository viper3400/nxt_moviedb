import { initConnection } from "#root/db/connection";

initConnection().then(() => {
  console.log("DB connection established.");
});
