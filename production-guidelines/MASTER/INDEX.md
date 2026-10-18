# 제작 지침 목차

작업 시작 시 [디자인·애니메이션 공통 기준과 이미지 미리보기](DESIGN_ANIMATION_PROTOCOL.md)를 실제 이미지와 함께 확인한다.

시작은 [루트 AGENTS.md](../AGENTS.md)다. 읽기 순서와 우선순위는 해당 파일에서 관리한다.
제작 순서·각 단계의 할 일·결과물·검수 근거·통과 조건은 [PRODUCTION_PLAYBOOK.md](PRODUCTION_PLAYBOOK.md) 전체를 따른다.

| 단계 | 전문 문서 | 담당 내용 |
|---|---|---|
| 00 시작 점검 | [IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md), [STORY_TEMPLATE.md](STORY_TEMPLATE.md) | 대상·범위·원본·지침 버전 확인 |
| 01 한국어 동화 제작 및 수정 | [STORY_GUIDE.md](STORY_GUIDE.md), [STORY_TEMPLATE.md](STORY_TEMPLATE.md), [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md), [AUDIO_GUIDE.md](AUDIO_GUIDE.md), [ANIMATION_GUIDE.md](ANIMATION_GUIDE.md) | 한국어 대본·원화·실제 음성·전체 연출 준비 |
| 02 한국어 음성·장면·애니메이션 검수 | [QA_CHECKLIST.md](QA_CHECKLIST.md) | 한국어 전체 시청·청취 및 필수 검수 통과 |
| 03 한국어 최종 완성 확정 | [PRODUCTION_RECORD_TEMPLATE.md](PRODUCTION_RECORD_TEMPLATE.md) | 영어의 기준이 될 한국어 완성 버전 고정 |
| 04 영어 대본 및 음성 자동 제작 | [STORY_GUIDE.md](STORY_GUIDE.md), [AUDIO_GUIDE.md](AUDIO_GUIDE.md) | 확정 한국어 기준 영어 대본·실제 음성 확보 및 검토 |
| 05 영어 음성 길이에 맞춘 장면·자막·페이지 전환 동기화 | [ANIMATION_GUIDE.md](ANIMATION_GUIDE.md), [AUDIO_GUIDE.md](AUDIO_GUIDE.md) | 영어 실측 음성·자막·동작·전환 일치 |
| 06 한국어·영어 MP4 생성 | [LAYOUT_PARITY.md](LAYOUT_PARITY.md), [VIDEO_EXPORT.md](VIDEO_EXPORT.md) | 출력 전 구도 비교 후 ko/en 실제 파일·해시 확보 |
| 07 한국어·영어 자동 검수 및 오류 수정 | [QA_CHECKLIST.md](QA_CHECKLIST.md), [VIDEO_EXPORT.md](VIDEO_EXPORT.md) | 언어별 자동 검사·수정·재검사 통과; 사용자 승인과 분리 |
| 08 사용자 최종 영상 검수 | [QA_CHECKLIST.md](QA_CHECKLIST.md) | 사용자가 ko/en 최종 파일을 직접 보고 듣고 검수 |
| 09 한국어·영어 각각 최종 승인 | [PRODUCTION_RECORD_TEMPLATE.md](PRODUCTION_RECORD_TEMPLATE.md), [QA_CHECKLIST.md](QA_CHECKLIST.md) | 해당 언어·영상 버전·SHA256에 대한 각각의 명시적 승인 |
| 10 사용자가 [유튜브 공개 게시] 버튼 클릭 | [YOUTUBE_AUTOMATION.md](YOUTUBE_AUTOMATION.md) | 사용자가 공개 대상·언어·승인본을 확인하고 직접 클릭 |
| 11 승인된 영상만 유튜브 Public 공개 | [SERIES_GUIDE.md](SERIES_GUIDE.md), [YOUTUBE_AUTOMATION.md](YOUTUBE_AUTOMATION.md) | 승인·클릭 근거와 현재 파일이 일치할 때만 Public 변경 |
| 12 실제 공개 상태 및 URL 확인 | [YOUTUBE_AUTOMATION.md](YOUTUBE_AUTOMATION.md) | 각 영상의 실제 public 상태와 URL 확인 |
| 13 GitHub·웹 배포 상태 확인 및 제작 이력 기록 | [HANDOFF.md](HANDOFF.md), [PRODUCTION_RECORD_TEMPLATE.md](PRODUCTION_RECORD_TEMPLATE.md) | GitHub 원격 SHA·웹 배포 버전/상태·언어별 제작 이력 확인 |
| 14 최종 완료 보고 | [HANDOFF.md](HANDOFF.md) | 완료·실패·미확인을 사실대로 구분한 결과 보고 |
| 웹 요청·실행·반영 | [WEB_CONTROL](../DEPLOYMENT/WEB_CONTROL.md), [AI_EXECUTOR](../DEPLOYMENT/AI_EXECUTOR.md), PRIVATE_PREVIEW (`../DEPLOYMENT/PRIVATE_PREVIEW.md`, PC 원본·현재 웹 사본 미포함) | 요청 이력·실행 경계·GitHub·별도 배포 |

01-C의 PC 음성 요청·회신, 04~05의 맥북 영어 음성 직접 생성·웹 연결·싱크 검수와 03/05 이후의 완성본 전달은 [HANDOFF.md](HANDOFF.md)에서 구분한다. 대본·배역·비용 조건을 확인한 음성 준비가 전체 완성을 기다리지 않게 한다.

단계 개편·기존 기준 보존과 충돌 대조는 [GUIDELINE_HISTORY.md](GUIDELINE_HISTORY.md)를 따른다.

작품별 확정 사항과 진행 기록은 STORIES/<id>/에 둔다. archive/와 작품 history/는 이전 원문·폐기 결정의 보존 위치이며 현행 절차가 아니다.

송수신 이벤트·복구·자동 기록 계약은 [HANDOFF](HANDOFF.md), 영어 대본 사용자 승인 기록은 [STORY_GUIDE](STORY_GUIDE.md)에만 정의한다. 실제 실행 순서는 PLAYBOOK 5절의 언어별 경로를 따른다.

전체 문서 대조 결과와 범위·남은 확인은 [GUIDELINE_AUDIT.md](GUIDELINE_AUDIT.md)를 확인한다.
