import { projectsIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import openAi, { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import { ChatCompletionMessage, ChatCompletionSystemMessageParam } from "openai/resources/index.mjs";
import {OpenAIStream, StreamingTextResponse} from "ai"


export async function POST(req: Request){
    try {
        const body = await req.json();
        const messages: ChatCompletionMessage[] = body.messages;

        const messagesTruncated = messages.slice(-6);

        const embedding = await getEmbedding(
            messagesTruncated.map((message) => message.content).join("\n")
        );

        const {userId} = auth();

        const vectorQueryResponse = await projectsIndex.query({
            vector: embedding,
            topK: 6,
            filter: {userId}
        });

        const relevantProjects = await prisma.project.findMany({
            where: {
                id: {
                    in: vectorQueryResponse.matches.map((match) => match.id)
                }
            }
        });

        console.log("relProjects: ", relevantProjects);

        const systemMessage: ChatCompletionSystemMessageParam = {
            role: "system",
            content: "You are a intelligent project manager app. You answer the users questions based on their existing project notes. " +
            "The relevant projects and notes for this query are: " + relevantProjects.map((project) => `
                    Title: ${project.title}
                    \n\n
                    Content: \n ${project.content}
                    \n\n
                    Status: ${project.status}
                    \n\n
                    Priority: ${project.priority}
                    \n\n
                    Deadline: ${project.deadline}
                `).join("\n\n\n"),
        };

        const response = await openAi.chat.completions.create({
            model: "gpt-3.5-turbo",
            stream: true,
            messages: [systemMessage, ...messagesTruncated]
        });

        const stream = OpenAIStream(response);
        return new StreamingTextResponse(stream);
    


    } catch (error) {
        console.log(error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
};