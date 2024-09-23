const express = require("express");
const fs = require("fs");

//import user from json file
const users = require("./MOCK_DATA (1).json");

const app = express();

//middleware
app.use(express.urlencoded({ extended: false }));

//--server side rendering
app.get("/user", (req, res) => {
  const html = `
    <ul>
        ${users
          .map((user) => {
            return `<li>
            ${user.first_name}
            </li>`;
          })
          .join("")}
    </ul>
    `;
  res.send(html);
});

//--client side rendering
app.get("/api/user", (req, res) => {
  res.send(users);
  //it directly convert the content-type as the type of content

  // res.json(users);
  //it is directly convert js object to JSON format

  // res.end(JSON.stringify(users));
  //we can convert it to JSON format through JSON.stringfy() function
});

app.get("/api/user/:id", (req, res) => {
  const id = req.params.id;
  const user = users.find((user) => user.id == id);
  res.json(user);
});

app.post("/api/user", (req, res) => {
  const body = req.body;

  console.log(body);

  users.push({ ...body, id: users.length + 1 });
  fs.writeFile(
    "./MOCK_DATA (1).json",
    JSON.stringify(users),
    (error, response) => {
      res.end({ status: "ok" });
    }
  );
});

app.patch("/api/user/:id", (req, res) => {
  const updates = req.body;
  const id = req.params.id;

  const index = users.findIndex((user) => user.id == id);

  users[index] = { ...users[index], ...updates };

  fs.writeFile(
    "./MOCK_DATA (1).json",
    JSON.stringify(users),
    (error, response) => {
      res.end({ status: "ok" });
    }
  );
});

app.delete("/api/user/:id", (req, res) => {
  const id = req.params.id;

  const index = users.findIndex((user) => user.id == id);

  users[index] = {};

  fs.writeFile(
    "./MOCK_DATA (1).json",
    JSON.stringify(users),
    (error, response) => {
      res.json({ status: "ok" });
    }
  );
});
app.listen(8000, () => {
  console.log("server started");
});
