"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";
import { Textarea } from "@/components/ui/textarea";
import { useNavigation } from "@/hooks/use-navigation";
import { useStore as useStoreApp } from "@/hooks/use-store-app";
import { useChat } from "@ai-sdk/react";
import { formatISO } from "date-fns";
import { marked } from "marked";
import { use } from "react";
import useSWRImmutable from "swr/immutable";

type Props = PageProps<"/[locale]/chat/[chatId]">;

export default function Page(props: Props) {
  const params = use(props.params);
  const { router } = useNavigation();
  const storeApp = useStoreApp();
  const chat = useChat({
    id: params.chatId,
    messages: storeApp.chats[params.chatId]?.messages,
    onFinish(options) {
      storeApp.set((s) => ({
        chats: {
          ...s.chats,
          [params.chatId]: {
            ...s.chats[params.chatId],
            updated_at: formatISO(new Date()),
            messages: options.messages,
          },
        },
      }));
      storeApp.set({ chatShouldSend: false });
      storeApp.set((s) => ({ chatStep: ++s.chatStep }));
    },
  });

  useSWRImmutable([params.chatId], () => {
    if (storeApp.chatShouldSend) {
      chat.sendMessage();
    }
  });

  return (
    <main className="relative container mx-auto flex-1 p-8 [--sw:0px] peer-data-[state=expanded]:[--sw:var(--sidebar-width)]">
      {/*  */}
      <ul className="flex flex-col gap-16 pb-160 [--spacing:3px]">
        {chat.messages.map((item) => {
          const message = item.parts
            .map((item) => (item.type === "text" ? item.text : ""))
            .join("");
          return (
            <li
              key={item.id}
              data-role={item.role}
              className="data-[role=assistant]:mr-auto data-[role=user]:ml-auto data-[role=user]:pl-16"
            >
              {item.role === "user" && (
                <Card>
                  <CardContent>
                    <p>{message}</p>
                  </CardContent>
                </Card>
              )}
              {item.role === "assistant" && (
                <div
                  className="typography"
                  dangerouslySetInnerHTML={{ __html: marked.parse(message) }}
                ></div>
              )}
            </li>
          );
        })}
      </ul>

      {/*  */}
      <form
        className="fixed right-8 bottom-8 left-[calc(var(--sw)+--spacing(8))] mx-auto max-w-prose"
        onSubmit={(e) => {
          e.preventDefault();
          storeApp.set((s) => ({ chatStep: ++s.chatStep }));
          storeApp.set({ chatInput: "" });
          if (params.chatId === "new") {
            const newChatId = window.crypto.randomUUID();
            storeApp.set((s) => ({
              chats: {
                ...s.chats,
                [newChatId]: {
                  id: newChatId,
                  created_at: formatISO(new Date()),
                  updated_at: formatISO(new Date()),
                  name: "",
                  messages: [
                    {
                      id: newChatId,
                      role: "user",
                      parts: [{ type: "text", text: storeApp.chatInput }],
                    },
                  ],
                },
              },
            }));
            storeApp.set({ chatShouldSend: true });
            router.push(newChatId);
          } else {
            storeApp.set((s) => ({
              chats: {
                ...s.chats,
                [params.chatId]: {
                  ...s.chats[params.chatId],
                  updated_at: formatISO(new Date()),
                },
              },
            }));
            chat.sendMessage({ text: storeApp.chatInput });
            window.scroll({
              top: window.document.documentElement.scrollHeight,
            });
          }
        }}
      >
        <fieldset disabled={chat.status !== "ready"}>
          <Textarea
            key={storeApp.chatStep}
            className="bg-background dark:bg-background max-h-32 min-h-20 resize-none overflow-y-auto [&]:[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            autoFocus
            value={storeApp.chatInput}
            onChange={(e) => {
              storeApp.set({ chatInput: e.currentTarget.value });
            }}
            onKeyDown={(e) => {
              if (
                e.code === "Enter" &&
                e.ctrlKey &&
                storeApp.chatInput.trim().length
              ) {
                e.currentTarget.form?.requestSubmit();
              }
            }}
          ></Textarea>
          <Button
            variant={"outline"}
            size={"sm"}
            className="absolute right-2 bottom-2"
            type="submit"
            disabled={!storeApp.chatInput.trim().length}
          >
            <Kbd>{"ctrl"}</Kbd>
            <Kbd>{"⏎"}</Kbd>
          </Button>
        </fieldset>
      </form>
    </main>
  );
}
