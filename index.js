import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import { dbConfig } from "./config/dataBaseConfig.js";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let db = new pg.Client(dbConfig);
db.connect();

async function getItems(){
  let items = [];
  try{
    const result = await db.query("select * from items");
    items = result.rows;
  } catch (error){
    console.log(error);
  }
  return items;
}

app.get("/", async (req, res) => {
  let items = await getItems();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", (req, res) => {
  const item = req.body.newItem;
  items.push({ title: item });
  res.redirect("/");
});

app.post("/edit", (req, res) => {});

app.post("/delete", (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
