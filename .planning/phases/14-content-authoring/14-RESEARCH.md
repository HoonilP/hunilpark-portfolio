# Phase 14: Content Authoring - Research

**Researched:** 2026-03-02
**Domain:** i18n JSON content authoring — bilingual engineering challenge narratives for 6 portfolio projects
**Confidence:** HIGH

## Summary

Phase 14 is a pure content authoring phase. The infrastructure is fully complete: `ChallengeSection.tsx`, `CodeBlock.tsx`, `ProjectContent.tsx`, and the `challenges.challenge1~N` i18n schema are all wired and rendering. All 6 projects currently have a single stub challenge in both `ko.json` and `en.json` with placeholder text reading "Phase 14에서 실제 콘텐츠로 교체 예정." This phase replaces those stubs with real, deeply researched engineering narrative content.

The work is entirely JSON editing in two files: `/Users/hipark/dev/portfolio/messages/ko.json` and `/Users/hipark/dev/portfolio/messages/en.json`. No component changes are needed. The schema is fixed: each project gets a `challenges` object with `challenge1`, `challenge2`, (optionally `challenge3`), each with fields `title`, `context`, `alternatives`, `decision`, `implementation`, `outcome`, and optionally `code` + `codeLang`. All source facts MUST come from the verified reference documents: `자료/박훈일 이력서.pdf` and `자료/박훈일 포트폴리오.pdf` and the ArtWar planning document `자료/Moltiverse/ArtWar_기획서_Moltiverse_Hackathon (1).pdf`. No invented or fabricated content is permitted (CONT-06).

The dominant risk is content quality — challenges must each include at least one explicitly rejected alternative (with rejection rationale), and every outcome field must contain quantitative figures (before/after numbers, ratios, time savings, or measurable results). The second risk is bilingual key parity: every key present in `ko.json` must exist identically in `en.json`.

**Primary recommendation:** Author content project-by-project, writing ko + en for each project in a single atomic edit, using a fixed 5-field narrative template per challenge. Validate key parity with a simple JSON key comparison after each project. Ship all 6 projects in 2-3 plans grouped by thematic similarity.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CONT-01 | 6개 프로젝트 각각 2-3개의 핵심 엔지니어링 챌린지가 깊이 있게 작성된다 | Each project has 1 stub challenge; replace with 2-3 real challenges drawn from resume/portfolio PDF facts. Schema supports up to `challenge3`. `ProjectContent.tsx` checks up to `challenge3` via `CHALLENGE_KEYS` array. |
| CONT-02 | 모든 챌린지의 outcome 필드에 정량적 수치(before/after, 측정값, 비율 등)가 포함된다 | Verified quantitative facts from source documents: DY CMS (~90% accounting automation), DY spreadsheet (월말 결산 수십 시간 → 수 시간), EMV (운영비 9.5억 원 절감, 승객 만족도 77% 향상), Joshua (SI 프로젝트 정상 납품). Each outcome field must cite at least one number. |
| CONT-03 | 각 프로젝트의 기술 스택 선택에 대한 이유(왜 이 기술을 선택했는가)가 포함된다 | Tech choice rationale should appear in `decision` field of at least one challenge per project — e.g. "왜 Electron+Angular인가", "왜 VanillaJS인가", "왜 NestJS+Next.js 분리형인가", "왜 OpenClaw인가" |
| CONT-04 | AI 관련 프로젝트(Joshua, Retail Analysis, Art War)에서 AI 엔지니어링 챌린지가 포함된다 | Joshua: KoGPT-2 fine-tuning, prompt engineering, inference pipeline. Retail Analysis: YOLO model tuning, on-premise CCTV pipeline. Art War: LLM agent orchestration with Kimi/Gemini Flash, multi-agent state machine. All three confirmed in source documents. |
| CONT-05 | 한국어와 영어 콘텐츠가 동시에 업데이트되고, 양언어 키 일치가 검증된다 | Edit ko.json and en.json in the same JSON edit per project. Validate with `python3 -c "import json; ko=json.load(open('messages/ko.json')); en=json.load(open('messages/en.json')); ..."` key comparison script. |
| CONT-06 | 콘텐츠가 이력서/포트폴리오 PDF 데이터 기반이며 임의 내용이 생성되지 않는다 | All facts must trace to: 이력서 PDF, 포트폴리오 PDF (slides), ArtWar 기획서 PDF, or existing ko.json overview/retrospective text. No invented metrics. |
</phase_requirements>

## Standard Stack

### Core
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| ko.json / en.json | next-intl v4 format | i18n message files | Already the project's message store; no other mechanism |
| Python 3 (for validation) | system | JSON key parity check | Already used in Phase 12 for safe JSON manipulation |

### Supporting
| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| `next build` | Next.js 16 | Build validation after edits | After each project's content is written to catch syntax errors |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Direct JSON editing | Separate markdown files compiled to JSON | Extra tooling, no benefit — schema is already defined |
| Single plan for all 6 projects | 2-3 plans grouped by project | Smaller atomic commits reduce risk of large JSON syntax errors |

**No new packages needed.** This phase is 100% JSON content authoring.

## Architecture Patterns

### Current i18n Schema (already in place)

```json
"ProjectDetail": {
  "joshua": {
    "challenges": {
      "title": "엔지니어링 챌린지",
      "challenge1": {
        "title": "챌린지 제목",
        "context": "문제 정의 — 왜 이 챌린지가 중요했는가",
        "alternatives": "시도한 접근법 — 어떤 방법들을 시도/고려했는가, 왜 기각했는가",
        "decision": "비교/결정 — 왜 최종 방법을 선택했는가 (기술 스택 선택 근거 포함)",
        "implementation": "구현 — 어떻게 구현했는가",
        "outcome": "성과 — 정량적 결과 (before/after, 측정값, 비율 필수)"
      },
      "challenge2": { ... },
      "challenge3": { ... }   // optional — omit if only 2 challenges
    }
  }
}
```

**CRITICAL: `code` and `codeLang` are optional fields.** `ChallengeSection.tsx` checks `t.has(`${prefix}.code`)` before rendering `CodeBlock`. Joshua's stub already has example `code` and `codeLang` fields — these can be used for challenges where a code snippet genuinely illustrates the engineering decision.

### Pattern 1: Narrative Template per Challenge

**Five-field structure that satisfies all requirements:**

```
title:          One concise challenge title (e.g., "Electron IPC 아키텍처 설계")
context:        2-4 sentences — what the problem was and why it mattered technically
alternatives:   2-4 sentences — what alternatives were considered and explicitly WHY each was rejected
decision:       2-3 sentences — why the chosen approach was selected (addresses CONT-03 tech stack rationale)
implementation: 2-4 sentences — how it was implemented concretely
outcome:        1-3 sentences — MUST include quantitative figure (number, %, before/after time, reduction ratio)
```

### Pattern 2: Bilingual Authoring Order

**Write ko first, en immediately after, for the same project.** Never write all Korean first then all English — that risks key drift. Edit pattern:

1. Open ko.json — write full challenge content for project X
2. Immediately write matching en.json content for project X
3. Run key parity check
4. Proceed to next project

### Pattern 3: Key Parity Validation

```bash
python3 -c "
import json

with open('messages/ko.json') as f: ko = json.load(f)
with open('messages/en.json') as f: en = json.load(f)

projects = ['joshua','dyCms','retailAnalysis','scholarlyChain','dinoGo','artWar']
for p in projects:
    ko_keys = set(ko['ProjectDetail'][p]['challenges'].keys())
    en_keys = set(en['ProjectDetail'][p]['challenges'].keys())
    if ko_keys != en_keys:
        print(f'MISMATCH {p}: ko={ko_keys - en_keys} en={en_keys - ko_keys}')
    else:
        print(f'OK {p}: {ko_keys}')
"
```

Run from `/Users/hipark/dev/portfolio/`.

### Anti-Patterns to Avoid

- **Fabricating quantitative outcomes:** If no real number exists in source documents for a project, do not invent one. Instead, use relative language that is still specific (e.g., "기존 수작업 대비 반복 업무 제거" or acknowledge what was measured). However, DY CMS, Joshua, and Retail Analysis all have verifiable numbers.
- **Missing the rejected-alternative requirement:** Every `alternatives` field MUST name at least one approach that was considered and explain why it was rejected. "VanillaJS 대신 React를 고려했으나 번들 사이즈와 외부 의존성 최소화를 위해 기각했다" is the pattern.
- **Partial bilingual update:** Never commit ko.json changes without simultaneously updating en.json with matching keys.
- **JSON syntax errors:** Large JSON edits risk syntax errors. Use `python3 -c "import json; json.load(open('messages/ko.json'))"` to validate after each edit.
- **Challenge3 key mismatch:** If a project has `challenge3` in ko.json but not en.json (or vice versa), `t.has()` will silently skip it on one locale. Always match exactly.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Key parity validation | Custom diff tool | Python one-liner above | Already validated pattern from Phase 12; sufficient for this use case |
| JSON editing | Script-based content generator | Direct JSON editing | Content requires human judgment on facts; no automation appropriate |

**Key insight:** This phase is entirely about editorial quality, not engineering. The infrastructure is done. The constraint is CONT-06: content must be factually grounded in the source PDFs — this makes automation inappropriate and human authoring mandatory.

## Common Pitfalls

### Pitfall 1: Outcome Field Without Quantitative Figure
**What goes wrong:** CONT-02 fails — a reviewer sees "성능이 향상되었다" with no number.
**Why it happens:** Easy to describe the approach without measuring the result.
**How to avoid:** Before writing any `outcome` field, identify the specific number from source documents first. Verified numbers:
- DY CMS: "약 90% 회계 자동화 달성" (both resume and portfolio PDF confirmed)
- DY CMS: "월말 결산 시간을 수십 시간에서 수 시간으로 단축"
- DY Spreadsheet (1st period): "수기 입력 오류 가능성과 반복 업무를 감소"
- Joshua: "SI 프로젝트 정상 납품 완료", "Windows/macOS 크로스플랫폼 출시"
- EMV Feasibility Study: "운영비 9.5억 원 절감", "승객 만족도 77% 향상", "탑승률 10~12% 증가", "총비용 73% 절감"
- ScholarlyChain: "15개 이상 페이지, 30개 이상 재사용 컴포넌트"
- ArtWar: "8강→4강→결승 토너먼트 완전 자율 운영"
**Warning signs:** An `outcome` field containing no digits or percentages.

### Pitfall 2: Alternative Not Explicitly Rejected
**What goes wrong:** CONT-01 fails — challenge mentions alternatives but doesn't say WHY they were rejected.
**Why it happens:** Temptation to write "A와 B를 고려했다" without explaining the rejection.
**How to avoid:** The `alternatives` field must always answer: "왜 A를 쓰지 않았는가?" Example pattern: "[Alternative X]를 검토했으나, [specific reason — e.g., 번들 크기, 런타임 의존성, 팀 숙련도, 데스크톱 환경 제약]으로 인해 기각했다."
**Warning signs:** `alternatives` field that reads as a feature comparison without a verdict.

### Pitfall 3: AI Challenge Missing for AI Projects
**What goes wrong:** CONT-04 fails — Joshua's challenges focus only on Electron/Angular, not KoGPT-2.
**Why it happens:** Frontend developer naturally focuses on UI/framework challenges.
**How to avoid:** Each AI project (Joshua, Retail Analysis, Art War) must have at least one challenge that addresses the AI/ML engineering dimension specifically. See source facts below.
**Warning signs:** Joshua with 2 challenges both about Electron; Retail Analysis with 0 challenges about YOLO.

### Pitfall 4: JSON Syntax Error from Large Edit
**What goes wrong:** `next build` fails with "JSON parse error" or next-intl throws at runtime.
**Why it happens:** Missing comma, unclosed brace, or trailing comma in a large JSON block.
**How to avoid:** After each project edit, run:
```bash
cd /Users/hipark/dev/portfolio && python3 -c "import json; json.load(open('messages/ko.json')); json.load(open('messages/en.json')); print('JSON OK')"
```
**Warning signs:** `next build` error mentioning JSON parse or unexpected token.

### Pitfall 5: challenge3 Key Present in One Locale Only
**What goes wrong:** `/ko/projects/joshua` shows 3 challenges; `/en/projects/joshua` shows 2. Silent — no error.
**Why it happens:** Deciding to add a 3rd challenge in Korean but forgetting English.
**How to avoid:** The parity validation script above catches this. Run it after every project edit.

## Code Examples

### Current stub in ko.json (to be replaced)

```json
"challenge1": {
  "title": "핵심 기술 챌린지",
  "context": "문제 정의 (Phase 14에서 실제 콘텐츠로 교체 예정)",
  "alternatives": "시도한 접근법 (Phase 14에서 실제 콘텐츠로 교체 예정)",
  "decision": "비교/결정 근거 (Phase 14에서 실제 콘텐츠로 교체 예정)",
  "implementation": "구현 상세 (Phase 14에서 실제 콘텐츠로 교체 예정)",
  "outcome": "정량적 성과 (Phase 14에서 실제 콘텐츠로 교체 예정)"
}
```

### Target structure — 2 challenges example (joshua ko.json)

```json
"challenges": {
  "title": "엔지니어링 챌린지",
  "challenge1": {
    "title": "Electron + Angular IPC 아키텍처 설계",
    "context": "[실제 문제 정의 — PDF 기반]",
    "alternatives": "[고려한 대안 및 기각 이유]",
    "decision": "[왜 Electron+Angular를 선택했는가 — CONT-03 tech rationale]",
    "implementation": "[구체적 구현 방법]",
    "outcome": "[정량적 성과 — Windows/macOS 크로스플랫폼 출시, SI 프로젝트 정상 납품 등]"
  },
  "challenge2": {
    "title": "KoGPT-2 추론 파이프라인 최적화 — AI 챌린지 (CONT-04)",
    "context": "[AI 모델 서빙 문제]",
    "alternatives": "[다른 모델/방식 검토 및 기각]",
    "decision": "[KoGPT-2 fine-tuning + GPU 베어메탈 선택 근거]",
    "implementation": "[프롬프트 구조화, 추론 파이프라인]",
    "outcome": "[정량적 — 응답 속도, 정확도, 납품 결과]"
  }
}
```

### Verified source facts per project (for content authoring)

**Joshua AI Agent (joshua)**
- KoGPT-2 모델 Fine-tuning, 키워드 기반 프롬프트 설계·최적화로 카피라이팅 문구 자동 생성
- 불필요한 토큰 생성 줄이고 추론 속도 최적화, 실사용 환경에서 빠른 응답이 가능한 생성 파이프라인 구현
- Electron + Angular 기반 데스크톱 앱 — Windows/macOS 크로스플랫폼
- Stripe 결제 시스템 연동 — AI 서비스 유료 이용 및 권한 제어 흐름
- GPU 서버 베어메탈 환경에 직접 구성, 내부 클라우드처럼 활용 가능한 형태로 모델 추론 요청 안정적 처리
- Main 프로세스(API 통신) ↔ Renderer 프로세스(UI) IPC 분리
- RxJS 기반 비동기 스트리밍 — AI 응답 실시간 렌더링
- 결과: SI 프로젝트 정상 납품, Windows/macOS 크로스플랫폼 출시
- 팀: 3명 (디자이너 2명, 기획·개발 1명)

**DY Microfinance CMS (dyCms)**
- 기존: Excel 스프레드시트 + 수작업 → 월말 결산 수십 시간 소요, 데이터 정합성 오류 빈번
- Next.js App Router (프론트엔드) + NestJS (백엔드) + PostgreSQL 분리형 아키텍처
- Server Actions로 폼 처리, RBAC 프론트엔드 라우팅 레벨 구현 (대출 상담사/회계 담당자/관리자 3역할)
- BS(대차대조표) + PL(손익계산서) 자동 생성 인터페이스
- 결과: 전체 회계 프로세스 약 90% 자동화 달성, 월말 결산 시간 수십 시간 → 수 시간으로 단축
- 솔로 풀스택 개발 (1명)

**Retail Store Analysis (retailAnalysis)**
- YOLO 기반 객체 인식 모델을 매장 CCTV 영상에서 고객 식별·트래킹
- VanillaJS 선택 이유: React/Vue 없이 복잡한 실시간 데이터 시각화 검증 + 번들 사이즈·성능 최적화
- Canvas API + SVG 히트맵, WebSocket 실시간 데이터 수신
- Observer 패턴 상태 관리, requestAnimationFrame + Debouncing 렌더링 최적화
- 베어메탈 환경 Linux 서버 직접 구성, On-premise 분석 구조 (클라우드 미사용)
- 고객 이동 경로, 체류 시간, 혼잡도 등 행동 지표 추출
- 팀: 3명

**Scholarly Chain (scholarlyChain)**
- Hyperledger Fabric 블록체인 연동 학생회비 투명 관리 시스템
- Next.js + shadcn/ui + JWT 미들웨어 + FCM 푸시 알림
- JWT 자동 갱신 미들웨어 구현 — 세션 끊김 방지
- 3역할 기반 UI (학생/위원/관리자) — 역할별 다른 대시보드
- Next.js API Routes 프록시로 백엔드 API 중계
- 결과: 15개 이상 페이지, 30개 이상 재사용 컴포넌트, Vercel 배포
- 4인 팀에서 프론트엔드 100% 담당

**Dino Go (dinoGo)**
- Sui 블록체인 위치 기반 NFT 수집 게임 (3일 해커톤)
- Google Maps API + Three.js 통합 — 지도 위 3D 공룡 오버레이
- 좌표 변환 로직 — 드래그/줌 시에도 3D 오브젝트 정확한 위치 렌더링
- Walrus 분산 스토리지 + Seal 임계값 암호화 + Kiosk SDK 통합
- 3개 커스텀 Web3 클라이언트 라이브러리 (Sui SDK, Walrus, Seal/Kiosk 추상화)
- 10개 이상 페이지 (NFT Studio, Marketplace, 3D 맵)
- 4인 팀에서 프론트엔드 전담

**Ministry of Truth / ArtWar (artWar)**
- Moltiverse Hackathon Agent+Token Track (1주, $140K 풀)
- OpenClaw 프레임워크 기반 3종 에이전트: MC(진행자), Judge A(기술 심미성), Judge B(주제 정합성)
- MC Agent: Kimi(무료 크레딧) → Gemini Flash 폴백 — 비용 효율 LLM 선택
- Judge A/B: 비전 모델 사용 (이미지 평론)
- Solidity 0.8.20 — ArtWarBetting.sol 스마트 컨트랙트 (openRound, placeBet, resolveRound, claimWinnings)
- nad.fun에 $MOT 토큰 직접 발행 (토큰 이코노미)
- 6단계 라운드 플로우 자율 운영 (주제발표→출품→베팅→심사→결과발표→다음라운드)
- NestJS REST API (Express.js 기반) + SQLite/JSON 월드 상태 관리
- AWS EC2 1대에서 에이전트 프로세스 + API 서버 함께 운영
- 채점: Judge A(기술력40%+색감30%+주제해석20%+감정10%) + Judge B(기술력10%+색감20%+주제해석30%+감정40%) → 최종 동일 가중치

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Stub placeholder text | Real engineering narrative content | Phase 14 | Challenges become recruiter-readable portfolio evidence |
| No alternative rejection | Explicit alternative rejection in `alternatives` field | Phase 14 | CONT-01 compliance; demonstrates engineering judgment |
| No quantitative outcomes | Verified numbers from PDF in `outcome` field | Phase 14 | CONT-02 compliance; makes impact credible |

## Open Questions

1. **How many challenges per project?**
   - What we know: CONT-01 says 2-3 per project. The schema supports up to `challenge3` (`CHALLENGE_KEYS = ['challenge1', 'challenge2', 'challenge3']`).
   - What's unclear: Some projects (Joshua, DY CMS, ArtWar) have enough documented engineering complexity for 3 challenges; others (Dino Go — 3-day hackathon) may stretch to produce a strong 3rd.
   - Recommendation: Joshua → 2 challenges (IPC architecture + KoGPT-2 AI pipeline). DY CMS → 2 challenges (architecture decision + RBAC implementation). Retail Analysis → 2 challenges (VanillaJS rationale + YOLO pipeline). ScholarlyChain → 2 challenges (JWT middleware + FCM role-based notification). Dino Go → 2 challenges (Google Maps+Three.js coordinate sync + Web3 abstraction layer). ArtWar → 3 challenges (LLM cost optimization + agent state machine + on-chain betting contract). Total: 13 challenges across 6 projects.

2. **Should any challenges include code snippets?**
   - What we know: `ChallengeSection.tsx` renders optional `code`+`codeLang` fields via `CodeBlock`. Joshua's stub already has an example code block.
   - What's unclear: Whether any real code snippets from the actual projects are available/appropriate.
   - Recommendation: Use code snippets sparingly — only where a specific code pattern genuinely illustrates the engineering decision. Good candidates: Joshua IPC pattern (Electron ipcMain/ipcRenderer), DY CMS RBAC middleware, ArtWar agent loop. Keep to 10-20 lines maximum. Leave code/codeLang fields absent if no concise snippet adds value.

3. **How to handle the EMV Feasibility Study project (not one of the 6 portfolio projects)?**
   - What we know: The EMV project appears in the resume as a consulting project at 페이먼트인앱. It is NOT one of the 6 portfolio projects (joshua, dyCms, retailAnalysis, scholarlyChain, dinoGo, artWar).
   - What's unclear: Whether any EMV metrics can be referenced in adjacent projects.
   - Recommendation: Do not create an EMV project entry. The EMV quantitative figures (운영비 9.5억 원 절감 etc.) belong to a different project context and must not be attributed to the 6 portfolio projects.

4. **Language and tone for English content?**
   - What we know: The existing en.json content (overview, retrospective) is written in professional technical English, first-person perspective.
   - Recommendation: Match the existing en.json tone — past tense, professional, specific. Avoid marketing language. "I designed X to solve Y, which reduced Z by N%" is the target register.

## Validation Architecture

> Skipped: `workflow.nyquist_validation` is not set in `.planning/config.json` (workflow config has no `nyquist_validation` key).

## Sources

### Primary (HIGH confidence)
- `/Users/hipark/dev/portfolio/자료/박훈일 이력서.pdf` — Resume: verified quantitative facts (90% automation, 수십 시간→수 시간, SI 납품, 크로스플랫폼), tech stacks, team sizes
- `/Users/hipark/dev/portfolio/자료/박훈일 포트폴리오.pdf` — Portfolio slides: project overviews, roles, results, learning points for Joshua and DY CMS
- `/Users/hipark/dev/portfolio/자료/Moltiverse/ArtWar_기획서_Moltiverse_Hackathon (1).pdf` — ArtWar detailed spec: agent architecture, LLM stack (Kimi/Gemini), smart contract functions, scoring system, round flow
- `/Users/hipark/dev/portfolio/messages/ko.json` — Existing ko.json: overview.background and overview.contribution fields contain detailed first-person narrative for all 6 projects (HIGH confidence source for challenge content)
- `/Users/hipark/dev/portfolio/messages/en.json` — Existing en.json: English equivalents of the same narratives
- `/Users/hipark/dev/portfolio/src/components/projects/ProjectContent.tsx` — `CHALLENGE_KEYS = ['challenge1', 'challenge2', 'challenge3']` — confirms max 3 challenges checked per project
- `/Users/hipark/dev/portfolio/src/components/projects/ChallengeSection.tsx` — Confirms optional `code`/`codeLang` field rendering via `t.has()`

### Secondary (MEDIUM confidence)
- None — all source material is first-party (the developer's own documents)

### Tertiary (LOW confidence)
- None

## Metadata

**Confidence breakdown:**
- Source facts: HIGH — directly from developer's own resume and portfolio PDFs; no external sources needed
- Schema/infrastructure: HIGH — read directly from production code files
- Content recommendations (which challenge topics per project): MEDIUM — editorial judgment based on source material; final selection by developer
- Quantitative figures: HIGH for DY CMS (90%), MEDIUM for Joshua/Dino Go/ScholarlyChain (exact numbers less documented in PDFs)

**Research date:** 2026-03-02
**Valid until:** 2026-04-02 (content is static; infrastructure schema is stable)
