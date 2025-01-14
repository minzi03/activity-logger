import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";
const path = "./data.json";

// Hàm kiểm tra ngày có hợp lệ không
const isValidDate = (date) => {
  const startDate = moment("2020-04-17");
  const endDate = moment("2022-7-21");
  return date.isBetween(startDate, endDate, null, "[]");
};

// Hàm tạo commit với ngày cụ thể
const markCommit = async (date) => {
  const data = { date: date.toISOString() };
  await jsonfile.writeFile(path, data); // Ghi ngày vào file data.json
  const git = simpleGit();
  await git.add([path]); // Thêm file data.json vào staging area
  await git.commit(`Commit at ${date.toISOString()}`, {
    "--date": date.toISOString(),
  }); // Tạo commit mới
};

// Hàm tạo n commit
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

  // Push tất cả commit lên remote repository
  console.log("Pushing all commits...");
  await git.push();
};

// Gọi hàm tạo commit
makeCommits(300);
