const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// 정적 파일 서빙 설정
app.use(express.static(__dirname));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// students.json 파일 경로 (server.js가 public 폴더에 있을 때)
const studentsPath = path.join(__dirname, 'assets', 'data', 'students.json');
const students = JSON.parse(fs.readFileSync(studentsPath, 'utf8'));

// 루트 경로에서 index.html 제공
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 로그인 페이지 경로
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// 로그인 API (이름+비번)
app.post('/login', (req, res) => {
  const { name, password } = req.body;
  const student = students.find(
    s => s.ID === name && s.password === password
  );
  if (student) {
    // 로그인 기록 저장
    const loginLog = {
      ID: student.ID,
      number: student.number,
      academy: student.Academy,
      class: student.Class,
      grade: student.Grade,
      loginTime: new Date().toISOString(),
      action: "로그인"
    };
    fs.appendFile('login_log.txt', JSON.stringify(loginLog) + '\n', err => {});
    // login_log.json에 누적 저장
    let arr = [];
    try {
      arr = JSON.parse(fs.readFileSync('login_log.json', 'utf8'));
    } catch (e) {}
    arr.push(loginLog);
    fs.writeFileSync('login_log.json', JSON.stringify(arr, null, 2));
    // 필드명 변환해서 반환
    const studentInfo = {
      ID: student.ID,
      number: student.number,
      academy: student.Academy,
      class: student.Class,
      grade: student.Grade,
      phonnumber: student.Phonnumber,
      phonnumber2: student.Phonnumber2,
      startDay: student.StartDay
    };
    res.json({ success: true, student: studentInfo });
  } else {
    res.json({ success: false });
  }
});

// 활동 기록 저장 API
app.post('/activity', (req, res) => {
  const log = req.body;
  fs.appendFile('activity_log.txt', JSON.stringify(log) + '\n', err => {});
  fs.appendFile('activity_log.json', JSON.stringify(log) + '\n', err => {});
  res.sendStatus(200);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`서버 실행중: http://localhost:${PORT}`);
});