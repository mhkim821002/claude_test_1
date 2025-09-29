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
│  ├─ 이메일/SMS/Slack 알림                                │
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

## Slack 자동화 연동 가이드

### Slack 알림 시스템 구성

#### 1. Slack App 설정
```bash
# 필요한 패키지 설치
npm install @slack/web-api @slack/webhook dotenv
```

#### 2. 환경 변수 설정 (.env)
```bash
# Slack Bot Token (xoxb-로 시작)
SLACK_BOT_TOKEN=xoxb-your-bot-token-here

# Slack Webhook URL
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL

# 알림 채널
SLACK_SECURITY_CHANNEL=#security-alerts
SLACK_MONITORING_CHANNEL=#server-monitoring
SLACK_INCIDENT_CHANNEL=#incident-response
```

#### 3. Slack 알림 구현 예시

**기본 Slack 알림 클래스**:
```javascript
const { WebClient } = require('@slack/web-api');
const { IncomingWebhook } = require('@slack/webhook');

class SlackNotifier {
  constructor() {
    this.client = new WebClient(process.env.SLACK_BOT_TOKEN);
    this.webhook = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);
  }

  // 보안 경고 알림
  async sendSecurityAlert(alertData) {
    const message = {
      channel: process.env.SLACK_SECURITY_CHANNEL,
      attachments: [{
        color: 'danger',
        title: '🚨 보안 경고',
        fields: [
          { title: '위협 유형', value: alertData.threatType, short: true },
          { title: '서버', value: alertData.serverName, short: true },
          { title: '시간', value: alertData.timestamp, short: true },
          { title: '상세 정보', value: alertData.details, short: false }
        ],
        footer: '보안 모니터링 시스템',
        ts: Math.floor(Date.now() / 1000)
      }]
    };

    await this.client.chat.postMessage(message);
  }

  // 시스템 모니터링 알림
  async sendMonitoringAlert(metricData) {
    const color = metricData.severity === 'critical' ? 'danger' : 'warning';

    const message = {
      channel: process.env.SLACK_MONITORING_CHANNEL,
      attachments: [{
        color: color,
        title: `📊 ${metricData.severity === 'critical' ? '긴급' : '경고'} - 시스템 모니터링`,
        fields: [
          { title: '메트릭', value: metricData.metric, short: true },
          { title: '현재 값', value: metricData.currentValue, short: true },
          { title: '임계값', value: metricData.threshold, short: true },
          { title: '서버', value: metricData.serverName, short: true }
        ]
      }]
    };

    await this.client.chat.postMessage(message);
  }

  // 사고 대응 알림
  async sendIncidentAlert(incidentData) {
    const message = {
      channel: process.env.SLACK_INCIDENT_CHANNEL,
      text: `🚨 보안 사고 발생`,
      attachments: [{
        color: 'danger',
        title: '긴급 대응 필요',
        fields: [
          { title: '사고 유형', value: incidentData.type, short: true },
          { title: '심각도', value: incidentData.severity, short: true },
          { title: '영향 범위', value: incidentData.impact, short: false },
          { title: '권장 조치', value: incidentData.recommendation, short: false }
        ],
        actions: [{
          type: 'button',
          text: '사고 대응 시작',
          style: 'danger',
          url: `${process.env.DASHBOARD_URL}/incident/${incidentData.id}`
        }]
      }]
    };

    await this.client.chat.postMessage(message);
  }
}
```

#### 4. 자동화 시나리오

**보안 이벤트별 Slack 알림**:
- **무차별 대입 공격**: 즉시 #security-alerts 채널 알림
- **권한 상승 시도**: 긴급 알림 + 담당자 멘션
- **시스템 리소스 임계치 초과**: #server-monitoring 채널 경고
- **심각한 보안 위협**: #incident-response 채널 + 즉시 대응 요청

**알림 우선순위 설정**:
```javascript
// 알림 우선순위 매핑
const alertPriority = {
  'critical': {
    channel: '#incident-response',
    mention: '@security-team @oncall',
    color: 'danger'
  },
  'high': {
    channel: '#security-alerts',
    mention: '@security-team',
    color: 'warning'
  },
  'medium': {
    channel: '#server-monitoring',
    mention: '',
    color: 'good'
  },
  'low': {
    channel: '#general-monitoring',
    mention: '',
    color: '#439FE0'
  }
};
```

#### 5. Slack 명령어 봇 구현

**대화형 보안 명령어**:
```javascript
// 서버 상태 확인 명령어
app.post('/slack/commands/server-status', async (req, res) => {
  const { text } = req.body;
  const serverName = text || 'all';

  const status = await getServerStatus(serverName);

  res.json({
    response_type: 'in_channel',
    text: `서버 상태 - ${serverName}`,
    attachments: [{
      fields: [
        { title: 'CPU', value: `${status.cpu}%`, short: true },
        { title: 'Memory', value: `${status.memory}%`, short: true },
        { title: 'Disk', value: `${status.disk}%`, short: true },
        { title: 'Status', value: status.health, short: true }
      ]
    }]
  });
});

// 보안 로그 조회 명령어
app.post('/slack/commands/security-logs', async (req, res) => {
  const { text } = req.body;
  const timeRange = text || '1h';

  const logs = await getSecurityLogs(timeRange);

  res.json({
    response_type: 'ephemeral',
    text: `최근 ${timeRange} 보안 로그`,
    attachments: logs.map(log => ({
      color: log.severity === 'high' ? 'danger' : 'warning',
      text: `${log.timestamp} - ${log.event} (${log.source})`
    }))
  });
});
```

#### 6. Webhook 자동화 설정

**GitHub와 Slack 연동**:
```javascript
// CLAUDE.md 업데이트 시 Slack 알림
const notifySlackOnUpdate = async (updateInfo) => {
  const message = {
    channel: '#development',
    text: '📝 CLAUDE.md 파일이 업데이트되었습니다',
    attachments: [{
      color: 'good',
      fields: [
        { title: '변경 시간', value: updateInfo.timestamp, short: true },
        { title: '커밋', value: updateInfo.commitHash, short: true },
        { title: '변경 사항', value: updateInfo.changes, short: false }
      ],
      actions: [{
        type: 'button',
        text: 'GitHub에서 보기',
        url: updateInfo.githubUrl
      }]
    }]
  };

  await slackNotifier.webhook.send(message);
};
```

#### 7. 대시보드 Slack 통합

**정기 보고서 자동 전송**:
```javascript
// 매일 아침 보안 요약 보고서
cron.schedule('0 9 * * *', async () => {
  const dailyReport = await generateDailySecurityReport();

  await slackNotifier.sendDailyReport(dailyReport);
});

// 주간 보안 동향 보고서
cron.schedule('0 9 * * 1', async () => {
  const weeklyReport = await generateWeeklySecurityReport();

  await slackNotifier.sendWeeklyReport(weeklyReport);
});
```

### Slack 권한 및 보안 설정

#### Bot 권한 설정
```
필수 OAuth Scopes:
- chat:write : 메시지 전송
- chat:write.public : 공개 채널 메시지 전송
- commands : 슬래시 명령어 사용
- files:write : 파일 업로드 (보고서 첨부용)
- users:read : 사용자 정보 조회 (멘션용)
```

#### 보안 고려사항
- Slack Token을 환경변수로 안전하게 관리
- Webhook URL 노출 방지
- 민감한 정보는 DM으로 전송
- 알림 채널별 접근 권한 관리
- 메시지 내용 암호화 고려

## GitHub Pages 웹 대시보드

### 외부 접근 가능한 보안 모니터링 대시보드

프로젝트에는 외부에서 접근 가능한 실시간 보안 모니터링 웹 대시보드가 포함되어 있습니다.

#### 🌐 웹사이트 접속 URL
```
https://mhkim821002.github.io/claude_test_1/
```

#### 📋 대시보드 주요 기능

**1. 실시간 모니터링 대시보드**
- 시스템 현황 통계 (긴급 알림, 보안 이벤트, 활성 서버, 업타임)
- 실시간 차트 (시스템 리소스, 보안 이벤트 추이)
- 자동 데이터 업데이트 (5초마다)

**2. 보안 현황 섹션**
- 위협 수준별 분류 (낮음/보통/높음/긴급)
- 최근 보안 이벤트 타임라인
- 실시간 위협 인텔리전스

**3. 시스템 모니터링**
- CPU, 메모리, 디스크, 네트워크 사용률 실시간 표시
- 진행률 바 애니메이션
- 서버별 상태 모니터링

**4. 알림 관리 시스템**
- 실시간 알림 피드
- 우선순위별 필터링 (전체/긴급/경고/정보)
- 인터랙티브 알림 액션 (해결/무시/차단/조사)

**5. 문서 센터**
- 설치 가이드 링크
- 보안 설정 문서
- Slack 연동 가이드
- API 문서

#### 🎨 디자인 특징

**반응형 디자인**
- 모바일/태블릿/데스크톱 모든 기기 지원
- CSS Grid 및 Flexbox 레이아웃
- 부드러운 애니메이션 효과

**현대적 UI/UX**
- 그라데이션 배경 및 글래스모피즘 효과
- Font Awesome 아이콘 사용
- Chart.js 라이브러리로 실시간 차트 구현
- 색상 코딩된 상태 표시 (빨강=긴급, 주황=경고, 초록=정상)

#### ⌨️ 키보드 단축키
```
Ctrl + 1: 대시보드
Ctrl + 2: 보안 현황
Ctrl + 3: 시스템 모니터링
Ctrl + 4: 알림
Ctrl + 5: 문서
```

#### 🔧 기술 스택

**프론트엔드**
- HTML5 (시맨틱 마크업)
- CSS3 (Grid, Flexbox, 애니메이션)
- Vanilla JavaScript (ES6+)
- Chart.js (실시간 차트)
- Font Awesome (아이콘)

**GitHub Pages 설정**
- `/docs` 폴더 기반 배포
- 자동 HTTPS 지원
- 커스텀 도메인 지원 가능

#### 📊 실시간 데이터 시뮬레이션

대시보드는 실제 서버 데이터 없이도 동작하도록 시뮬레이션 기능을 포함:

- **시스템 메트릭**: 5초마다 랜덤 데이터 생성
- **보안 이벤트**: 자동 카운터 업데이트
- **새 알림**: 5분마다 랜덤 알림 추가
- **서버 상태**: 실시간 상태 변경 시뮬레이션

#### 🔄 GitHub Pages 자동 배포

파일 구조:
```
docs/
├── index.html          # 메인 대시보드 페이지
├── styles.css          # 반응형 스타일시트
└── script.js           # 대시보드 JavaScript 로직
```

**배포 프로세스**:
1. `/docs` 폴더에 웹사이트 파일 저장
2. GitHub 저장소 Settings > Pages 설정
3. Source: "Deploy from a branch" 선택
4. Branch: "main", Folder: "/docs" 선택
5. 자동으로 웹사이트 배포 완료

#### 🛡️ 보안 고려사항

**클라이언트 사이드 보안**
- 민감한 API 키나 인증 정보 노출 방지
- HTTPS 강제 사용
- Content Security Policy (CSP) 적용 권장

**데이터 보호**
- 실제 운영 데이터는 시뮬레이션으로 대체
- 개인정보나 민감한 시스템 정보 제외
- 정적 사이트로 서버 사이드 취약점 최소화

#### 🚀 확장 가능성

**실시간 데이터 연동**
- WebSocket 또는 Server-Sent Events 추가
- REST API 엔드포인트 연동
- 실제 서버 메트릭 수집 시스템 연결

**추가 기능**
- 사용자 인증 시스템
- 대시보드 커스터마이징
- 데이터 내보내기 기능
- 모바일 앱 연동