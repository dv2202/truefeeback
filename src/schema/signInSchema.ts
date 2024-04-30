import {z} from 'zod';
//you can say identifier as email or username no issue 


export const signInSchema = z.object({
    identifier: z.string(),
    password: z.string()
})
    