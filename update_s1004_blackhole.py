import os
import glob
import re

js_files = glob.glob("*.js")

blackhole_code = '''
        // S1004 별에 블랙홀 모양 추가
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
        }
'''

def update_s1004_blackhole(file_path):
    print(f"처리 중: {file_path}")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        # 기존 달/은하 코드 제거 (moonText, galaxy, 🌙, dot 등)
        content = re.sub(r"// S1004 별에 달 모양 추가[\s\S]+?star\.appendChild\(moonText\);[\s\S]*?\n", "", content)
        content = re.sub(r"// S1004 별에 은하 모양 추가[\s\S]+?star\.appendChild\(dot\);[\s\S]*?\n", "", content)
        # 블랙홀 코드 삽입
        pattern = r'(star\.style\.zIndex = \'30\';)'
        if re.search(pattern, content):
            content = re.sub(pattern, r"\1\n" + blackhole_code, content)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✅ S1004 별이 블랙홀로 변경되었습니다.")
        else:
            print(f"  ℹ️ 별 스타일 설정 부분을 찾을 수 없습니다.")
    except Exception as e:
        print(f"  ❌ 오류 발생: {e}")

for file_path in js_files:
    update_s1004_blackhole(file_path)

print("\n🎉 모든 JavaScript 파일에서 S1004 별이 블랙홀로 변경되었습니다!") 