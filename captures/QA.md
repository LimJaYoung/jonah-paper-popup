# 본문 씬 1 브라우저 검수 — 2026-10-09

Codex 내장 실제 브라우저, localhost:5173. 기본 데스크톱 창과 768×1024 태블릿 뷰포트 사용.

- 오프닝 100%: 기존 바다·배·큰 물고기·책 모양 확인, 이야기 시작 버튼 표시.
- 접힘 단계: 펼치기·접기·다시 재생·슬라이더 비활성 확인. 일시정지와 재개 확인.
- 페이지 넘김: 기존 종이가 사라진 다음 고정 책등 축에서 내지 한 장만 회전. 중간 각도 1.193 rad에서 정지하여 캡처(08-page-turn.jpg). 책 펼침 값은 100% 유지.
- 본문 펼침: 성문과 여러 집 층, 두 길, 작은 항구와 배, 중앙 전신 요나, 따뜻한 빛 확인. 이전 바다 오브젝트 표시 false.
- 자막 1·2·3과 말풍선, 이야기 종료 후 배 안내 확인. 자막은 캔버스 아래 별도 영역.
- 배 클릭: 걷기 시작 후 항구 도착, walk=1, 마지막 자막 확인(07-scene1-harbor.jpg).
- 이전: 역전환 후 오프닝의 이야기 시작 버튼 복원.
- 재진입: 요나 중앙 복귀, walk=0, 자막 처음부터 재생 확인.
- 다음 버튼: 같은 걷기 상태와 walk=1 도착, 같은 마지막 자막 확인.
- 본문 접기: 0% 닫힌 책 확인. 다시 재생: 책 펼침 및 이야기 진행, walk=0 확인.
- 음성 연결은 기존 구현에 없으므로 추가 음성 없이 요청 문구의 자막으로 진행.

물리 태블릿의 실제 터치 하드웨어 검수는 하지 않았으며 브라우저의 태블릿 크기와 포인터 클릭으로 확인했다.

최신 코드 재로드 후 768×1024에서 확인: 배 클릭 영역 110×100 CSS px, 장면·안내·자막 가림 없음(09-tablet-scene1.jpg). 브라우저 error/warn 로그 없음. npm run check 및 npm run build 통과.

## 전환 방식 수정

접기 자리의 `다음페이지 ←`로 시작. 6초짜리 연속 회전으로 변경했다.
브라우저에서 0.982 rad: 오른쪽 내지와 바다 종이가 함께 회전·접힘, 다음 종이 unfold=0, artOnLeaf=true 확인(10-attached-fold.jpg).
2.368 rad: 다음 왼쪽 종이가 내지 뒷면에 붙어 펼쳐짐, 본문 unfold=1.440, 기존 종이 접힘 완료 확인(11-attached-unfold.jpg).
완료 시 본문 unfolded=3, 이전 바다 표시 false, 첫 자막부터 재생. 전환 중 버튼 잠금과 일시정지·재개 확인.
기존의 빈 내지 전환 및 접기 버튼 검수 기록은 이 수정 이전 버전의 기록이다.

## 진행 버튼 통합

슬라이더 없이 ‘책 펼치기’ 클릭 → 첫 장 100% 펼침 → 동일 버튼이 ‘다음페이지’로 변경 → 클릭 후 두 번째 장으로 전환을 실제 브라우저에서 확인했다. 페이지 이동 중 진행·이전 버튼이 비활성화된다. 별도의 이야기 시작 버튼은 제거했다.

## 요나 이동 방향 수정

항구 이동 전 .65초 동안 진행 방향으로 회전한 뒤 걷는다. 이동 벡터에서 회전각을 계산한다. 앞면/뒷면 소재를 분리하여 뒷면에 얼굴이 비치지 않게 했다. 브라우저에서 자동 항구 도착 후 뒷머리와 코랄색 옷의 등 부분이 보이는 것을 확인했고, 오류·경고 로그는 없었다(15-jonah-back.jpg).

## 걷는 동안 손 내리기

기존 앞·뒷면 원화의 팔 부분을 어깨 관절로 분리했다. 몸을 돌리는 첫 .48초 동안 양팔을 내리고, .65초 이후 이동 중에는 팔을 걸음에 맞춰 작게 교차 회전한다. 항구 도착 후 팔 회전은 멈추고 내린 자세를 유지한다. 실제 브라우저에서 자동 도착과 armsDown=1을 확인했고 콘솔 오류 없음(16-jonah-arms-down.jpg).

## 자연스러운 곡선 갈림길

각진 직사각형 길 3개를 연속된 베지어 곡선 Y자 종이 윤곽으로 교체했다. 책등에서만 삼각형을 분할해 양쪽 페이지에 부착했으며 같은 종이 질감·얇은 두께를 유지했다. 요나의 보행 위치와 몸 방향은 항구로 향하는 곡선과 접선으로 계산한다. 실제 브라우저에서 성문과 부두 연결, 곡선 분기부와 콘솔 오류 없음 확인.

## Scene 2 — 2026-10-09
- Actual IAB localhost browser: opening intact; scene 1 automatic walk reaches harbor; next enters scene 2 with shared attached-paper page turn. During turn `artOnLeaf=true`, controls disabled, opening hidden for 1→2.
- Boat click and right next both enter boarding. Before boarding: shipX=1.400, boarded=false/onShip=false. Departure only after boarded=true/onShip=true; final shipX=2.850, within page edge (15.6% spread travel).
- Departed image shows Jonah + two sailors traveling with hull/sail/cabin. Sleep image shows naturally occluded Jonah and 쿨…; final foreshadow line remains and next disabled. No storm.
- Previous from scene 2 returns scene 1 arrived state without repeated walk. Re-enter scene 2 resets phase=intro, shipX=1.400, boarded=false, cabinProgress=0. Replay separately verified same reset; pause/resume tested during transition and sailing.
- Opening and scene 1 existing visual art/camera preserved. Audio absent, not claimed as played.
- Screenshots: 18-scene2-before-boarding.jpg, 19-scene2-departed.jpg, 20-scene2-sleeping.jpg.
- npm run check, npm run build, git diff --check passed.

## 2026-10-09 · 씬 3 확장
- 기존 배·돛·선실·종이 인물 생성 코드를 `vessel.js`로 공유. 씬 2 디자인과 승선 흐름 유지.
- 씬 3: 바람 → 짐 내림 → 깨우기/갑판 → 고백 → 노 젓기 → 조심스러운 하강 → 고요 → 경배 → 예고. 큰 물고기 미등장.
- 실제 localhost 브라우저에서 오프닝 → 씬 1 자동 항구 도착 → 씬 2 승선/수면 → 씬 3 진입 확인.
- 폭풍, 갑판의 요나, 노 젓기, 하강 후 가림, 고요와 마지막 다음 비활성 상태 확인. 캡처 23–27.
- 씬 3 이전으로 씬 2 복귀 시 승선 전 intro 상태 복원 확인.
- 일시정지에서 자막·배·파도·진행이 함께 정지. 렌더 루프의 dt로만 진행하며 별도 자막 타이머나 오디오 없음.
- 현재 원본 프로젝트에 음성·소리 설정 구현이 없어 새 오디오를 추가하지 않음.
- `npm run check`, `npm run build` 통과.
- 씬 3 재진입 및 다시 재생 직후 wind / 0.27초 / 폭풍 강도 0 / 배 기울기 0 / 요나 선실 높이 0.16 초기 상태 확인.
- 페이지 회전 1.610 rad에서 정지: 종이가 잎에 부착되어 접힌 상태 확인(28). 선실 문 열린 갑판 진입 7.92초(29), 하강 6.53초의 요나(30) 추가 확인.
- 마지막 예고에서 다음 비활성 확인. 브라우저 JavaScript 오류 0건.
