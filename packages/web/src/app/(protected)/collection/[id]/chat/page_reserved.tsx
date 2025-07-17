// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { ArrowUpRight, Square } from "lucide-react";

// import CollectionIdTabs from "@/app/(protected)/collection/[id]/_components/tabs";
// import ChangeChatSheet from "@/app/(protected)/collection/[id]/chat/_components/change-chat";
// import { Button } from "@/components/ui/button";
// import {
//   PromptInput,
//   PromptInputAction,
//   PromptInputActions,
//   PromptInputTextarea,
// } from "@/components/ui/prompt-input";
// import { getFileIcon } from "@/lib/files";
// import type { ChatCollection, ChatMessage, Document } from "@/types";

// import {
//   MOCK_CHAT_COLLECTION,
//   MOCK_CHAT_CONTENT,
//   MOCK_CHAT_HISTORY,
// } from "../__mock__/chat";
// import { MOCK_DOCUMENTS } from "../__mock__/documents";
// import { ChatMessageStream } from "./_components/ChatMessageStream";

// export default function ChatPage() {
//   // const params = useParams();
//   const params = { id: "e98a6169-75b8-43bf-805d-5b379b9f4a0d" }; // Mocking useParams for demonstration
//   const { id } = params;

//   const chatData: ChatCollection | undefined = useMemo(() => {
//     const data = MOCK_CHAT_COLLECTION.find((chat) => chat.id === id);
//     if (!data) return undefined;
//     if (data.id === MOCK_CHAT_HISTORY.id) {
//       return { ...data, history: MOCK_CHAT_HISTORY.history };
//     }
//     return { ...data, history: [] };
//   }, [id]);

//   const [chatHistory, setChatHistory] = useState<ChatMessage[]>(
//     chatData?.history ?? [],
//   );
//   const [inputText, setInputText] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isStreaming, setIsStreaming] = useState(false);
//   const [lastAssistantMessageId, setLastAssistantMessageId] = useState<
//     string | null
//   >(null);

//   // Auto complete stated
//   const [showAutocomplete, setShowAutocomplete] = useState(false);
//   const [autocompleteQuery, setAutocompleteQuery] = useState("");
//   const [cursorPosition, setCursorPosition] = useState(0);

//   const chatRef = useRef<HTMLDivElement | null>(null);

//   const scrollToBottom = () => {
//     if (chatRef.current) {
//       chatRef.current.scrollTop = chatRef.current.scrollHeight;
//     }
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [chatHistory]);

//   const handleSend = () => {
//     if (!inputText.trim()) return;

//     const now = new Date().toISOString();
//     const userMessage: ChatMessage = {
//       id: Date.now().toString(),
//       role: "user",
//       content: inputText,
//       collection_chat_id: "e98a6169-75b8-43bf-805d-5b379b9f4a0d",
//       created_at: now,
//       created_by: "0ea38322-4d8b-4a63-af9e-2dd31cf9db2e",
//     };

//     setChatHistory((prev) => [...prev, userMessage]);
//     setInputText("");

//     const assistantMessage: ChatMessage = {
//       id: (Date.now() + 1).toString(),
//       role: "assistant",
//       content: MOCK_CHAT_CONTENT,
//       collection_chat_id: "e98a6169-75b8-43bf-805d-5b379b9f4a0d",
//       created_at: now,
//       created_by: "0ea38322-4d8b-4a63-af9e-2dd31cf9db2e",
//     };

//     setChatHistory((prev) => [...prev, assistantMessage]);
//     setLastAssistantMessageId(assistantMessage.id);

//     // Control loading and streaming states
//     setIsLoading(true);
//     setIsStreaming(true);

//     setTimeout(() => {
//       setIsLoading(false);
//       setIsStreaming(true);
//     }, 2000);
//   };

//   // Handle input change for auto-complete
//   useEffect(() => {
//     const cursor = cursorPosition;
//     const value = inputText;

//     // Find last '@' before cursor
//     const triggerIndex = value.lastIndexOf("@", cursor - 1);

//     if (triggerIndex !== -1) {
//       // Extract the substring after '@' up to the cursor
//       const query = value.substring(triggerIndex + 1, cursor);

//       // Only show autocomplete if there's no space in the query
//       if (!query.includes(" ")) {
//         setAutocompleteQuery(query);
//         setShowAutocomplete(true);
//         return;
//       }
//     }

//     // Otherwise, hide autocomplete
//     setAutocompleteQuery("");
//     setShowAutocomplete(false);
//   }, [inputText, cursorPosition]);

//   // Filter documents based on the autocomplete query
//   const filteredDocuments = useMemo(() => {
//     if (!autocompleteQuery) return [];
//     return MOCK_DOCUMENTS.filter((doc) =>
//       doc.file_name.toLowerCase().includes(autocompleteQuery.toLowerCase()),
//     );
//   }, [autocompleteQuery]);

//   // Mention syntax helper
//   const mentionSyntax = (doc: Document) => `@[${doc.id}|${doc.file_name}]`;

//   // Handle document selection
//   const handleSelectDocument = (doc: Document) => {
//     const beforeCursor = inputText.substring(0, cursorPosition);
//     const afterCursor = inputText.substring(cursorPosition);

//     const triggerIndex = beforeCursor.lastIndexOf("@");
//     const mentionText = mentionSyntax(doc);

//     const newText =
//       beforeCursor.substring(0, triggerIndex) + mentionText + " " + afterCursor;

//     setInputText(newText);
//     setShowAutocomplete(false);

//     // Update cursor position to after inserted mention plus space
//     const newCursorPos = (
//       beforeCursor.substring(0, triggerIndex) +
//       mentionText +
//       " "
//     ).length;
//     setCursorPosition(newCursorPos);
//   };
//   if (!chatData) {
//     return <div>Chat not found</div>;
//   }

//   return (
//     <>
//       <CollectionIdTabs tab="tab-chat" />
//       <div className="bg-background flex h-[calc(100vh-8rem)] w-full flex-col border-l">
//         <header className="border-b p-4">
//           {/* <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="flex items-center gap-2 p-0">
//                 <h1 className="text-xl font-bold">{chatData.title}</h1>
//                 <ChevronDown className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent>
//               <div className="p-2">
//                 <p className="font-bold">{chatData.title}</p>
//                 <p className="text-muted-foreground text-sm">
//                   {chatData.description}
//                 </p>
//                 <div className="text-muted-foreground mt-2 text-xs">
//                   <p>Updated by: {chatData.updated_by}</p>
//                   <p>
//                     Updated at:{" "}
//                     {formatDistanceToNow(new Date(chatData.updated_at), {
//                       addSuffix: true,
//                     })}
//                   </p>
//                 </div>
//               </div>
//               <div className="my-2 border-t" />
//               <div className="text-muted-foreground px-2 py-1 text-xs font-semibold">
//                 Other Chats
//               </div>
//               {MOCK_CHAT_COLLECTION.filter((c) => c.id !== chatData.id).map(
//                 (chat) => (
//                   <DropdownMenuItem
//                     key={chat.id}
//                     onClick={() => {
//                       window.location.href = `/collection/${chat.collection_id}/chat/${chat.id}`;
//                     }}
//                   >
//                     {chat.title}
//                   </DropdownMenuItem>
//                 ),
//               )}
//             </DropdownMenuContent>
//           </DropdownMenu> */}
//           <ChangeChatSheet title={chatData.title} />
//         </header>

//         <main ref={chatRef} className="flex-1 space-y-4 overflow-y-auto p-4">
//           {chatHistory.map((message) => (
//             <ChatMessageStream
//               key={message.id}
//               message={message}
//               chatRef={chatRef}
//               isLoading={
//                 isLoading &&
//                 message.role === "assistant" &&
//                 message.id === lastAssistantMessageId
//               }
//               isStreaming={
//                 isStreaming &&
//                 message.role === "assistant" &&
//                 message.id === lastAssistantMessageId
//               }
//             />
//           ))}
//         </main>

//         <footer className="absolute bottom-5 left-0 flex w-full justify-center bg-transparent p-6">
//           <div className="relative w-1/2">
//             <PromptInput
//               value={inputText}
//               onValueChange={(value) => setInputText(value)}
//               onCursorChange={(pos) => setCursorPosition(pos)}
//               isLoading={isLoading}
//               onSubmit={handleSend}
//               className="w-full"
//             >
//               <PromptInputTextarea placeholder="Type @ to mention a document..." />

//               {showAutocomplete && (
//                 <div className="bg-background absolute bottom-20 left-0 z-50 w-full rounded-lg border shadow-md">
//                   {filteredDocuments.length > 0 ? (
//                     filteredDocuments.map((doc) => (
//                       <button
//                         key={doc.id}
//                         className="hover:bg-muted flex w-full items-center gap-2 px-4 py-2 text-left text-sm"
//                         onClick={() => handleSelectDocument(doc)}
//                       >
//                         {getFileIcon({
//                           file: {
//                             name: doc.file_name,
//                             type: doc.file_type,
//                           },
//                         })}
//                         {doc.file_name}
//                       </button>
//                     ))
//                   ) : (
//                     <div className="text-muted-foreground px-4 py-2 text-sm">
//                       No results found
//                     </div>
//                   )}
//                 </div>
//               )}

//               <PromptInputActions className="justify-end pt-2">
//                 <PromptInputAction
//                   tooltip={isLoading ? "Stop generation" : "Send message"}
//                 >
//                   <Button
//                     variant="default"
//                     size="icon"
//                     className="absolute right-0 h-8 w-8 -translate-y-1/2 rounded-full"
//                     onClick={handleSend}
//                     aria-label="Send message"
//                   >
//                     {isLoading ? (
//                       <Square className="size-5 fill-current" />
//                     ) : (
//                       <ArrowUpRight className="size-5" />
//                     )}
//                   </Button>
//                 </PromptInputAction>
//               </PromptInputActions>
//             </PromptInput>
//           </div>
//         </footer>
//       </div>
//     </>
//   );
// }
