import os
import glob
import re

js_files = glob.glob("*.js")

def update_s1004_galaxy(file_path):
    print(f"처리 중: {file_path}")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # S1004 별에 은하 모양 추가 (원형으로 작은 점 여러 개 배치)
        pattern = r'(star\.style\.zIndex = \'30\';.*?)(\n|\r\n)'
        replacement = r'''\1
        // S1004 별에 은하 모양 추가
        if (starKey === 'S1004') {
            const galaxyCount = 12;
            const radius = 40; // px, 은하 반지름
            for (let i = 0; i < galaxyCount; i++) {
                const angle = (2 * Math.PI * i) / galaxyCount;
                const dot = document.createElement('div');
                dot.style.position = 'absolute';
                dot.style.left = (50 + Math.cos(angle) * radius) + '%';
                dot.style.top = (50 + Math.sin(angle) * radius) + '%';
                dot.style.width = '10px';
                dot.style.height = '10px';
                dot.style.background = 'radial-gradient(circle, #fff 60%, #aaf 100%)';
                dot.style.borderRadius = '50%';
                dot.style.boxShadow = '0 0 8px #fff, 0 0 16px #aaf';
                dot.style.transform = 'translate(-50%, -50%)';
                dot.style.zIndex = '31';
                star.appendChild(dot);
            }
        }
        '''
        
        if re.search(pattern, content, re.DOTALL):
            content = re.sub(pattern, replacement, content, flags=re.DOTALL)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✅ S1004 별이 은하 모양으로 변경되었습니다.")
        else:
            print(f"  ℹ️ 별 스타일 설정 부분을 찾을 수 없습니다.")
    except Exception as e:
        print(f"  ❌ 오류 발생: {e}")

for file_path in js_files:
    update_s1004_galaxy(file_path)

print("\n🎉 모든 JavaScript 파일에서 S1004 별이 은하 모양으로 변경되었습니다!") 