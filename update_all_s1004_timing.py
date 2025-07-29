import os
import glob
import re

# 모든 JS 파일 찾기
js_files = glob.glob("*.js")

def update_s1004_timing(file_path):
    print(f"처리 중: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # S1004 클릭 후 Next 버튼 자동 클릭 시간을 1.5초로 변경
        # 1초로 설정된 부분을 1.5초로 변경
        pattern1 = r'(setTimeout\(\(\) => \{[\s\S]*?nextButton\.click\(\);[\s\S]*?\}, )1000(\);[\s\S]*?// S1004)'
        replacement1 = r'\11500\2'
        
        # 콘솔 로그도 함께 변경
        pattern2 = r'(console\.log\(\'S1004 클릭 후 )1초( 뒤 Next 버튼 자동 클릭\';)'
        replacement2 = r'\11.5초\2'
        
        # 주석도 변경
        pattern3 = r'(// )1초( 후 Next 버튼 자동 클릭)'
        replacement3 = r'\11.5초\2'
        
        modified = False
        
        if re.search(pattern1, content):
            content = re.sub(pattern1, replacement1, content)
            modified = True
            
        if re.search(pattern2, content):
            content = re.sub(pattern2, replacement2, content)
            modified = True
            
        if re.search(pattern3, content):
            content = re.sub(pattern3, replacement3, content)
            modified = True
        
        if modified:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✅ S1004 Next 버튼 자동 클릭 시간이 1.5초로 변경되었습니다.")
        else:
            print(f"  ℹ️ S1004 관련 타이밍 코드를 찾을 수 없습니다.")
            
    except Exception as e:
        print(f"  ❌ 오류 발생: {e}")

# 모든 파일 처리
for file_path in js_files:
    update_s1004_timing(file_path)

print("\n🎉 모든 JavaScript 파일에서 S1004 Next 버튼 자동 클릭 시간이 1.5초로 변경되었습니다!") 