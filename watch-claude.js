#!/usr/bin/env node

const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const CLAUDE_FILE = path.join(__dirname, 'CLAUDE.md');
let lastModified = null;

console.log('🔍 CLAUDE.md 파일 변경사항을 모니터링 중...');
console.log('📁 대상 파일:', CLAUDE_FILE);

function checkFileChange() {
  try {
    const stats = fs.statSync(CLAUDE_FILE);
    const currentModified = stats.mtime.getTime();

    if (lastModified === null) {
      lastModified = currentModified;
      console.log('✅ 초기 파일 상태 확인됨');
      return;
    }

    if (currentModified !== lastModified) {
      console.log('📝 CLAUDE.md 파일이 변경되었습니다!');
      lastModified = currentModified;

      // Git add and commit
      const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
      const commitMessage = `Update CLAUDE.md - ${timestamp}

🤖 Auto-generated commit for CLAUDE.md changes

Co-Authored-By: Claude <noreply@anthropic.com>`;

      exec('git add CLAUDE.md', (error) => {
        if (error) {
          console.error('❌ Git add 실패:', error.message);
          return;
        }

        exec(`git commit -m "${commitMessage}"`, (error, stdout) => {
          if (error) {
            console.error('❌ Git commit 실패:', error.message);
            return;
          }

          console.log('✅ 자동 커밋 완료:', stdout.trim());
          console.log('💡 GitHub에 푸시하려면: git push origin main');
        });
      });
    }
  } catch (error) {
    console.error('❌ 파일 확인 중 오류:', error.message);
  }
}

// 초기 확인
checkFileChange();

// 1초마다 파일 변경사항 확인
setInterval(checkFileChange, 1000);

// 프로세스 종료 처리
process.on('SIGINT', () => {
  console.log('\n👋 CLAUDE.md 모니터링을 종료합니다.');
  process.exit(0);
});