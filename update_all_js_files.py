import os
import glob
import re

# 모든 JS 파일 찾기
js_files = glob.glob("*.js")

def update_js_file(file_path):
    print(f"처리 중: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        modified = False
        
        # createPictureLayers 함수가 이미 있는지 확인
        if 'createPictureLayers' not in content:
            # drawStars 함수 내에서 createPictureLayers 호출 부분 찾기
            # drawStars 함수 끝 부분에 createPictureLayers 호출 추가
            draw_stars_pattern = r'(function drawStars\([^)]*\)\s*\{[^}]*\})'
            draw_stars_match = re.search(draw_stars_pattern, content, re.DOTALL)
            
            if draw_stars_match:
                draw_stars_func = draw_stars_match.group(1)
                
                # createPictureLayers 함수 정의 추가
                picture_layers_func = '''
    // 4개의 300x200 레이어에 사진 채우기
    function createPictureLayers(currentPoint, longIndex) {
        // 기존 레이어 제거
        const existingLayers = document.querySelectorAll('.picture-layer');
        existingLayers.forEach(layer => layer.remove());
        
        // 4개 레이어 생성
        for (let i = 1; i <= 4; i++) {
            const pictureKey = `S${longIndex} picture_${i}`;
            if (currentPoint[pictureKey]) {
                const picturePath = `assets/picture/${currentPoint[pictureKey]}`;
                const layerElement = document.createElement('div');
                layerElement.className = 'picture-layer';
                layerElement.style.position = 'absolute';
                layerElement.style.width = '300px';
                layerElement.style.height = '200px';
                layerElement.style.zIndex = '15'; // 사진 레이어는 별 아래, 아이콘 위
                layerElement.style.overflow = 'hidden';
                layerElement.style.border = '2px solid #333';
                layerElement.style.backgroundColor = '#f0f0f0';
                
                // 레이어 위치 설정 (왼쪽 세로 배치, 10px 간격)
                layerElement.style.left = '10px'; // 왼쪽에서 10px
                layerElement.style.top = `${10 + (i - 1) * 210}px`; // 세로로 210px 간격 (200px + 10px)
                
                // 이미지 생성
                const imgElement = document.createElement('img');
                imgElement.src = picturePath;
                imgElement.style.width = '100%';
                imgElement.style.height = '100%';
                imgElement.style.objectFit = 'cover';
                imgElement.style.display = 'block';
                
                // 번호 표시 추가
                const numberElement = document.createElement('div');
                numberElement.textContent = `${i} picture`;
                numberElement.style.position = 'absolute';
                numberElement.style.top = '5px';
                numberElement.style.left = '5px';
                numberElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                numberElement.style.color = 'white';
                numberElement.style.padding = '2px 6px';
                numberElement.style.borderRadius = '3px';
                numberElement.style.fontSize = '12px';
                numberElement.style.fontWeight = 'bold';
                numberElement.style.zIndex = '1';
                
                layerElement.appendChild(imgElement);
                layerElement.appendChild(numberElement);
                document.getElementById('image-container').appendChild(layerElement);
            }
        }
    }
'''
                
                # drawStars 함수 내에서 createPictureLayers 호출 추가
                # drawStars 함수 끝 부분에 createPictureLayers 호출 추가
                if 'createPictureLayers(currentPoint, longIndex);' not in content:
                    # drawStars 함수 내에서 비디오 처리 부분 이후에 추가
                    video_pattern = r'(setTimeout\(\(\) => \{[^}]*\}, 500\); // 0\.5초 지연)'
                    video_match = re.search(video_pattern, content, re.DOTALL)
                    
                    if video_match:
                        video_part = video_match.group(1)
                        new_video_part = video_part + '\n\n        // [2] 사진 보여주기 함수 호출 전, 기존 사진 이미지 제거\n        const prevPictures = document.querySelectorAll(\'.picture-element\');\n        prevPictures.forEach(el => el.remove());\n    }\n\n    function createPictureLayers(currentPoint, longIndex) {\n        // 기존 레이어 제거\n        const existingLayers = document.querySelectorAll(\'.picture-layer\');\n        existingLayers.forEach(layer => layer.remove());\n        \n        // 4개 레이어 생성\n        for (let i = 1; i <= 4; i++) {\n            const pictureKey = `S${longIndex} picture_${i}`;\n            if (currentPoint[pictureKey]) {\n                const picturePath = `assets/picture/${currentPoint[pictureKey]}`;\n                const layerElement = document.createElement(\'div\');\n                layerElement.className = \'picture-layer\';\n                layerElement.style.position = \'absolute\';\n                layerElement.style.width = \'300px\';\n                layerElement.style.height = \'200px\';\n                layerElement.style.zIndex = \'15\'; // 사진 레이어는 별 아래, 아이콘 위\n                layerElement.style.overflow = \'hidden\';\n                layerElement.style.border = \'2px solid #333\';\n                layerElement.style.backgroundColor = \'#f0f0f0\';\n                \n                // 레이어 위치 설정 (왼쪽 세로 배치, 10px 간격)\n                layerElement.style.left = \'10px\'; // 왼쪽에서 10px\n                layerElement.style.top = `${10 + (i - 1) * 210}px`; // 세로로 210px 간격 (200px + 10px)\n                \n                // 이미지 생성\n                const imgElement = document.createElement(\'img\');\n                imgElement.src = picturePath;\n                imgElement.style.width = \'100%\';\n                imgElement.style.height = \'100%\';\n                imgElement.style.objectFit = \'cover\';\n                imgElement.style.display = \'block\';\n                \n                // 번호 표시 추가\n                const numberElement = document.createElement(\'div\');\n                numberElement.textContent = `${i} picture`;\n                numberElement.style.position = \'absolute\';\n                numberElement.style.top = \'5px\';\n                numberElement.style.left = \'5px\';\n                numberElement.style.backgroundColor = \'rgba(0, 0, 0, 0.7)\';\n                numberElement.style.color = \'white\';\n                numberElement.style.padding = \'2px 6px\';\n                numberElement.style.borderRadius = \'3px\';\n                numberElement.style.fontSize = \'12px\';\n                numberElement.style.fontWeight = \'bold\';\n                numberElement.style.zIndex = \'1\';\n                \n                layerElement.appendChild(imgElement);\n                layerElement.appendChild(numberElement);\n                document.getElementById(\'image-container\').appendChild(layerElement);\n            }\n        }\n    }'
                        
                        content = content.replace(video_part, new_video_part)
                        modified = True
                    
                    # drawStars 함수 내에서 createPictureLayers 호출 추가
                    if 'createPictureLayers(currentPoint, longIndex);' not in content:
                        # drawStars 함수 내에서 비디오 처리 부분 이후에 추가
                        draw_stars_end_pattern = r'(adjustStarPositions\(\); // Adjust star positions)'
                        draw_stars_end_match = re.search(draw_stars_end_pattern, content, re.DOTALL)
                        
                        if draw_stars_end_match:
                            draw_stars_end_part = draw_stars_end_match.group(1)
                            new_draw_stars_end_part = draw_stars_end_part + '\n\n        // 4개의 300x200 레이어에 사진 채우기\n        createPictureLayers(currentPoint, longIndex);'
                            
                            content = content.replace(draw_stars_end_part, new_draw_stars_end_part)
                            modified = True
        
        if modified:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✓ 완료: {file_path}")
        else:
            print(f"  - 이미 완료됨 또는 수정 불필요: {file_path}")
            
    except Exception as e:
        print(f"  ✗ 오류: {file_path} - {str(e)}")

# 모든 파일 처리
print("모든 JavaScript 파일에 picture 필드 관련 코드 추가 중...")
print("=" * 60)

for file_path in js_files:
    update_js_file(file_path)

print("=" * 60)
print("모든 JavaScript 파일 처리 완료!") 