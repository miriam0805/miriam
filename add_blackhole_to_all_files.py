import os
import re

def add_blackhole_style_to_all_files():
    """모든 JavaScript 파일에 S1004 별에 블랙홀 스타일을 적용하는 함수"""
    
    # JavaScript 파일들 찾기
    js_files = []
    for file in os.listdir('.'):
        if file.endswith('.js') and file != 'script.js':
            js_files.append(file)
    
    print(f"발견된 JavaScript 파일들: {js_files}")
    
    # 블랙홀 스타일 코드
    blackhole_style_code = '''        // S1004 별에 블랙홀 모양 추가
        if (starKey === 'S1004') {
            star.style.background = 'radial-gradient(circle at 50% 50%, #222 60%, #000 80%, transparent 100%)';
            star.style.boxShadow = '0 0 40px 20px #6cf, 0 0 80px 40px #fff2';
            star.style.border = '3px solid #6cf';
            star.style.animation = 'blackhole-spin 2s linear infinite';
            star.style.overflow = 'visible';
            // 블랙홀 회전 애니메이션 추가
            if (!document.getElementById('blackhole-spin-style')) {
                const style = document.createElement('style');
                style.id = 'blackhole-spin-style';
                style.innerHTML = `@keyframes blackhole-spin { 0% { transform: translate(-50%, -50%) rotate(0deg); } 100% { transform: translate(-50%, -50%) rotate(360deg); } }`;
                document.head.appendChild(style);
            }
        }'''
    
    for js_file in js_files:
        try:
            with open(js_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # S1004 별 크기 설정 후에 블랙홀 스타일 추가
            # 크기 설정 부분을 찾아서 그 다음에 블랙홀 스타일 추가
            size_pattern = r'(// S1004 별만 원래 크기로 설정\s*\n\s*if \(starKey === \'S1004\'\) \{\s*\n\s*star\.style\.width = \'calc\(var\(--container-size\) \* 0\.025\)\';\s*\n\s*star\.style\.height = \'calc\(var\(--container-size\) \* 0\.025\)\';\s*\n\s*\} else \{\s*\n\s*star\.style\.width = \'calc\(var\(--container-size\) \* 0\.025\)\';\s*\n\s*star\.style\.height = \'calc\(var\(--container-size\) \* 0\.025\)\';\s*\n\s*\})'
            
            # 이미 블랙홀 스타일이 있는지 확인
            if 'blackhole-spin' not in content:
                # 크기 설정 부분을 찾아서 그 다음에 블랙홀 스타일 추가
                match = re.search(size_pattern, content)
                if match:
                    # 크기 설정 부분 다음에 블랙홀 스타일 추가
                    content = re.sub(
                        size_pattern,
                        match.group(1) + '\n        star.style.height = \'calc(var(--container-size) * 0.025)\';\n        star.style.transform = \'translate(-50%, -50%)\'; // 중앙 정렬을 위한 transform 추가\n        star.style.zIndex = \'30\'; // 별을 가장 위에\n' + blackhole_style_code,
                        content
                    )
                else:
                    # 크기 설정 부분이 없으면 다른 패턴으로 찾기
                    alt_pattern = r'(star\.style\.width = \'calc\(var\(--container-size\) \* 0\.025\)\';\s*\n\s*star\.style\.height = \'calc\(var\(--container-size\) \* 0\.025\)\';\s*\n\s*star\.style\.transform = \'translate\(-50%, -50%\)\'; // 중앙 정렬을 위한 transform 추가\s*\n\s*star\.style\.zIndex = \'30\'; // 별을 가장 위에)'
                    match = re.search(alt_pattern, content)
                    if match:
                        content = re.sub(
                            alt_pattern,
                            match.group(1) + '\n' + blackhole_style_code,
                            content
                        )
            
            if original_content != content:
                with open(js_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"✅ {js_file} - 블랙홀 스타일을 추가했습니다.")
            else:
                print(f"ℹ️ {js_file} - 이미 블랙홀 스타일이 있거나 변경사항이 없습니다.")
                
        except Exception as e:
            print(f"❌ {js_file} 처리 중 오류: {e}")

if __name__ == "__main__":
    print("모든 JavaScript 파일에 블랙홀 스타일을 적용하는 작업을 시작합니다...")
    add_blackhole_style_to_all_files()
    print("작업이 완료되었습니다.") 