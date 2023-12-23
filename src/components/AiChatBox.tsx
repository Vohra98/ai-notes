import { cn } from "@/lib/utils";
import {useChat} from "ai/react"
import { Bot, XCircle } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Message } from "ai";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { use, useEffect, useRef } from "react";
interface AiChatBoxProps {
    open: boolean;
    onClose: () => void;
}

const AiChatBox = ({open, onClose} : AiChatBoxProps) => {
    const { 
        messages,
        input,
        handleInputChange,
        handleSubmit,
        setMessages,
        isLoading,
        error
    } = useChat();

    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (open) {
            inputRef.current?.focus();
        }
    }, [open]);

    return (
        <div className={cn("bottom-0 right-0 z-10 w-full max-w-[500px] p-1", open ? "fixed" : "hidden")}>
            <button onClick={onClose} className="mb-1 ms-auto block">
                <XCircle size={24} />
            </button>
            <div className="flex h-[600px] flex-col rounded-lg bg-background border shadow-xl">
                <div className="h-full mt-3 px-3 overflow-y-auto" ref={scrollRef}>
                    {messages.map((message) => (
                        <ChatMessage key={message.id} message={message} />
                    ))}
                </div>
                <form onSubmit={handleSubmit} className="m-3 flex gap-1">
                    <Input
                        value={input}
                        onChange={handleInputChange}
                        placeholder="Ask me a question"
                        ref={inputRef}
                    />
                    <Button type="submit" disabled={isLoading}>
                        Send
                    </Button>
                </form>
            </div>
        </div>
    )
};

export default AiChatBox;

function ChatMessage({message: {role, content}}: {message: Message}) {
    const {user} = useUser();
    const isAiMessage = role === "assistant";
    return (
        <div className={cn("mb-3 flex items-center", isAiMessage ? "justify-start me-5" : "justify-end ms-5")}>
            {isAiMessage && <Bot className="mr-2 shrink-0" />}
            <p className={cn("whitespace-pre-line rounded-md border px-3 py-2", isAiMessage ? "bg-background" : "bg-primary text-primary-foreground")}>
                {content}
            </p>
            {!isAiMessage && user?.imageUrl && (
                <Image
                    src={user.imageUrl}
                    width={40}
                    height={40}
                    alt="user image"
                    className="ml-2 rounded-full"
                />
            )}
        </div>
    )
};