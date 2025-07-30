import os
import glob
import re

# 모든 JS 파일 찾기
js_files = glob.glob("*.js")

def update_s1004_size(file_path):
    print(f"처리 중: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # createStar 함수에서 S1004 별만 4배 크게 설정
        # 기존 별 크기 설정 부분을 찾아서 S1004 조건 추가
        pattern = r'(star\.style\.width = \'calc\(var\(--container-size\) \* 0\.025\)\';)'
        replacement = r'''// S1004 별만 4배 크게 설정
        if (starKey === 'S1004') {
            star.style.width = 'calc(var(--container-size) * 0.1)';
            star.style.height = 'calc(var(--container-size) * 0.1)';
        } else {
            \1
            star.style.height = 'calc(var(--container-size) * 0.025)';
        }'''
        
        if re.search(pattern, content):
            content = re.sub(pattern, replacement, content)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"  ✅ S1004 별 크기가 4배로 설정되었습니다.")
        else:
            print(f"  ℹ️ 별 크기 설정 부분을 찾을 수 없습니다.")
            
    except Exception as e:
        print(f"  ❌ 오류 발생: {e}")

# 모든 파일 처리
for file_path in js_files:
    update_s1004_size(file_path)

print("\n🎉 모든 JavaScript 파일에서 S1004 별 크기가 4배로 설정되었습니다!") 