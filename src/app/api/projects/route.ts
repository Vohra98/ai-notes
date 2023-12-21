import prisma from "@/lib/db/prisma";
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

        const project = await prisma.project.create({
            data: {
                title,
                content,
                status,
                priority,
                deadline,
                userId
            }
        });

        return Response.json({project}, {status: 201});

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

        const updatedProject = await prisma.project.update({
            where: {id},
            data: {
                title,
                content,
                priority,
                status,
                deadline
            }
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

        await prisma.project.delete({where: {id}});

        return Response.json({message: "Project Deleted"}, {status: 200});

    } catch (error) {
        console.log(error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}