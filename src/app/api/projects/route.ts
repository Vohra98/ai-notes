import { projectsIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/openai";
import { createProjectSchema, deleteProjectSchema, updateProjectSchema } from "@/lib/validation/project";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parseResult = createProjectSchema.safeParse(body);

        if (!parseResult.success) {
            console.log(parseResult.error);
            return Response.json({ error: "Invalid input" }, { status: 400 });
        }

        const { title, content, status, priority, deadline } = parseResult.data;

        const {userId} = auth();

        if (!userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const embedding = await getEmbeddingForProject(title, content, status, priority, deadline);

        const project = await prisma.$transaction(async (tx) => {
            const project = await tx.project.create({
                data: {
                    title,
                    content,
                    status,
                    priority,
                    deadline,
                    userId
                }
            });

            await projectsIndex.upsert([
                {
                    id: project.id,
                    values: embedding,
                    metadata: {userId}
                }
            ])

            return project;
        });

        return Response.json({ project }, {status: 201});

    } catch (error) {
        console.log(error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const parseResult = updateProjectSchema.safeParse(body);

        if (!parseResult.success) {
            console.log(parseResult.error);
            return Response.json({ error: "Invalid input" }, { status: 400 });
        }

        const { id, title, content, status, priority, deadline } = parseResult.data;

        const note = await prisma.project.findUnique({where: {id}});

        if (!note) {
            return Response.json({ error: "Project not found" }, { status: 404 });
        }

        const {userId} = auth();

        if (!userId || userId !== note.userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const embedding = await getEmbeddingForProject(title, content, status, priority, deadline);

        const updatedProject = await prisma.$transaction(async (tx) => {
            const updatedProject = await tx.project.update({
                where: {id},
                data: {
                    title,
                    content,
                    status,
                    priority,
                    deadline
                }
            });

            await projectsIndex.upsert([
                {
                    id,
                    values: embedding,
                    metadata: { userId }
                }
            ])

            return updatedProject;
        });

        return Response.json({updatedProject}, {status: 200});

    } catch (error) {
        console.log(error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}


export async function DELETE(req: Request) {
    try {
        const body = await req.json();
        const parseResult = deleteProjectSchema.safeParse(body);

        if (!parseResult.success) {
            console.log(parseResult.error);
            return Response.json({ error: "Invalid input" }, { status: 400 });
        }

        const { id } = parseResult.data;

        const note = await prisma.project.findUnique({where: {id}});

        if (!note) {
            return Response.json({ error: "Project not found" }, { status: 404 });
        }

        const {userId} = auth();

        if (!userId || userId !== note.userId) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.$transaction(async (tx) => {
            await tx.project.delete({where: {id}});
            await projectsIndex.deleteOne(id);
        });

        return Response.json({message: "Project Deleted"}, {status: 200});

    } catch (error) {
        console.log(error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}

async function getEmbeddingForProject(title: string, content: string|undefined, status: string|undefined, priority: string|undefined, deadline: Date|undefined) {
    return getEmbedding(title + "\n\n" + (content ?? '') + (status ?? '') + (priority ?? '') + (deadline?.toISOString() ?? ''))
}