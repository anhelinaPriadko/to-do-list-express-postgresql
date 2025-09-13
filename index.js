import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import { validationResult, checkSchema } from "express-validator";
import { dbConfig } from "./config/dataBaseConfig.js";
import {
  titleAddValidationSchema,
  titleUpdateValidationSchema,
} from "./utilities/validationSchema.mjs";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let db = new pg.Client(dbConfig);
db.connect();

async function getItems() {
  let items = [];
  try {
    const result = await db.query("select * from items");
    items = result.rows;
  } catch (error) {
    console.log(error);
  }
  return items;
}

async function addItem(title) {
  try {
    await db.query("insert into items (title) values ($1)", [title]);
  } catch (error) {
    console.log(error);
  }
}

app.get("/", async (req, res) => {
  let items = await getItems();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", checkSchema(titleAddValidationSchema), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
  } else {
    await addItem(req.body.newItem);
  }
  res.redirect("/");
});

app.post("/edit", (req, res) => {});

app.post("/delete", (req, res) => {});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
