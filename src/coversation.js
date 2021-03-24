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
const { v4: uuidv4 } = require("uuid");

module.exports = {
  creataConversationByC: function (identity, name) {
    console.log(identity);
    return new Promise((resolve) => {
      const custName = radomCompanyName();
      const jobName = radomJobName();
      client.conversations.conversations
        .create({
          uniqueName: "tanji-" + Math.random() * Math.random() * 1000,
          attributes: JSON.stringify({
            b: {
              identity: uuidv4(),
              custName,
              jobName,
              isApplied: Math.random() > 0.5,
              applicant: name,
            },
            c: {
              identity,
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
    console.log(identity);
    return new Promise((resolve) => {
      const custName = radomCompanyName();
      const jobName = radomJobName();
      client.conversations.conversations
        .create({
          uniqueName: "tanji-" + Math.random() * Math.random() * 1000,
          attributes: JSON.stringify({
            b: {
              identity,
              custName,
              jobName,
              isApplied: Math.random() > 0.5,
              applicant: radomApplyName(),
            },
            c: {
              identity: uuidv4(),
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
    console.log(identity);
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
