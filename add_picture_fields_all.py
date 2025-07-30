import json
import os
import glob

# data 폴더의 모든 JSON 파일 찾기
data_files = glob.glob("assets/data/*.json")

def add_picture_fields_to_file(file_path):
    print(f"처리 중: {file_path}")
    
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        modified = False
        
        for item in data:
            if "points" in item:
                for point in item["points"]:
                    for key in ["S1", "S2", "S3", "S4"]:
                        # 해당 key가 있고 picture_1이 없으면 추가
                        if f"{key} po_sition" in point and f"{key} picture_1" not in point:
                            point[f"{key} picture_1"] = ""
                            point[f"{key} picture_2"] = ""
                            point[f"{key} picture_3"] = ""
                            point[f"{key} picture_4"] = ""
                            modified = True
        
        if modified:
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            print(f"  ✓ 완료: {file_path}")
        else:
            print(f"  - 이미 완료됨: {file_path}")
            
    except Exception as e:
        print(f"  ✗ 오류: {file_path} - {str(e)}")

# 모든 파일 처리
print("모든 JSON 파일에 picture 필드 추가 중...")
print("=" * 50)

for file_path in data_files:
    add_picture_fields_to_file(file_path)

print("=" * 50)
print("모든 파일 처리 완료!") 