import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";
const path = "./data.json";

// Kiểm tra ngày hợp lệ
const isValidDate = (date) => {
  const startDate = moment("2029-03-02");
  const endDate = moment("2023-6-19");
  return date.isBetween(startDate, endDate, null, "[]");
};

// Hàm để tạo commit với một ngày cụ thể
const markCommit = async (date) => {
  const data = { date: date.toISOString() };
  await jsonfile.writeFile(path, data); // Ghi ngày vào file data.json
  const git = simpleGit();
  await git.add([path]); // Thêm file data.json vào staging area
  await git.commit(`Commit at ${date.toISOString()}`, {
    "--date": date.toISOString(),
  }); // Tạo commit mới
};

// Hàm tạo nhiều commit ngẫu nhiên
const makeCommits = async (n) => {
  const git = simpleGit();
  for (let i = 0; i < n; i++) {
    // Tạo số tuần và số ngày ngẫu nhiên
    const randomWeeks = Math.floor(Math.random() * (54 * 4 + 1)); // Tạo số tuần ngẫu nhiên từ 0 đến 216
    const randomDays = Math.floor(Math.random() * 7); // Tạo số ngày ngẫu nhiên từ 0 đến 6
    const randomDate = moment("2019-01-01")
      .add(randomWeeks, "weeks")
      .add(randomDays, "days"); // Tính ngày ngẫu nhiên từ 01/01/2019

    // Kiểm tra nếu ngày hợp lệ
    if (isValidDate(randomDate)) {
      console.log(`Creating commit: ${randomDate.toISOString()}`);
      await markCommit(randomDate); // Tạo commit với ngày ngẫu nhiên
    } else {
      console.log(`Invalid date: ${randomDate.toISOString()}, skipping...`);
    }
  }

  // Đẩy tất cả các commit lên GitHub
  console.log("Pushing all commits...");
  await git.push();
};

// Chạy tạo 50,000 commit
makeCommits(400);
