# 개발 환경 실행 (Spring Boot + React)

## 1. 개발용 Docker Compose 실행
```bash
# 프로젝트 루트에서

# Docker Compose를 사용해 개발용 환경 실행
docker-compose -f docker-compose-dev.yml up -d


# docker-compose -f docker-compose-dev.yml 의 축약 CLI
# 서비스 시작
./dev.sh up -d

# 서비스 종료
./dev.sh down

# 현재 컨테이너 상태 확인
./dev.sh ps

