// 보안 모니터링 시스템 JavaScript

// 네비게이션 기능
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCharts();
    initializeCounters();
    initializeAlertFilters();
    simulateRealTimeData();
});

// 네비게이션 초기화
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // 활성 링크 업데이트
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // 섹션 표시/숨김
            const targetId = link.getAttribute('href').substring(1);
            sections.forEach(section => {
                section.style.display = section.id === targetId ? 'block' : 'none';
            });
        });
    });
}

// 차트 초기화
function initializeCharts() {
    // 시스템 리소스 차트
    const resourceCtx = document.getElementById('resourceChart');
    if (resourceCtx) {
        new Chart(resourceCtx, {
            type: 'line',
            data: {
                labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                datasets: [
                    {
                        label: 'CPU (%)',
                        data: [45, 52, 48, 61, 55, 67],
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Memory (%)',
                        data: [67, 71, 65, 73, 69, 75],
                        borderColor: '#f39c12',
                        backgroundColor: 'rgba(243, 156, 18, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Disk (%)',
                        data: [82, 82, 83, 84, 84, 85],
                        borderColor: '#27ae60',
                        backgroundColor: 'rgba(39, 174, 96, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }

    // 보안 이벤트 차트
    const securityCtx = document.getElementById('securityChart');
    if (securityCtx) {
        new Chart(securityCtx, {
            type: 'bar',
            data: {
                labels: ['로그인 실패', '포트 스캔', '권한 상승', 'DDoS', '악성코드'],
                datasets: [{
                    label: '보안 이벤트 수',
                    data: [12, 5, 2, 1, 0],
                    backgroundColor: [
                        'rgba(231, 76, 60, 0.8)',
                        'rgba(243, 156, 18, 0.8)',
                        'rgba(155, 89, 182, 0.8)',
                        'rgba(52, 152, 219, 0.8)',
                        'rgba(39, 174, 96, 0.8)'
                    ],
                    borderColor: [
                        '#e74c3c',
                        '#f39c12',
                        '#9b59b6',
                        '#3498db',
                        '#27ae60'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// 카운터 애니메이션
function initializeCounters() {
    const counters = [
        { id: 'critical-alerts', target: 0, duration: 1000 },
        { id: 'security-events', target: 19, duration: 1500 },
        { id: 'active-servers', target: 3, duration: 1200 },
        { id: 'uptime', target: 99.9, duration: 2000, isDecimal: true }
    ];

    counters.forEach(counter => {
        animateCounter(counter);
    });
}

function animateCounter({ id, target, duration, isDecimal = false }) {
    const element = document.getElementById(id);
    if (!element) return;

    const startTime = performance.now();
    const startValue = 0;

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (target - startValue) * easeOutQuart;

        if (isDecimal) {
            element.textContent = currentValue.toFixed(1);
        } else {
            element.textContent = Math.floor(currentValue);
        }

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

// 알림 필터 기능
function initializeAlertFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const alertItems = document.querySelectorAll('.alert-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 활성 버튼 업데이트
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            // 알림 아이템 필터링
            alertItems.forEach(item => {
                if (filter === 'all') {
                    item.style.display = 'flex';
                } else {
                    const hasClass = item.classList.contains(filter);
                    item.style.display = hasClass ? 'flex' : 'none';
                }
            });
        });
    });
}

// 실시간 데이터 시뮬레이션
function simulateRealTimeData() {
    setInterval(() => {
        updateSystemMetrics();
        updateAlertCounts();
    }, 5000); // 5초마다 업데이트
}

function updateSystemMetrics() {
    // CPU 사용률 업데이트
    const cpuBar = document.querySelector('.progress-bar[data-value="45"]');
    if (cpuBar) {
        const newValue = Math.floor(Math.random() * 30) + 40; // 40-70%
        cpuBar.style.width = newValue + '%';
        cpuBar.querySelector('.progress-text').textContent = newValue + '%';
        cpuBar.setAttribute('data-value', newValue);
    }

    // 메모리 사용률 업데이트
    const memoryBar = document.querySelector('.progress-bar[data-value="67"]');
    if (memoryBar) {
        const newValue = Math.floor(Math.random() * 20) + 60; // 60-80%
        memoryBar.style.width = newValue + '%';
        memoryBar.querySelector('.progress-text').textContent = newValue + '%';
        memoryBar.setAttribute('data-value', newValue);
    }

    // 네트워크 대역폭 업데이트
    const networkBar = document.querySelector('.progress-bar[data-value="34"]');
    if (networkBar) {
        const newValue = Math.floor(Math.random() * 40) + 20; // 20-60%
        networkBar.style.width = newValue + '%';
        networkBar.querySelector('.progress-text').textContent = newValue + '%';
        networkBar.setAttribute('data-value', newValue);
    }
}

function updateAlertCounts() {
    // 보안 이벤트 수 랜덤 업데이트
    const securityEvents = document.getElementById('security-events');
    if (securityEvents) {
        const currentValue = parseInt(securityEvents.textContent);
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
        const newValue = Math.max(0, currentValue + change);
        securityEvents.textContent = newValue;
    }

    // 업타임 업데이트
    const uptime = document.getElementById('uptime');
    if (uptime) {
        const variation = (Math.random() - 0.5) * 0.2; // ±0.1%
        const newValue = Math.max(99.0, Math.min(100.0, 99.9 + variation));
        uptime.textContent = newValue.toFixed(1);
    }
}

// 알림 아이템 액션 처리
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-sm')) {
        const action = e.target.textContent;
        const alertItem = e.target.closest('.alert-item');

        switch(action) {
            case '해결':
                alertItem.style.opacity = '0.5';
                e.target.textContent = '해결됨';
                e.target.disabled = true;
                break;
            case '무시':
                alertItem.style.display = 'none';
                break;
            case '차단':
                e.target.textContent = '차단됨';
                e.target.style.background = '#e74c3c';
                e.target.style.color = 'white';
                e.target.disabled = true;
                break;
            case '조사':
                e.target.textContent = '조사중';
                e.target.style.background = '#f39c12';
                e.target.style.color = 'white';
                break;
            case '확인':
                alertItem.style.opacity = '0.5';
                e.target.textContent = '확인됨';
                e.target.disabled = true;
                break;
        }
    }
});

// 실시간 시간 업데이트
function updateTime() {
    const timeElements = document.querySelectorAll('.alert-time');
    timeElements.forEach((element, index) => {
        const minutes = [2, 5, 10][index] || 1;
        element.textContent = `${minutes}분 전`;
    });
}

// 키보드 단축키
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                document.querySelector('a[href="#dashboard"]').click();
                break;
            case '2':
                e.preventDefault();
                document.querySelector('a[href="#security"]').click();
                break;
            case '3':
                e.preventDefault();
                document.querySelector('a[href="#monitoring"]').click();
                break;
            case '4':
                e.preventDefault();
                document.querySelector('a[href="#alerts"]').click();
                break;
            case '5':
                e.preventDefault();
                document.querySelector('a[href="#docs"]').click();
                break;
        }
    }
});

// 새로운 알림 추가 시뮬레이션
function addNewAlert() {
    const alertList = document.querySelector('.alert-list');
    const alertTypes = ['warning', 'info', 'critical'];
    const alertMessages = [
        {
            type: 'warning',
            title: '높은 CPU 사용률',
            description: '서버 02의 CPU 사용률이 85%를 초과했습니다.',
            icon: 'fas fa-microchip'
        },
        {
            type: 'info',
            title: '시스템 백업 완료',
            description: '정기 백업이 성공적으로 완료되었습니다.',
            icon: 'fas fa-database'
        },
        {
            type: 'critical',
            title: '서비스 중단',
            description: '웹 서버가 응답하지 않습니다.',
            icon: 'fas fa-exclamation-triangle'
        }
    ];

    const randomAlert = alertMessages[Math.floor(Math.random() * alertMessages.length)];

    const alertHTML = `
        <div class="alert-item ${randomAlert.type}">
            <div class="alert-icon"><i class="${randomAlert.icon}"></i></div>
            <div class="alert-content">
                <h4>${randomAlert.title}</h4>
                <p>${randomAlert.description}</p>
                <span class="alert-time">방금 전</span>
            </div>
            <div class="alert-actions">
                <button class="btn-sm">해결</button>
                <button class="btn-sm">무시</button>
            </div>
        </div>
    `;

    alertList.insertAdjacentHTML('afterbegin', alertHTML);
}

// 5분마다 새로운 알림 추가
setInterval(addNewAlert, 300000);

// 페이지 로드 완료 시 환영 메시지
window.addEventListener('load', function() {
    console.log('🛡️ 보안 모니터링 시스템 대시보드가 로드되었습니다.');
    console.log('📊 실시간 데이터 모니터링을 시작합니다.');

    // 키보드 단축키 안내
    console.log('⌨️ 키보드 단축키:');
    console.log('  Ctrl+1: 대시보드');
    console.log('  Ctrl+2: 보안 현황');
    console.log('  Ctrl+3: 시스템 모니터링');
    console.log('  Ctrl+4: 알림');
    console.log('  Ctrl+5: 문서');
});