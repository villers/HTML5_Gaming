const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { createServer: createViteServer } = require("vite");

function randomIntInc(low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low);
}

(async () => {
  // http
  const vite = await createViteServer({
    server: { middlewareMode: true },
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res) => {
    let template = fs.readFileSync(
      path.resolve(__dirname, "index.html"),
      "utf-8"
    );
    res.status(200).set({ "Content-Type": "text/html" }).end(template);
  });

  // init
  const color = [
    "#999999",
    "#CCCCCC",
    "#00FF00",
    "#0000FF",
    "#FF0000",
    "#FFFF00",
  ];
  const users = [];
  const nbParticule = 250;
  const particules = [];

  for (let i = 0; i < nbParticule; i++) {
    particules[i] = {
      x: randomIntInc(0, 3000),
      y: randomIntInc(0, 3000),
      color: color[randomIntInc(0, 5)],
      id: i,
      mass: 1,
    };
  }

  // socket
  io.on("connection", function (socket) {
    let me = false;

    socket.on("new_player", function (user) {
      me = user;
      socket.emit("getParticules", particules);

      for (let k in users) {
        socket.emit("new_player", users[k]);
      }

      users[me.id] = me;
      socket.broadcast.emit("new_player", user);
    });

    socket.on("update_particles", function (id) {
      particules[id] = {
        x: randomIntInc(0, 3000),
        y: randomIntInc(0, 3000),
        color: color[randomIntInc(0, 5)],
        id: id,
        mass: 1,
      };
      io.emit("update_particles", particules[id]);
    });

    socket.on("move_player", function (user) {
      users[me.id] = user;
      socket.broadcast.emit("move_player", user);
    });

    socket.on("kill_player", function (enemy) {
      delete users[enemy.id];
      io.emit("kill_player", enemy);
    });

    socket.on("disconnect", function () {
      if (!me) {
        return false;
      }
      delete users[me.id];
      socket.broadcast.emit("logout", me.id);
    });
  });

  server.listen(3000, function () {
    console.log("listening on *:3000");
  });
})();
