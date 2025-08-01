import os
import glob
import re

# 모든 HTML 파일 찾기
html_files = glob.glob("*.html")

def update_html_file(file_path):
    print(f"처리 중: {file_path}")
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        modified = False
        
        # picture-layer 관련 스타일이 이미 있는지 확인
        if '.picture-layer' not in content:
            # </style> 태그 앞에 picture 관련 스타일 추가
            style_end_pattern = r'(</style>)'
            style_end_match = re.search(style_end_pattern, content)
            
            if style_end_match:
                style_end_tag = style_end_match.group(1)
                
                # picture 관련 스타일 추가
                picture_styles = '''
        /* Picture Layer 스타일 추가 */
        .picture-layer {
            position: absolute;
            width: 300px;
            height: 200px;
            z-index: 15;
            overflow: hidden;
            border: 2px solid #333;
            background-color: #f0f0f0;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .picture-layer img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
        
        .picture-layer .picture-number {
            position: absolute;
            top: 5px;
            left: 5px;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: bold;
            z-index: 1;
        }
        
        /* Picture Element 스타일 */
        .picture-element {
            width: calc(var(--container-size) * 0.45) !important;
            height: calc(var(--container-size) * 0.45) !important;
            object-fit: cover;
            display: block;
            margin: auto;
            border-radius: 50%;
        }
        
        .picture-cell {
            position: relative;
            width: 100%;
            height: 100%;
            overflow: hidden;
            border-radius: 50%;
            background: transparent;
        }
        
        .picture-cell > div {
            width: 100%;
            height: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            gap: 0;
        }
        
        .picture-cell img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }
        
        /* 반응형 Picture Element 크기 조정 */
        @media screen and (max-width: 500px) {
            .picture-element {
                width: calc(var(--container-size) * 0.135) !important;
                height: calc(var(--container-size) * 0.135) !important;
            }
        }
        
        @media screen and (min-width: 501px) and (max-width: 800px) {
            .picture-element {
                width: calc(var(--container-size) * 0.18) !important;
                height: calc(var(--container-size) * 0.18) !important;
            }
        }
        
        @media screen and (min-width: 801px) and (max-width: 1200px) {
            .picture-element {
                width: calc(var(--container-size) * 0.42) !important;
                height: calc(var(--container-size) * 0.42) !important;
            }
        }
        
        @media screen and (min-width: 1201px) and (max-width: 1400px) {
            .picture-element {
                width: calc(var(--container-size) * 0.48) !important;
                height: calc(var(--container-size) * 0.48) !important;
            }
        }
        
        @media screen and (min-width: 1401px) and (max-width: 1700px) {
            .picture-element {
                width: calc(var(--container-size) * 0.54) !important;
                height: calc(var(--container-size) * 0.54) !important;
            }
        }
        
        @media screen and (min-width: 1701px) and (max-width: 2100px) {
            .picture-element {
                width: calc(var(--container-size) * 0.63) !important;
                height: calc(var(--container-size) * 0.63) !important;
            }
        }
        
        @media screen and (min-width: 2101px) {
            .picture-element {
                width: calc(var(--container-size) * 0.72) !important;
                height: calc(var(--container-size) * 0.72) !important;
            }
        }
        
        /* Picture Grid 스타일 */
        .picture-grid {
            position: absolute;
            top: 10px;
            left: 10px;
            width: 300px;
            height: 800px;
            z-index: 15;
            pointer-events: none;
        }
        
        .picture-grid .picture-row {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .picture-grid .picture-cell {
            width: 300px;
            height: 200px;
            border: 2px solid #333;
            border-radius: 8px;
            overflow: hidden;
            background-color: #f0f0f0;
        }
        
        /* Yoso Element 스타일 */
        .yoso-element {
            position: absolute;
            z-index: 10;
            pointer-events: auto;
            cursor: default;
            transition: all 0.3s ease;
            opacity: 0.95;
        }
        
        .yoso-element:hover {
            transform: scale(1.1);
            opacity: 1;
        }
        
        /* 반응형 Yoso Element 크기 조정 */
        @media screen and (max-width: 500px) {
            .yoso-element {
                width: calc(var(--container-size) * 0.225);
                height: calc(var(--container-size) * 0.225);
            }
        }
        
        @media screen and (min-width: 501px) and (max-width: 800px) {
            .yoso-element {
                width: calc(var(--container-size) * 0.3);
                height: calc(var(--container-size) * 0.3);
            }
        }
        
        @media screen and (min-width: 801px) and (max-width: 1200px) {
            .yoso-element {
                width: calc(var(--container-size) * 0.7);
                height: calc(var(--container-size) * 0.7);
            }
        }
        
        @media screen and (min-width: 1201px) and (max-width: 1400px) {
            .yoso-element {
                width: calc(var(--container-size) * 0.8);
                height: calc(var(--container-size) * 0.8);
            }
        }
        
        @media screen and (min-width: 1401px) and (max-width: 1700px) {
            .yoso-element {
                width: calc(var(--container-size) * 0.9);
                height: calc(var(--container-size) * 0.9);
            }
        }
        
        @media screen and (min-width: 1701px) and (max-width: 2100px) {
            .yoso-element {
                width: calc(var(--container-size) * 1.05);
                height: calc(var(--container-size) * 1.05);
            }
        }
        
        @media screen and (min-width: 2101px) {
            .yoso-element {
                width: calc(var(--container-size) * 1.2);
                height: calc(var(--container-size) * 1.2);
            }
        }
'''
                
                new_style_end = picture_styles + '\n    ' + style_end_tag
                content = content.replace(style_end_tag, new_style_end)
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
print("모든 HTML 파일에 picture 필드 관련 스타일 추가 중...")
print("=" * 60)

for file_path in html_files:
    update_html_file(file_path)

print("=" * 60)
print("모든 HTML 파일 처리 완료!") 