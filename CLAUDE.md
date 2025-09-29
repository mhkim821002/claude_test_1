# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

**주 목적**: 보안 총괄 담당자용 서버 모니터링 시스템 개발
**기술 스택**: Node.js + Express.js 5.1.0 기반 보안 모니터링 플랫폼

**환경 정보:**
- Node.js: v22.19.0
- npm: 10.9.3
- Express.js: 5.1.0 (정확한 버전)

**현재 상태:**
- `app.js` 파일이 비어있음 (메인 엔트리 포인트)
- package.json의 main이 "index.js"로 설정되어 있지만 실제 파일은 `app.js`
- 기본적인 package.json 구성만 존재

## 명령어

### 개발 관련
```bash
# 애플리케이션 실행
node app.js

# 현재 테스트 (미구성 상태)
npm test  # "Error: no test specified" 출력

# 개발 서버 (nodemon 설치 후 권장)
npm install -D nodemon
npm run dev  # package.json에 "dev": "nodemon app.js" 스크립트 추가 필요
```

### 의존성 관리
```bash
# 새 패키지 설치
npm install <package-name>

# 개발 의존성 설치
npm install -D <package-name>
```

## Express.js 5.x 특징

Express.js 5.1.0을 사용하므로 다음 사항을 고려해야 합니다:

**주요 변경사항 (v4 대비):**
- Promise 기반 미들웨어 지원 개선
- 비동기 에러 핸들링 자동화
- 일부 미들웨어가 내장에서 분리됨
- `req.param()` 메서드 제거됨
- 더 엄격한 라우팅 규칙

**권장 패턴:**
```javascript
// async/await 미들웨어 사용 가능
app.get('/api/data', async (req, res) => {
  try {
    const data = await fetchData();
    res.json(data);
  } catch (error) {
    // Express 5에서 자동으로 에러 핸들러로 전달됨
    throw error;
  }
});
```

## 프로젝트 구조

```
my-express-api/
├── app.js              # 메인 애플리케이션 파일 (현재 비어있음)
├── package.json        # 프로젝트 설정
├── package-lock.json   # 의존성 잠금 파일
└── node_modules/       # 설치된 패키지들
```

## 개발 시 고려사항

### 필수 설정이 필요한 항목들:
1. **package.json main 필드 수정**: "index.js" → "app.js"
2. **기본 Express 서버 코드 작성**
3. **개발 스크립트 추가** (start, dev 등)
4. **에러 핸들링 미들웨어 구현**

### 권장 추가 패키지:
```bash
# 개발 도구
npm install -D nodemon    # 파일 변경 시 자동 재시작

# 보안 및 유틸리티
npm install helmet        # 보안 헤더
npm install cors          # CORS 처리
npm install morgan        # 로깅
npm install dotenv        # 환경변수 관리

# 데이터베이스 (필요시)
npm install mongoose      # MongoDB
npm install pg            # PostgreSQL
```

### 기본 서버 구조 템플릿:
```javascript
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우트 설정
app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
```

## 테스트 및 린팅

현재 테스트 프레임워크가 설정되어 있지 않습니다. 권장 설정:

```bash
# 테스트 도구
npm install -D jest supertest

# 린팅 도구
npm install -D eslint prettier
```

## Git 및 GitHub 자동화

### CLAUDE.md 자동 업로드 기능

이 프로젝트에는 CLAUDE.md 파일의 변경사항을 자동으로 Git에 커밋하는 기능이 포함되어 있습니다:

```bash
# CLAUDE.md 변경사항 모니터링 시작
npm run watch-claude

# GitHub에 수동 푸시
npm run push
```

**자동화 스크립트 (`watch-claude.js`)**:
- CLAUDE.md 파일 변경사항을 1초마다 감지
- 변경 시 자동으로 Git 커밋 생성
- 타임스탬프가 포함된 커밋 메시지 자동 생성

**사용 방법**:
1. 터미널에서 `npm run watch-claude` 실행
2. CLAUDE.md 파일을 편집하고 저장
3. 자동으로 Git 커밋 생성 및 GitHub 푸시 완료!

**기능**:
- ✅ 실시간 파일 변경 감지
- ✅ 자동 Git 커밋 생성
- ✅ 자동 GitHub 푸시
- ✅ GitHub Classic Personal Access Token 인증 설정 완료

**주의사항**:
- Ctrl+C로 모니터링 중단 가능
- 인터넷 연결이 필요함 (GitHub 푸시용)
- Git 사용자 정보가 설정되어 있어야 함

## 서버 보안 모니터링 시스템 개발 가이드

### 프로젝트 목표
보안 총괄 담당자를 위한 종합적인 서버 모니터링 및 보안 이벤트 탐지 시스템 구축

### 모니터링 대상 항목

#### 1. 시스템 리소스 모니터링
- **CPU 사용률**: 비정상적인 CPU 스파이크 탐지
- **메모리 사용률**: 메모리 누수 및 과부하 감지
- **디스크 사용률**: 용량 부족 및 I/O 병목 모니터링
- **네트워크 트래픽**: 대역폭 사용량 및 비정상 패턴 분석

#### 2. 보안 이벤트 탐지
- **로그인 보안**:
  - 무차별 대입 공격 (Brute Force) 탐지
  - 비정상적인 로그인 시도 패턴
  - 다중 실패 로그인 후 성공 시도
  - 비정상 시간대 접속

- **시스템 보안**:
  - 권한 상승 시도 (Privilege Escalation)
  - sudo/관리자 권한 남용
  - 시스템 파일 무단 변경
  - 비정상적인 프로세스 실행

- **네트워크 보안**:
  - 포트 스캔 시도
  - DDoS 공격 패턴
  - 비정상적인 외부 연결
  - 내부 네트워크 스캔

#### 3. 파일 시스템 모니터링
- 중요 시스템 파일 변경 감지
- 설정 파일 무단 수정
- 로그 파일 조작 시도
- 백도어 파일 생성 탐지

### 권장 기술 스택

#### 백엔드 (Node.js/Express)
```bash
# 시스템 모니터링
npm install systeminformation    # 시스템 정보 수집
npm install node-cron           # 스케줄링
npm install winston            # 로깅

# 보안 관련
npm install express-rate-limit  # Rate limiting
npm install helmet             # 보안 헤더
npm install bcrypt             # 패스워드 해싱

# 데이터베이스
npm install mongoose           # MongoDB (로그 저장)
npm install redis              # 캐싱 및 세션

# 실시간 통신 및 알림
npm install socket.io          # 실시간 알림
npm install nodemailer         # 이메일 알림
npm install @slack/web-api     # Slack API 연동
npm install @slack/webhook     # Slack Webhook
```

#### 프론트엔드 (대시보드)
```bash
# 실시간 차트
npm install chart.js           # 차트 라이브러리
npm install socket.io-client   # 실시간 업데이트

# UI 프레임워크 (선택사항)
npm install express-handlebars # 템플릿 엔진
# 또는 React/Vue.js 등
```

### 보안 모니터링 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                   보안 모니터링 시스템                      │
├─────────────────────────────────────────────────────────┤
│  데이터 수집 계층                                          │
│  ├─ 시스템 메트릭 수집기                                    │
│  ├─ 로그 파일 분석기                                       │
│  ├─ 네트워크 트래픽 모니터                                  │
│  └─ 파일 시스템 감시자                                     │
├─────────────────────────────────────────────────────────┤
│  분석 및 탐지 계층                                         │
│  ├─ 이상 징후 탐지 엔진                                    │
│  ├─ 규칙 기반 알림 시스템                                  │
│  ├─ 패턴 매칭 알고리즘                                     │
│  └─ 위협 인텔리전스 연동                                   │
├─────────────────────────────────────────────────────────┤
│  알림 및 대응 계층                                         │
│  ├─ 실시간 대시보드                                       │
│  ├─ 이메일/SMS 알림                                      │
│  ├─ 자동 차단 시스템                                      │
│  └─ 사고 대응 워크플로우                                   │
├─────────────────────────────────────────────────────────┤
│  데이터 저장 계층                                          │
│  ├─ 실시간 데이터 (Redis)                                 │
│  ├─ 로그 데이터베이스 (MongoDB)                           │
│  └─ 장기 보관 스토리지                                     │
└─────────────────────────────────────────────────────────┘
```

### 개발 우선순위

#### Phase 1: 기본 모니터링
1. 시스템 리소스 모니터링 구현
2. 기본 웹 대시보드 구축
3. 실시간 데이터 표시

#### Phase 2: 보안 탐지
1. 로그인 시도 모니터링
2. 무차별 대입 공격 탐지
3. 기본 알림 시스템

#### Phase 3: 고급 보안 기능
1. 패턴 기반 이상 탐지
2. 자동 대응 시스템
3. 상세 보고서 생성

#### Phase 4: 확장 기능
1. 다중 서버 모니터링
2. 클러스터링 지원
3. API 연동 및 통합

### 보안 고려사항

#### 접근 제어
- 관리자 인증 시스템
- 역할 기반 접근 제어 (RBAC)
- API 키 관리

#### 데이터 보안
- 로그 데이터 암호화
- 민감 정보 마스킹
- 안전한 통신 (HTTPS/TLS)

#### 시스템 보안
- 모니터링 시스템 자체 보안
- 로그 무결성 보장
- 백업 및 복구 계획

### 개발 가이드라인

#### 코딩 표준
- 보안 코딩 가이드라인 준수
- 입력 검증 및 출력 인코딩
- 에러 처리 및 로깅

#### 테스트
- 단위 테스트 (보안 기능 중심)
- 통합 테스트 (시나리오 기반)
- 보안 테스트 (취약점 스캔)

#### 배포
- 컨테이너화 (Docker)
- 환경 분리 (개발/스테이징/운영)
- CI/CD 파이프라인