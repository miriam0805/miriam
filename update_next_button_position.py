import os
import glob
import re

# 모든 HTML 파일 찾기
html_files = glob.glob("*.html")

def update_next_button_position(file_path):
    print(f"처리 중: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Next 버튼 위치를 오른쪽 상단에서 200px 아래로 변경
        pattern = r'(#next-button\s*\{[^}]*\})'
        replacement = r'''#next-button {
            position: absolute;
            top: 200px; /* 오른쪽 상단에서 200px 아래 */
            right: 5%; /* 오른쪽 */
            transform: none; /* 기존 가운데 정렬 제거 */
            font-size: calc(var(--container-size) * 0.016); /* 40% 크기 */
            padding: 1vw 2vw; /* 패딩 */
            background-color: #e4ede4;
            color: #333;
            border: none;
            border-radius: 1vw; /* 둥근 모서리 */
            cursor: pointer;
            z-index: 1000;
            display: none;
            transition: all 0.3s ease;
            margin: 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        }'''
        
        if re.search(pattern, content, re.DOTALL):
            content = re.sub(pattern, replacement, content, flags=re.DOTALL)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"  ✅ Next 버튼이 오른쪽 상단에서 200px 아래로 이동되었습니다.")
        else:
            print(f"  ℹ️ Next 버튼 스타일을 찾을 수 없습니다.")
            
    except Exception as e:
        print(f"  ❌ 오류 발생: {e}")

# 모든 파일 처리
for file_path in html_files:
    update_next_button_position(file_path)

print("\n🎉 모든 HTML 파일에서 Next 버튼이 오른쪽 상단에서 200px 아래로 이동되었습니다!") 