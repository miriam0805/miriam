-- 토킹스타 학원 데이터베이스 설정
-- 실행 방법: mysql -u root -p < setup_database.sql

-- 데이터베이스 생성
CREATE DATABASE IF NOT EXISTS talkingstar_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE talkingstar_db;

-- 학생 정보 테이블 생성
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    academy VARCHAR(50) NOT NULL DEFAULT '토킹스타',
    student_number INT NOT NULL,
    student_id VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(20) NOT NULL,
    class_name VARCHAR(50) NOT NULL,
    grade VARCHAR(20) NOT NULL,
    phone_number VARCHAR(20),
    phone_number2 VARCHAR(20),
    start_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_student_number (student_number),
    INDEX idx_student_id (student_id),
    INDEX idx_class_name (class_name),
    INDEX idx_grade (grade),
    INDEX idx_start_date (start_date)
);

-- 성적 관리 테이블
CREATE TABLE student_scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    lesson_date DATE NOT NULL,
    point_score INT DEFAULT 0,
    try_count INT DEFAULT 0,
    level_score INT DEFAULT 0,
    total_score INT DEFAULT 0,
    memo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    INDEX idx_student_date (student_id, lesson_date),
    INDEX idx_lesson_date (lesson_date)
);

-- 출석 관리 테이블
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    attendance_date DATE NOT NULL,
    status ENUM('present', 'absent', 'late', 'excused') DEFAULT 'present',
    check_in_time TIME,
    check_out_time TIME,
    memo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_date (student_id, attendance_date),
    INDEX idx_attendance_date (attendance_date),
    INDEX idx_status (status)
);

-- 수업 일정 테이블
CREATE TABLE class_schedule (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(50) NOT NULL,
    day_of_week ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    teacher_name VARCHAR(50),
    room_number VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_class_day (class_name, day_of_week),
    INDEX idx_active (is_active)
);

-- 학생 데이터 삽입
INSERT INTO students (academy, student_number, student_id, password, class_name, grade, phone_number, phone_number2, start_date) VALUES
('토킹스타', 1, '옥혜리', '0366', '비기너B', '1', '010-6354-0366', '010--', '2025-03-05'),
('토킹스타', 2, '한아란', '5623', '비기너B', '1', '010-4577-5623', '010--', '2025-03-04'),
('토킹스타', 3, '고이담', '5172', '비기너B', '1', '010-2324-5172', '010--', '2025-02-10'),
('토킹스타', 4, '김하준', '8397', '비기너B', '2', '010-5158-8397', '010--', '2025-02-24'),
('토킹스타', 5, '김예림', '9340', '비기너B', '2', '010-4475-9340', '010--', '2025-02-02'),
('토킹스타', 6, '오하린', '9343', '비기너B', '2', '010-9434-9343', '010-4607-0765', '2024-12-31'),
('토킹스타', 7, '이로이', '5797', '비기너B', '2', '010-9428-5797', '010--', '2024-11-03'),
('토킹스타', 8, '박시연', '9603', '비기너B', '2', '010-4669-9603', '010-3879-6382', '2024-02-24'),
('토킹스타', 9, '김유리', '4316', '비기너B', '2', '010-4554-4316', '010--', '2024-02-24'),
('토킹스타', 10, '사공윤', '1228', '비기너B', '3', '010-7758-1228', '010--', '2025-02-02'),
('토킹스타', 11, '이지온', '8587', '비기너B', '3', '010-9696-8587', '010--', '2024-10-05'),
('토킹스타', 12, '윤가온', '9695', '비기너B', '3', '010-9947-9695', '010--', '2024-10-05'),
('토킹스타', 13, '윤민서', '4965', '비기너B', '3', '010-5068-4965', '010--', '2024-10-05'),
('토킹스타', 14, '노찬솔', '6357', '비기너B', '3', '010-6510-6357', '010--', '2024-09-02'),
('토킹스타', 15, '정우영', '5504', '비기너B', '3', '010-9688-5504', '010--', '2024-07-27'),
('토킹스타', 16, '이민서', '4605', '비기너B', '3', '010-6370-4605', '010-8812-8478', '2023-08-28'),
('토킹스타', 17, '하정원', '6422', '비기너B', '3', '010-7941-6422', '010-4477-9603', '2023-03-02'),
('토킹스타', 18, '정세빈', '4040', '베이직 A', '4', '010-3134-4040', '010--', '2025-06-30'),
('토킹스타', 19, '송현승', '1290', '베이직 A', '4', '010-2853-1290', '010--', '2025-05-19'),
('토킹스타', 20, '김가영', '5688', '비기너B', '4', '010-2504-5688', '010--', '2025-03-10'),
('토킹스타', 21, '오주안', '2367', '비기너B', '4', '010-5184-2367', '010--', '2025-03-01'),
('토킹스타', 22, '김도담', '8722', '베이직 A', '4', '010-8887-8722', '010--', '2024-09-02'),
('토킹스타', 23, '김연서', '2198', '베이직 A', '4', '010-2094-2198', '010--', '2024-03-21'),
('토킹스타', 24, '김초원', '3380', '비기너B', '4', '010-2774-3380', '010--', '2024-02-28'),
('토킹스타', 25, '조윤설', '2566', '베이직 A', '4', '010-5050-2566', '010--', '2024-02-24'),
('토킹스타', 26, '정호원', '9058', '베이직 A', '4', '010-5277-9058', '010--', '2024-02-24'),
('토킹스타', 27, '박수현', '2388', '베이직 A', '4', '010-3506-2388', '010--', '2024-01-04'),
('토킹스타', 28, '정지호', '1073', '베이직 A', '4', '010-2107-1073', '010--', '2024-01-04'),
('토킹스타', 29, '신연두', '9165', '베이직 A', '4', '010-7797-9165', '010--', '2023-10-06'),
('토킹스타', 30, '최지웅', '6787', '베이직 A', '4', '010-4632-6787', '010--', '2023-02-22'),
('토킹스타', 31, '김다희', '8900', '베이직 A', '4', '010-4194-8900', '010--', '2022-12-05'),
('토킹스타', 32, '오유빈', '9343', '베이직 A', '4', '010-9434-9343', '010-4607-0765', '2022-05-16'),
('토킹스타', 33, '옥은성', '0366', '베이직 A', '4', '010-6354-0366', '010--', '2022-03-07'),
('토킹스타', 34, '최하윤', '6889', '어드벤스A', '4', '010-9444-6889', '010--', '2022-02-21'),
('토킹스타', 35, '김승비', '4996', '베이직 A', '5', '010-4147-4996', '010--', '2024-01-08'),
('토킹스타', 36, '추연서', '1042', '베이직 A', '5', '010-5886-1042', '010--', '2023-04-01'),
('토킹스타', 37, '하주원', '6422', '비기너B', '5', '010-7941-6422', '010--', '2023-03-02'),
('토킹스타', 38, '박지환', '5510', '비기너B', '5', '010-3198-5510', '010-4844-8659', '2023-02-09'),
('토킹스타', 39, '이서준', '3851', '비기너B', '5', '010-7929-3851', '010--', '2023-01-02'),
('토킹스타', 40, '김민재', '5542', '베이직 A', '5', '010-2332-5542', '010--', '2023-01-02'),
('토킹스타', 41, '김승윤', '1850', '베이직 B', '5', '010-2335-1850', '010--', '2022-10-10'),
('토킹스타', 42, '이규연', '0322', '비기너B', '5', '010-3185-0322', '010--', '2022-08-23'),
('토킹스타', 43, '류다현', '2873', '비기너B', '5', '010-3568-2873', '010--', '2022-08-11'),
('토킹스타', 44, '노채린', '4414', '비기너B', '5', '010-8515-4414', '010--', '2022-03-28'),
('토킹스타', 45, '정지성', '9942', '베이직 B', '5', '010-2635-9942', '010--', '2022-03-28'),
('토킹스타', 46, '박시완', '8318', '베이직 B', '5', '010-8534-8318', '010--', '2021-12-01'),
('토킹스타', 47, '최예준', '3303', '비기너B', '5', '010-7458-3303', '010--', '2021-07-01'),
('토킹스타', 48, '정예지', '5284', '베이직 A', '5', '010-5036-5284', '010-5037-5284', '2021-02-26'),
('토킹스타', 49, '정현우', '6695', '베이직 A', '5', '010-2807-6695', '010--', '2021-02-25'),
('토킹스타', 50, '송현준', '1290', '베이직 B', '6', '010-2853-1290', '010--', '2025-05-19'),
('토킹스타', 51, '조예린', '2827', '베이직 A', '6', '010-2393-2827', '010--', '2024-01-08'),
('토킹스타', 52, '성보민', '3227', '베이직 A', '6', '010-7512-3227', '010--', '2023-10-11'),
('토킹스타', 53, '양예준', '6526', '베이직 A', '6', '010-4870-6526', '010--', '2023-10-05'),
('토킹스타', 54, '조아름', '3015', '베이직 A', '6', '010-3269-3015', '010--', '2023-05-23'),
('토킹스타', 55, '황승빈', '3373', '베이직 A', '6', '010-4521-3373', '010--', '2022-09-01'),
('토킹스타', 56, '이재성', '4832', '베이직 B', '6', '010-2791-4832', '010--', '2022-02-21'),
('토킹스타', 57, '사공율', '1228', '베이직 B', '6', '010-7758-1228', '010--', '2022-02-21'),
('토킹스타', 58, '이우재', '7855', '베이직 B', '6', '010-7156-7855', '010--', '2022-02-03'),
('토킹스타', 59, '최하윤', '7148', '베이직 A', '6', '010-9312-7148', '010--', '2020-05-25'),
('토킹스타', 60, '박은찬', '2352', '인터A', '중1', '010-6778-2352', '010--', '2020-08-29'),
('토킹스타', 61, '최서윤', '6889', '인터A', '중1', '010-9444-6889', '010--', '2020-09-10'),
('토킹스타', 62, '김유나', '1422', '인터A', '중1', '010-9881-1422', '010--', '2020-06-08'),
('토킹스타', 63, '이태영', '3851', '인터B', '중2', '010-7929-3851', '010--', '2019-12-26'),
('토킹스타', 64, '문지유', '8929', '인터B', '중2', '010-5790-8929', '010--', '2023-01-02'),
('토킹스타', 65, '김수영', '2625', '인터B', '중2', '010-8950-2625', '010--', '2019-02-26'),
('토킹스타', 66, '김혜림', '8875', '인터B', '중3', '010-4556-8875', '010--', '2021-04-07'),
('토킹스타', 67, '최현규', '7148', '어드벤스B', '중3', '010-9312-7148', '010--', '2017-09-04'),
('토킹스타', 68, '조규상', '7148', '어드벤스B', '특반', '010-9312-7148', '010--', '2017-09-04'),
('토킹스타', 69, '1234', '4321', '어드벤스', '특반', '010-9', '010--', '2017-09-04'),
('토킹스타', 70, '문유성', '1234', '111', '특반', '010-9', '010--', '2017-09-04'),
('토킹스타', 71, '문유나', '1234', '111', '특반', '010-9', '010--', '2017-09-04'),
('토킹스타', 72, '학생1', 'qwer4321', '어드벤스', '특반', '010-9', '010--', '2017-09-04'),
('토킹스타', 73, '학생2', 'qwer4321', '어드벤스', '특반', '010-9', '010--', '2017-09-04'),
('토킹스타', 74, '학생3', 'qwer4321', '어드벤스', '특반', '010-9', '010--', '2017-09-04'),
('토킹스타', 75, '학생4', 'qwer4321', '어드벤스', '특반', '010-9', '010--', '2017-09-04'),
('토킹스타', 76, '학생5', 'qwer4321', '어드벤스', '특반', '010-9', '010--', '2017-09-04'),
('토킹스타', 77, '학생6', 'qwer4321', '어드벤스', '특반', '010-9', '010--', '2017-09-04'),
('토킹스타', 78, '학생7', 'qwer4321', '어드벤스', '특반', '010-9', '010--', '2017-09-04'),
('토킹스타', 79, '학생8', 'qwer4321', '어드벤스', '특반', '010-9', '010--', '2017-09-04'),
('토킹스타', 80, '학생9', 'qwer4321', '어드벤스', '특반', '010-9', '010--', '2017-09-04'),
('토킹스타', 81, '학생10', 'qwer4321', '어드벤스', '특반', '010-9', '010--', '2017-09-04'),
('토킹스타', 82, '학생11', 'qwer4321', '어드벤스', '특반', '010-9', '010--', '2017-09-04'),
('토킹스타', 83, '학생12', 'qwer4321', '어드벤스', '특반', '010-9', '010--', '2017-09-04'),
('토킹스타', 84, '학생13', 'qwer4321', '어드벤스', '특반', '010-9', '010--', '2017-09-04'),
('토킹스타', 85, '학생14', 'qwer4321', '어드벤스', '특반', '010-9', '010--', '2017-09-04'),
('토킹스타', 86, '학생15', 'qwer4321', '어드벤스', '특반', '010-9', '010--', '2017-09-04'),
('토킹스타', 87, '학생16', 'qwer4321', '어드벤스', '특반', '010-9', '010--', '2017-09-04');

-- 샘플 성적 데이터 삽입
INSERT INTO student_scores (student_id, lesson_date, point_score, try_count, level_score, total_score, memo) VALUES
(1, '2025-01-15', 85, 3, 8, 93, '첫 수업, 잘 따라옴'),
(1, '2025-01-22', 90, 2, 9, 99, '진도 빠름'),
(2, '2025-01-15', 78, 4, 7, 85, '조금 어려워함'),
(2, '2025-01-22', 82, 3, 8, 90, '개선됨'),
(3, '2025-01-15', 92, 1, 9, 101, '매우 우수'),
(3, '2025-01-22', 95, 1, 10, 105, '완벽한 수행');

-- 샘플 출석 데이터 삽입
INSERT INTO attendance (student_id, attendance_date, status, check_in_time, check_out_time) VALUES
(1, '2025-01-15', 'present', '14:00:00', '15:30:00'),
(1, '2025-01-22', 'present', '14:05:00', '15:35:00'),
(2, '2025-01-15', 'present', '14:02:00', '15:32:00'),
(2, '2025-01-22', 'late', '14:15:00', '15:45:00'),
(3, '2025-01-15', 'present', '13:58:00', '15:28:00'),
(3, '2025-01-22', 'present', '14:00:00', '15:30:00');

-- 샘플 수업 일정 데이터 삽입
INSERT INTO class_schedule (class_name, day_of_week, start_time, end_time, teacher_name, room_number) VALUES
('비기너B', 'monday', '14:00:00', '15:30:00', '김선생님', 'A-101'),
('비기너B', 'wednesday', '14:00:00', '15:30:00', '김선생님', 'A-101'),
('베이직 A', 'tuesday', '16:00:00', '17:30:00', '이선생님', 'A-102'),
('베이직 A', 'thursday', '16:00:00', '17:30:00', '이선생님', 'A-102'),
('어드벤스A', 'friday', '18:00:00', '19:30:00', '박선생님', 'A-103'),
('어드벤스A', 'saturday', '10:00:00', '11:30:00', '박선생님', 'A-103');

-- 유용한 뷰 생성
CREATE VIEW student_summary AS
SELECT 
    class_name,
    grade,
    COUNT(*) as student_count,
    MIN(start_date) as earliest_start,
    MAX(start_date) as latest_start
FROM students 
GROUP BY class_name, grade
ORDER BY class_name, grade;

-- 클래스별 학생 수 뷰
CREATE VIEW class_statistics AS
SELECT 
    class_name,
    COUNT(*) as total_students,
    COUNT(CASE WHEN grade IN ('1', '2', '3') THEN 1 END) as elementary_count,
    COUNT(CASE WHEN grade IN ('4', '5', '6') THEN 1 END) as middle_count,
    COUNT(CASE WHEN grade LIKE '중%' THEN 1 END) as high_count
FROM students 
GROUP BY class_name
ORDER BY total_students DESC;

-- 학생별 월간 통계 뷰
CREATE VIEW monthly_student_stats AS
SELECT 
    s.student_id,
    s.student_number,
    s.class_name,
    s.grade,
    YEAR(CURDATE()) as year,
    MONTH(CURDATE()) as month,
    COUNT(DISTINCT a.attendance_date) as attendance_days,
    COUNT(CASE WHEN a.status = 'present' THEN 1 END) as present_days,
    COUNT(CASE WHEN a.status = 'absent' THEN 1 END) as absent_days,
    COUNT(CASE WHEN a.status = 'late' THEN 1 END) as late_days,
    AVG(ss.point_score) as avg_point_score,
    AVG(ss.total_score) as avg_total_score,
    MAX(ss.total_score) as max_total_score
FROM students s
LEFT JOIN attendance a ON s.id = a.student_id 
    AND YEAR(a.attendance_date) = YEAR(CURDATE()) 
    AND MONTH(a.attendance_date) = MONTH(CURDATE())
LEFT JOIN student_scores ss ON s.id = ss.student_id 
    AND YEAR(ss.lesson_date) = YEAR(CURDATE()) 
    AND MONTH(ss.lesson_date) = MONTH(CURDATE())
GROUP BY s.id, s.student_id, s.student_number, s.class_name, s.grade;

-- 클래스별 성적 통계 뷰
CREATE VIEW class_performance_stats AS
SELECT 
    s.class_name,
    s.grade,
    COUNT(DISTINCT s.id) as total_students,
    AVG(ss.point_score) as avg_point_score,
    AVG(ss.total_score) as avg_total_score,
    MAX(ss.total_score) as highest_score,
    MIN(ss.total_score) as lowest_score,
    COUNT(CASE WHEN ss.total_score >= 80 THEN 1 END) as excellent_count,
    COUNT(CASE WHEN ss.total_score >= 60 AND ss.total_score < 80 THEN 1 END) as good_count,
    COUNT(CASE WHEN ss.total_score < 60 THEN 1 END) as needs_improvement_count
FROM students s
LEFT JOIN student_scores ss ON s.id = ss.student_id
WHERE ss.lesson_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY s.class_name, s.grade
ORDER BY s.class_name, s.grade;

-- 완료 메시지
SELECT '토킹스타 학원 데이터베이스 설정이 완료되었습니다!' as message;
SELECT COUNT(*) as total_students FROM students;
SELECT COUNT(*) as total_scores FROM student_scores;
SELECT COUNT(*) as total_attendance FROM attendance;
SELECT COUNT(*) as total_schedules FROM class_schedule; 