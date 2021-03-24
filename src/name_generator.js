const APPLY_NAME = ["林小寬", "張偉", "王芳", "張敏", "王靜"];

const COMPAMY_NAME = [
  "104好食光咖啡廳",
  "伊靈寺創意手搖飲",
  "社團法人高雄市牙醫師公會",
  "棠宇有限公司",
  "依田股份有限公司",
  "東森分眾傳媒股份有限公司",
];

const JOB_NAME = ["秘書、行政人員", "作業員", "電商業務人員", "主管座車司機"];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

module.exports = {
  radomApplyName: () => rand(APPLY_NAME),
  radomCompanyName: () => rand(COMPAMY_NAME),
  radomJobName: () => rand(JOB_NAME),
};
