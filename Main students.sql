CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    guardian VARCHAR(50),
    guardian_phone VARCHAR(20),
    join_date DATE,
    memo TEXT
);

CREATE TABLE scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    try_score INT DEFAULT 0,
    total_score INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id)
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

-- 샘플 데이터 삽입 (성적)
INSERT INTO student_scores (student_id, lesson_date, point_score, try_count, level_score, total_score, memo) VALUES
(1, '2025-01-15', 85, 3, 8, 93, '첫 수업, 잘 따라옴'),
(1, '2025-01-22', 90, 2, 9, 99, '진도 빠름'),
(2, '2025-01-15', 78, 4, 7, 85, '조금 어려워함'),
(2, '2025-01-22', 82, 3, 8, 90, '개선됨'),
(3, '2025-01-15', 92, 1, 9, 101, '매우 우수'),
(3, '2025-01-22', 95, 1, 10, 105, '완벽한 수행');

-- 샘플 데이터 삽입 (출석)
INSERT INTO attendance (student_id, attendance_date, status, check_in_time, check_out_time) VALUES
(1, '2025-01-15', 'present', '14:00:00', '15:30:00'),
(1, '2025-01-22', 'present', '14:05:00', '15:35:00'),
(2, '2025-01-15', 'present', '14:02:00', '15:32:00'),
(2, '2025-01-22', 'late', '14:15:00', '15:45:00'),
(3, '2025-01-15', 'present', '13:58:00', '15:28:00'),
(3, '2025-01-22', 'present', '14:00:00', '15:30:00');

-- 샘플 데이터 삽입 (수업 일정)
INSERT INTO class_schedule (class_name, day_of_week, start_time, end_time, teacher_name, room_number) VALUES
('비기너B', 'monday', '14:00:00', '15:30:00', '김선생님', 'A-101'),
('비기너B', 'wednesday', '14:00:00', '15:30:00', '김선생님', 'A-101'),
('베이직 A', 'tuesday', '16:00:00', '17:30:00', '이선생님', 'A-102'),
('베이직 A', 'thursday', '16:00:00', '17:30:00', '이선생님', 'A-102'),
('어드벤스A', 'friday', '18:00:00', '19:30:00', '박선생님', 'A-103'),
('어드벤스A', 'saturday', '10:00:00', '11:30:00', '박선생님', 'A-103');