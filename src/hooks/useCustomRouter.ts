import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';
import { usePathname, useRouter } from 'next/navigation';

export function useCustomRouter() {
  const pathname = usePathname();
  const router = useRouter();

  const customPush: AppRouterInstance['push'] = (href, options) => {
    router.push(resolveHref(href, pathname), options);
  };

  return {
    ...router,
    push: customPush,
  };
}

export function resolveHref(href: string, pathname: string | null) {
  const resolvedHref = href.startsWith('/') ? href : `/${href}`;

  return pathname?.startsWith('/app') ? `/app${resolvedHref}` : resolvedHref;
}
