import json

with open('assets/data/data_1_3.json', encoding='utf-8') as f:
    data = json.load(f)

def reorder_icons(points):
    for idx_point, point in enumerate(points):
        # icon_5, icon_6 값 추출
        icon5 = None
        icon6 = None
        for k in list(point.keys()):
            if k.endswith('icon_5'):
                icon5 = (k, point.pop(k))
            if k.endswith('icon_6'):
                icon6 = (k, point.pop(k))
        # picture_1 위치 찾기
        insert_idx = None
        for idx, k in enumerate(list(point.keys())):
            if k.endswith('picture_1'):
                insert_idx = idx
                break
        if insert_idx is None:
            print(f"[경고] {idx_point}번째 point에 picture_1이 없습니다. keys: {list(point.keys())}")
            continue
        # icon_5, icon_6 삽입
        items = list(point.items())
        new_items = items[:insert_idx]
        if icon5: new_items.append(icon5)
        if icon6: new_items.append(icon6)
        new_items += items[insert_idx:]
        point.clear()
        point.update(new_items)
        print(f"{idx_point}번째 point 정렬 완료")

for idx_data, d in enumerate(data):
    if 'points' in d:
        print(f"{idx_data}번째 data의 points 처리 시작")
        reorder_icons(d['points'])

with open('assets/data/data_1_3.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("모든 작업 완료")