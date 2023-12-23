import { useState } from "react";
import AiChatBox from "./AiChatBox";
import { Button } from "./ui/button";
import { Bot } from "lucide-react";


const AiChatButton = () => {
    const [chatBoxOpen, setChatBoxOpen] = useState(false);

    return(
        <>
            <Button onClick={() => setChatBoxOpen(true)}>
                <Bot size={24} className="mr-4"/>
                AI Chat
            </Button>
            <AiChatBox open={chatBoxOpen} onClose={() => setChatBoxOpen(false)} />
        </>
    )
};

export default AiChatButton;