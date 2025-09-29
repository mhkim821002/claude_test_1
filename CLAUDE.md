# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

이 프로젝트는 Express.js 5.1.0을 사용하는 초기 상태의 Node.js API 프로젝트입니다.

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