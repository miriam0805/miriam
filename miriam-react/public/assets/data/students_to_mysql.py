#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
students.json 파일을 MySQL 데이터베이스에 삽입하는 스크립트
"""

import json
import mysql.connector
from mysql.connector import Error
import os
from datetime import datetime

def create_database_connection():
    """MySQL 데이터베이스 연결을 생성합니다."""
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',  # MySQL 사용자명을 변경하세요
            password='',  # MySQL 비밀번호를 입력하세요
            charset='utf8mb4'
        )
        return connection
    except Error as e:
        print(f"데이터베이스 연결 오류: {e}")
        return None

def create_database_and_table(connection):
    """데이터베이스와 테이블을 생성합니다."""
    try:
        cursor = connection.cursor()
        
        # 데이터베이스 생성
        cursor.execute("CREATE DATABASE IF NOT EXISTS miriam_academy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        cursor.execute("USE miriam_academy")
        
        # 테이블 생성
        create_table_query = """
        CREATE TABLE IF NOT EXISTS students (
            id INT AUTO_INCREMENT PRIMARY KEY,
            academy VARCHAR(50) NOT NULL,
            student_number VARCHAR(10) NOT NULL,
            student_id VARCHAR(50) NOT NULL,
            password VARCHAR(50) NOT NULL,
            class_name VARCHAR(50) NOT NULL,
            grade VARCHAR(20) NOT NULL,
            phone_number VARCHAR(20) NOT NULL,
            phone_number2 VARCHAR(20) NOT NULL,
            start_day DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY unique_student (student_id, student_number)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        """
        cursor.execute(create_table_query)
        
        # 인덱스 생성
        indexes = [
            "CREATE INDEX IF NOT EXISTS idx_student_id ON students(student_id)",
            "CREATE INDEX IF NOT EXISTS idx_class_name ON students(class_name)",
            "CREATE INDEX IF NOT EXISTS idx_grade ON students(grade)",
            "CREATE INDEX IF NOT EXISTS idx_start_day ON students(start_day)"
        ]
        
        for index_query in indexes:
            try:
                cursor.execute(index_query)
            except Error as e:
                print(f"인덱스 생성 오류 (무시됨): {e}")
        
        connection.commit()
        print("데이터베이스와 테이블이 성공적으로 생성되었습니다.")
        
    except Error as e:
        print(f"테이블 생성 오류: {e}")

def load_json_data(file_path):
    """JSON 파일에서 데이터를 로드합니다."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        print(f"JSON 파일에서 {len(data)}개의 학생 데이터를 로드했습니다.")
        return data
    except FileNotFoundError:
        print(f"파일을 찾을 수 없습니다: {file_path}")
        return None
    except json.JSONDecodeError as e:
        print(f"JSON 파싱 오류: {e}")
        return None

def insert_students_data(connection, students_data):
    """학생 데이터를 데이터베이스에 삽입합니다."""
    try:
        cursor = connection.cursor()
        
        # 기존 데이터 삭제 (선택사항)
        cursor.execute("DELETE FROM students")
        print("기존 데이터를 삭제했습니다.")
        
        # 데이터 삽입
        insert_query = """
        INSERT INTO students (academy, student_number, student_id, password, class_name, grade, phone_number, phone_number2, start_day)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        
        inserted_count = 0
        for student in students_data:
            try:
                values = (
                    student.get('Academy', ''),
                    student.get('number', ''),
                    student.get('ID', ''),
                    student.get('password', ''),
                    student.get('Class', ''),
                    student.get('Grade', ''),
                    student.get('Phonnumber', ''),
                    student.get('Phonnumber2', ''),
                    student.get('StartDay', '')
                )
                cursor.execute(insert_query, values)
                inserted_count += 1
            except Error as e:
                print(f"학생 데이터 삽입 오류 (학생 ID: {student.get('ID', 'Unknown')}): {e}")
        
        connection.commit()
        print(f"총 {inserted_count}개의 학생 데이터가 성공적으로 삽입되었습니다.")
        
    except Error as e:
        print(f"데이터 삽입 오류: {e}")

def show_statistics(connection):
    """데이터베이스 통계를 보여줍니다."""
    try:
        cursor = connection.cursor()
        
        # 전체 학생 수
        cursor.execute("SELECT COUNT(*) as total_students FROM students")
        total = cursor.fetchone()[0]
        print(f"\n=== 데이터베이스 통계 ===")
        print(f"전체 학생 수: {total}명")
        
        # 반별 학생 수
        cursor.execute("""
            SELECT class_name, COUNT(*) as student_count 
            FROM students 
            GROUP BY class_name 
            ORDER BY student_count DESC
        """)
        print("\n반별 학생 수:")
        for row in cursor.fetchall():
            print(f"  {row[0]}: {row[1]}명")
        
        # 학년별 학생 수
        cursor.execute("""
            SELECT grade, COUNT(*) as student_count 
            FROM students 
            GROUP BY grade 
            ORDER BY grade
        """)
        print("\n학년별 학생 수:")
        for row in cursor.fetchall():
            print(f"  {row[0]}학년: {row[1]}명")
        
    except Error as e:
        print(f"통계 조회 오류: {e}")

def main():
    """메인 함수"""
    print("=== students.json을 MySQL 데이터베이스로 가져오기 ===")
    
    # JSON 파일 경로
    json_file_path = "assets/data/students.json"
    
    # JSON 파일 존재 확인
    if not os.path.exists(json_file_path):
        print(f"JSON 파일을 찾을 수 없습니다: {json_file_path}")
        return
    
    # 데이터베이스 연결
    connection = create_database_connection()
    if not connection:
        return
    
    try:
        # 데이터베이스와 테이블 생성
        create_database_and_table(connection)
        
        # JSON 데이터 로드
        students_data = load_json_data(json_file_path)
        if not students_data:
            return
        
        # 데이터 삽입
        insert_students_data(connection, students_data)
        
        # 통계 보여주기
        show_statistics(connection)
        
        print("\n=== 완료 ===")
        print("students.json 데이터가 MySQL 데이터베이스에 성공적으로 저장되었습니다.")
        
    except Error as e:
        print(f"오류 발생: {e}")
    finally:
        if connection.is_connected():
            connection.close()
            print("데이터베이스 연결이 종료되었습니다.")

if __name__ == "__main__":
    main()