# 프로젝트 관리 및 분석 시스템

프로젝트 및 작업 관리를 위한 직관적이고 유연한 도구로, 팀 간 협업과 업무 효율성을 향상 시키는데 사용됩니다

## 주요 기능

### 팀

-   팀을 생성하고 초대하여 각자의 팀을 꾸릴 수 있습니다.

### 칸반보드

![column_switch](https://github.com/haeseung123/kanbanBoard/assets/106800437/6d0c9e16-381f-4558-80bf-f04bee894b1d)

_본 이미지는 이해를 돕기 위한 예시이며 프로젝트와 무관한 이미지입니다._

#### Column

-   위와 같은 칸반보드를 구성할 수 있습니다.
-   Column은 각 열을 의미하며 생성,삭제 권한은 팀장에게만 있습니다.
-   컬럼의 제목과 순서를 변경할 수 있습니다.

#### Ticket

<img width="480" alt="스크린샷 2024-02-15 오후 4 36 10" src="https://github.com/haeseung123/kanbanBoard/assets/106800437/464e6d64-bf21-4693-8a87-9dbb9ec469d5">

_본 이미지는 이해를 돕기 위한 예시이며 프로젝트와 무관한 이미지입니다._

-   Ticket은 각 열에 속하는 작업을 의미하며 생성,수정,삭제 권한은 모두에게 있습니다.
-   티켓은 작업의 상세 정보를 가지고 있습니다.

    -   `타이틀` : **“Provide documentation on intergrations”**
    -   `태그` [Frontend / Backend / Design / QA / PM / Document]
    -   `작업기한`: **“Sep 12”** (YYYY-MM-DD 형태로 작성합니다.)
    -   `작업분량` / `담당자`

-   컬럼 내에서의 이동과 다른 컬럼으로의 이동이 가능합니다.

## Skills

#### Back-End

<img src="https://img.shields.io/badge/Node.js-v 18-339933">&nbsp;
<img src="https://img.shields.io/badge/Nest.js-v 10.2-E0234E">&nbsp;
<img src="https://img.shields.io/badge/TypeScript-v 5.0-3178C6"><br>
<img src="https://img.shields.io/badge/TypeORM-v 0.3-fcad03">&nbsp;
<img src="https://img.shields.io/badge/postgreSQL-v 16.1-4169E1">&nbsp;

#### DevOps

<img src="https://img.shields.io/badge/AWS-EC2-FF9900">&nbsp;
<img src="https://img.shields.io/badge/AWS-RDS-527FFF">&nbsp;
<img src="https://img.shields.io/badge/Docker-v 24.0.6-2496ED">&nbsp;
<img src="https://img.shields.io/badge/Jenkins-v 2.60-D24939">&nbsp;
<img src="https://img.shields.io/badge/Ubuntu-v 22.04-E95420">&nbsp;

<br>

## 프로젝트 아키텍처

#### 시스템 아키텍처

<img width="848" alt="스크린샷 2024-03-06 오후 4 32 07" src="https://github.com/haeseung123/kanbanBoard/assets/106800437/c349cdef-c2e0-4589-a477-c04f854af825">

#### 백엔드 CI/CD

<img width="844" alt="스크린샷 2024-03-06 오후 4 27 12" src="https://github.com/haeseung123/kanbanBoard/assets/106800437/fa6e2e3d-13c9-4336-bd98-d9be83855132">

## ERD

<img width="1138" alt="스크린샷 2024-02-16 오후 4 23 26" src="https://github.com/haeseung123/kanbanBoard/assets/106800437/42264bb6-34eb-4c0b-8204-1e6aa7301ccd">

-   각 팀은 고유한 칸반보드를 가질 수 있으며 다양한 팀 및 프로젝트에 맞게 구성될 수 있도록 설계하였습니다.
-   사용자의 권한을 관리하고 제어하는 데 용이할 수 있도록 `is_leader` 컬럼을 `User`테이블에 저장하여 데이터베이스의 일관성을 유지하고 사용자 정보와 관련된 역할 및 권한을 단일 위치에서 관리하고 쿼리할 수 있도록 하였습니다.

## API 명세

포스트맨으로 API를 테스트하고 정리된 링크입니다.

[Postman API 명세서](https://documenter.getpostman.com/view/21718887/2sA2r6YQo1#8f4fa0cd-e9cc-49b3-949d-a05b8a2785a5)
