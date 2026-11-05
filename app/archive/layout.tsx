// parallel route!
// We can not use "children" props in the layout.ta
// because parallel rout shows multiple pages at the same time.
// localhost:3000/archive : works
// localhost:3000/latest: not found.


// Next!! why we need parallel route!!!!!!!!!!!!
/**
1. 새로고침(Hard Refresh)과 URL 공유 문제

    일반 React 방식 (useState):
    대시보드에서 특정 상세 모달을 띄웠거나, 좌측/우측 탭을 다르게 열어두었을 때 상태는 전부
    자바스크립트 메모리(state)에 있습니다.

    이때 사용자가 페이지를 새로고침하거나, 그 URL을 복사해서 다른 사람에게 보내면
    열려 있던 모달이나 탭 상태가 전부 날아갑니다.

    병렬 라우트 방식 (@folder):
    각 영역이 고유의 URL 슬롯을 가집니다. 모달이 열린 상태가 URL(/@modal/photo/1)에
    박히기 때문에, 새로고침을 해도 모달이 유지되고, 링크를 그대로 공유해도 상대방에게
    똑같은 화면이 뜹니다.

2. 서버 스트리밍(SSR)과 로딩 상태의 독립성
    일반 React 방식:
    한 페이지 안에서 여러 API를 호출할 때, 컴포넌트들이 부모-자식 관계로 얽혀 있으면 보통 페이지
    전체가 로딩되거나 클라이언트단(useEffect / TanStack Query 등)에서 각자 fetch를
    해야 합니다.

    병렬 라우트 방식:
    Next.js 서버 컴포넌트(RSC) 환경에서 각 슬롯은 완벽히 독립된 서버 렌더링 단위입니다.
    예를 들어 분석 섹션(@analytics)은 DB 쿼리가 느려서 2초가 걸리고,
    팀 섹션(@team)은 0.1초 만에 끝난다면, 각각의 loading.js 덕분에
    팀 섹션은 먼저 뜨고 분석 섹션만 독립적으로 스켈레톤 UI를 유지할 수 있습니다.
    메인 페이지 전체가 블로킹되지 않습니다.

요약하자면
    단순히 UI를 쪼개서 조립하는 거라면: 그냥 일반 React 컴포넌트를 쓰시면 됩니다.
    굳이 Parallel Route를 쓸 필요가 없습니다.

    "URL 경로에 따라 화면의 여러 조각을 독립적으로 서버에서 렌더링하고,
    새로고침해도 상태(모달 등)가 깨지지 않게 하고 싶을 때" Next.js의 라우팅 시스템 레벨에서
    해결하기 위해 만든 기능입니다.
 */


// Please note!!! [IMPORTANT]
/*
Next.js에서 병렬 라우트(Parallel Routes, @folder)를 사용할 때 가장 흔하게 마주치는 빌드 에러
 중 하나입니다.

에러 메시지가 말해주듯, "모든 병렬 라우트 슬롯은 동일한 URL 요청에 대해 대응할 수 있어야 한다"는
규칙을 위반했기 때문에 발생합니다.
왜 이 에러가 발생할까요?

Next.js 병렬 라우트는 여러 슬롯(예: @analytics, @team, @latest)을 하나의 레이아웃 안에서
동시에 렌더링합니다.
사용자가 특정 URL(예: /archive/2026)로 접속했을 때, 모든 슬롯(@...)들은 그 URL을 감당할
 수 있는 페이지(page.js)나 대체 파일(default.js)을 가지고 있어야 합니다.

현재 에러 난 부분을 보면:
    사용자가 /archive/[year] (예: /archive/2026) 페이지에 접속했습니다.
    app/archive/layout.tsx 안에 여러 병렬 라우트 슬롯이 정의되어 있습니다.

    그중 @latest 슬롯 안에는 /archive/[year] URL에 대응할 page.js나 default.js가
    존재하지 않습니다.

    결과적으로 "어떤 슬롯은 해당 URL을 처리할 수 있는데, @latest 슬롯은 처리를 못 하니 
    URL 매칭이 깨진다"며 Next.js가 빌드를 중단시키는 것입니다.

해결 방법

해결책은 간단합니다. @latest 슬롯(또는 에러 메시지에 언급된 해당 폴더)에
default.tsx(또는 default.js) 파일을 생성해 주면 됩니다.
왜 page.js가 아니라 default.js인가요?

    사용자가 /archive/2026으로 직접 접속했을 때, 
    메인 콘텐츠는 동적 라우트([year])가 처리하지만 @latest 슬롯은 하드코딩된
    특정 연도가 아니라 "최신 글"을 보여주는 고정된 컴포넌트일 수 있습니다.

    이처럼 상위 URL(예: /archive)에서 하위 URL(예: /archive/2026)로 이동했을 때,
    서브 슬롯이 어떤 상태를 유지해야 할지 모르는 경우 Next.js는 default.js를 찾습니다.

    default.js는 해당 슬롯이 현재 URL에 매칭되는 페이지를 찾지 못했을 때 렌더링할
    fallback(대체) 파일 역할을 합니다.

조치 순서

    @latest 폴더 내부(예: app/archive/@latest/default.tsx)에 파일을 만듭니다.
    기본으로 보여줄 UI 컴포넌트를 작성합니다.

TypeScript

// app/archive/@latest/default.tsx
export default function LatestDefault() {
  return (
    <div>
      <h3>최신 아카이브</h3>
    </div>
  );
}

이렇게 @latest 폴더 내부에 default.tsx를 추가해 주면, /archive/[year]와 같은 
하위 경로로 진입했을 때 @latest 슬롯이 무엇을 그려야 할지 알 수 있게 되므로 에러가 해결됩니다.

*/
import { ReactNode } from "react";

export interface ArchiveLayoutProps {
  archive: ReactNode;
  latest: ReactNode;
}

// [IMPORTANT]
// The `layout.tsx` is required for the parallel pages.
// where it is folder that the route has parallel with @ symbol
function ArchiveLayout({ archive, latest }: ArchiveLayoutProps) {
  return (
    <div>
      <h1>News Archive</h1>
      {/* Parallel routes that two routes show up in the s */}
      <section id="archive-filter">
        {archive}
      </section>
      <section id="archive-latest">
        {latest}
      </section>
    </div>
  );
}

export default ArchiveLayout;