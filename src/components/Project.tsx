"use client";

import { Project as ProjectModel } from "@prisma/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useState } from "react";
import AddEditProjectDialog from "./AddEditProjectDialog";
import { Clock, FlagTriangleRight } from "lucide-react";
import { Button } from "./ui/button";

interface ProjectProps {
    project: ProjectModel;
}

const deadlineApproching = (deadline: Date) => {
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    const days = diff / (1000 * 60 * 60 * 24);
    return days;
};

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
                    <CardTitle className="flex items-center justify-between">
                        {project.title}

                        {project.priority !== 'low' &&
                            <FlagTriangleRight color={project.priority == 'high' ? 'red' : 'orange'} />
                        }
                        
                    </CardTitle>
                    <CardDescription className="flex flex-col gap-1 mt-4">
                        <span>
                            {date}
                            {wasUpdated && " (updated)"}
                        </span>
                        { project.deadline &&
                            <span className={`flex gap-2 items-center ${deadlineApproching(project.deadline) < 3 && project.status !== 'done' ? 'text-red-500' : 'text-gray-500'}`}>
                                <Clock size={16} />
                                {project.deadline?.toDateString()}
                            </span>
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-line">{project.content}</p>    
                </CardContent>
                <CardFooter className="flex items-center justify-end">
                    <span className={`text-right capitalize p-2 rounded-lg ${project.status == 'done' ? 'bg-green-400' : 'bg-gray-200'}`}>{project.status?.replace("-", " ")}</span>
                </CardFooter>
            </Card>
            <AddEditProjectDialog open={showEditProjectDialog} setOpen={setShowEditProjectDialog} projectToEdit={project}/>
        </>
    )

};
export default Project;