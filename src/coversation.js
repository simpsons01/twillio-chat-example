var config = require("./config");
var client = require("twilio")(
  config.TWILIO_ACCOUNT_SID,
  config.TWILIO_AUTH_TOKEN
);

module.exports = {
  creataConversation: function (identity) {
    return new Promise((resolve) => {
      client.conversations.conversations
        .create({
          uniqueName:
            "tanji-" + Math.random() * Math.random() * Math.random() * 10000,
          attributes: JSON.stringify({
            b: {
              custName: "104好食光咖啡廳",
              jobName: "內部廚房人員,櫃檯收銀人員,咖啡輕食",
              isApplied: Math.random() > 0.5,
            },
            c: {
              name: identity,
              jobName: "內部廚房人員,櫃檯收銀人員,咖啡輕食",
            },
          }),
        })
        .then((conversation) => {
          resolve(conversation.sid);
        })
        .catch((err) => console.log(err));
    });
  },
  addPaticipent: function (cid, identity) {
    return new Promise((resolve) => {
      client.conversations
        .conversations(cid)
        .participants.create({ identity })
        .then((participant) =>
          resolve({
            cid: cid,
            pid: participant.sid,
          })
        )
        .catch((err) => console.log(err));
    });
  },
  leavePaticipent: function (cid, pid) {
    return new Promise((resolve) => {
      client.conversations.conversations(cid).participants(pid).remove();
      resolve();
    });
  },
};
