import os
import glob
import re

# 모든 JS 파일 찾기
js_files = glob.glob("*.js")

def update_s1004_moon(file_path):
    print(f"처리 중: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # S1004 별에 달 모양 추가
        # createStar 함수에서 S1004 별에 달 이모지 추가
        pattern = r'(star\.style\.zIndex = \'30\'; // 별을 가장 위에)'
        replacement = r'''\1
        
        // S1004 별에 달 모양 추가
        if (starKey === 'S1004') {
            const moonText = document.createElement('span');
            moonText.textContent = '🌙';
            moonText.style.position = 'absolute';
            moonText.style.left = '50%';
            moonText.style.top = '50%';
            moonText.style.transform = 'translate(-50%, -50%)';
            moonText.style.fontSize = 'calc(var(--container-size) * 0.08)';
            moonText.style.color = '#FFD700';
            moonText.style.textShadow = '0 0 10px #FFD700';
            moonText.style.zIndex = '31';
            star.appendChild(moonText);
        }'''
        
        if re.search(pattern, content):
            content = re.sub(pattern, replacement, content)
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"  ✅ S1004 별이 달 모양으로 변경되었습니다.")
        else:
            # 다른 패턴 시도
            pattern2 = r'(star\.style\.zIndex = \'30\';)'
            replacement2 = r'''\1
            
            // S1004 별에 달 모양 추가
            if (starKey === 'S1004') {
                const moonText = document.createElement('span');
                moonText.textContent = '🌙';
                moonText.style.position = 'absolute';
                moonText.style.left = '50%';
                moonText.style.top = '50%';
                moonText.style.transform = 'translate(-50%, -50%)';
                moonText.style.fontSize = 'calc(var(--container-size) * 0.08)';
                moonText.style.color = '#FFD700';
                moonText.style.textShadow = '0 0 10px #FFD700';
                moonText.style.zIndex = '31';
                star.appendChild(moonText);
            }'''
            
            if re.search(pattern2, content):
                content = re.sub(pattern2, replacement2, content)
                
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                
                print(f"  ✅ S1004 별이 달 모양으로 변경되었습니다.")
            else:
                print(f"  ℹ️ 별 스타일 설정 부분을 찾을 수 없습니다.")
            
    except Exception as e:
        print(f"  ❌ 오류 발생: {e}")

# 모든 파일 처리
for file_path in js_files:
    update_s1004_moon(file_path)

print("\n🎉 모든 JavaScript 파일에서 S1004 별이 달 모양으로 변경되었습니다!") 