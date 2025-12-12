"use client";

import { useSyncExternalStore } from "react";

export function ClientOnly(props: React.PropsWithChildren) {
  return (
    useSyncExternalStore(
      () => () => {},
      () => true,
      () => false,
    ) && props.children
  );
}
