// main99.js
// data/data_1_4.json에서 첫 번째 currentPoint의 S$ image를 표시하는 예시
function loadData() {
    console.log('데이터 로드 시작');
    let dataFile = 'data/data_1_4.json'; // 기본값
    // localStorage에서 파일명을 가져오는 부분은 생략(옵션)

    fetch(dataFile)
        .then(response => {
            console.log('서버 응답:', response);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('원본 데이터:', data);
            if (!Array.isArray(data)) {
                console.error('데이터가 배열이 아닙니다:', data);
                return;
            }
            if (data.length === 0) {
                console.error('데이터가 비어있습니다.');
                return;
            }
            const currentData = data[0];
            if (!currentData) {
                console.error('ID 0의 데이터를 찾을 수 없습니다.');
                return;
            }
            console.log('현재 데이터:', currentData);
            console.log('포인트 데이터:', currentData.points);
            // 첫 번째 포인트의 S$ image를 중앙에 표시
            if (currentData.points && currentData.points.length > 0) {
                const firstPoint = currentData.points[0];
                showMainImage(firstPoint);
            }
        })
        .catch(error => {
            console.error('데이터 로드 중 오류 발생:', error);
        });
}

// 페이지 로드시 자동 실행
window.onload = loadData;


// 중앙 메인 화면에 S$ image 값을 표시하는 함수
function showMainImage(currentPoint) {
    const mainImageArea = document.getElementById('main-image-area');
    if (mainImageArea) {
        const sImage = currentPoint['S$ image'];
        if (sImage) {
            mainImageArea.innerHTML = `<img src="assets/images/${sImage}" alt="메인 이미지" style="max-width:100%;max-height:100%;object-fit:contain;">`;
        } else {
            mainImageArea.textContent = '메인 화면';
        }
    }
}

