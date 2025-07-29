@echo off
echo 토킹스타 학원 데이터베이스 설정을 시작합니다...
echo.

REM MySQL 경로 설정
set MYSQL_PATH="C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

REM MySQL이 설치되어 있는지 확인
%MYSQL_PATH% --version >nul 2>&1
if %errorlevel% neq 0 (
    echo MySQL을 찾을 수 없습니다.
    echo MySQL이 설치되어 있는지 확인해주세요.
    echo 일반적인 경로: C:\Program Files\MySQL\MySQL Server 8.0\bin\
    pause
    exit /b 1
)

echo MySQL이 설치되어 있습니다.
echo.

REM 데이터베이스 설정 실행
echo 데이터베이스와 테이블을 생성하고 데이터를 삽입합니다...
%MYSQL_PATH% -u root -p < setup_database.sql

if %errorlevel% equ 0 (
    echo.
    echo 성공적으로 데이터베이스가 설정되었습니다!
    echo.
    echo 데이터베이스 정보:
    echo - 데이터베이스명: talkingstar_db
    echo - 학생 수: 87명
    echo - 테이블: students, student_scores, attendance, class_schedule
    echo - 뷰: student_summary, class_statistics, monthly_student_stats, class_performance_stats
    echo.
    echo PHP 연결 파일: db_connection.php
    echo.
) else (
    echo.
    echo 데이터베이스 설정 중 오류가 발생했습니다.
    echo MySQL 서버가 실행 중인지 확인해주세요.
    echo.
)

pause 