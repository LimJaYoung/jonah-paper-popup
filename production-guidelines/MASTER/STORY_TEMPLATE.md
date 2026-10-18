# 새 작품 데이터와 실행 명령

00·01에서 참조한다. 아래 명령은 프로젝트 루트에서 실행한다. `<id>`는 실제 작품 ID로 바꾸며 모든 작품 명령에 대상 ID를 명시한다. CLI 기본값이 요나이므로 생략하지 않는다.

## 생성과 기록

ID는 소문자 영문·숫자·하이픈, 최대 64자다. 기존 동일 ID·비슷한 이름의 작업 폴더를 먼저 확인한다. 기존 노아 작업은 `02-noah`이고 `noah`는 빈 옛 초안이다.

`npm run story:create -- --id <id> --title "작품 제목"`

코덱스는 새 동화 생성 전에 AGENTS.md → PRODUCTION_PLAYBOOK.md 전체 → IMPLEMENTATION_STATUS.md → INDEX.md → DESIGN_ANIMATION_PROTOCOL.md의 실제 이미지 및 대상 전문 지침을 실제로 읽는다. 새 기록에는 적용 지침 버전·한국어 완성 기준과 00~14 상태표를 넣는다. 영어 자동 제작은 한국어 완성 확정 뒤에만 시작하며 최종 승인/공개 클릭 기록을 자동 채우지 않는다. 이 안내는 자연어 AI 차단이나 유료 호출 금지를 해제하지 않는다.

현재 생성기는 `story.json`, `MASTER.md`와 scenes/characters/assets/audio/subtitles/output 폴더를 만든다. `PRODUCTION_NOTES.md`, `STORY_RULES.md`도 현재 생성기에서 자동 생성한다. 기록 양식의 항목을 실제 확인 근거로 갱신한다. 공통 MASTER·ENGINE을 작품마다 복사하지 않는다.

## 언어별 데이터 관리 요구

작품 프로젝트·공통 그림·캐릭터·종이 구조·장면 순서는 복제하지 않는다. 하나의 작품 ID 아래 ko/en 대본·용어표·배역·화면 글자·음성 manifest·실측 타임라인·자막·출력·게시 설정을 구분하고 공통 장면 ID로 연결한다. 경로와 버전은 작품 기록에 명시한다. 아래 현행 스키마·CLI는 언어별 처리 지원을 보증하지 않으며 이번 지침 변경으로 언어 옵션이 추가된 것은 아니다.

## 현행 story.json 구조

| 구분 | 필드 |
|---|---|
| 작품 | schemaVersion, id, title, brand, audience, adapter |
| 출처 | source.reference, source.translation, source.reviewed |
| 진행·배역 | status, approval, voices, voiceCasting, tts |
| 출력·게시 | video, closingCredit, youtube |
| 이야기 | scenes, 필요시 openingNarration |
| scene | id, number, title, steps |
| step | id, phase, duration, motionDuration, text, speaker, animation |
| 선택 대사 | dialogue.text, dialogue.speaker |

문장 추출은 `utterances()`를 따른다. `step.dialogue`의 발화 ID는 `step.id + '-dialogue'`다. 고유 ID·화자·문장 순서를 유지한다. source.reviewed와 approval은 실제 본문·대본 확인 근거가 있을 때만 갱신한다.

**위 구조는 현행 데이터 설명이다.** 별도의 이야기 장면/펼침면 구분이나 새 필드를 적는 것만으로 플레이어가 지원하지는 않는다. 01의 대응표를 먼저 만들고, 한국어 01-D와 영어 05에서 실제 어댑터·플레이어·출력까지 연결한다. 새 작품에 요나의 물고기·도입·배역·읽기 실측·승인 해시·업로드 ID를 복사하지 않는다.

## 명령과 실제 역할

| 명령 | 실제 역할과 주의 |
|---|---|
| `npm run dev` | 로컬 서버; 기존 실행 여부·포트 확인 |
| `npm run story:prepare -- --id <id>` | 타임라인·SRT·게시 메타데이터 생성; 그림·MP3·믹스 자동 완성 아님 |
| `node scripts/import-typecast.mjs <id> '<MP3>' '<SRT>'` | 실제 음성 분리·manifest·믹스·타임라인 갱신 |
| `node scripts/studio.mjs approve --id <id> --confirm reviewed` | 검토 결과 기록; 실제 승인 없이 실행 금지 |
| `npm run video:preview -- --id <id> --seconds 12` | 도입부 짧은 검수 출력; 전체·임의 장면 검수 아님 |
| `npm run video:render -- --id <id>` | 최종 렌더; 사전 검수와 실제 지원 어댑터 필요 |
| `npm test` / `npm run check` | 단위·구문·스키마 검사; 실제 그림/음성 검수 아님 |
| `node scripts/sync-production-guide.mjs` | 지침 표시본 갱신 |

`approve` 실행을 사용자 동의로 위장하지 않는다. 현재 `scriptHash`에는 openingNarration·voiceCasting 등이 모두 포함되지는 않는다. 해시 통과만으로 전체 최신 대본·배역 검수가 끝났다고 판단하지 않는다.

## 아직 일반화되지 않은 기능

현재 웹/렌더 연결은 요나·노아 어댑터에 한정돼 있다. 새 어댑터 이름만 넣거나 요나/노아 이름으로 위장해 해결하지 않는다. 실제 새 장면과 연결을 구현·검수해야 한다.

`ENGINE/scenario/index.mjs`의 AI 초안은 화자를 요나 계열로 제한하는 코드가 남아 있다. 새로운 인물 대사를 내레이터로 바꾸어 저장하지 않는다. 새 작품에 필요한 화자를 지원하는지 먼저 확인한다. API·모델·가격·승인 범위도 실제로 확인한다. 미승인 초안을 확정 대본 위에 덮어쓰지 않는다.

`voice:generate`는 현재 Typecast 배역을 자동 생성하는 명령이 아니다. Typecast 캐스팅이 있으면 중단하도록 구현돼 있다. 음성 생성 완료와 녹음용 텍스트 준비를 구분한다.
