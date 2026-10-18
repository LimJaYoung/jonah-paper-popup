# YouTube 자동화

담당은 집 서버 PC다. 맥북이 제작·승인한 한영 원본의 실제 MP4를 검수해 비공개로 업로드하고 영상 ID·언어·MP4 해시·처리 상태를 기록한다. 아래 기존 파일 검수·권한 조건을 유지하며 Public 전환은 언어별 사용자 최종 승인과 직접 공개 클릭 후에만 실행한다. 원본 담당과 변경 경계는 PRODUCTION_PLAYBOOK.md 2절을 따른다.

서버 전용 ENGINE/youtube-publisher/index.mjs. 실제 계정 인증·업로드는 아직 실행하지 않았습니다.
`--lang ko`/`--lang en`으로 자료와 게시 기록을 분리합니다. 제작실에서 언어별 제목·설명·재생목록을 입력하고 자막·타임라인 작업을 실행하면 `output/youtube-metadata.json`이 생성됩니다. 영어 경로는 STORY_GUIDE를 따릅니다. MP4·SRT·썸네일은 실제 생성 상태를 확인합니다. 재생목록 ID는 준비 정보이며 API 자동 추가는 아직 구현하지 않았습니다. 웹에는 인증 자료 존재 여부만 표시하며 실제 채널·업로드 완료로 대신하지 않습니다.

업로드는 현재 검수 fingerprint와 렌더 보고서·MP4 SHA256이 모두 일치해야 합니다. 대본이 같아도 그림·음성이 바뀐 뒤에는 이전 MP4를 게시하지 못합니다. 실제 파일의 전체 시청·청취 후에만 reviewed-private를 사용합니다. 최종 공개·예약 확인은 별도입니다.
명령의 `<id>`는 실제 작품 ID로 바꾼다. 아래 모든 `--action`에도 `--id <id>`를 함께 명시한다. 게시 단계는 PRODUCTION_PLAYBOOK의 09~12 승인·클릭·공개·확인을 따른다.

## 필수 승인·공개 순서와 현재 한계

한국어·영어 각각 실제 최종 MP4 검수와 파일 SHA256에 연결한 사용자 최종 승인·공개 승인 범위를 확보한다. 사용자가 [유튜브 공개 게시] 버튼을 직접 클릭한 기록을 확인한 뒤 승인된 해당 영상만 Public으로 전환한다. 자동 검수 통과·approve/CLI 실행·대화의 일반 제작 지시는 클릭을 대신하지 않는다. 승인 이후 영상 변경 시 07~09 재검수·재승인과 해당 새 파일의 공개 클릭 근거가 필요하다.

현재 웹에는 이 최종 승인 검증과 공개 게시 버튼의 실제 연결이 확인되지 않았다. 아래 명령은 기존 기술 기능을 보존한 설명이며 새 공개 절차를 충족했다는 뜻이 아니다. 버튼 미구현·승인/클릭 근거 없음이면 공개는 확인 대기다. 기존 예약 기능은 별도 명시 요청에서 충돌 조건을 확인하며, 예약 완료를 이번 Public 공개 완료로 기록하지 않는다.

실제 공개 뒤 언어별 영상 ID·채널·public 상태·URL·공개 재생 가능 여부와 확인 시각을 대조한다. 실패/처리 중/비공개/일부공개/접근 불가는 그대로 기록하고 완료로 바꾸지 않는다. GitHub·웹 배포·YouTube 게시 상태는 13에서 각각 기록한다.

## 기존 기술 경로

Google Cloud에서 YouTube Data API v3를 켜고 데스크톱 OAuth 클라이언트를 준비합니다. GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET는 환경변수. `npm run youtube -- --id <id> --action auth`의 URL로 인증. 127.0.0.1:5191/callback, state 검사, 5분 만료. 토큰은 .secrets/youtube.json, 파일 권한 0600. 정적 서버에서 제공하지 않습니다.
`--action channel`로 연결된 채널 ID 확인. `--action upload --channel <ID> --confirm reviewed-private`는 최신 최종 렌더 보고서를 확인하고 privacyStatus=private로 업로드합니다. 완료 영상 ID를 저장하여 중복 업로드를 막습니다.
썸네일·한국어 자막 추가가 실패하면 영상 ID는 유지하며 `--action attachments`로 재시도합니다. 업로드 세션이 중단되면 세션 정보를 보관하고 자동 신규 업로드는 차단합니다. 세션 자동 재개는 미구현이며 API 상태 조회·수동 복구가 필요합니다.
공개: `--action publish --channel <ID> --confirm publish:<VIDEO_ID>`.
예약: `--action schedule --channel <ID> --confirm publish:<VIDEO_ID> --at <미래 ISO 시각>`. 미래 시각만 허용합니다. 사용자 승인 없이 공개하지 않습니다.
미검증 API 프로젝트는 비공개 제한이 있을 수 있으며 OAuth/프로젝트 감사, 할당량, 썸네일 권한을 채널별로 확인해야 합니다. 이 도구는 성인 제작자용입니다. 어린이 대상 콘텐츠의 정확한 설정과 API 정책 검토는 남아 있습니다.
공식 출처:
- https://developers.google.com/youtube/v3/docs/videos/insert
- https://developers.google.com/youtube/v3/docs/videos
- https://developers.google.com/youtube/v3/docs/captions/insert
- https://developers.google.com/youtube/v3/docs/thumbnails/set
- https://developers.google.com/youtube/terms/developer-policies
