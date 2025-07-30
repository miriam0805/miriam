import json

with open('assets/data/data_1_1.json', encoding='utf-8') as f:
    data = json.load(f)

def reorder_icons(points):
    for idx_point, point in enumerate(points):
        # S1004별은 건너뛰기
        if any(str(k).startswith("S1004") for k in point.keys()):
            print(f"[정보] {idx_point}번째 point는 S1004별이므로 건너뜀")
            continue
        # icon_1~icon_4, icon_5, icon_6 값 추출
        icons = []
        for i in range(1, 7):
            key_name = None
            for k in list(point.keys()):
                if k.endswith(f'icon_{i}'):
                    key_name = k
                    break
            if key_name:
                icons.append((key_name, point.pop(key_name)))
        # picture_1 위치 찾기
        insert_idx = None
        for idx, k in enumerate(list(point.keys())):
            if k.endswith('picture_1'):
                insert_idx = idx
                break
        if insert_idx is None:
            print(f"[경고] {idx_point}번째 point에 picture_1이 없습니다. keys: {list(point.keys())}")
            continue
        # icon_1~icon_6 삽입
        items = list(point.items())
        new_items = items[:insert_idx]
        new_items += icons
        new_items += items[insert_idx:]
        point.clear()
        point.update(new_items)
        print(f"{idx_point}번째 point 정렬 완료")

for idx_data, d in enumerate(data):
    if 'points' in d:
        print(f"{idx_data}번째 data의 points 처리 시작")
        reorder_icons(d['points'])

with open('assets/data/data_1_1.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("모든 작업 완료")