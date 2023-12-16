import {z} from 'zod';

export const createProjectSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    content: z.string().optional()
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>; 

export const updateProjectSchema = createProjectSchema.extend({
    id: z.string().min(1)
});

export const deleteProjectSchema = z.object({
    id: z.string().min(1)
});