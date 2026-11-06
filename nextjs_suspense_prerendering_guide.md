# Next.js에서 `params`, `usePathname()`과 `Suspense`를 이해하는 방법

## 1. 핵심 개념 세 가지

- **Prerendering (사전 렌더링)**: 사용자가 요청하기 전에 페이지의 HTML을 미리 만들어 두는 과정입니다.
- **Runtime (실행 시점)**: 실제 요청 또는 브라우저 탐색 과정에서 경로 등의 정보가 결정되는 시점입니다.
- **Suspense**: 렌더링 중 아직 준비되지 않은 부분을 별도로 분리하여, 나머지 화면과 대체 UI(fallback)를 먼저 보여줄 수 있게 하는 React 경계입니다.

> **핵심 질문:** “Next.js가 이 화면을 미리 만들 때 필요한 정보를 이미 알고 있는가?”

## 2. 정적 페이지는 미리 만들기 쉽습니다

```tsx
export default function NewsPage() {
  return <h1>Welcome to NextNews!</h1>;
}
```

위 컴포넌트는 어떤 사용자가 접근하든 같은 HTML을 반환합니다.

```html
<h1>Welcome to NextNews!</h1>
```

Next.js는 이런 부분을 미리 생성해 빠르게 제공할 수 있습니다.

## 3. `params`에서는 왜 문제가 생길까요?

```tsx
export default async function NewsPage({ params }: PageProps<'/news/[slug]'>) {
  const { slug } = await params;
  return <h1>{slug}</h1>;
}
```

`/news/apple`, `/news/google`처럼 주소마다 결과가 달라집니다. **사전 렌더링 시점에 어느 `slug`를 사용할지 모르면** 해당 내용을 미리 확정할 수 없습니다.

하지만 **`params`를 사용한다고 언제나 Suspense가 필요한 것은 아닙니다.** 경로를 `generateStaticParams()`로 미리 지정할 수도 있고, 프로젝트의 렌더링 설정에 따라 요청 시 렌더링할 수도 있습니다.

또한 Next.js 15부터 `params`는 Promise 형태입니다. **Promise라는 사실만으로 `Suspense`가 무조건 필요한 것은 아닙니다.**

## 4. Suspense가 해결하는 문제

```tsx
import { Suspense } from 'react';

async function NewsDetail({ params }: PageProps<'/news/[slug]'>) {
  const { slug } = await params;
  return <h2>{slug}</h2>;
}

export default function Page({ params }: PageProps<'/news/[slug]'>) {
  return (
    <>
      <h1>News Website</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <NewsDetail params={params} />
      </Suspense>
    </>
  );
}
```

화면을 다음처럼 나누는 것입니다.

```text
Page
├── News Website       → 미리 만들 수 있는 부분
└── Suspense
    ├── Loading...      → 기다리는 동안 표시할 대체 UI
    └── NewsDetail      → 필요한 정보가 준비되면 표시
```

**Suspense는 비동기 데이터를 직접 가져오는 함수가 아닙니다.** 렌더링 중 대기해야 하는 부분의 경계를 지정합니다.

## 5. `usePathname()`에도 왜 적용될까요?

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MainHeader() {
  const path = usePathname();

  return (
    <nav>
      <Link href="/news" className={path.startsWith('/news') ? 'active' : undefined}>
        News
      </Link>
      <Link href="/archive" className={path.startsWith('/archive') ? 'active' : undefined}>
        Archive
      </Link>
    </nav>
  );
}
```

현재 URL에 따라 `active` 클래스가 바뀝니다.

| 현재 경로 | News 링크 | Archive 링크 |
|---|---|---|
| `/news` | `active` | 기본 |
| `/news/article-1` | `active` | 기본 |
| `/archive` | 기본 | `active` |

사전 렌더링 시 현재 경로를 확정할 수 없는 조건에서는 `usePathname()`을 사용하는 부분이 렌더링을 막을 수 있습니다. 이 경우 해당 컴포넌트를 `Suspense`로 감싸 경계를 설정합니다.

```tsx
import { Suspense } from 'react';
import MainHeader from '@/components/main-header/main-header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          <MainHeader />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
```

`fallback={null}`이면 해당 부분이 준비되기 전에는 아무것도 표시하지 않습니다. 헤더를 항상 보여야 한다면 정적인 헤더와 경로에 의존하는 부분을 분리하는 구조가 더 좋을 수 있습니다.

> **주의:** `usePathname()`을 사용할 때마다 항상 `Suspense`가 필요한 것은 아닙니다. Next.js 공식 문서에서는 특히 `cacheComponents` 사용 및 동적 라우트 조건에 따라 필요할 수 있다고 설명합니다.

## 6. `'use client'`와 `Suspense`는 역할이 다릅니다

| 기능 | 의미 |
|---|---|
| `'use client'` | Client Component 경계를 지정합니다. |
| `usePathname()` | 현재 URL 경로를 읽는 Client Hook입니다. |
| `Suspense` | 렌더링이 잠시 대기하는 하위 영역의 fallback 경계를 지정합니다. |

**Client Component라고 해서 초기 서버 렌더링이 무조건 생략되는 것은 아닙니다.** Next.js는 초기 HTML을 만들 때 Client Component도 서버에서 미리 렌더링할 수 있습니다.

## 7. 왜 최근에 오류가 자주 발생할까요?

Next.js 버전과 프로젝트 설정에 따라 사전 렌더링 및 런타임 데이터 처리 방식이 달라집니다.

특히 Next.js 16의 `cacheComponents`가 활성화된 프로젝트에서는 미리 만들 수 있는 콘텐츠와 요청 시점에만 알 수 있는 데이터를 구별하는 것이 중요합니다.

다음 설정이 있는지 확인해 보세요.

```ts
// next.config.ts
const nextConfig = {
  cacheComponents: true,
};

export default nextConfig;
```

이 설정이 활성화되어 있으면 런타임에만 알 수 있는 데이터 접근을 `Suspense`로 분리해야 하는 상황이 발생할 수 있습니다. **다만 이 설정만으로 모든 오류 원인이 확정되는 것은 아닙니다.** 사용 중인 라우트 및 `generateStaticParams()` 등도 영향을 줍니다.

## 8. 한눈에 정리

| 코드/상황 | Suspense 필요 여부 |
|---|---|
| 일반적인 정적 컴포넌트 | 보통 필요 없음 |
| 일반적인 Client Component | 보통 필요 없음 |
| `params` 사용 | 렌더링 설정 및 경로에 따라 달라짐 |
| `usePathname()` 사용 | 렌더링 설정 및 동적 라우트에 따라 달라짐 |
| 정적 페이지에서 `useSearchParams()` 사용 | CSR 전환 방지를 위해 Suspense가 필요한 경우가 많음 |
| 런타임 데이터 때문에 사전 렌더링이 중단됨 | 적절한 Suspense 경계 또는 다른 렌더링 전략 필요 |

### 최종 요점

**`params`나 `usePathname()` 자체가 잘못된 것이 아닙니다.** 사전 렌더링 시점에는 알 수 없는 값에 의존할 때 문제가 생깁니다. `Suspense`는 그 부분을 분리하여 나머지 UI를 먼저 렌더링할 수 있게 합니다.

## 공식 참고 자료

- [Next.js — `usePathname`](https://nextjs.org/docs/app/api-reference/functions/use-pathname)
- [Next.js — Dynamic Segments](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes)
- [Next.js — `cacheComponents`](https://nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents)
- [Next.js — Blocking Prerender Client Hook](https://nextjs.org/docs/messages/blocking-prerender-client-hook)
- [React — `<Suspense>`](https://react.dev/reference/react/Suspense)
