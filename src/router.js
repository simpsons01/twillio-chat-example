const Router = require("express").Router;
const db = require("./db");
const tokenGenerator = require("./token_generator");
const router = new Router();
const {
  creataConversationByC,
  creataConversationByVip,
  addPaticipent,
  leavePaticipent,
} = require("../src/coversation");

router.post("/create/user/:name", (req, res) => {
  const name = req.params.name;
  const isUserExist = db.userList.some((user) => user.identity === name);
  const payload = tokenGenerator(req.params.name);
  payload.cid = "";
  payload.pid = "";
  if (!isUserExist) {
    db.userList.push(payload);
  } else {
    db.userList = db.userList.map((user) => {
      if (user.identity === payload.identity) {
        return payload;
      }
      return user;
    });
  }
  res.send(payload);
});

router.post("/create/c/conversation/:name", (req, res) => {
  creataConversationByC(req.params.name).then((sid) => {
    db.cidList.push(sid);
    res.send({ data: db.cidList });
  });
});

router.post("/create/vip/conversation/:name", (req, res) => {
  creataConversationByVip(req.params.name).then((sid) => {
    db.cidList.push(sid);
    res.send({ data: db.cidList });
  });
});

router.post("/join/:name/:sid", (req, res) => {
  const name = req.params.name;
  const sid = req.params.sid;
  addPaticipent(sid, name).then(({ cid, pid }) => {
    db.userList.forEach((user) => {
      if (user.identity === name) {
        user.cid = cid;
        user.pid = pid;
      }
    });
    res.send({ data: db.userList });
  });
});

router.get("/get/user/:name", (req, res) => {
  const name = req.params.name;
  const payload = db.userList.find((user) => user.identity === name);
  if (payload) {
    res.send(payload);
  } else {
    res.status(400).send({ msg: "bad request" });
  }
});

router.delete("/remove/:name/:sid", (req, res) => {
  const payload = db.userList.find((user) => user.identity === req.params.name);
  leavePaticipent(payload.cid, payload.pid).then(() => {
    db.userList.forEach((user) => {
      if (user.identity === payload.identity) {
        user.cid = "";
        user.pid = "";
      }
    });
    res.send({ data: db.userList });
  });
});

module.exports = router;
