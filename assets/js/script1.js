// 데이터 로드 및 시각화 함수
async function loadAndVisualizeData(width, height) {
    try {
        const response = await fetch('../data/data_911.json');
        const data = await response.json();
        
        // 서브별 위치 출력
        data.forEach((sentence, index) => {
            console.log(`문장 ${index + 1}: ${sentence.work_sentence}`);
            
            const points = sentence.points;
            
            // S1 서브별 위치
            if (points[0]['S1 sub_star_positions']) {
                console.log('S1 서브별 위치:');
                points[0]['S1 sub_star_positions'].forEach((pos, i) => {
                    console.log(`S1-${i+1}: ${pos}`);
                });
            }
            
            // S2 서브별 위치
            if (points[1]['S2 sub_star_positions']) {
                console.log('S2 서브별 위치:');
                points[1]['S2 sub_star_positions'].forEach((pos, i) => {
                    console.log(`S2-${i+1}: ${pos}`);
                });
            }
            
            // S3 서브별 위치
            if (points[2]['S3 sub_star_positions']) {
                console.log('S3 서브별 위치:');
                points[2]['S3 sub_star_positions'].forEach((pos, i) => {
                    console.log(`S3-${i+1}: ${pos}`);
                });
            }
            
            console.log('------------------------');
        });
        
        // SVG 컨테이너 생성
        const svg = d3.select('#visualization')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .style('position', 'relative')
            .style('z-index', '1')
            .style('max-width', '100%')
            .style('height', 'auto');

        // 각 문장에 대한 시각화
        data.forEach((sentence, index) => {
            const points = sentence.points;
            
            // S1과 S2의 위치 계산
            const s1Pos = parsePosition(points[0]['S1 po_sition']);
            const s2Pos = parsePosition(points[1]['S2 po_sition']);
            
            // S1 메인 포인트 표시
            const s1Adjusted = adjustPosition(s1Pos.x, s1Pos.y, width, height);
            svg.append('circle')
                .attr('cx', s1Adjusted.x)
                .attr('cy', s1Adjusted.y)
                .attr('r', Math.max(width * 0.025, 10)) // 최소 크기 설정
                .attr('fill', '#ff0000')
                .attr('opacity', 0.3)
                .style('pointer-events', 'none')
                .style('position', 'relative')
                .style('z-index', '2');
            
            // S2 메인 포인트 표시
            const s2Adjusted = adjustPosition(s2Pos.x, s2Pos.y, width, height);
            svg.append('circle')
                .attr('cx', s2Adjusted.x)
                .attr('cy', s2Adjusted.y)
                .attr('r', Math.max(width * 0.025, 10)) // 최소 크기 설정
                .attr('fill', '#0000ff')
                .attr('opacity', 0.3)
                .style('pointer-events', 'none')
                .style('position', 'relative')
                .style('z-index', '2');
            
            // S1 서브 카테고리 위치 계산
            if (points[0]['S1 sub_star_positions']) {
                points[0]['S1 sub_star_positions'].forEach((pos, i) => {
                    const subPos = parsePosition(pos);
                    const subAdjusted = adjustPosition(subPos.x, subPos.y, width, height);
                    
                    // S1과 서브 카테고리 연결선
                    svg.append('line')
                        .attr('x1', s1Adjusted.x)
                        .attr('y1', s1Adjusted.y)
                        .attr('x2', subAdjusted.x)
                        .attr('y2', subAdjusted.y)
                        .attr('stroke', '#0000ff')
                        .attr('stroke-width', Math.max(width * 0.004, 2)) // 최소 두께 설정
                        .attr('stroke-dasharray', '10,5')
                        .style('pointer-events', 'none')
                        .style('position', 'relative')
                        .style('z-index', '3');
                    
                    // 서브 카테고리 점 표시
                    svg.append('circle')
                        .attr('cx', subAdjusted.x)
                        .attr('cy', subAdjusted.y)
                        .attr('r', Math.max(width * 0.1, 40)) // 최소 크기 설정
                        .attr('fill', '#0000ff')
                        .attr('opacity', 1)
                        .attr('stroke', '#ffffff')
                        .attr('stroke-width', Math.max(width * 0.0025, 1)) // 최소 두께 설정
                        .style('pointer-events', 'none')
                        .style('position', 'relative')
                        .style('z-index', '3');
                    
                    // 서브 카테고리 텍스트 레이블
                    svg.append('text')
                        .attr('x', subAdjusted.x + width * 0.11)
                        .attr('y', subAdjusted.y)
                        .attr('fill', '#0000ff')
                        .attr('font-size', `${Math.max(width * 0.023, 16)}px`) // 최소 크기 설정
                        .attr('font-weight', 'bold')
                        .text(`S1-${i+1}`)
                        .style('pointer-events', 'none')
                        .style('position', 'relative')
                        .style('z-index', '3');
                });
            }
            
            // S2 서브 카테고리 위치 계산
            if (points[1]['S2 sub_star_positions']) {
                points[1]['S2 sub_star_positions'].forEach((pos, i) => {
                    const subPos = parsePosition(pos);
                    const subAdjusted = adjustPosition(subPos.x, subPos.y, width, height);
                    
                    // S2와 서브 카테고리 연결선
                    svg.append('line')
                        .attr('x1', s2Adjusted.x)
                        .attr('y1', s2Adjusted.y)
                        .attr('x2', subAdjusted.x)
                        .attr('y2', subAdjusted.y)
                        .attr('stroke', '#0000ff')
                        .attr('stroke-width', Math.max(width * 0.004, 2)) // 최소 두께 설정
                        .style('pointer-events', 'none')
                        .style('position', 'relative')
                        .style('z-index', '3');
                    
                    // 서브 카테고리 점 표시
                    svg.append('circle')
                        .attr('cx', subAdjusted.x)
                        .attr('cy', subAdjusted.y)
                        .attr('r', Math.max(width * 0.1, 40)) // 최소 크기 설정
                        .attr('fill', '#0000ff')
                        .attr('opacity', 1)
                        .attr('stroke', '#ffffff')
                        .attr('stroke-width', Math.max(width * 0.0025, 1)) // 최소 두께 설정
                        .style('pointer-events', 'none')
                        .style('position', 'relative')
                        .style('z-index', '3');
                    
                    // 서브 카테고리 텍스트 레이블
                    svg.append('text')
                        .attr('x', subAdjusted.x + width * 0.11)
                        .attr('y', subAdjusted.y)
                        .attr('fill', '#0000ff')
                        .attr('font-size', `${Math.max(width * 0.023, 16)}px`) // 최소 크기 설정
                        .attr('font-weight', 'bold')
                        .text(`S2-${i+1}`)
                        .style('pointer-events', 'none')
                        .style('position', 'relative')
                        .style('z-index', '3');
                });
            }

            // S3 서브 카테고리 위치 계산
            if (points[2]['S3 sub_star_positions']) {
                const s3Pos = parsePosition(points[2]['S3 po_sition']);
                const s3Adjusted = adjustPosition(s3Pos.x, s3Pos.y, width, height);
                
                points[2]['S3 sub_star_positions'].forEach((pos, i) => {
                    const subPos = parsePosition(pos);
                    const subAdjusted = adjustPosition(subPos.x, subPos.y, width, height);
                    
                    // S3와 서브 카테고리 연결선
                    svg.append('line')
                        .attr('x1', s3Adjusted.x)
                        .attr('y1', s3Adjusted.y)
                        .attr('x2', subAdjusted.x)
                        .attr('y2', subAdjusted.y)
                        .attr('stroke', '#0000ff')
                        .attr('stroke-width', Math.max(width * 0.004, 2)) // 최소 두께 설정
                        .style('pointer-events', 'none')
                        .style('position', 'relative')
                        .style('z-index', '3');
                    
                    // 서브 카테고리 점 표시
                    svg.append('circle')
                        .attr('cx', subAdjusted.x)
                        .attr('cy', subAdjusted.y)
                        .attr('r', Math.max(width * 0.1, 40)) // 최소 크기 설정
                        .attr('fill', '#0000ff')
                        .attr('opacity', 1)
                        .attr('stroke', '#ffffff')
                        .attr('stroke-width', Math.max(width * 0.0025, 1)) // 최소 두께 설정
                        .style('pointer-events', 'none')
                        .style('position', 'relative')
                        .style('z-index', '3');
                    
                    // 서브 카테고리 텍스트 레이블
                    svg.append('text')
                        .attr('x', subAdjusted.x + width * 0.11)
                        .attr('y', subAdjusted.y)
                        .attr('fill', '#0000ff')
                        .attr('font-size', `${Math.max(width * 0.023, 16)}px`) // 최소 크기 설정
                        .attr('font-weight', 'bold')
                        .text(`S3-${i+1}`)
                        .style('pointer-events', 'none')
                        .style('position', 'relative')
                        .style('z-index', '3');
                });
            }
        });

        // 서브별 정보 표시 함수 실행
        showSubCategories(data);
    } catch (error) {
        console.error('데이터 로드 중 오류 발생:', error);
    }
}

// 서브별 정보를 화면 위에 표시하는 함수
function showSubCategories(data) {
    // 서브별 정보를 표시할 div 생성
    const subInfoDiv = d3.select('body')
        .append('div')
        .attr('id', 'sub-categories-info')
        .style('position', 'fixed')
        .style('top', '20px')
        .style('left', '20px')
        .style('background-color', 'white')
        .style('padding', '20px')
        .style('border', '1px solid #ccc')
        .style('border-radius', '5px')
        .style('box-shadow', '0 0 10px rgba(0,0,0,0.1)')
        .style('z-index', '1000');

    // 각 문장의 서브별 정보 표시
    data.forEach((sentence, index) => {
        const points = sentence.points;
        
        // 문장 제목 추가
        subInfoDiv.append('h3')
            .text(`문장 ${index + 1}: ${sentence.work_sentence}`);

        // S1 서브별 정보
        if (points[0]['S1 sub_star_positions']) {
            subInfoDiv.append('h4')
                .text('S1 서브별:');
            points[0]['S1 sub_star_positions'].forEach((pos, i) => {
                subInfoDiv.append('p')
                    .text(`S1-${i+1}: ${pos}`);
            });
        }

        // S2 서브별 정보
        if (points[1]['S2 sub_star_positions']) {
            subInfoDiv.append('h4')
                .text('S2 서브별:');
            points[1]['S2 sub_star_positions'].forEach((pos, i) => {
                subInfoDiv.append('p')
                    .text(`S2-${i+1}: ${pos}`);
            });
        }

        // S3 서브별 정보
        if (points[2]['S3 sub_star_positions']) {
            subInfoDiv.append('h4')
                .text('S3 서브별:');
            points[2]['S3 sub_star_positions'].forEach((pos, i) => {
                subInfoDiv.append('p')
                    .text(`S3-${i+1}: ${pos}`);
            });
        }

        // 구분선 추가
        subInfoDiv.append('hr');
    });
}

// 위치 문자열 파싱 함수
function parsePosition(posStr) {
    const match = posStr.match(/\(([\d.]+),\s*([\d.]+)\)/);
    return {
        x: parseFloat(match[1]),
        y: parseFloat(match[2])
    };
}

// 이미지 크기에 따른 위치 조정 함수
function adjustPosition(x, y, width, height) {
    return {
        x: x * width,
        y: y * height
    };
}

// 스케일 조정 함수
function updateScale() {
    const scale = window.innerWidth / 1200;
    document.getElementById('visualization').style.setProperty('--scale', scale);
    const textDisplay = document.getElementById('text-display');
    if (textDisplay) {
        const fontSize = Math.max(window.innerWidth * 0.02, 16); // 창 너비의 2%, 최소 16px
        textDisplay.style.fontSize = `${fontSize}px`;
        textDisplay.style.padding = `${fontSize * 0.3}px ${fontSize * 0.6}px`; // 패딩도 비례하게 조정
        textDisplay.style.transform = `scale(${scale * 0.5})`; // 전체 크기를 50%로 조정
        textDisplay.style.transformOrigin = 'top left';
    }
}

// 페이지 로드 시 시각화 실행
document.addEventListener('DOMContentLoaded', () => {
    const imageWidth = 2500;
    const imageHeight = 2500;
    
    loadAndVisualizeData(imageWidth, imageHeight);
    updateScale();

    window.addEventListener('resize', debounce(() => {
        d3.select('#visualization svg').remove();
        const scale = Math.min(window.innerWidth / imageWidth, window.innerHeight / imageHeight);
        loadAndVisualizeData(imageWidth * scale, imageHeight * scale);
        updateScale();
    }, 250));
});

// 디바운스 함수
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}