import os
import glob
import re

# 모든 JS 파일 찾기
js_files = glob.glob("*.js")

def add_s1004_timing(file_path):
    print(f"처리 중: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # S1004 클릭 시 Next 버튼 활성화 코드가 있는지 확인
        if 'if (starKey === \'S1004\')' in content and 'nextButton.disabled = false' in content:
            # 1.5초 타이밍 코드 추가
            pattern = r'(return;\s*\}\s*$)'
            replacement = r'''
            // 1.5초 후 Next 버튼 자동 클릭
            setTimeout(() => {
                if (nextButton && !nextButton.disabled) {
                    console.log('S1004 클릭 후 1.5초 뒤 Next 버튼 자동 클릭');
                    nextButton.click();
                } else {
                    console.log('Next 버튼이 비활성화되어 있어 자동 클릭하지 않음');
                }
            }, 1500);

            return;
        }'''
            
            if re.search(pattern, content, re.MULTILINE):
                content = re.sub(pattern, replacement, content, flags=re.MULTILINE)
                
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                print(f"  ✅ S1004 Next 버튼 자동 클릭 1.5초 타이밍이 추가되었습니다.")
            else:
                print(f"  ℹ️ S1004 return 문을 찾을 수 없습니다.")
        else:
            print(f"  ℹ️ S1004 관련 코드가 없습니다.")
            
    except Exception as e:
        print(f"  ❌ 오류 발생: {e}")

# 모든 파일 처리
for file_path in js_files:
    add_s1004_timing(file_path)

print("\n🎉 모든 JavaScript 파일에 S1004 Next 버튼 자동 클릭 1.5초 타이밍이 추가되었습니다!") 