import Project from "@/components/Project";
import prisma from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI - projects",
    description: "The interligent project manager that helps you manage your projects using AI",
    
};


const projectsPage = async () => {
    const { userId } = auth();

    if (!userId) throw new Error("Not authenticated");

    const allprojects = await prisma.project.findMany({
        where: {
            userId,
        },
    });
    
    return (
        <>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {allprojects.map((project) => {
                    return (
                    <Project key={project.id} project={project} />
                    );
                })}
                
            </div>
            {allprojects.length === 0 && (
                <div className="text-center max-w-4xl mx-auto my-8">
                    <h2 className="text-3xl font-bold text-center">
                    {"You don't have any projects yet, Go find some projects to manage instead of wasting your time here?"}
                    </h2>
                </div>
            )}
        </>
        
        
    );
};


export default projectsPage;

