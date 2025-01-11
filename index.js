const fs = require("fs");
const moment = require("moment");
const random = require("random");
const jsonfile = require("jsonfile");
const simpleGit = require("simple-git");

const git = simpleGit();

// Tạo commit giả
async function fakeCommit() {
  const filePath = "./data.json";

  // Đọc dữ liệu hiện tại từ data.json
  let data = {};
  if (fs.existsSync(filePath)) {
    data = jsonfile.readFileSync(filePath);
  }

  // Thêm thời gian và dữ liệu ngẫu nhiên vào data
  const newData = {
    time: moment().format(),
    randomValue: random.int(0, 100),
  };

  // Cập nhật tệp data.json
  data = { ...data, ...newData };
  jsonfile.writeFileSync(filePath, data, { spaces: 2 });

  // Đảm bảo git đã được khởi tạo
  await git.init();

  // Stage các thay đổi
  await git.add(filePath);

  // Commit giả
  await git.commit(`Fake commit at ${moment().format()}`);

  // Kiểm tra xem có thay đổi chưa
  const status = await git.status();
  console.log(status);

  console.log("Fake commit đã được tạo.");
}

fakeCommit();
