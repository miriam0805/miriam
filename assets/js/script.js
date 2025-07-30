// 택배상자 표시 함수
function showDeliveryBox() {
    const imageContainer = document.querySelector('.image-container');
    const deliveryBox = document.createElement('div');
    
    // 택배상자 스타일 설정
    deliveryBox.style.position = 'absolute';
    deliveryBox.style.width = '50px';  // 상자 크기
    deliveryBox.style.height = '50px';
    deliveryBox.style.backgroundColor = '#f0f0f0';
    deliveryBox.style.border = '2px solid #333';
    deliveryBox.style.borderRadius = '5px';
    deliveryBox.style.display = 'flex';
    deliveryBox.style.alignItems = 'center';
    deliveryBox.style.justifyContent = 'center';
    deliveryBox.style.fontSize = '12px';
    deliveryBox.style.color = '#333';
    deliveryBox.style.zIndex = '1000';
    
    // 상대적 위치 설정 (0.612, 0.744)
    deliveryBox.style.left = '61.2%';
    deliveryBox.style.top = '74.4%';
    deliveryBox.style.transform = 'translate(-50%, -50%)';
    
    // 상자 내용
    deliveryBox.textContent = '택배';
    
    // 이미지 컨테이너에 추가
    imageContainer.appendChild(deliveryBox);
}

// 페이지 로드 시 택배상자 표시
window.addEventListener('load', showDeliveryBox); 