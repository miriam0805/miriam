import json
import re

file_path = "assets/data/data_1_1.json"

print(f"처리 중: {file_path}")

try:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    modified = False
    
    # S1, S2, S3, S4 각각에 대해 picture 필드 추가
    for key in ["S1", "S2", "S3", "S4"]:
        # 해당 key의 icon_4 다음에 picture 필드들이 없는 경우 추가
        pattern = rf'"{key} icon_4": ""\s*\n\s*}}'
        replacement = f'"{key} icon_4": "",\n        "{key} picture_1": "",\n        "{key} picture_2": "",\n        "{key} picture_3": "",\n        "{key} picture_4": ""\n      }}'
        
        if re.search(pattern, content):
            content = re.sub(pattern, replacement, content)
            modified = True
            print(f"  {key} picture 필드들 추가됨")
    
    if modified:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"✅ {file_path} 파일이 성공적으로 업데이트되었습니다!")
    else:
        print(f"ℹ️ {file_path} 파일에는 이미 모든 picture 필드가 있습니다.")

except Exception as e:
    print(f"❌ 오류 발생: {e}") 