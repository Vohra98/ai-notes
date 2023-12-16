"use client";

import { Project as ProjectModel } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useState } from "react";
import AddEditProjectDialog from "./AddEditProjectDialog";

interface ProjectProps {
    project: ProjectModel;
}

const Project = ({project}: ProjectProps) => {
    const [showEditProjectDialog, setShowEditProjectDialog] = useState(false);
    const wasUpdated = project.updatedAt > project.createdAt;
    const date = (wasUpdated ? project.updatedAt : project.createdAt).toDateString();

    return (
        <>
            <Card
                className="cursor-pointer transition-shadow hover:shadow-lg"
                onClick={() => {
                    setShowEditProjectDialog(true);
                }}
            >
                <CardHeader>
                    <CardTitle>
                        {project.title}
                    </CardTitle>
                    <CardDescription>
                        {date}
                        {wasUpdated && " (updated)"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-line">{project.content}</p>
                </CardContent>
            </Card>
            <AddEditProjectDialog open={showEditProjectDialog} setOpen={setShowEditProjectDialog} projectToEdit={project}/>
        </>
    )

};
export default Project;