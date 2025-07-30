import React, { useState, useEffect, useRef } from 'react';
import './StarWarGame.css';

const StarWarGame = () => {
  const [currentPoints, setCurrentPoints] = useState(0);
  const [currentTry, setCurrentTry] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentTotal, setCurrentTotal] = useState(0);
  const [currentStar, setCurrentStar] = useState(1);
  const [starElements, setStarElements] = useState({});
  const [data, setData] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [maxStar, setMaxStar] = useState(0);
  const [points, setPoints] = useState([]);
  
  const mainImageRef = useRef(null);
  const mainImageAreaRef = useRef(null);
  const mainTextRef = useRef(null);
  const iconRowRef = useRef(null);
  const pictureRowRef = useRef(null);
  const svgRef = useRef(null);

  // localStorage에서 데이터 복원
  useEffect(() => {
    const savedPoints = parseInt(localStorage.getItem('currentPoints')) || 0;
    const savedTry = parseInt(localStorage.getItem('currentTry')) || 0;
    const savedLevel = parseInt(localStorage.getItem('currentLevel')) || 0;
    const savedTotal = parseInt(localStorage.getItem('currentTotal')) || 0;

    setCurrentPoints(savedPoints);
    setCurrentTry(savedTry);
    setCurrentLevel(savedLevel);
    setCurrentTotal(savedTotal);
  }, []);

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/assets/data/data_1_1.json');
        const jsonData = await response.json();
        setData(jsonData);
        setCurrentIdx(0);
        
        const currentPoints = jsonData[0]?.points || [];
        setPoints(currentPoints);
        
        let maxStarCount = 0;
        for (let i = 0; i < currentPoints.length; i++) {
          if (Object.keys(currentPoints[i]).some(k => /^S\d+ po_sition$/.test(k) && k !== 'S1004 po_sition')) {
            maxStarCount++;
          }
        }
        setMaxStar(maxStarCount);
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      }
    };

    loadData();
  }, []);

  // 점수 업데이트 함수
  const updateScoreDisplay = () => {
    localStorage.setItem('currentPoints', currentPoints);
    localStorage.setItem('currentTry', currentTry);
    localStorage.setItem('currentLevel', currentLevel);
    localStorage.setItem('currentTotal', currentTotal);
  };

  // 포인트 추가 함수
  const addPoints = () => {
    const newPoints = currentPoints + 3;
    setCurrentPoints(newPoints);
    updateScoreDisplay();
    window.location.href = '/chapt';
  };

  // 별 표시 함수
  const showStar = (n) => {
    if (n > maxStar) {
      showS1004Star();
      return;
    }

    const point = points[n - 1];
    const posKey = `S${n} po_sition`;
    const pos = point?.[posKey];

    if (pos) {
      const match = pos.match(/\(([^,]+),\s*([^)]+)\)/);
      if (match) {
        const x = parseFloat(match[1]);
        const y = parseFloat(match[2]);
        
        const starElement = {
          element: document.createElement('div'),
          x,
          y
        };

        starElement.element.className = 'star-point';
        starElement.element.textContent = '★';
        starElement.element.style.left = (x * 100) + '%';
        starElement.element.style.top = (y * 100) + '%';
        starElement.element.dataset.starIndex = n;
        starElement.element.style.pointerEvents = 'auto';
        starElement.element.style.cursor = 'pointer';

        // 클릭 이벤트 추가
        starElement.element.addEventListener('click', (e) => {
          e.stopPropagation();
          
          const newPoints = currentPoints + 3;
          setCurrentPoints(newPoints);
          updateScoreDisplay();
          
          const audioText = point?.[`S${n} audio_text`] || point?.['audio_text'];
          if (audioText) {
            try {
              const audio = new Audio('/assets/audio/' + audioText + '.mp3');
              
              audio.addEventListener('error', () => {
                console.log('오디오 로딩 실패');
                if (mainTextRef.current) {
                  mainTextRef.current.style.display = 'block';
                }
                setTimeout(() => {
                  setCurrentStar(n + 1);
                  showStar(n + 1);
                }, 800);
              });
              
              audio.play().catch(() => {
                console.log('오디오 재생 실패');
                if (mainTextRef.current) {
                  mainTextRef.current.style.display = 'block';
                }
                setTimeout(() => {
                  setCurrentStar(n + 1);
                  showStar(n + 1);
                }, 800);
              });
              
              audio.onended = () => {
                if (mainTextRef.current) {
                  mainTextRef.current.style.display = 'block';
                }
                setTimeout(() => {
                  setCurrentStar(n + 1);
                  showStar(n + 1);
                }, 800);
              };
            } catch (error) {
              console.log('오디오 생성 실패:', error);
              if (mainTextRef.current) {
                mainTextRef.current.style.display = 'block';
              }
              setTimeout(() => {
                setCurrentStar(n + 1);
                showStar(n + 1);
              }, 800);
            }
          } else {
            if (mainTextRef.current) {
              mainTextRef.current.style.display = 'block';
            }
            setTimeout(() => {
              setCurrentStar(n + 1);
              showStar(n + 1);
            }, 800);
          }
          
          starElement.element.style.pointerEvents = 'none';
          starElement.element.style.color = '#aaa';
        });

        if (mainImageAreaRef.current) {
          mainImageAreaRef.current.appendChild(starElement.element);
        }
        
        setStarElements(prev => ({ ...prev, [n]: starElement }));
      }
    }

    // 이미지 설정
    const imgFile = point?.[`S${n} image`] || point?.[`S${n} picture_1`];
    if (mainImageRef.current && imgFile) {
      mainImageRef.current.src = "/assets/images/" + imgFile;
    }

    // 텍스트 설정
    const text = point?.[`text_S${n}`];
    if (mainTextRef.current && text && text !== 'null' && text !== null) {
      mainTextRef.current.textContent = text;
      mainTextRef.current.style.display = 'none';
    } else if (mainTextRef.current) {
      mainTextRef.current.textContent = '';
      mainTextRef.current.style.display = 'none';
    }

    // 아이콘 표시
    showIconsForPoint(point, n);
    // 사진 표시
    showPicturesForPoint(point, n);
    // sub_star와 선 표시
    drawSubStarsAndLines(n);
  };

  // S1004 별 표시 함수
  const showS1004Star = () => {
    if (mainImageAreaRef.current?.querySelector('.blackhole-star')) return;
    
    const s1004Point = points.find(p => p['S1004 po_sition']);
    if (!s1004Point) return;
    
    const pos = s1004Point['S1004 po_sition'];
    const match = pos.match(/\(([^,]+),\s*([^)]+)\)/);
    
    if (match) {
      const x = parseFloat(match[1]);
      const y = parseFloat(match[2]);
      
      const blackhole = document.createElement('div');
      blackhole.className = 'blackhole-star';
      blackhole.style.left = (x * 100) + '%';
      blackhole.style.top = (y * 100) + '%';
      
      blackhole.addEventListener('click', () => {
        const newLevel = currentLevel + 1;
        setCurrentLevel(newLevel);
        updateScoreDisplay();
        
        // 작업문장과 NEXT 버튼 표시
        const centerSentence = document.getElementById('center-sentence');
        if (centerSentence) {
          centerSentence.innerHTML = '';
          
          const sentence = document.createElement('div');
          sentence.textContent = data[currentIdx]?.work_sentence || '';
          sentence.style.marginBottom = '32px';
          sentence.style.fontSize = '2.2rem';
          
          const nextBtn = document.createElement('button');
          nextBtn.textContent = 'NEXT';
          nextBtn.style.fontSize = '2rem';
          nextBtn.style.padding = '16px 40px';
          nextBtn.style.background = '#222';
          nextBtn.style.color = '#fff';
          nextBtn.style.border = 'none';
          nextBtn.style.borderRadius = '12px';
          nextBtn.style.cursor = 'pointer';
          
          nextBtn.onclick = () => {
            const newTry = currentTry + currentPoints;
            setCurrentTry(newTry);
            setCurrentPoints(0);
            updateScoreDisplay();
            
            // 다음 아이디로 이동
            const nextId = data[currentIdx + 1]?.id || data[0]?.id;
            window.location.href = `/main?id=${nextId}`;
          };
          
          centerSentence.appendChild(sentence);
          centerSentence.appendChild(nextBtn);
          centerSentence.style.display = 'block';
        }
      });
      
      if (mainImageAreaRef.current) {
        mainImageAreaRef.current.appendChild(blackhole);
      }
    }
  };

  // 아이콘 표시 함수
  const showIconsForPoint = (point, n) => {
    if (!iconRowRef.current) return;
    
    iconRowRef.current.innerHTML = '';
    
    let iconCount = 0;
    for (let i = 1; i <= 6; i++) {
      const iconFile = point[`S${n} icon_${i}`];
      if (iconFile) {
        iconCount++;
      }
    }
    
    if (iconCount === 0) {
      iconRowRef.current.style.display = 'none';
    } else {
      iconRowRef.current.style.display = 'flex';
    }
    
    for (let i = 1; i <= 6; i++) {
      const iconFile = point[`S${n} icon_${i}`];
      if (iconFile) {
        const img = document.createElement('img');
        img.src = "/assets/images/yoso/" + iconFile;
        img.alt = `아이콘${i}`;
        img.style.width = `calc(${100/iconCount}% - 8px)`;
        img.style.height = "138.24px";
        img.style.maxHeight = "138.24px";
        img.style.objectFit = "contain";
        img.style.flex = `1 1 ${100/iconCount}%`;
        iconRowRef.current.appendChild(img);
      }
    }
  };

  // 사진 표시 함수
  const showPicturesForPoint = (point, n) => {
    if (!pictureRowRef.current) return;
    
    pictureRowRef.current.innerHTML = '';
    
    let hasPictures = false;
    for (let i = 1; i <= 4; i++) {
      const picFile = point[`S${n} picture_${i}`];
      if (picFile) {
        hasPictures = true;
        const photoCell = document.createElement('div');
        photoCell.className = 'photo-cell';
        photoCell.style.cssText = `flex:1; ${i < 4 ? 'border-right:2px solid #000;' : ''} height:100%; display:flex; align-items:center; justify-content:center;`;
        
        const img = document.createElement('img');
        img.src = "/assets/picture/" + picFile;
        img.alt = `사진${i}`;
        img.style.cssText = "width:100%;height:100%;object-fit:cover;";
        
        photoCell.appendChild(img);
        pictureRowRef.current.appendChild(photoCell);
      }
    }
    
    pictureRowRef.current.style.display = hasPictures ? 'flex' : 'none';
  };

  // sub_star와 선 그리기 함수
  const drawSubStarsAndLines = (n) => {
    const point = points[n - 1];
    const posKey = `S${n} po_sition`;
    const subKey = `S${n} sub_star_positions`;
    const mainPos = point?.[posKey];
    const subStars = point?.[subKey];
    
    if (!mainPos || !subStars || !svgRef.current) {
      if (svgRef.current) svgRef.current.innerHTML = '';
      return;
    }
    
    svgRef.current.innerHTML = "";
    
    const areaW = mainImageAreaRef.current?.offsetWidth || 0;
    const areaH = mainImageAreaRef.current?.offsetHeight || 0;
    
    const match = mainPos.match(/\(([^,]+),\s*([^)]+)\)/);
    if (!match) return;
    
    const x1 = parseFloat(match[1]);
    const y1 = parseFloat(match[2]);
    const px1 = x1 * areaW;
    const py1 = y1 * areaH;
    
    subStars.forEach(posStr => {
      const m = posStr.match(/\(([^,]+),\s*([^)]+)\)/);
      if (!m) return;
      
      const x2 = parseFloat(m[1]);
      const y2 = parseFloat(m[2]);
      const px2 = x2 * areaW;
      const py2 = y2 * areaH;
      
      // 선 추가
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', px1);
      line.setAttribute('y1', py1);
      line.setAttribute('x2', px2);
      line.setAttribute('y2', py2);
      line.setAttribute('stroke', 'green');
      line.setAttribute('stroke-width', '3');
      svgRef.current.appendChild(line);
      
      // sub_star(초록색 원) 추가
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', px2);
      circle.setAttribute('cy', py2);
      circle.setAttribute('r', 10.5);
      circle.setAttribute('fill', 'green');
      circle.setAttribute('stroke', '#fff');
      circle.setAttribute('stroke-width', '3');
      svgRef.current.appendChild(circle);
    });
  };

  // 첫 번째 별 표시
  useEffect(() => {
    if (points.length > 0) {
      showStar(1);
    }
  }, [points]);

  // 이미지 로드 후 처리
  useEffect(() => {
    if (mainImageRef.current) {
      mainImageRef.current.onload = () => {
        const area = mainImageAreaRef.current;
        if (area && mainImageRef.current) {
          const ratio = mainImageRef.current.naturalWidth / mainImageRef.current.naturalHeight;
          area.style.height = (area.offsetWidth / ratio) + 'px';
        }
      };
    }
  }, []);

  return (
    <div className="star-war-game">
      <div id="main-frame">
        <div id="top-row">
          <div id="score-box">
            <div>point: {currentPoints}, try: {currentTry}</div>
            <div>level: {currentLevel}, total: {currentTotal}</div>
          </div>
          <div id="right-box">
            <div>Miriam</div>
          </div>
          <div id="index-box" onClick={addPoints}>index</div>
        </div>
        
        <div id="main-image-area" ref={mainImageAreaRef}>
          <svg id="star-lines" ref={svgRef}></svg>
          <img 
            id="main-image" 
            ref={mainImageRef}
            src="/assets/images/1.png" 
            alt="메인 이미지" 
          />
        </div>
        
        <div id="bottom-row">
          <div className="icon-cell">
            <img src="/assets/images/yoso/icon1.png" alt="" />
          </div>
          <div className="icon-cell">
            <img src="/assets/images/yoso/icon2.png" alt="" />
          </div>
          <div className="icon-cell">
            <img src="/assets/images/yoso/icon3.png" alt="" />
          </div>
          <div className="icon-cell">
            <img src="/assets/images/yoso/icon4.png" alt="" />
          </div>
          <div className="icon-cell">
            <img src="/assets/images/yoso/icon5.png" alt="" />
          </div>
          <div className="icon-cell">
            <img src="/assets/images/yoso/icon6.png" alt="" />
          </div>
        </div>
        
        <div id="icon-row" ref={iconRowRef}></div>
        <div id="picture-row" ref={pictureRowRef}></div>
        <div id="main-bottom-text" ref={mainTextRef}>텍스트 .</div>
      </div>
      
      <div id="center-sentence"></div>
    </div>
  );
};

export default StarWarGame; 