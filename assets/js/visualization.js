// 데이터 로드 및 시각화 함수
async function loadAndVisualizeData() {
    try {
        const response = await fetch('../data/data_911.json');
        const data = await response.json();
        
        // SVG 컨테이너 생성
        const svg = d3.select('#visualization')
            .append('svg')
            .attr('width', 2000)
            .attr('height', 2000);

        // 각 문장에 대한 시각화
        data.forEach((sentence, index) => {
            const points = sentence.points;
            
            // S1과 S2의 위치 계산
            const s1Pos = parsePosition(points[0]['S1 po_sition']);
            const s2Pos = parsePosition(points[1]['S2 po_sition']);
            
            // S1 메인 포인트 표시
            svg.append('circle')
                .attr('cx', s1Pos.x * 2000)
                .attr('cy', s1Pos.y * 2000)
                .attr('r', 200)
                .attr('fill', '#ff0000')
                .attr('opacity', 0.5);
            
            // S2 메인 포인트 표시
            svg.append('circle')
                .attr('cx', s2Pos.x * 2000)
                .attr('cy', s2Pos.y * 2000)
                .attr('r', 200)
                .attr('fill', '#0000ff')
                .attr('opacity', 0.5);
            
            // S1 서브 카테고리 위치 계산
            if (points[0]['S1 sub_star_positions']) {
                points[0]['S1 sub_star_positions'].forEach((pos, i) => {
                    const subPos = parsePosition(pos);
                    // S1과 서브 카테고리 연결선
                    svg.append('line')
                        .attr('x1', s1Pos.x * 2000)
                        .attr('y1', s1Pos.y * 2000)
                        .attr('x2', subPos.x * 2000)
                        .attr('y2', subPos.y * 2000)
                        .attr('stroke', '#ff0000')
                        .attr('stroke-width', 5)
                        .attr('stroke-dasharray', '10,5');
                    
                    // 서브 카테고리 점 표시
                    svg.append('circle')
                        .attr('cx', subPos.x * 2000)
                        .attr('cy', subPos.y * 2000)
                        .attr('r', 200)
                        .attr('fill', '#ff0000')
                        .attr('opacity', 0.5);
                    
                    // 서브 카테고리 텍스트 레이블
                    svg.append('text')
                        .attr('x', subPos.x * 2000 + 220)
                        .attr('y', subPos.y * 2000)
                        .attr('fill', '#ff0000')
                        .attr('font-size', '24px')
                        .text(`S1-${i+1}`);
                });
            }
            
            // S2 서브 카테고리 위치 계산
            if (points[1]['S2 sub_star_positions']) {
                points[1]['S2 sub_star_positions'].forEach((pos, i) => {
                    const subPos = parsePosition(pos);
                    // S2와 서브 카테고리 연결선
                    svg.append('line')
                        .attr('x1', s2Pos.x * 2000)
                        .attr('y1', s2Pos.y * 2000)
                        .attr('x2', subPos.x * 2000)
                        .attr('y2', subPos.y * 2000)
                        .attr('stroke', '#0000ff')
                        .attr('stroke-width', 5);
                    
                    // 서브 카테고리 점 표시
                    svg.append('circle')
                        .attr('cx', subPos.x * 2000)
                        .attr('cy', subPos.y * 2000)
                        .attr('r', 200)
                        .attr('fill', '#0000ff')
                        .attr('opacity', 0.5);
                    
                    // 서브 카테고리 텍스트 레이블
                    svg.append('text')
                        .attr('x', subPos.x * 2000 + 220)
                        .attr('y', subPos.y * 2000)
                        .attr('fill', '#0000ff')
                        .attr('font-size', '24px')
                        .text(`S2-${i+1}`);
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

// 페이지 로드 시 시각화 실행
document.addEventListener('DOMContentLoaded', loadAndVisualizeData);