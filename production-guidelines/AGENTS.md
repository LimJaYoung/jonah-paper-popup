# 성경동화 제작실 시작점

## 모든 세션 시작 시 필수 · 2026-10-17

컨텍스트 요약 뒤와 새 세션에서도 대상 작품 PRODUCTION_NOTES의 현재 재개 기록을 실제 파일과 대조한다. 재개 절차는 제작 지침 MASTER/HANDOFF.md, 채택된 시안 10장은 DESIGN_ANIMATION_PROTOCOL.md, 종이 접힘 효과는 ANIMATION_GUIDE.md를 따른다.

[디자인·애니메이션 기준과 이미지 미리보기](MASTER/DESIGN_ANIMATION_PROTOCOL.md)를 읽고, 문서에 연결한 승인 시안과 구현 캡처를 실제 이미지 도구로 열어 확인한다. 새 작업·수정·재개·인계 모두 적용하며 관찰한 특징 3개와 유지할 요소를 작업 기록에 남긴다. 파일명만 읽고 시각 확인을 완료로 기록하지 않는다. 아래 기존 필수 읽기도 모두 유지한다.

새 작품과 기존 작업 재개는 이 파일부터 시작한다. 환경을 먼저 확인한다. 아래 Windows 경로는 PC 실행 환경에만 적용하며 맥북/Sites에서는 현재 체크아웃과 `.openai/hosting.json`을 기준으로 작업한다. Windows Git 루트는 `성경동화-서버`, 실제 프로젝트는 그 안의 `bible-paper-studio-2026-10-11`이다. 프로젝트 명령은 이 파일이 있는 폴더에서 실행한다. 원본 종이 애니메이셔와 기존 배포는 보존한다.

## 최상위 업무 소유권

[PRODUCTION_PLAYBOOK.md](MASTER/PRODUCTION_PLAYBOOK.md) 2절의 맥북·PC 역할과 승인 경계를 먼저 적용한다. 영어 대본·영어 음성 생성·웹 제작소 연결·자막/장면 타이밍 검수는 맥북의 이 대화에서 Codex가 담당한다. PC는 완성된 영어 입력의 MP4·출력 검수·유튜브 비공개 업로드를 맡으며 영어 음성 제작을 PC에 넘기지 않는다. 상대 담당·미등록 파일 수정과 승인 없는 통합·배포를 금지한다. Public은 사용자 최종 승인과 직접 공개 클릭이 필요하다.

## 필수 읽기 순서
1. 이 AGENTS.md
2. [MASTER/PRODUCTION_PLAYBOOK.md](MASTER/PRODUCTION_PLAYBOOK.md) 전체
3. [MASTER/IMPLEMENTATION_STATUS.md](MASTER/IMPLEMENTATION_STATUS.md)
4. [MASTER/INDEX.md](MASTER/INDEX.md)
5. 대상 STORIES/<id>/PRODUCTION_NOTES.md
6. 대상 STORIES/<id>/STORY_RULES.md
7. 현재 변경 영역의 전문 지침

새 작품 제작·수정·재개 전에 코덱스는 위 필수 문서를 실제로 읽고 적용 버전과 핵심 규칙을 기록해야 한다. PRODUCTION_PLAYBOOK v3.2.5의 PLAYBOOK 5절의 언어별 순서, 한국어 완성 후 영어 자동 제작, 언어별 독립 검수/최종 승인, 사용자의 공개 게시 버튼 클릭을 준수한다. 기능 미구현·실패·미확인을 통과로 기록하지 않는다. 지침 간 충돌은 보고하고 임의로 선택하지 않는다.

새 작품에 기록이 없으면 [기록 양식](MASTER/PRODUCTION_RECORD_TEMPLATE.md)과 [생성 안내](MASTER/STORY_TEMPLATE.md)로 만든다. 이미 받은 승인과 최신 사용자 결정을 보존한다. 근거 불명 충돌만 확인 대기로 남기고 독립 작업을 계속한다.

공통 규칙은 MASTER 전문 문서, 작품 결정은 STORY_RULES, 현황·미완료·다음 한 단계는 PRODUCTION_NOTES에서 관리한다. archive/history와 과거 보고서는 필수 읽기 대상이 아니다. 하위 안내는 이 시작점만 참조하며 별도 절차를 만들지 않는다.

제작소의 제작 지침 메뉴는 이 AGENTS.md와 MASTER/PRODUCTION_PLAYBOOK.md 및 연결 전문 문서·작품 기록을 읽어 생성한 동일 원본의 표시본이다. 화면에 별도 규칙을 직접 쓰지 않는다. 변경 후 `node scripts/sync-production-guide.mjs`를 실행하고 원문·연결·표시본을 실제 제작소 메뉴에서 검증한다. 종료 기록은 매 작업 갱신한다. 문서 정리는 동화 대본·원화·음성·엔진 변경 권한이 아니다.
