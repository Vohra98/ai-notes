import { createProjectSchema, CreateProjectSchema } from "@/lib/validation/project";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import LoadingButton from "./ui/loading-button";
import { useRouter } from "next/navigation";
import { Project } from "@prisma/client";
import { useState } from "react";

interface AddEditProjectDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    projectToEdit?: Project;
};

const AddEditProjectDialog = ({ open, setOpen, projectToEdit}: AddEditProjectDialogProps) => {
    const [ deleteInProgress, setDeleteInProgress ] = useState(false);
    const router = useRouter();
    const form = useForm<CreateProjectSchema>({
        
        resolver: zodResolver(createProjectSchema),
        defaultValues: {
            title: projectToEdit?.title || "",
            content: projectToEdit?.content || "",
        },
    });

    async function onSubmit(input: CreateProjectSchema) {

        try {
            if (projectToEdit) {
                const response = await fetch("/api/projects/", {
                    method: "PUT",
                    body: JSON.stringify({
                        ...input,
                        id: projectToEdit.id,
                    }),
                });
                if (!response.ok) {
                    throw Error("status code: " + response.status);
                }
            } else {
                const response = await fetch("/api/projects", {
                    method: "POST",
                    body: JSON.stringify(input),
                });
    
                if (!response.ok) {
                    throw Error("status code: " + response.status);
                }
                form.reset();
            }
            router.refresh();
            setOpen(false);

        } catch (error) {
            console.error(error);
            alert("something went wrong, Please try again later");
        }
    };

    async function onDelete() {
        if(!projectToEdit) return;
        setDeleteInProgress(true);
        try {
            const response = await fetch("/api/projects", {
                method: "DELETE",
                body: JSON.stringify({
                    id: projectToEdit.id,
                }),
            });
            if (!response.ok) {
                throw Error("status code: " + response.status);
            }
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("something went wrong, Please try again later");
        } finally{
            setDeleteInProgress(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {projectToEdit ? "Edit project" : "Add project"}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                        <FormField 
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Project name
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="Project Name" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                    
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Project content
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Project Content" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="gap-4 md:gap-0">
                            {projectToEdit && (
                                <LoadingButton
                                    loading={deleteInProgress}
                                    onClick={onDelete}
                                    className="mr-2"
                                    disabled={form.formState.isSubmitting}
                                    variant="destructive"
                                    type="button"
                                >
                                    Delete
                                </LoadingButton>
                            
                            )}
                            <LoadingButton
                                type="submit"
                                loading={form.formState.isSubmitting}
                                disabled={deleteInProgress}
                            >
                                {projectToEdit ? "Edit project" : "Add project"}
                            </LoadingButton>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddEditProjectDialog;