// main99.js
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
