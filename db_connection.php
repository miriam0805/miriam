<?php
// 데이터베이스 연결 설정
class Database {
    private $host = 'localhost';
    private $db_name = 'talkingstar_db';
    private $username = 'root';
    private $password = '';
    private $conn;
    
    public function getConnection() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8",
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $e) {
            echo "데이터베이스 연결 실패: " . $e->getMessage();
        }
        
        return $this->conn;
    }
}

// 학생 관리 클래스
class StudentManager {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    // 모든 학생 조회
    public function getAllStudents() {
        $query = "SELECT * FROM students ORDER BY student_number";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }
    
    // 클래스별 학생 조회
    public function getStudentsByClass($class_name) {
        $query = "SELECT * FROM students WHERE class_name = ? ORDER BY student_number";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$class_name]);
        return $stmt->fetchAll();
    }
    
    // 학생 ID로 조회
    public function getStudentById($student_id) {
        $query = "SELECT * FROM students WHERE student_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$student_id]);
        return $stmt->fetch();
    }
    
    // 새 학생 추가
    public function addStudent($data) {
        $query = "INSERT INTO students (academy, student_number, student_id, password, class_name, grade, phone_number, phone_number2, start_date) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([
            $data['academy'],
            $data['student_number'],
            $data['student_id'],
            $data['password'],
            $data['class_name'],
            $data['grade'],
            $data['phone_number'],
            $data['phone_number2'],
            $data['start_date']
        ]);
    }
    
    // 학생 정보 수정
    public function updateStudent($id, $data) {
        $query = "UPDATE students SET 
                  academy = ?, student_number = ?, student_id = ?, password = ?, 
                  class_name = ?, grade = ?, phone_number = ?, phone_number2 = ?, start_date = ?
                  WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([
            $data['academy'],
            $data['student_number'],
            $data['student_id'],
            $data['password'],
            $data['class_name'],
            $data['grade'],
            $data['phone_number'],
            $data['phone_number2'],
            $data['start_date'],
            $id
        ]);
    }
    
    // 학생 삭제
    public function deleteStudent($id) {
        $query = "DELETE FROM students WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$id]);
    }
}

// 성적 관리 클래스
class ScoreManager {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    // 학생 성적 조회
    public function getStudentScores($student_id) {
        $query = "SELECT * FROM student_scores WHERE student_id = ? ORDER BY lesson_date DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$student_id]);
        return $stmt->fetchAll();
    }
    
    // 성적 추가
    public function addScore($data) {
        $query = "INSERT INTO student_scores (student_id, lesson_date, point_score, try_count, level_score, total_score, memo) 
                  VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([
            $data['student_id'],
            $data['lesson_date'],
            $data['point_score'],
            $data['try_count'],
            $data['level_score'],
            $data['total_score'],
            $data['memo']
        ]);
    }
    
    // 성적 수정
    public function updateScore($id, $data) {
        $query = "UPDATE student_scores SET 
                  lesson_date = ?, point_score = ?, try_count = ?, level_score = ?, 
                  total_score = ?, memo = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([
            $data['lesson_date'],
            $data['point_score'],
            $data['try_count'],
            $data['level_score'],
            $data['total_score'],
            $data['memo'],
            $id
        ]);
    }
}

// 출석 관리 클래스
class AttendanceManager {
    private $conn;
    
    public function __construct($db) {
        $this->conn = $db;
    }
    
    // 출석 조회
    public function getAttendance($student_id, $date = null) {
        if ($date) {
            $query = "SELECT * FROM attendance WHERE student_id = ? AND attendance_date = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$student_id, $date]);
        } else {
            $query = "SELECT * FROM attendance WHERE student_id = ? ORDER BY attendance_date DESC";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$student_id]);
        }
        return $stmt->fetchAll();
    }
    
    // 출석 체크
    public function checkAttendance($data) {
        $query = "INSERT INTO attendance (student_id, attendance_date, status, check_in_time, check_out_time, memo) 
                  VALUES (?, ?, ?, ?, ?, ?) 
                  ON DUPLICATE KEY UPDATE 
                  status = VALUES(status), 
                  check_in_time = VALUES(check_in_time), 
                  check_out_time = VALUES(check_out_time), 
                  memo = VALUES(memo)";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([
            $data['student_id'],
            $data['attendance_date'],
            $data['status'],
            $data['check_in_time'],
            $data['check_out_time'],
            $data['memo']
        ]);
    }
}

// 사용 예시
/*
$database = new Database();
$db = $database->getConnection();

$studentManager = new StudentManager($db);
$scoreManager = new ScoreManager($db);
$attendanceManager = new AttendanceManager($db);

// 모든 학생 조회
$students = $studentManager->getAllStudents();

// 특정 학생 성적 조회
$scores = $scoreManager->getStudentScores(1);

// 출석 체크
$attendanceData = [
    'student_id' => 1,
    'attendance_date' => '2025-01-27',
    'status' => 'present',
    'check_in_time' => '14:00:00',
    'check_out_time' => '15:30:00',
    'memo' => '정상 출석'
];
$attendanceManager->checkAttendance($attendanceData);
*/
?> 