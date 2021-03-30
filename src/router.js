const Router = require("express").Router;
const db = require("./db");
const tokenGenerator = require("./token_generator");
const router = new Router();
const {
  creataConversationByC,
  creataConversationByVip,
  addPaticipent,
  leavePaticipent,
  updateConversationAttr
} = require("../src/coversation");

router.post("/create/user/:name", (req, res) => {
  const name = req.params.name;
  const isUserExist = db.userList.some((user) => user.name === name);
  const payload = tokenGenerator(req.params.name);
  payload.cid = "";
  payload.pid = "";
  if (!isUserExist) {
    db.userList.push(payload);
  } else {
    db.userList = db.userList.map((user) => {
      if (user.name === payload.name) {
        return payload;
      }
      return user;
    });
  }
  res.send(payload);
});

router.post("/create/:type/conversation/:name", (req, res) => {
  const action =
    req.params.type === "c" ? creataConversationByC : creataConversationByVip;
  const payload = db.userList.find((user) => user.name === req.params.name);
  if (payload) {
    action(payload.id, payload.name).then((sid) => {
      db.cidList.push(sid);
      res.send({ data: sid });
    });
  } else {
    res.status(400).send({ msg: "bad request" });
  }
});

router.post("/createandjoin/:type/conversation/:name", (req, res) => {
  const action =
    req.params.type === "c" ? creataConversationByC : creataConversationByVip;
  const payload = db.userList.find((user) => user.name === req.params.name);
  if (payload) {
    action(payload.id, payload.name).then((sid) => {
      addPaticipent(sid, payload.id).then(({ cid, pid }) => {
        db.cidList.push(sid);
        db.userList.forEach((user) => {
          if (user.id === payload.id) {
            user.cid = cid;
            user.pid = pid;
          }
        });
        res.send({
          data: {
            ...payload,
            cid,
            pid,
          },
        });
      });
    });
  } else {
    res.status(400).send({ msg: "bad request" });
  }
});

router.post("/join/:name/:sid", (req, res) => {
  const payload = db.userList.find((user) => user.name === req.params.name);
  if (payload) {
    const sid = req.params.sid;
    addPaticipent(sid, payload.id).then(({ cid, pid }) => {
      db.userList.forEach((user) => {
        if (user.id === payload.id) {
          user.cid = cid;
          user.pid = pid;
        }
      });
      res.send({ data: db.userList });
    });
  } else {
    res.status(400).send({ msg: "bad request" });
  }
});

router.get("/get/user/:name", (req, res) => {
  const name = req.params.name;
  const payload = db.userList.find((user) => user.name === name);
  if (payload) {
    res.send(payload);
  } else {
    res.status(400).send({ msg: "bad request" });
  }
});

router.get("/get/cidlist", (req, res) => {
  res.send({ data: db.cidList });
});

router.delete("/remove/:userId/:sid", (req, res) => {
  const payload = db.userList.find((user) => user.id === req.params.userId);
  leavePaticipent(payload.cid, payload.pid).then(() => {
    db.userList.forEach((user) => {
      if (user.id === payload.id) {
        user.cid = "";
        user.pid = "";
      }
    });
    res.send({ data: db.userList });
  });
});

router.post("/edit/:sid", (req, res) => {
  const sid = req.params.sid;
  const attrs = req.body;
  if(sid && attrs) {
    updateConversationAttr(sid, attrs).then((conversation) => {
      res.send(conversation);
    }).catch(err=>console.log(err));
  } else {
    res.status(400).send({ msg: "bad request" });
  }
});

module.exports = router;
