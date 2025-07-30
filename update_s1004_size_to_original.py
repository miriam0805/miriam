import os
import re

def update_s1004_size_to_original():
    """S1004 별의 크기를 원래 크기로 조정하는 함수"""
    
    # JavaScript 파일들 찾기
    js_files = []
    for file in os.listdir('.'):
        if file.endswith('.js') and file != 'script.js':
            js_files.append(file)
    
    print(f"발견된 JavaScript 파일들: {js_files}")
    
    for js_file in js_files:
        try:
            with open(js_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # S1004 별 크기 관련 코드 찾기
            original_content = content
            
            # S1004 별 크기 설정 부분 수정
            # 4배 크기 설정을 원래 크기로 변경
            content = re.sub(
                r'// S1004 별만 4배 크게 설정\s*\n\s*if \(starKey === \'S1004\'\) \{\s*\n\s*star\.style\.width = \'calc\(var\(--container-size\) \* 0\.1\)\';\s*\n\s*star\.style\.height = \'calc\(var\(--container-size\) \* 0\.1\)\';\s*\n\s*\} else \{\s*\n\s*star\.style\.width = \'calc\(var\(--container-size\) \* 0\.025\)\';\s*\n\s*star\.style\.height = \'calc\(var\(--container-size\) \* 0\.025\)\';\s*\n\s*\}',
                '// S1004 별만 원래 크기로 설정\n        if (starKey === \'S1004\') {\n            star.style.width = \'calc(var(--container-size) * 0.025)\';\n            star.style.height = \'calc(var(--container-size) * 0.025)\';\n        } else {\n            star.style.width = \'calc(var(--container-size) * 0.025)\';\n            star.style.height = \'calc(var(--container-size) * 0.025)\';\n        }',
                content
            )
            
            # 일반 크기로 설정하는 부분도 원래 크기로 변경
            content = re.sub(
                r'// S1004 별만 일반 크기로 설정 \(블랙홀 크기 다시 반으로 줄임\)\s*\n\s*if \(starKey === \'S1004\'\) \{\s*\n\s*star\.style\.width = \'calc\(var\(--container-size\) \* 0\.025\)\';\s*\n\s*star\.style\.height = \'calc\(var\(--container-size\) \* 0\.025\)\';\s*\n\s*\} else \{\s*\n\s*star\.style\.width = \'calc\(var\(--container-size\) \* 0\.025\)\';\s*\n\s*star\.style\.height = \'calc\(var\(--container-size\) \* 0\.025\)\';\s*\n\s*\}',
                '// S1004 별만 원래 크기로 설정\n        if (starKey === \'S1004\') {\n            star.style.width = \'calc(var(--container-size) * 0.025)\';\n            star.style.height = \'calc(var(--container-size) * 0.025)\';\n        } else {\n            star.style.width = \'calc(var(--container-size) * 0.025)\';\n            star.style.height = \'calc(var(--container-size) * 0.025)\';\n        }',
                content
            )
            
            # 블랙홀 스타일은 유지하되 크기만 원래대로
            if original_content != content:
                with open(js_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"✅ {js_file} - S1004 별 크기를 원래 크기로 변경했습니다.")
            else:
                print(f"ℹ️ {js_file} - 변경사항이 없습니다.")
                
        except Exception as e:
            print(f"❌ {js_file} 처리 중 오류: {e}")

if __name__ == "__main__":
    print("S1004 별 크기를 원래 크기로 조정하는 작업을 시작합니다...")
    update_s1004_size_to_original()
    print("작업이 완료되었습니다.") 