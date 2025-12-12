import { useParams, usePathname, useRouter } from "next/navigation";

export function useNavigation() {
  return {
    pathname: usePathname(),
    params: useParams(),
    router: useRouter(),
  };
}
