# Phase 6: Foundation - Context

**Gathered:** 2026-02-28
**Status:** Ready for planning

<domain>
## Phase Boundary

/lab2 라우트를 Next.js App Router에서 한/영 양 로케일로 설정하고, Three.js/R3F WebGL 인프라를 클라이언트 전용으로 구축한다. 로딩 화면이 에셋 진행률을 표시하고, 뷰포트 게이트가 소형 기기를 차단하며, /lab2 ↔ 메인 사이트 간 WebGL 컨텍스트 누수 없이 안정적으로 동작한다.

Phase 7 이후의 스크롤, 3D 씬, 콘텐츠 오버레이, 이펙트는 이 Phase의 범위가 아니다.

</domain>

<decisions>
## Implementation Decisions

### 로딩 화면
- 미니말 퍼센트 숫자만 크게 표시 — 다른 텍스트(이름, 서브텍스트) 없음
- 로딩 완료 후 페이드 아웃으로 씬 전환
- 로딩 중 배경 분위기는 Claude 재량 (전체 씬 톤에 맞춰 결정)

### 뷰포트 게이트
- 1024px 미만에서 게이트 표시, 1024px 이상은 태블릿 가로 모드 포함 모두 허용
- 게이트에 메인 포트폴리오로 돌아가는 링크 제공
- 실시간 반응 — 데스크톱에서 창 크기를 줄이면 즉시 게이트, 다시 늘리면 씬 복귀
- 게이트 디자인(텍스트만 vs 프리뷰 포함)은 Claude 재량

### /lab vs /lab2 관계
- /lab(기존)과 /lab2(새로운) 모두 유지 — 별도 경험으로 공존
- 메인 사이트 네비게이션에 /lab2 진입 링크 추가
- /lab2 내에서 메인 사이트로 돌아가는 고정 링크 항상 표시 (화면 코너)
- 네비게이션 레이블 이름은 Claude 재량 (기존 /lab과 구분되도록)

### Claude's Discretion
- 로딩 화면 배경색/분위기 (전체 경험 톤에 맞춤)
- 뷰포트 게이트 디자인 스타일
- 네비게이션 레이블 네이밍 (/lab2의 표시 이름)
- 초기 빈 씬의 배경색/그라디언트
- 빈 씬에 플레이스홀더 요소 포함 여부
- 캔버스 비율 (풀스크린 vs 영역 제한)
- 다크/라이트 모드 지원 전략

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-foundation*
*Context gathered: 2026-02-28*
