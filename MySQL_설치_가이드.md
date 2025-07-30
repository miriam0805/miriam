# 토킹스타 학원 데이터베이스 설정 가이드

## 1. MySQL 설치

### Windows에서 MySQL 설치
1. **MySQL Community Server 다운로드**
   - https://dev.mysql.com/downloads/mysql/ 접속
   - "MySQL Installer for Windows" 다운로드
   - 또는 https://dev.mysql.com/downloads/installer/ 에서 다운로드

2. **설치 과정**
   ```
   1. MySQL Installer 실행
   2. "Developer Default" 선택
   3. "Next" 클릭하여 설치 진행
   4. root 비밀번호 설정 (기억해두세요!)
   5. 설치 완료
   ```

### XAMPP 사용 (더 간단한 방법)
1. **XAMPP 다운로드**
   - https://www.apachefriends.org/download.html
   - Windows용 XAMPP 다운로드

2. **설치 및 실행**
   ```
   1. XAMPP 설치
   2. XAMPP Control Panel 실행
   3. MySQL "Start" 클릭
   4. phpMyAdmin 접속 (http://localhost/phpmyadmin)
   ```

## 2. 데이터베이스 설정

### 방법 1: 배치 파일 사용 (권장)
```bash
# 1. run_mysql_setup.bat 파일을 더블클릭
# 2. MySQL root 비밀번호 입력
# 3. 자동으로 데이터베이스와 테이블이 생성됩니다
```

### 방법 2: 수동 실행
```bash
# 1. 명령 프롬프트 실행
# 2. 프로젝트 폴더로 이동
cd "C:\Users\USER\Dropbox\comcom py html\root\public\public"

# 3. MySQL 접속
mysql -u root -p

# 4. SQL 파일 실행
source setup_database.sql;
```

### 방법 3: phpMyAdmin 사용
1. **phpMyAdmin 접속**
   - http://localhost/phpmyadmin
   - root 계정으로 로그인

2. **SQL 실행**
   - "SQL" 탭 클릭
   - `setup_database.sql` 파일 내용 복사하여 붙여넣기
   - "실행" 클릭

## 3. 데이터베이스 구조

### 생성되는 테이블들
- **`students`**: 학생 기본 정보 (87명)
- **`student_scores`**: 성적 관리
- **`attendance`**: 출석 관리
- **`class_schedule`**: 수업 일정

### 생성되는 뷰들
- **`student_summary`**: 클래스별 학생 통계
- **`class_statistics`**: 클래스별 통계
- **`monthly_student_stats`**: 학생별 월간 통계
- **`class_performance_stats`**: 클래스별 성적 분석

## 4. PHP 연결 설정

### db_connection.php 파일 수정
```php
// 데이터베이스 연결 정보 수정
private $host = 'localhost';        // MySQL 서버 주소
private $db_name = 'talkingstar_db'; // 데이터베이스명
private $username = 'root';         // 사용자명
private $password = '';             // 비밀번호 (설치 시 설정한 값)
```

## 5. 확인 방법

### 데이터베이스 확인
```sql
-- MySQL 접속
mysql -u root -p

-- 데이터베이스 목록 확인
SHOW DATABASES;

-- 데이터베이스 선택
USE talkingstar_db;

-- 테이블 목록 확인
SHOW TABLES;

-- 학생 수 확인
SELECT COUNT(*) FROM students;

-- 뷰 목록 확인
SHOW FULL TABLES WHERE Table_type = 'VIEW';
```

### 샘플 쿼리
```sql
-- 모든 학생 조회
SELECT * FROM students LIMIT 10;

-- 클래스별 학생 수
SELECT class_name, COUNT(*) as student_count 
FROM students 
GROUP BY class_name;

-- 최근 성적 조회
SELECT s.student_id, s.class_name, ss.total_score, ss.lesson_date
FROM students s
JOIN student_scores ss ON s.id = ss.student_id
ORDER BY ss.lesson_date DESC
LIMIT 10;
```

## 6. 문제 해결

### MySQL이 인식되지 않는 경우
1. **PATH 환경변수 확인**
   - 시스템 환경변수에 MySQL bin 폴더 추가
   - 일반적으로: `C:\Program Files\MySQL\MySQL Server 8.0\bin`

2. **MySQL 서비스 확인**
   ```bash
   # 서비스 관리자에서 "MySQL80" 서비스가 실행 중인지 확인
   # 또는 명령 프롬프트에서:
   net start MySQL80
   ```

### 접속 오류
1. **비밀번호 확인**
   - MySQL 설치 시 설정한 root 비밀번호 확인

2. **권한 문제**
   ```sql
   -- MySQL에 접속 후
   ALTER USER 'root'@'localhost' IDENTIFIED BY '새비밀번호';
   FLUSH PRIVILEGES;
   ```

## 7. 추가 기능

### 웹 인터페이스 (선택사항)
- phpMyAdmin을 통한 웹 기반 데이터베이스 관리
- XAMPP 설치 시 자동으로 포함됨

### 백업 및 복원
```bash
# 데이터베이스 백업
mysqldump -u root -p talkingstar_db > backup.sql

# 데이터베이스 복원
mysql -u root -p talkingstar_db < backup.sql
```

---

**설정 완료 후 `db_connection.php` 파일을 사용하여 웹 애플리케이션에서 데이터베이스에 접근할 수 있습니다!** 