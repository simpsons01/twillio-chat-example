var config = require("./config");
var client = require("twilio")(
  config.TWILIO_ACCOUNT_SID,
  config.TWILIO_AUTH_TOKEN
);
var {
  radomApplyName,
  radomCompanyName,
  radomJobName,
} = require("./name_generator");

module.exports = {
  creataConversationByC: function (identity) {
    return new Promise((resolve) => {
      const custName = radomCompanyName();
      const jobName = radomJobName();
      client.conversations.conversations
        .create({
          uniqueName: "tanji-" + Math.random() * Math.random() * 1000,
          attributes: JSON.stringify({
            b: {
              identity: radomApplyName(),
              custName,
              jobName,
              isApplied: Math.random() > 0.5,
            },
            c: {
              identity: identity,
              custName,
              jobName,
            },
          }),
        })
        .then((conversation) => {
          resolve(conversation.sid);
        })
        .catch((err) => console.log(err));
    });
  },
  creataConversationByVip: function (identity) {
    return new Promise((resolve) => {
      const custName = radomCompanyName();
      const jobName = radomJobName();
      client.conversations.conversations
        .create({
          uniqueName: "tanji-" + Math.random() * Math.random() * 1000,
          attributes: JSON.stringify({
            b: {
              identity: identity,
              custName,
              jobName,
              isApplied: Math.random() > 0.5,
            },
            c: {
              identity: radomApplyName(),
              custName,
              jobName,
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
