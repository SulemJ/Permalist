import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

const app = express();
const port = 3000;
env.config();
const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

db.connect();

async function getList(){    
 const result = await db.query("select * from items ");
  items = result.rows;
  return items
}
app.get("/", async (req, res) => {
   const items = await getList();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  db.query(`insert into items(title) values('${item}')`);
  res.redirect("/");
});

app.post("/edit", (req, res) => {
  let title = req.body.updatedItemTitle;
  let id = req.body.updatedItemId;
  db.query(`update items set title = '${title}' where id = ${id}`);
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  const id = req.body.deleteItemId;
  db.query(`delete from items where id =${id} `);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
