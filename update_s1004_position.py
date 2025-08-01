import json
import os
import glob
import re

# data 폴더의 모든 JSON 파일 찾기
data_files = glob.glob("assets/data/*.json")

def update_s1004_position(file_path):
    print(f"처리 중: {file_path}")
    
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # S1004 po_sition 값을 (0.5, 0.90)로 변경
        pattern = r'"S1004 po_sition": "\([^)]+\)"'
        replacement = '"S1004 po_sition": "(0.5, 0.90)"'
        
        # 변경 전 개수 확인
        matches = re.findall(pattern, content)
        if matches:
            content = re.sub(pattern, replacement, content)
            
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(content)
            
            print(f"  ✅ {len(matches)}개의 S1004 po_sition 값이 (0.5, 0.90)로 변경되었습니다.")
        else:
            print(f"  ℹ️ S1004 po_sition 필드를 찾을 수 없습니다.")
            
    except Exception as e:
        print(f"  ❌ 오류 발생: {e}")

# 모든 파일 처리
for file_path in data_files:
    update_s1004_position(file_path)

print("\n🎉 모든 파일의 S1004 po_sition 값이 (0.5, 0.90)로 변경되었습니다!") 