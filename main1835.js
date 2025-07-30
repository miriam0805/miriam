document.addEventListener("DOMContentLoaded", function() {
    const imageContainer = document.getElementById('image-container');
    const starContainer = document.getElementById('star-container');
    const nextButton = document.getElementById('next-button');
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentId++;
            resetAllValues();
            initializeSystem();
        });
    }
    const currentImage = document.getElementById('current-image');
    let currentId = 0;
    let currentStarIndex = 0;
    let starData = [];
    let currentData = null;
    let totalStars = 0;
    let currentStarClickedIndex = 0;
    let sDollarClickCount = 0;
    const lastStarKey = 'S$';

    // 스타일시트 관련 초기 설정
    const mainStyleSheet = document.styleSheets[0];
    
    // blueGlow 애니메이션 키프레임 정의
    const blueGlowKeyframes = `
        @keyframes blueGlow {
            0% { box-shadow: 0 0 10px #00a2ff, 0 0 20px #00a2ff, 0 0 30px #00a2ff; }
            50% { box-shadow: 0 0 20px #00a2ff, 0 0 30px #00a2ff, 0 0 40px #00a2ff; }
            100% { box-shadow: 0 0 10px #00a2ff, 0 0 20px #00a2ff, 0 0 30px #00a2ff; }
        }
    `;
    mainStyleSheet.insertRule(blueGlowKeyframes, mainStyleSheet.cssRules.length);

    // 파티클 애니메이션 키프레임 추가
    const particleKeyframes = `
        @keyframes moveParticle {
            0% { transform: translateY(0); }
            100% { transform: translateY(-100px); opacity: 0; }
        }
    `;
    mainStyleSheet.insertRule(particleKeyframes, mainStyleSheet.cssRules.length);

    // 이미지 크기 감지 및 별 위치 조정
    function adjustStarPositions() {
        const imageWidth = currentImage.clientWidth;
        const imageHeight = currentImage.clientHeight;

        const stars = document.querySelectorAll('.star');
        stars.forEach(star => {
            const x = parseFloat(star.dataset.x);
            const y = parseFloat(star.dataset.y);

            // 이미지 크기에 맞게 위치 계산
            star.style.left = `${x * imageWidth}px`;
            star.style.top = `${y * imageHeight}px`;
        });

        // 궤도 위치도 조정
        const orbits = document.querySelectorAll('.star-orbit');
        orbits.forEach(orbit => {
            const star = orbit.nextElementSibling;
            if (star && star.classList.contains('star')) {
                const x = parseFloat(star.dataset.x);
                const y = parseFloat(star.dataset.y);
                orbit.style.left = `${x * imageWidth}px`;
                orbit.style.top = `${y * imageHeight}px`;
            }
        });
    }

    // 이미지 로드 완료 시 이벤트 리스너 추가
    currentImage.addEventListener('load', () => {
        adjustStarPositions();
    });

    // 윈도우 리사이즈 이벤트 리스너 추가
    window.addEventListener('resize', () => {
        adjustStarPositions();
    });

    // 텍스트 디스플레이 크기 조정 함수
    function adjustTextDisplaySize() {
        const textDisplay = document.getElementById('text-display');
        if (textDisplay) {
            const windowWidth = window.innerWidth;
            const fontSize = Math.max(windowWidth * 0.04, 24); // 창 너비의 4%, 최소 24px
            const padding = fontSize * 0.5; // 폰트 크기의 50%를 패딩으로 설정
            
            textDisplay.style.fontSize = `${fontSize}px`;
            textDisplay.style.padding = `${padding}px ${padding * 2}px`;
        }
    }

    // 초기 크기 조정 및 리사이즈 이벤트 리스너 설정
    adjustTextDisplaySize();
    window.addEventListener('resize', adjustTextDisplaySize);

    function loadData() {
        console.log('데이터 로드 시작');
        let dataFile = 'assets/data/data_1_3.json'; // 기본값
        const stored = localStorage.getItem('dataFile');
        if (stored) dataFile = 'assets/data/' + stored;

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
                starData = data;
                
                if (!Array.isArray(starData)) {
                    console.error('데이터가 배열이 아닙니다:', starData);
                    showErrorMessage('데이터 형식이 올바르지 않습니다.');
                    
            // 1.5초 후 Next 버튼 자동 클릭
            setTimeout(() => {
                if (nextButton && !nextButton.disabled) {
                    console.log('S1004 클릭 후 1.5초 뒤 Next 버튼 자동 클릭');
                    nextButton.click();
                } else {
                    console.log('Next 버튼이 비활성화되어 있어 자동 클릭하지 않음');
                }
            }, 1500);

            return;
        }
                if (starData.length === 0) {
                    console.error('데이터가 비어있습니다.');
                    showErrorMessage('데이터가 비어있습니다.');
                    
            // 1.5초 후 Next 버튼 자동 클릭
            setTimeout(() => {
                if (nextButton && !nextButton.disabled) {
                    console.log('S1004 클릭 후 1.5초 뒤 Next 버튼 자동 클릭');
                    nextButton.click();
                } else {
                    console.log('Next 버튼이 비활성화되어 있어 자동 클릭하지 않음');
                }
            }, 1500);

            return;
        }
                console.log('데이터 로드 완료:', starData);
                console.log('데이터 길이:', starData.length);
                
                currentId = 0;
                currentData = starData[currentId];
                
                if (!currentData) {
                    console.error('ID 0의 데이터를 찾을 수 없습니다.');
                    showErrorMessage('초기 데이터를 찾을 수 없습니다.');
                    
            // 1.5초 후 Next 버튼 자동 클릭
            setTimeout(() => {
                if (nextButton && !nextButton.disabled) {
                    console.log('S1004 클릭 후 1.5초 뒤 Next 버튼 자동 클릭');
                    nextButton.click();
                } else {
                    console.log('Next 버튼이 비활성화되어 있어 자동 클릭하지 않음');
                }
            }, 1500);

            return;
        }
                console.log('현재 데이터:', currentData);
                console.log('포인트 데이터:', currentData.points);

                // 각 별에 대해 Preposition 체크 수행
                if (currentData.points && currentData.points.length > 0) {
                    currentData.points.forEach((point, index) => {
                        console.log(`포인트 ${index + 1} 데이터:`, point);
                        const starKey = Object.keys(point).find(key => key.endsWith('part_of_speech'));
                        if (starKey && point[starKey] === 'Preposition') {
                            const positionKey = starKey.replace('part_of_speech', 'po_sition');
                            const position = point[positionKey];
                            if (position) {
                                handleSpecialValue('Preposition', position);
                            }
                        }
                    });
                }

                // 첫 번째 이미지 설정
                if (currentData.points && currentData.points.length > 0) {
                    const firstPoint = currentData.points[0];
                    console.log('첫 번째 포인트:', firstPoint);
                    if (firstPoint && firstPoint['S1 image']) {
                        const imagePath = `assets/images/${firstPoint['S1 image']}`;
                        console.log('첫 이미지 로드:', imagePath);
                        loadImageWithFallback(imagePath);
                    } else {
                        console.error('첫 이미지를 찾을 수 없습니다.');
                        showErrorMessage('이미지를 찾을 수 없습니다.');
                    }
                }

                nextButton.disabled = true;
                currentStarIndex = 0;
                totalStars = currentData.points.length;
                sDollarClickCount = 0;
                
                drawStars(currentData.points, currentStarIndex);
            })
            .catch(error => {
                console.error('데이터 로드 중 오류 발생:', error);
                console.error('오류 상세:', error.stack);
                showErrorMessage('데이터를 불러오는 중 오류가 발생했습니다.');
            });
    }

    // 이미지 로드 실패 시 대체 이미지를 표시하는 함수
    function loadImageWithFallback(imagePath) {
        const currentImage = document.getElementById('current-image');
        if (!currentImage) {
            console.error('current-image element not found');
            
            // 1.5초 후 Next 버튼 자동 클릭
            setTimeout(() => {
                if (nextButton && !nextButton.disabled) {
                    console.log('S1004 클릭 후 1.5초 뒤 Next 버튼 자동 클릭');
                    nextButton.click();
                } else {
                    console.log('Next 버튼이 비활성화되어 있어 자동 클릭하지 않음');
                }
            }, 1500);

            return;
        }
        // 이미지 로드 전에 이전 이미지 제거
        currentImage.src = '';
        
        currentImage.onload = function() {
            console.log('Image loaded successfully:', imagePath);
            currentImage.style.opacity = '1';
            adjustStarPositions();
        };
        
        currentImage.onerror = function() {
            console.error('Image load failed:', imagePath);
            this.src = 'assets/images/1.jpg';
            showErrorMessage('이미지를 불러올 수 없습니다.');
        };
        
        currentImage.src = imagePath;
    }

    // 에러 메시지를 표시하는 함수
    function showErrorMessage(message) {
        const messageElement = document.getElementById('message');
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.style.display = 'block';
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 3000);
        }
    }

    function initializeSystem() {
        // 첫 번째 이미지 로드
        const firstImage = document.getElementById('current-image');
        if (firstImage) {
            firstImage.src = 'assets/images/Qbe1.jpg';
            firstImage.onload = function() {
                console.log('First image loaded successfully');
                firstImage.style.opacity = '1';
            };
            firstImage.onerror = function() {
                console.error('Failed to load first image');
                showErrorMessage('첫 번째 이미지를 불러올 수 없습니다.');
            };
        }

        // 첫 번째 아이콘 이미지 로드
        const personIcon = document.getElementById('person-icon');
        if (personIcon) {
            personIcon.src = 'assets/images/yoso/Qbe1.jpg';
            personIcon.style.display = 'block';
            personIcon.onload = function() {
                console.log('First icon loaded successfully');
            };
            personIcon.onerror = function() {
                console.error('Failed to load first icon');
            };
        }

        if (currentId >= starData.length) {
            currentId = 0;
        }
        currentData = starData[currentId];
        const firstPoint = currentData.points[0];
        if (firstPoint && firstPoint['S1 image']) {
            currentImage.src = `assets/images/${encodeURIComponent(firstPoint['S1 image'])}`;
        }
        nextButton.disabled = true;
        currentStarIndex = 0;
        totalStars = currentData.points.length;
        sDollarClickCount = 0;
        
        drawStars(currentData.points, currentStarIndex);
    }

    function drawStars(starPositions, longIndex) {
        console.log('drawStars 호출:', { longIndex, currentPoint: starPositions[longIndex] });
        starContainer.innerHTML = ''; // Clear the star container
        
        // 이전에 표시된 요소들 제거
        const personElement = document.getElementById('person_image');
        if (personElement) {
            personElement.remove();
        }

        const partOfSpeechIcon = document.getElementById('part-of-speech-icon');
        if (partOfSpeechIcon) {
            partOfSpeechIcon.style.display = 'none';
        }

        const partOfSpeechImage = document.getElementById('part_of_speech_image');
        if (partOfSpeechImage) {
            partOfSpeechImage.remove();
        }

        // 택배상자 숨기기
        const deliveryBox = document.getElementById('delivery-box');
        if (deliveryBox) {
            deliveryBox.style.display = 'none';
        }

        // 아이콘 이미지들 제거
        const iconImages = document.querySelectorAll('img[src*="yoso/"]');
        iconImages.forEach(icon => {
            if (icon && icon.parentNode) {
                icon.parentNode.removeChild(icon);
            }
        });
        
        const currentPoint = starPositions[longIndex];

        if (!currentPoint) {
            console.error(`No data found for index: ${longIndex}`);
            
            // 1.5초 후 Next 버튼 자동 클릭
            setTimeout(() => {
                if (nextButton && !nextButton.disabled) {
                    console.log('S1004 클릭 후 1.5초 뒤 Next 버튼 자동 클릭');
                    nextButton.click();
                } else {
                    console.log('Next 버튼이 비활성화되어 있어 자동 클릭하지 않음');
                }
            }, 1500);

            return;
        }
        console.log('Current point data:', currentPoint);

        // 별, 아이콘 등 포인트 위치 계산 (object-fit: contain 대응)
        const imageRect = currentImage.getBoundingClientRect();
        const containerRect = imageContainer.getBoundingClientRect();
        const imageAspect = currentImage.naturalWidth / currentImage.naturalHeight;
        const containerAspect = containerRect.width / containerRect.height;
        let displayWidth, displayHeight, offsetX, offsetY;
        if (imageAspect > containerAspect) {
            // 좌우가 꽉 참 (위아래 여백)
            displayWidth = containerRect.width;
            displayHeight = containerRect.width / imageAspect;
            offsetX = 0;
            offsetY = (containerRect.height - displayHeight) / 2;
        } else {
            // 위아래가 꽉 참 (좌우 여백)
            displayWidth = containerRect.height * imageAspect;
            displayHeight = containerRect.height;
            offsetX = (containerRect.width - displayWidth) / 2;
            offsetY = 0;
        }
        // 별 위치 계산 (x, y는 0~1 비율)
        // 기존 adjustedX, adjustedY 대신 starX, starY 사용
        // 예시: const [x, y] = ...
        // const starX = offsetX + x * displayWidth;
        // const starY = offsetY + y * displayHeight;
        // 이후 star, 아이콘, picture 등 모든 포인트 배치에 starX, starY 사용

        // 현재 이미지 설정
        if (currentPoint[`S${longIndex} image`]) {
            const imagePath = `assets/images/${encodeURIComponent(currentPoint[`S${longIndex} image`])}`;
            console.log('Loading image:', imagePath);
            
            // 이미지 로드 전에 이전 이미지 제거
            currentImage.src = '';
            
            // 새로운 이미지 로드
            currentImage.onload = function() {
                console.log('Image loaded successfully');
                currentImage.style.opacity = '1';
                adjustStarPositions();
            };
            
            currentImage.onerror = function() {
                console.error('Failed to load image:', imagePath);
                showErrorMessage('이미지를 불러올 수 없습니다.');
                // fallback 이미지를 존재하는 파일로 변경
                currentImage.src = 'assets/images/1.jpg';
            };
            
            currentImage.src = imagePath;
        }

        // 1, 2 아이콘 배치 (가로/세로 정렬)
        const isMobile = window.innerWidth <= 600;
        const iconSize = isMobile ? 65 : 100;
        const iconGap = isMobile ? 8 : 10;
        // 별 위치 계산
        const position = currentPoint[`S${longIndex} po_sition`];
        if (position) {
            const [x, y] = position.replace(/[()]/g, '').split(',').map(Number);
            const adjustedX = x * imageRect.width;
            const adjustedY = y * imageRect.height;
            // 별 아래 공간 계산
            let baseY;
            const spaceBelow = imageRect.height - adjustedY;
            if (spaceBelow > iconSize + 60) {
                // 아래 공간 충분 → 별 아래 60px에 표시
                baseY = adjustedY + 60;
            } else {
                // 아래 공간 부족 → 별 위 30px에 표시
                baseY = adjustedY - iconSize - 30;
            }
            
            // 화면 크기에 따라 아이콘 배치 결정
            const isMobile = window.innerWidth <= 600;
            
            for (let i = 1; i <= 2; i++) {
                const iconKey = `S${longIndex} icon_${i}`;
                if (currentPoint[iconKey]) {
                    const iconPath = `assets/images/yoso/${encodeURIComponent(currentPoint[iconKey])}`;
                    const iconElement = document.createElement('img');
                    iconElement.src = iconPath;
                    iconElement.className = 'yoso-element';
                    iconElement.style.position = 'absolute';
                    iconElement.style.width = `${iconSize}px`;
                    iconElement.style.height = `${iconSize}px`;
                    iconElement.style.zIndex = '10';
                    iconElement.style.pointerEvents = 'auto';
                    iconElement.style.cursor = 'default';
                    iconElement.style.transition = 'all 0.3s ease';
                    iconElement.style.opacity = '0.95';
                    iconElement.onload = function() {
                        console.log('아이콘 이미지 로드 성공:', iconPath);
                    };
                    iconElement.onerror = function() {
                        this.style.display = 'none';
                        // 이미지 로드 실패 시 흰색 네모 div로 대체
                        const emptyDiv = document.createElement('div');
                        emptyDiv.className = 'yoso-element';
                        emptyDiv.style.position = 'absolute';
                        emptyDiv.style.width = `${iconSize}px`;
                        emptyDiv.style.height = `${iconSize}px`;
                        emptyDiv.style.background = '#fff';
                        emptyDiv.style.zIndex = '10';
                        if (isMobile) {
                            emptyDiv.style.left = '10px';
                            emptyDiv.style.top = `${baseY + (i - 1) * (iconSize + iconGap)}px`;
                            emptyDiv.style.transform = 'none';
                        } else {
                            emptyDiv.style.left = `${adjustedX + (i - 1) * (iconSize + iconGap)}px`;
                            emptyDiv.style.top = `${baseY}px`;
                            emptyDiv.style.transform = 'translate(-50%, 0)';
                        }
                        document.getElementById('image-container').appendChild(emptyDiv);
                    };
                    if (isMobile) {
                        iconElement.style.left = '10px';
                        iconElement.style.top = `${baseY + (i - 1) * (iconSize + iconGap)}px`;
                        iconElement.style.transform = 'none';
                    } else {
                        iconElement.style.left = `${adjustedX + (i - 1) * (iconSize + iconGap)}px`;
                        iconElement.style.top = `${baseY}px`;
                        iconElement.style.transform = 'translate(-50%, 0)';
                    }
                    document.getElementById('image-container').appendChild(iconElement);
                } else {
                    // 아이콘 값이 없으면 흰색 네모 div 추가
                    const emptyDiv = document.createElement('div');
                    emptyDiv.className = 'yoso-element';
                    emptyDiv.style.position = 'absolute';
                    emptyDiv.style.width = `${iconSize}px`;
                    emptyDiv.style.height = `${iconSize}px`;
                    emptyDiv.style.background = '#fff';
                    emptyDiv.style.zIndex = '10';
                    if (isMobile) {
                        emptyDiv.style.left = '10px';
                        emptyDiv.style.top = `${baseY + (i - 1) * (iconSize + iconGap)}px`;
                        emptyDiv.style.transform = 'none';
                    } else {
                        emptyDiv.style.left = `${adjustedX + (i - 1) * (iconSize + iconGap)}px`;
                        emptyDiv.style.top = `${baseY}px`;
                        emptyDiv.style.transform = 'translate(-50%, 0)';
                    }
                    document.getElementById('image-container').appendChild(emptyDiv);
                }
            }
            
            // 아이콘 3, 4 배치 (우상단 고정)
            for (let i = 3; i <= 4; i++) {
                const iconKey = `S${longIndex} icon_${i}`;
                if (currentPoint[iconKey]) {
                    const iconPath = `assets/images/yoso/${encodeURIComponent(currentPoint[iconKey])}`;
                    const iconElement = document.createElement('img');
                    iconElement.src = iconPath;
                    iconElement.className = 'yoso-element';
                    iconElement.style.position = 'absolute';
                    iconElement.style.width = `${iconSize}px`;
                    iconElement.style.height = `${iconSize}px`;
                    iconElement.style.zIndex = '10';
                    iconElement.style.pointerEvents = 'auto';
                    iconElement.style.cursor = 'default';
                    iconElement.style.transition = 'all 0.3s ease';
                    iconElement.style.opacity = '0.95';
                    
                    iconElement.onload = function() {
                        console.log('아이콘 이미지 로드 성공:', iconPath);
                    };
                    iconElement.onerror = function() {
                        this.style.display = 'none';
                        // 이미지 로드 실패 시 흰색 네모 div로 대체
                        const emptyDiv = document.createElement('div');
                        emptyDiv.className = 'yoso-element';
                        emptyDiv.style.position = 'absolute';
                        emptyDiv.style.width = `${iconSize}px`;
                        emptyDiv.style.height = `${iconSize}px`;
                        emptyDiv.style.background = '#fff';
                        emptyDiv.style.zIndex = '10';
                        emptyDiv.style.right = '10px';
                        emptyDiv.style.top = `${10 + (i - 3) * (iconSize + iconGap)}px`;
                        emptyDiv.style.transform = 'none';
                        document.getElementById('image-container').appendChild(emptyDiv);
                    };
                    // 우상단 고정 위치
                    iconElement.style.right = '10px';
                    iconElement.style.top = `${10 + (i - 3) * (iconSize + iconGap)}px`;
                    iconElement.style.transform = 'none';
                    document.getElementById('image-container').appendChild(iconElement);
                } else {
                    // 아이콘 값이 없으면 흰색 네모 div 추가
                    const emptyDiv = document.createElement('div');
                    emptyDiv.className = 'yoso-element';
                    emptyDiv.style.position = 'absolute';
                    emptyDiv.style.width = `${iconSize}px`;
                    emptyDiv.style.height = `${iconSize}px`;
                    emptyDiv.style.background = '#fff';
                    emptyDiv.style.zIndex = '10';
                    emptyDiv.style.right = '10px';
                    emptyDiv.style.top = `${10 + (i - 3) * (iconSize + iconGap)}px`;
                    emptyDiv.style.transform = 'none';
                    document.getElementById('image-container').appendChild(emptyDiv);
                }
            }
        }

        // JSON 데이터 내에서 Preposition 값 찾기
        let prepositionFound = false;
        let prepositionPosition = null;

        // 모든 키를 순회하면서 part_of_speech 값이 Preposition인지 확인
        for (const key in currentPoint) {
            if (key.endsWith('part_of_speech') && currentPoint[key] === 'Preposition') {
                prepositionFound = true;
                // 해당 별의 위치 찾기
                const starKey = key.replace('part_of_speech', '');
                const positionKey = `${starKey}po_sition`;
                prepositionPosition = currentPoint[positionKey];
                break;
            }
        }

        // Preposition 값이 있으면 택배상자 표시
        if (prepositionFound && prepositionPosition) {
            const [x, y] = prepositionPosition.replace(/[()]/g, '').split(',').map(Number);
            showDeliveryBox(x, y);
        }

        // 4개의 300x200 레이어에 사진 채우기
        createPictureLayers(currentPoint, longIndex);

        // 1. 먼저 별 생성
        for (let i = 1; i <= 1004; i++) {
            const key = `S${i}`;
            const position = currentPoint[`${key} po_sition`];
            
            if (position) {
                const [x, y] = position.replace(/[()]/g, '').split(',').map(Number);
                const star = createStar(x, y, false, key, longIndex, currentPoint);
                
                if (!key.startsWith('mis_')) {
                    createSubStars(star, 5, key, currentPoint);
                }
            }
        }

        // Handle mis stars (if needed)
        for (let i = 1; i <= 10; i++) {
            const misKey = `mis_${i} po_sition`;
            if (currentPoint[misKey]) {
                const positions = currentPoint[misKey].match(/\(([\d.]+),\s*([\d.]+)\)/g);
                if (positions) {
                    positions.forEach((pos, index) => {
                        const [x, y] = pos.replace(/[()]/g, '').split(',').map(Number);
                        createStar(x, y, true, `mis_${i}_${index + 1}`, longIndex, currentPoint);
                    });
                }
            }
        }

        adjustStarPositions(); // Adjust star positions

        // 2. 비디오 재생 (S1, S2, ..., S1004 모두 지원)
        setTimeout(() => {
            // 현재 별의 인덱스를 활용해 정확한 video 키를 찾음
            const starVideoKey = `S${longIndex} video`;
            let videoKey = null;
            let videoFile = null;
            if (currentPoint[starVideoKey]) {
                videoKey = starVideoKey;
                videoFile = currentPoint[videoKey];
            }

            // S$ video가 있으면 우선적으로 처리
            if (!videoFile && currentPoint['S$ video']) {
                videoKey = 'S$ video';
                videoFile = currentPoint[videoKey];
            }

            if (videoFile) {
                const videoPath = `assets/videos/${videoFile}`;
                handleVideo(videoPath, () => {
                    showYosoElements(currentPoint);
                });
            } else {
                // 비디오가 없는 경우 바로 yoso 요소들 표시
                showYosoElements(currentPoint);
            }
        }, 500); // 0.5초 지연

        // [2] 사진 보여주기 함수 호출 전, 기존 사진 이미지 제거
        const prevPictures = document.querySelectorAll('.picture-element');
        prevPictures.forEach(el => el.remove());

        updatePhotoBoxes(currentPoint);
        updateIconBoxes(currentPoint);

        const starKeyPrefix = `S${longIndex + 1}`;
        updatePhotoBoxes(currentPoint, starKeyPrefix);
        updateIconBoxes(currentPoint, starKeyPrefix);

        updateBackgroundImage(currentPoint);
        updateMainAndSideImages(currentPoint);

        showS5Pictures(currentPoint);
    }

    function createStar(x, y, isMis, starKey, longIndex, currentPoint) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // 데이터 속성 추가
        star.dataset.starKey = starKey;
        star.dataset.longIndex = longIndex;
        
        // S$ position을 메인 위치로 가져옴
        if (starKey === 'S$') {
            const sDollarPosition = currentPoint['S$ po_sition'];
            if (sDollarPosition) {
                const [sDollarX, sDollarY] = sDollarPosition.replace(/[()]/g, '').split(',').map(Number);
                star.style.left = `${sDollarX * 100}%`;
                star.style.top = `${sDollarY * 100}%`;
            }
        } else {
            star.style.left = `${x * 100}%`;
            star.style.top = `${y * 100}%`;
        }
        
        // 모든 별에 대한 기본 스타일 설정
        star.style.pointerEvents = 'auto';
        star.style.cursor = 'pointer';
        star.style.width = 'calc(var(--container-size) * 0.025)';
        star.style.height = 'calc(var(--container-size) * 0.025)';
        star.style.transform = 'translate(-50%, -50%)'; // 중앙 정렬을 위한 transform 추가
        star.style.zIndex = '30'; // 별을 가장 위에
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
        
        // 클릭 이벤트 리스너 추가
        star.addEventListener('click', (event) => {
            event.stopPropagation();
            
            // 별의 중심 좌표를 정확히 계산
            const rect = star.getBoundingClientRect();
            const containerRect = starContainer.getBoundingClientRect();
            const centerX = rect.left - containerRect.left + rect.width / 2;
            const centerY = rect.top - containerRect.top + rect.height / 2;
            
            const spaceship = document.getElementById('spaceship');
            if (spaceship) {
                spaceship.style.left = `${x * 100}%`;
                spaceship.style.top = `${y * 100}%`;
            }
            
            createParticleEffect(centerX, centerY);
            star.classList.add('completed');
            
            point += 3;
            tryCount = point;
            total = point;
            updateScoreDisplay();
            handleStarClick(star.dataset.starKey, parseInt(star.dataset.longIndex));
        });
        
        const orbit = document.createElement('div');
        orbit.className = 'star-orbit';
        
        if (!isMis && starKey && starKey !== 'S$') {
            createSubStars(star, 5, starKey, currentPoint);
        }
        
        starContainer.appendChild(orbit);
        starContainer.appendChild(star);
        
        return star;
    }

    function createSubStars(mainStar, count, starKey, currentPoint) {
        const subStarContainer = document.getElementById('sub-star-container');
        const constellationContainer = document.getElementById('constellation-container');
        
        if (!subStarContainer || !constellationContainer) {
            console.error('Required containers not found!');
            
            // 1.5초 후 Next 버튼 자동 클릭
            setTimeout(() => {
                if (nextButton && !nextButton.disabled) {
                    console.log('S1004 클릭 후 1.5초 뒤 Next 버튼 자동 클릭');
                    nextButton.click();
                } else {
                    console.log('Next 버튼이 비활성화되어 있어 자동 클릭하지 않음');
                }
            }, 1500);

            return;
        }
        const subStarPositionKey = `${starKey} sub_star_positions`;
        const subStarPositions = currentPoint[subStarPositionKey];
        
        if (subStarPositions) {
            subStarContainer.innerHTML = '';
            constellationContainer.innerHTML = '';
            
            const positions = Array.isArray(subStarPositions) 
                ? subStarPositions 
                : subStarPositions.split(';').filter(pos => pos.trim());
                
            const imageWidth = currentImage.clientWidth;
            const imageHeight = currentImage.clientHeight;
            
            // S별의 정확한 위치 계산
            const mainPosition = currentPoint[`${starKey} po_sition`];
            let mainStarX, mainStarY;
            
            if (mainPosition) {
                const [x, y] = mainPosition.replace(/[()]/g, '').split(',').map(Number);
                mainStarX = x * imageWidth;
                mainStarY = y * imageHeight;
            } else {
                const mainStarRect = mainStar.getBoundingClientRect();
                const containerRect = starContainer.getBoundingClientRect();
                mainStarX = mainStarRect.left - containerRect.left + mainStarRect.width / 2;
                mainStarY = mainStarRect.top - containerRect.top + mainStarRect.height / 2;
            }

            let prevSubStarX = null;
            let prevSubStarY = null;
            let firstSubStarX = null;
            let firstSubStarY = null;
            
            positions.forEach((position, index) => {
                if (!position) return;
                
                const [x, y] = position.replace(/[()]/g, '').split(',').map(Number);
                const subStar = document.createElement('div');
                subStar.className = 'sub-star';
                
                const text = document.createElement('span');
                text.textContent = '🟢';
                text.style.color = 'green';
                text.style.position = 'absolute';
                text.style.left = '0.1%';
                text.style.top = '0.1%';
                text.style.transform = 'translate(-50%, -50%)';
                text.style.fontSize = 'calc(200px * var(--container-size) /1.5)';
                text.style.fontWeight = 'bold';
                
                // 서브별의 정확한 중심점 계산
                const subStarX = x * imageWidth;
                const subStarY = y * imageHeight;
                
                if (index === 0) {
                    firstSubStarX = subStarX;
                    firstSubStarY = subStarY;
                }
                
                Object.assign(subStar.style, {
                    position: 'absolute',
                    left: `${subStarX}px`,
                    top: `${subStarY}px`,
                    width: '30px',
                    height: '30px',
                    backgroundColor: 'transparent',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 0 10px green',
                    zIndex: '5'
                });
                
                subStar.appendChild(text);
                subStarContainer.appendChild(subStar);

                // S별과 서브별 연결 (서브별의 중심점에서 시작)
                if (index === 0) {
                    createConstellationLine(mainStarX, mainStarY, subStarX, subStarY, constellationContainer);
                }
                
                // 서브별들 간의 연결 (각 서브별의 중심점에서 시작)
                if (prevSubStarX !== null && prevSubStarY !== null) {
                    createConstellationLine(prevSubStarX, prevSubStarY, subStarX, subStarY, constellationContainer);
                }
                
                // 마지막 서브별 처리 (서브별의 중심점에서 시작)
                if (index === positions.length - 1) {
                    if (positions.length >= 3) {
                        createConstellationLine(subStarX, subStarY, firstSubStarX, firstSubStarY, constellationContainer);
                    }
                    if (positions.length === 2) {
                        createConstellationLine(subStarX, subStarY, mainStarX, mainStarY, constellationContainer);
                    }
                }
                
                prevSubStarX = subStarX;
                prevSubStarY = subStarY;
            });
        }
    }

    function createConstellationLine(x1, y1, x2, y2, container) {
        const line = document.createElement('div');
        line.className = 'constellation-line';
        
        // 두 점 사이의 거리 계산
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        
        // 각도 계산 (라디안)
        const angle = Math.atan2(y2 - y1, x2 - x1);
        
        // 정확한 중심점에서 시작하도록 설정
        Object.assign(line.style, {
            position: 'absolute',
            left: `${x1}px`,
            top: `${y1}px`,
            width: `${length}px`,
            height: '2px',
            backgroundColor: 'rgba(255, 255, 0, 0.5)',
            transform: `rotate(${angle}rad)`,
            transformOrigin: 'left center',
            zIndex: '1'
        });
        
        container.appendChild(line);
    }

    function createParticleEffect(x, y) {
        const particleContainer = document.getElementById('particle-container');
        for (let i = 0; i < 100; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            // 별 중심에서 좌우 50px 범위 내에서만 보이게 (상하 이동 없음)
            const offsetX = (Math.random() - 0.5) * 100; // -50 ~ +50
            const offsetY = 0;
            particle.style.left = (x + offsetX) + 'px';
            particle.style.top = (y + offsetY) + 'px';
            // 무지개 색상 적용
            const hue = Math.floor(Math.random() * 360);
            particle.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
            // 랜덤한 방향으로 파티클 이동
            const angle = Math.random() * Math.PI * 2;
            const velocity = 2 + Math.random() * 2;
            const duration = 500 + Math.random() * 1000;
            particle.style.animation = `moveParticle ${duration}ms ease-out`;
            particleContainer.appendChild(particle);
            // 파티클 크기 키움
            particle.style.width = '40px';
            particle.style.height = '40px';
            // 애니메이션 종료 후 파티클 제거
            setTimeout(() => {
                particleContainer.removeChild(particle);
            }, duration);
        }
    }

    function calculateParticleCount(starKey) {
        if (starKey.startsWith('S$')) {
            return 200;  // 'S$' 별 클릭 시 200개의 파티클 생성
        } else {
            return 3;    // 그 외의 경우 3개의 파티클 생성
        }
    }

    // 점수 변수 선언 (전역)
    let point = 0;
    let tryCount = 0;
    let total = 0;

    function updateScoreDisplay() {
        const pointBox = document.getElementById('point-box');
        const tryBox = document.getElementById('try-box');
        const totalBox = document.getElementById('total-box');
        if (pointBox) pointBox.textContent = point;
        if (tryBox) tryBox.textContent = tryCount;
        if (totalBox) totalBox.textContent = total;
    }

    function handleStarClick(starKey, longIndex) {
        if (!currentData) {
            console.error('currentData가 초기화되지 않았습니다.');
            
            // 1.5초 후 Next 버튼 자동 클릭
            setTimeout(() => {
                if (nextButton && !nextButton.disabled) {
                    console.log('S1004 클릭 후 1.5초 뒤 Next 버튼 자동 클릭');
                    nextButton.click();
                } else {
                    console.log('Next 버튼이 비활성화되어 있어 자동 클릭하지 않음');
                }
            }, 1500);

            return;
        }
        const currentPoint = currentData.points[longIndex];
        if (!currentPoint) {
            console.error(`No point found for index: ${longIndex}`);
            
            // 1.5초 후 Next 버튼 자동 클릭
            setTimeout(() => {
                if (nextButton && !nextButton.disabled) {
                    console.log('S1004 클릭 후 1.5초 뒤 Next 버튼 자동 클릭');
                    nextButton.click();
                } else {
                    console.log('Next 버튼이 비활성화되어 있어 자동 클릭하지 않음');
                }
            }, 1500);

            return;
        }
        console.log('Star clicked:', starKey);
        console.log('Current point data:', currentPoint);

        // JSON 데이터 내에서 Preposition 값 찾기
        let prepositionFound = false;
        let prepositionPosition = null;

        // 모든 키를 순회하면서 part_of_speech 값이 Preposition인지 확인
        for (const key in currentPoint) {
            if (key.endsWith('part_of_speech') && currentPoint[key] === 'Preposition') {
                prepositionFound = true;
                // 해당 별의 위치 찾기
                const starKey = key.replace('part_of_speech', '');
                const positionKey = `${starKey}po_sition`;
                prepositionPosition = currentPoint[positionKey];
                break;
            }
        }

        // Preposition 값이 있으면 택배상자 표시
        if (prepositionFound && prepositionPosition) {
            const [x, y] = prepositionPosition.replace(/[()]/g, '').split(',').map(Number);
            showDeliveryBox(x, y);
        }

        // 텍스트 표시
        const sentenceBar = document.getElementById('sentence-bar');
        if (sentenceBar) {
            const text = currentPoint[`text_${starKey}`] || '';
            if (text) {
                sentenceBar.textContent = text;
            }
        }

        // 음성 재생
        const audioText = currentPoint[`${starKey} audio_text`];
        if (audioText) {
            console.log('재생할 음성 파일:', audioText);
            // 파일 이름의 공백을 %20으로 인코딩하고 .mp3 확장자 추가
            const encodedAudioText = `${audioText.replace(/\s+/g, '%20')}.mp3`;
            const audioElement = new Audio(`assets/audio/${encodedAudioText}`);
            audioElement.onerror = function(e) {
                console.error('음성 파일 로드 실패:', e);
                console.error('시도한 경로:', `assets/audio/${encodedAudioText}`);
            };
            audioElement.onloadeddata = function() {
                console.log('음성 파일 로드 완료');
                audioElement.play().catch(error => {
                    console.error('음성 재생 실패:', error);
                });
            };
        }

        // S1004 클릭 시 Next 버튼 활성화 및 노란색 이미지 표시
        if (starKey === 'S1004') {
            tryCount = point;
            total = point;
            updateScoreDisplay();
            // try-score에 기존 point 누적
            const tryScore = document.getElementById('try-score');
            if (tryScore) {
                let currentTry = 0;
                const match = tryScore.textContent.match(/\d+/);
                if (match) currentTry = parseInt(match[0], 10);
                tryScore.textContent = 'try: ' + (currentTry + point);
            }
            // point 0점으로 초기화 및 표시
            point = 0;
            const pointScore = document.getElementById('point-score');
            if (pointScore) {
                pointScore.textContent = 'point: ' + point;
            }
            nextButton.disabled = false;
            nextButton.style.display = 'block';
            
            // 노란색 이미지 표시
            if (currentImage) {
                // 이미지 로드 이벤트 추가
                currentImage.onload = function() {
                    console.log('노란색 이미지 로드 완료');
                    currentImage.style.opacity = '1';
                };
                
                currentImage.onerror = function() {
                    console.error('노란색 이미지 로드 실패');
                };
                
                // 이미지 경로 설정 및 스타일 적용
                currentImage.src = 'assets/images/yellow.png';
                currentImage.style.transition = 'opacity 0.5s ease-in-out';
                currentImage.style.opacity = '0';
                currentImage.style.width = '100%';
                currentImage.style.height = '100%';
                currentImage.style.objectFit = 'contain';
            }

            // work_sentence 텍스트 표시
            if (sentenceBar) {
                const text = currentData.work_sentence || 'Click the next button';
                sentenceBar.textContent = text;
            }

            
            // 1.5초 후 Next 버튼 자동 클릭
            setTimeout(() => {
                if (nextButton && !nextButton.disabled) {
                    console.log('S1004 클릭 후 1.5초 뒤 Next 버튼 자동 클릭');
                    nextButton.click();
                } else {
                    console.log('Next 버튼이 비활성화되어 있어 자동 클릭하지 않음');
                }
            }, 1500);

            return;
        }
        // 다음 별 그리기 함수
        function drawNextStar() {
            const nextLongIndex = longIndex + 1;
            if (currentData.points[nextLongIndex]) {
                drawStars(currentData.points, nextLongIndex);
            }
        }

        // 별 클릭 시 바로 다음 별 그리기
        drawNextStar();

        // 별 클릭 시 점수 3점 누적 및 표시
        point += 3;
        updateScoreDisplay();
    }

    // 모든 값을 초기화하는 함수
    function resetAllValues() {
        // 모든 별 관련 요소 제거 (더 강력한 선택자 사용)
        const allStarElements = document.querySelectorAll('*');
        allStarElements.forEach(element => {
            if (element.classList && (
                element.classList.contains('star') ||
                element.classList.contains('star-orbit') ||
                element.classList.contains('ripple') ||
                element.classList.contains('star-spinning') ||
                element.classList.contains('emoji-style') ||
                element.classList.contains('mis-star') ||
                element.classList.contains('particle')
            )) {
                if (element && element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }
        });

        // 아이콘 이미지 제거
        const iconImages = document.querySelectorAll('img[src*="yoso/"]');
        iconImages.forEach(icon => {
            if (icon && icon.parentNode) {
                icon.parentNode.removeChild(icon);
            }
        });

        // delivery-box는 제거하지 않고 숨김 처리만 수행
        const deliveryBox = document.getElementById('delivery-box');
        if (deliveryBox) {
            deliveryBox.style.display = 'none';
        }

        // 2인칭 이미지 제거
        const personElement = document.getElementById('2_person');
        if (personElement && personElement.parentNode) {
            personElement.parentNode.removeChild(personElement);
        }

        // 모든 컨테이너 강제 초기화
        const containers = [
            starContainer,
            document.getElementById('particle-container'),
            document.getElementById('constellation-container'),
            document.getElementById('constellation-lines')
        ];
        
        containers.forEach(container => {
            if (container) {
                container.innerHTML = '';
                while (container.firstChild) {
                    container.removeChild(container.firstChild);
                }
            }
        });

        // 모든 인터벌과 타임아웃 제거
        const highestIntervalId = window.setInterval(() => {}, 0);
        for (let i = 1; i < highestIntervalId; i++) {
            window.clearInterval(i);
        }

        const highestTimeoutId = window.setTimeout(() => {}, 0);
        for (let i = 1; i < highestTimeoutId; i++) {
            window.clearTimeout(i);
        }

        // 이미지와 텍스트 초기화
        document.getElementById('current-image').src = '';
        document.getElementById('sentence-bar').textContent = '';
        
        // 우주선 위치 초기화
        const spaceship = document.getElementById('spaceship');
        Object.assign(spaceship.style, {
            left: '1%',
            top: '1%'
        });
        
        // Next 버튼 비활성화
        nextButton.disabled = true;
        nextButton.style.display = 'none';
        
        // 데이터 초기화
        currentData = null;
        currentStarIndex = 0;
        totalStars = 0;
        currentStarClickedIndex = 0;
    }

    // Next 버튼 클릭 이벤트 수정
    // nextButton.addEventListener('click', () => {
    //     currentId++;
    //     resetAllValues();
    //     initializeSystem();
    // });

    function handleSpecialValue(specialValue, position) {
        console.log('handleSpecialValue called with:', specialValue, position);
        const deliveryBox = document.getElementById('delivery-box');
        console.log('Delivery box element:', deliveryBox);

        if (!deliveryBox) {
            console.error('Delivery box element not found');
            
            // 1.5초 후 Next 버튼 자동 클릭
            setTimeout(() => {
                if (nextButton && !nextButton.disabled) {
                    console.log('S1004 클릭 후 1.5초 뒤 Next 버튼 자동 클릭');
                    nextButton.click();
                } else {
                    console.log('Next 버튼이 비활성화되어 있어 자동 클릭하지 않음');
                }
            }, 1500);

            return;
        }
        let x, y;
        if (typeof position === 'string') {
            try {
                // 괄호와 공백을 제거
                const cleanPosition = position.replace(/[()\s]/g, '');
                console.log('Cleaned position string:', cleanPosition);
                
                // 쉼표로 분리
                const coords = cleanPosition.split(',');
                console.log('Split coordinates:', coords);
                
                if (coords.length !== 2) {
                    throw new Error('Invalid coordinate format');
                }
                
                x = parseFloat(coords[0]);
                y = parseFloat(coords[1]);
                
                console.log('Parsed coordinates:', { x, y });
                
                if (isNaN(x) || isNaN(y)) {
                    throw new Error('Failed to parse coordinates to numbers');
                }
            } catch (error) {
                console.error('Error parsing coordinates:', error);
                console.error('Original position string:', position);
                
            // 1.5초 후 Next 버튼 자동 클릭
            setTimeout(() => {
                if (nextButton && !nextButton.disabled) {
                    console.log('S1004 클릭 후 1.5초 뒤 Next 버튼 자동 클릭');
                    nextButton.click();
                } else {
                    console.log('Next 버튼이 비활성화되어 있어 자동 클릭하지 않음');
                }
            }, 1500);

            return;
        }
        } else if (typeof position === 'object') {
            x = position.x;
            y = position.y;
            console.log('Using object coordinates:', { x, y });
        }

        const currentImage = document.getElementById('current-image');
        if (!currentImage) {
            console.error('Current image not found');
            
            // 1.5초 후 Next 버튼 자동 클릭
            setTimeout(() => {
                if (nextButton && !nextButton.disabled) {
                    console.log('S1004 클릭 후 1.5초 뒤 Next 버튼 자동 클릭');
                    nextButton.click();
                } else {
                    console.log('Next 버튼이 비활성화되어 있어 자동 클릭하지 않음');
                }
            }, 1500);

            return;
        }
        // 이미지가 로드된 후에 택배상자 표시
        if (currentImage.complete) {
            console.log('Image already loaded, dimensions:', {
                width: currentImage.width,
                height: currentImage.height
            });
            showDeliveryBox(x, y);
        } else {
            currentImage.addEventListener('load', () => {
                console.log('Image loaded, dimensions:', {
                    width: currentImage.width,
                    height: currentImage.height
                });
                showDeliveryBox(x, y);
            });
        }
    }
    
    function showDeliveryBox(x, y) {
        console.log('showDeliveryBox called with:', { x, y });
        const deliveryBox = document.getElementById('delivery-box');
        const currentImage = document.getElementById('current-image');
        
        if (!deliveryBox || !currentImage) {
            console.error('Required elements not found:', {
                deliveryBox: !!deliveryBox,
                currentImage: !!currentImage
            });
            
            // 1.5초 후 Next 버튼 자동 클릭
            setTimeout(() => {
                if (nextButton && !nextButton.disabled) {
                    console.log('S1004 클릭 후 1.5초 뒤 Next 버튼 자동 클릭');
                    nextButton.click();
                } else {
                    console.log('Next 버튼이 비활성화되어 있어 자동 클릭하지 않음');
                }
            }, 1500);

            return;
        }
        // 이미지의 실제 크기와 표시 크기 계산
        const imageRect = currentImage.getBoundingClientRect();
        const scaleX = currentImage.naturalWidth / imageRect.width;
        const scaleY = currentImage.naturalHeight / imageRect.height;

        // 좌표를 이미지의 실제 크기에 맞게 조정
        const adjustedX = x * imageRect.width;
        const adjustedY = y * imageRect.height;

        console.log('Adjusted coordinates:', { adjustedX, adjustedY });
        console.log('Image dimensions:', {
            natural: { width: currentImage.naturalWidth, height: currentImage.naturalHeight },
            displayed: { width: imageRect.width, height: imageRect.height }
        });

        // 택배상자 위치 설정
        Object.assign(deliveryBox.style, {
            position: 'absolute',
            left: `${adjustedX}px`,
            top: `${adjustedY}px`,
            display: 'block',
            transform: 'translate(-10%, -10%) scale(0.6)',
            zIndex: '5',
            cursor: 'pointer'
        });

        // 택배상자 클릭 이벤트 추가
        deliveryBox.onclick = function(event) {
            event.stopPropagation(); // 이벤트 버블링 방지
            console.log('Delivery box clicked at:', { x, y });
            
            // 클릭한 위치에서 가장 가까운 별 찾기
            const stars = document.querySelectorAll('.star');
            let closestStar = null;
            let minDistance = Infinity;

            stars.forEach(star => {
                const starRect = star.getBoundingClientRect();
                const starCenterX = starRect.left + starRect.width / 2;
                const starCenterY = starRect.top + starRect.height / 2;
                
                const distance = Math.sqrt(
                    Math.pow(starCenterX - adjustedX, 2) + 
                    Math.pow(starCenterY - adjustedY, 2)
                );

                if (distance < minDistance) {
                    minDistance = distance;
                    closestStar = star;
                }
            });

            // 가장 가까운 별이 있고 거리가 200px 이내라면 해당 별을 클릭한 것처럼 처리
            if (closestStar && minDistance <= 200) {
                const starKey = closestStar.dataset.starKey;
                const longIndex = parseInt(closestStar.dataset.longIndex);
                
                if (starKey && longIndex) {
                    handleStarClick(starKey, longIndex);
                    createParticles(50, adjustedX, adjustedY);
                }
            }
        };
    }

    function createParticles(count, x, y) {
        const particleContainer = document.getElementById('particle-container');
        
        // 다양한 색상 배열 정의
        const colors = [
            'hsl(0, 100%, 50%)',    // 빨강
            'hsl(30, 100%, 50%)',   // 주황
            'hsl(60, 100%, 50%)',   // 노랑
            'hsl(120, 100%, 50%)',  // 초록
            'hsl(180, 100%, 50%)',  // 청록
            'hsl(240, 100%, 50%)',  // 파랑
            'hsl(270, 100%, 50%)',  // 보라
            'hsl(300, 100%, 50%)',  // 자주
            'hsl(330, 100%, 50%)'   // 분홍
        ];
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // 랜덤한 초기 위치 (클릭 지점 주변)
            const randomOffsetX = (Math.random() - 0.5) * 50;
            const randomOffsetY = (Math.random() - 0.05) * 50;
            
            // 랜덤한 이동 거리 생성
            const moveX = (Math.random() * 200 - 100);
            const moveY = -(Math.random() * 200 - 100);
            
            // 랜덤한 색상 선택
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            
            // 동적 키프레임 생성
            const keyframeName = `moveParticle${i}`;
            const styleSheet = document.styleSheets[0];
            const keyframes = `
                @keyframes ${keyframeName} {
                    0% {
                        transform: translate(0, 0);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(${moveX}px, ${moveY}px);
                        opacity: 0;
                    }
                }
            `;
            styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
            
            Object.assign(particle.style, {
                left: `${x + randomOffsetX}px`,
                top: `${y + randomOffsetY}px`,
                width: '20px',
                height: '20px',
                backgroundColor: randomColor,
                animation: `${keyframeName} ${Math.random() * 1 + 0.5}s ease-out`,
                boxShadow: `0 0 20px ${randomColor}`,
                borderRadius: '50%'
            });
            
            particleContainer.appendChild(particle);
            
            // 애니메이션 종료 후 파티클 제거
            particle.addEventListener('animationend', () => {
                particle.remove();
            });
        }
    }

    // 새로운 함수 추가
    function handlePersonImage(imagePath, position) {
        console.log('handlePersonImage called with:', { imagePath, position });
        
        // 이전 person_image 요소가 있으면 제거
        const existingPersonElement = document.getElementById('person_image');
        if (existingPersonElement) {
            existingPersonElement.remove();
        }
        
        // 새로운 person_image 요소 생성
        const personElement = document.createElement('div');
        personElement.id = 'person_image';
        document.getElementById('image-container').appendChild(personElement);
        console.log('Created new person_image element');

        const currentImage = document.getElementById('current-image');
        if (!currentImage) {
            console.error('current-image element not found');
            
            // 1.5초 후 Next 버튼 자동 클릭
            setTimeout(() => {
                if (nextButton && !nextButton.disabled) {
                    console.log('S1004 클릭 후 1.5초 뒤 Next 버튼 자동 클릭');
                    nextButton.click();
                } else {
                    console.log('Next 버튼이 비활성화되어 있어 자동 클릭하지 않음');
                }
            }, 1500);

            return;
        }
        // 이미지가 로드된 후에 표시
        if (currentImage.complete) {
            showPersonImage(position);
        } else {
            currentImage.addEventListener('load', () => {
                showPersonImage(position);
            });
        }

        function showPersonImage(position) {
            let x, y;
            if (typeof position === 'string') {
                try {
                    const cleanPosition = position.replace(/[()\s]/g, '');
                    const coords = cleanPosition.split(',');
                    
                    if (coords.length === 2) {
                        x = parseFloat(coords[0]);
                        y = parseFloat(coords[1]);
                        
                        if (isNaN(x) || isNaN(y)) {
                            console.error('Invalid coordinates:', { x, y });
                            
            // 1.5초 후 Next 버튼 자동 클릭
            setTimeout(() => {
                if (nextButton && !nextButton.disabled) {
                    console.log('S1004 클릭 후 1.5초 뒤 Next 버튼 자동 클릭');
                    nextButton.click();
                } else {
                    console.log('Next 버튼이 비활성화되어 있어 자동 클릭하지 않음');
                }
            }, 1500);

            return;
        }
                    } else {
                        console.error('Invalid position format:', position);
                        
            // 1.5초 후 Next 버튼 자동 클릭
            setTimeout(() => {
                if (nextButton && !nextButton.disabled) {
                    console.log('S1004 클릭 후 1.5초 뒤 Next 버튼 자동 클릭');
                    nextButton.click();
                } else {
                    console.log('Next 버튼이 비활성화되어 있어 자동 클릭하지 않음');
                }
            }, 1500);

            return;
        }
                } catch (error) {
                    console.error('Error parsing position:', error);
                    
            // 1.5초 후 Next 버튼 자동 클릭
            setTimeout(() => {
                if (nextButton && !nextButton.disabled) {
                    console.log('S1004 클릭 후 1.5초 뒤 Next 버튼 자동 클릭');
                    nextButton.click();
                } else {
                    console.log('Next 버튼이 비활성화되어 있어 자동 클릭하지 않음');
                }
            }, 1500);

            return;
        }
            }

            const personImage = document.createElement('img');
            personImage.src = `assets/images/yoso/${encodeURIComponent(imagePath)}`;  // 아이콘 이미지는 yoso 폴더에서 로드
            personImage.style.position = 'absolute';
            personImage.style.left = `${x * 100}%`;
            personImage.style.top = `${y * 100}%`;
            personImage.style.transform = 'translate(-50%, -50%)';
            personImage.style.width = 'calc(var(--container-size) * 0.05)';
            personImage.style.height = 'calc(var(--container-size) * 0.05)';
            personImage.style.zIndex = '25';
            personImage.style.pointerEvents = 'auto';
            personImage.style.cursor = 'pointer';
            personImage.style.transition = 'all 0.3s ease';
            personImage.style.opacity = '0.8';

            personElement.appendChild(personImage);
        }
    }

    // 새로운 함수 추가
    function handlePartOfSpeechImage(imagePath, position) {
        console.log('handlePartOfSpeechImage called with position:', position);
        
        // 이전 part_of_speech_image 요소가 있으면 제거
        const existingElement = document.getElementById('part_of_speech_image');
        if (existingElement) {
            existingElement.remove();
        }
        
        // 새로운 part_of_speech_image 요소 생성
        const element = document.createElement('div');
        element.id = 'part_of_speech_image';
        document.getElementById('image-container').appendChild(element);
        console.log('Created new part_of_speech_image element');

        const currentImage = document.getElementById('current-image');
        if (!currentImage) {
            console.error('current-image element not found');
            
            // 1.5초 후 Next 버튼 자동 클릭
            setTimeout(() => {
                if (nextButton && !nextButton.disabled) {
                    console.log('S1004 클릭 후 1.5초 뒤 Next 버튼 자동 클릭');
                    nextButton.click();
                } else {
                    console.log('Next 버튼이 비활성화되어 있어 자동 클릭하지 않음');
                }
            }, 1500);

            return;
        }
        // 이미지가 로드된 후에 표시
        if (currentImage.complete) {
            showPartOfSpeechImage(position);
        } else {
            currentImage.addEventListener('load', () => {
                showPartOfSpeechImage(position);
            });
        }

        function showPartOfSpeechImage(position) {
            let x, y;
            if (typeof position === 'string') {
                try {
                    const cleanPosition = position.replace(/[()\s]/g, '');
                    const coords = cleanPosition.split(',');
                    
                    if (coords.length !== 2) {
                        throw new Error('Invalid coordinate format');
                    }
                    
                    x = parseFloat(coords[0]);
                    y = parseFloat(coords[1]);
                    
                    if (isNaN(x) || isNaN(y)) {
                        throw new Error('Failed to parse coordinates to numbers');
                    }
                } catch (error) {
                    console.error('Error parsing coordinates:', error);
                    
            // 1.5초 후 Next 버튼 자동 클릭
            setTimeout(() => {
                if (nextButton && !nextButton.disabled) {
                    console.log('S1004 클릭 후 1.5초 뒤 Next 버튼 자동 클릭');
                    nextButton.click();
                } else {
                    console.log('Next 버튼이 비활성화되어 있어 자동 클릭하지 않음');
                }
            }, 1500);

            return;
        }
            } else if (typeof position === 'object') {
                x = position.x;
                y = position.y;
            }

            // 이미지 크기에 상대적인 위치 계산
            const currentImage = document.getElementById('current-image');
            const imageWidth = currentImage.clientWidth;
            const imageHeight = currentImage.clientHeight;

            const adjustedX = x * imageWidth;
            const adjustedY = y * imageHeight;

            // 이미지 크기에 비례하여 아이콘 크기 계산
            const iconSize = Math.min(imageWidth, imageHeight) * 0.15; // 이미지 크기의 15%

            // 이미지 위치 설정
            Object.assign(element.style, {
                position: 'absolute',
                left: `${adjustedX}px`,
                top: `${adjustedY - 50 - (iconSize/1.2)}px`,
                display: 'block',
                zIndex: '5',
                cursor: 'pointer', 
                transform: 'translate(-50%, 0)',
                transformOrigin: 'center center',
                width: `${iconSize/1.2}px`,
                height: `${iconSize/1.2}px`,
                backgroundImage: `url(${imagePath})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                pointerEvents: 'auto',
                opacity: '0.95'
            });
        }
    }

    function showYosoElements(currentPoint) {
        // 예시: 콘솔에만 출력
        console.log('showYosoElements 호출됨', currentPoint);

        // part_of_speech_detail이 "name" 또는 "Who"인 경우 처리
        for (const key in currentPoint) {
            if (key.endsWith('part_of_speech_detail')) {
                const detail = currentPoint[key];
                const starKey = key.replace('part_of_speech_detail', '');
                const position = currentPoint[`${starKey}po_sition`];
                
                if (position) {
                    if (detail === 'name') {
                        handlePartOfSpeechImage('assets/images/yoso/name.png', position);
                    } else if (detail === 'Who') {
                        handlePartOfSpeechImage('assets/images/yoso/who.png', position);
                    }
                }
            }
        }

        // 실제로 yoso 관련 요소를 표시하려면 아래에 구현
        // 예: 인칭 이미지 표시
        const person = currentPoint['S1 person'] || currentPoint['S$ person'];
        const number = currentPoint['S1 number'] || currentPoint['S$ number'];
        const position = currentPoint['S1 po_sition'] || currentPoint['S$ po_sition'];

        if (person && number && position) {
            let imagePath = '';
            if (person === "1" && number === "S") {
                imagePath = 'assets/images/yoso/person1_s.png';
            } else if (person === "1" && number === "P") {
                imagePath = 'assets/images/yoso/person1_p.png';
            } else if (person === "2" && number === "S") {
                imagePath = 'assets/images/yoso/person2_s.png';
            } else if (person === "2" && number === "P") {
                imagePath = 'assets/images/yoso/person2_p.png';
            } else if (person === "3" && number === "S") {
                const gender = currentPoint['S1 gender'] || currentPoint['S$ gender'];
                if (gender === "M") {
                    imagePath = 'assets/images/yoso/person3_he.png';
                } else if (gender === "F") {
                    imagePath = 'assets/images/yoso/person3_she.png';
                } else {
                    imagePath = 'assets/images/yoso/person3_it.png';
                }
            } else if (person === "3" && number === "P") {
                imagePath = 'assets/images/yoso/person3_p.png';
            }

            if (imagePath) {
                handlePersonImage(imagePath, position);
            }
        }
    }

    function handleVideo(videoPath, position) {
        const videoContainer = document.getElementById('video-container');
        const videoPlayer = document.getElementById('video-player');
        
        if (!videoContainer || !videoPlayer) {
            console.error('비디오 요소를 찾을 수 없습니다.');
            
            // 1.5초 후 Next 버튼 자동 클릭
            setTimeout(() => {
                if (nextButton && !nextButton.disabled) {
                    console.log('S1004 클릭 후 1.5초 뒤 Next 버튼 자동 클릭');
                    nextButton.click();
                } else {
                    console.log('Next 버튼이 비활성화되어 있어 자동 클릭하지 않음');
                }
            }, 1500);

            return;
        }
        // 비디오 소스 및 무음 설정
        videoPlayer.src = videoPath;
        videoPlayer.muted = true;

        // 비디오 로드 에러 처리
        videoPlayer.onerror = function() {
            console.error('비디오 로드 실패:', videoPath);
            showErrorMessage('비디오를 불러올 수 없습니다.');
            videoContainer.style.display = 'none';
        };

        // 비디오 로드 성공 시
        videoPlayer.onloadeddata = function() {
            videoContainer.style.display = 'block';
            videoPlayer.play().catch(error => {
                console.error('비디오 재생 실패:', error);
                showErrorMessage('비디오 재생에 실패했습니다.');
            });
            addVideoSkipButton(position); // 비디오가 열릴 때마다 skip 버튼 추가
        };

        // 비디오 종료 시
        videoPlayer.onended = function() {
            videoContainer.style.display = 'none';
            if (typeof position === 'function') {
                position();
            }
        };

        // 비디오 컨테이너 클릭 이벤트
        videoContainer.onclick = function(e) {
            if (e.target === videoContainer) {
                videoContainer.style.display = 'none';
                videoPlayer.pause();
                if (typeof position === 'function') {
                    position();
                }
            }
        };
    }

    function addVideoSkipButton(position) {
        const videoContainer = document.getElementById('video-container');
        if (!videoContainer) return;

        // 기존 스킵 버튼 제거
        const existingSkipButton = document.querySelector('.video-skip-button');
        if (existingSkipButton) {
            existingSkipButton.remove();
        }

        // 새로운 스킵 버튼 생성
        const skipButton = document.createElement('button');
        skipButton.className = 'video-skip-button';
        skipButton.textContent = '►►⫸';
        skipButton.style.position = 'absolute';
        skipButton.style.top = '10px';
        skipButton.style.right = '10px';
        skipButton.style.padding = '8px 22px';
        skipButton.style.fontSize = '2rem';
        skipButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        skipButton.style.color = 'white';
        skipButton.style.border = 'none';
        skipButton.style.borderRadius = '10px';
        skipButton.style.cursor = 'pointer';
        skipButton.style.zIndex = '1001';
        skipButton.style.fontWeight = 'bold';
        skipButton.style.boxShadow = '0 4px 16px rgba(0,0,0,0.3)';

        skipButton.onclick = function() {
            const videoPlayer = document.getElementById('video-player');
            if (videoPlayer) {
                videoPlayer.pause();
                videoContainer.style.display = 'none';
                // 스킵 시에도 다음 단계로!
                if (typeof position === 'function') {
                    position();
                }
            }
        };

        videoContainer.appendChild(skipButton);
    }

    // 300x200 크기의 4개 레이어에 사진 채우기 함수
    function createPictureLayers(currentPoint, longIndex) {
        // 기존 picture-row 제거
        let pictureRow = document.getElementById('picture-row');
        if (pictureRow) pictureRow.remove();

        // picture-row 컨테이너 생성
        pictureRow = document.createElement('div');
        pictureRow.id = 'picture-row';
        pictureRow.style.position = 'absolute';
        pictureRow.style.left = '0';
        pictureRow.style.bottom = '0';
        pictureRow.style.width = '100%';
        pictureRow.style.display = 'flex';
        pictureRow.style.justifyContent = 'space-between';
        pictureRow.style.zIndex = '10';
        pictureRow.style.background = '#fff';
        pictureRow.style.borderTop = '3px solid #000';
        document.getElementById('image-container').appendChild(pictureRow);

        for (let i = 1; i <= 6; i++) {
            const iconKey = `S${longIndex + 1} icon_${i}`;
            const layerElement = document.createElement('div');
            layerElement.className = 'picture-layer';
            layerElement.style.flex = '1';
            layerElement.style.height = '120px';
            layerElement.style.border = '2px solid #000';
            layerElement.style.display = 'flex';
            layerElement.style.alignItems = 'center';
            layerElement.style.justifyContent = 'center';
            layerElement.style.fontSize = '1.5rem';
            // 값이 없으면 하늘색, 있으면 흰색
            if (currentPoint[iconKey]) {
                layerElement.style.background = '#fff';
                const iconPath = `assets/images/yoso/${currentPoint[iconKey]}`;
                const imgElement = document.createElement('img');
                imgElement.src = iconPath;
                imgElement.onerror = function() {
                    this.style.display = 'none';
                };
                imgElement.style.width = '100%';
                imgElement.style.height = '100%';
                imgElement.style.objectFit = 'contain';
                layerElement.appendChild(imgElement);
            } else {
                layerElement.style.background = '#87ceeb'; // 하늘색
            }
            pictureRow.appendChild(layerElement);
        }

        // 하단 점수 표시 (아이콘 박스 아래, 가운데 정렬)
        let scoreBar = document.getElementById('score-bar');
        if (!scoreBar) {
            scoreBar = document.createElement('div');
            scoreBar.id = 'score-bar';
            scoreBar.style.position = 'absolute';
            scoreBar.style.left = '50%';
            scoreBar.style.transform = 'translateX(-50%)';
            scoreBar.style.top = 'auto';
            scoreBar.style.bottom = '';
            scoreBar.style.marginTop = '16px';
            scoreBar.style.width = '40vw';
            scoreBar.style.minWidth = '240px';
            scoreBar.style.maxWidth = '800px';
            scoreBar.style.fontSize = '1.2rem';
            scoreBar.style.zIndex = '20';
            scoreBar.style.background = '#ffe066';
            scoreBar.style.border = '3px solid #222';
            scoreBar.style.borderRadius = '16px';
            scoreBar.style.padding = '12px 32px';
            scoreBar.style.boxShadow = '0 4px 16px rgba(0,0,0,0.18)';
            scoreBar.style.fontWeight = 'bold';
            scoreBar.style.color = '#222';
            scoreBar.style.lineHeight = '1.5';
            scoreBar.style.height = 'auto';
            scoreBar.style.overflow = 'visible';
            scoreBar.style.display = 'flex';
            scoreBar.style.alignItems = 'center';
            scoreBar.style.justifyContent = 'center';
            scoreBar.innerHTML = 'point: <span id="point-box">0</span> &nbsp; try: <span id="try-box">0</span> &nbsp; total: <span id="total-box">0</span>';
        }
        // sentence-bar 아래에 score-bar를 append
        const sentenceBar = document.getElementById('sentence-bar');
        if (sentenceBar && scoreBar.parentNode !== sentenceBar.parentNode) {
            sentenceBar.parentNode.insertBefore(scoreBar, sentenceBar.nextSibling);
        }
        updateScoreDisplay();
    }

    function setImageOrBlank(box, imgPath) {
        box.innerHTML = "";
        if (box.classList.contains('yoso-element')) {
            if (imgPath) {
                box.style.background = "#fff";
            } else {
                box.style.background = "#87ceeb"; // 하늘색
            }
        } else {
            box.style.background = "#fff";
        }
        box.style.display = "flex";
        box.style.alignItems = "center";
        box.style.justifyContent = "center";
        if (imgPath) {
            const img = document.createElement('img');
            img.src = imgPath;
            img.alt = "";
            img.style.maxWidth = "100%";
            img.style.maxHeight = "100%";
            img.style.display = "block";
            img.onerror = function() {
                if (this.parentNode) this.parentNode.removeChild(this);
            };
            box.appendChild(img);
        }
        // 값이 없으면 아무것도 append하지 않음 (하늘색만 보임)
    }

    // 사진 박스 적용
    function updatePhotoBoxes(currentPoint, starKeyPrefix) {
        const pictures = [
            currentPoint[`${starKeyPrefix} picture_1`],
            currentPoint[`${starKeyPrefix} picture_2`],
            currentPoint[`${starKeyPrefix} picture_3`],
            currentPoint[`${starKeyPrefix} picture_4`]
        ];
        const photoBoxes = document.querySelectorAll('.photo-box');
        photoBoxes.forEach((box, idx) => {
            const pic = pictures[idx];
            setImageOrBlank(box, pic ? "assets/picture/" + pic : null);
        });
    }

    // 아이콘 박스 적용 예시 (별 아래, 우상단 등)
    function setIconBox(box, iconPath) {
        setImageOrBlank(box, iconPath);
    }

    function updateIconBoxes(currentPoint, starKeyPrefix) {
        const icons = [
            currentPoint[`${starKeyPrefix} icon_1`],
            currentPoint[`${starKeyPrefix} icon_2`],
            currentPoint[`${starKeyPrefix} icon_3`],
            currentPoint[`${starKeyPrefix} icon_4`],
            currentPoint[`${starKeyPrefix} icon_5`],
            currentPoint[`${starKeyPrefix} icon_6`]
        ];
        const iconBoxes = document.querySelectorAll('.yoso-element');
        iconBoxes.forEach((box, idx) => {
            const icon = icons[idx];
            setImageOrBlank(box, icon ? "assets/images/yoso/" + icon : null);
        });
    }

    loadData();

    // 로그아웃 버튼 클릭 시
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function() {
        const name = localStorage.getItem('name') || '';
        const number = localStorage.getItem('number') || '';
        const academy = localStorage.getItem('Academy') || '';
        const className = localStorage.getItem('Class') || '';
        const grade = localStorage.getItem('Grade') || '';
        // ...기타 값

        if (!name) {
          alert('로그인 후 이용해 주세요!');
          return;
        }

        // 필드명을 서버에서 사용하는 필드명과 일치시키기 위해 수정
        const log = {
          name,
          number,
          academy,
          class: className,
          grade,
          action: '로그아웃',
          time: new Date().toISOString()
          // ...기타 값
        };

        fetch('http://localhost:4000/activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(log)
        }).then(() => {
          // 로그아웃 후 처리
          localStorage.clear();
          location.href = 'chapt.html';
        });
      });
    }

    // starContainer의 z-index를 높게 설정
    if (starContainer) {
        starContainer.style.zIndex = '1000';
    }
    // createStar 함수 내 별의 z-index도 1000 이상으로 설정

    // 텍스트 디스플레이 z-index 조정 (별 아래, 사진/아이콘 위)
    const sentenceBar = document.getElementById('sentence-bar');
    if (sentenceBar) {
        sentenceBar.style.zIndex = '20';
        sentenceBar.style.backgroundColor = 'rgba(255,255,255,0.01)'; // 본문 배경은 거의 불투명
        // 패딩 부분만 완전 투명하게 만들기 위해 before 가상요소 스타일 추가
        sentenceBar.style.position = 'relative';
        if (!document.getElementById('sentence-bar-transparent-style')) {
            const style = document.createElement('style');
            style.id = 'sentence-bar-transparent-style';
            style.innerHTML = `#sentence-bar::before {
                content: '';
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                border-radius: inherit;
                pointer-events: none;
                box-shadow: 0 0 0 9999px rgba(255,255,255,0.01);
            }`;
            document.head.appendChild(style);
        }
    }

    function updateBackgroundImage(currentPoint) {
        // S$ image 값이 있으면 해당 이미지를 배경으로 사용
        const bgImage = currentPoint["S$ image"];
        const area = document.querySelector('.center-image-area');
        if (area) {
            if (bgImage) {
                area.style.backgroundImage = `url('assets/picture/${bgImage}')`;
                area.style.backgroundSize = 'cover';
                area.style.backgroundPosition = 'center';
            } else {
                area.style.backgroundImage = '';
            }
        }
    }

    function updateMainAndSideImages(currentPoint) {
        // 중앙 큰 그림
        const mainImg = document.getElementById('main-image');
        if (mainImg) {
            const mainSrc = currentPoint["S$ image"];
            mainImg.src = mainSrc ? "assets/picture/" + mainSrc : "";
        }
        // 왼쪽 사진 박스 4개
        for (let i = 1; i <= 4; i++) {
            const sideImg = document.getElementById(`side-photo-${i}`);
            if (sideImg) {
                const pic = currentPoint[`S$ picture_${i}`];
                sideImg.src = pic ? "assets/picture/" + pic : "";
            }
        }
    }

    function updateMainImageFromS1S2(currentPoint) {
        const mainImg = document.getElementById('main-image');
        if (mainImg) {
            // S1, S2, S3, ... image 중 값이 있는 첫 번째를 사용
            let mainSrc = null;
            for (let i = 1; i <= 10; i++) { // S1~S10까지 확장 가능
                const imgVal = currentPoint[`S${i} image`];
                if (imgVal) {
                    mainSrc = imgVal;
                    break;
                }
            }
            mainImg.src = mainSrc ? "assets/images/" + mainSrc : "";
        }
        // 왼쪽 사진 박스 숨김
        for (let i = 1; i <= 4; i++) {
            const sideImg = document.getElementById(`side-photo-${i}`);
            if (sideImg) {
                sideImg.style.display = "none";
            }
        }
    }
    // drawStars 등에서 currentPoint가 바뀔 때마다 호출
    // 예시:
    // updateMainAndSideImages(currentPoint);
    // updateMainImageFromS1S2(currentPoint);

    function showS5Pictures(currentPoint) {
        const row = document.getElementById('main-picture-row');
        if (!row) return;
        row.innerHTML = '';
        for (let i = 1; i <= 4; i++) {
            const pic = currentPoint[`S5 picture_${i}`];
            const box = document.createElement('div');
            box.style.width = '120px';
            box.style.height = '120px';
            box.style.background = '#eee';
            box.style.border = '2px solid #aaa';
            box.style.borderRadius = '16px';
            box.style.overflow = 'hidden';
            box.style.display = 'flex';
            box.style.alignItems = 'center';
            box.style.justifyContent = 'center';
            if (pic) {
                const img = document.createElement('img');
                img.src = 'assets/picture/' + pic;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                box.appendChild(img);
            }
            row.appendChild(box);
        }
    }
});