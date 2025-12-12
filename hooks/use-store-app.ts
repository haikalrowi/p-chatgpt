import { UIMessage } from "ai";
import { createSerializer, useQueryStates } from "nuqs";
import { create } from "zustand";
import { combine, persist } from "zustand/middleware";

const searchParams = {
  //
};

export const [
  //
  serialize,
  useStoreImpl,
  useStore,
] = [
  createSerializer(searchParams),
  create(
    persist(
      combine(
        {
          chatInput: "",
          chats: {} as Record<
            string,
            {
              id: string;
              created_at: string;
              updated_at: string;
              name: string;
              messages: UIMessage[];
            }
          >,
          chatShouldSend: false,
          chatStep: 0,
        },
        (set) => ({ set }),
      ),
      { name: "use-store-app" },
    ),
  ),
  function () {
    const searchParamsState = useQueryStates(searchParams);
    return {
      searchParams: {
        ...searchParamsState[0],
        set: searchParamsState[1],
      },
      ...useStoreImpl(),
    };
  },
];
