'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SignInSchema } from "@/Schema/SignInSchema";
import { motion } from 'framer-motion';
import { LoginMutation, LoginMutationVariables, LoginDocument } from "@/gql/graphql";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import Router from "next/router";


const SignupForm = () => {
    const form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const [login, {loading, error}] = useMutation<LoginMutation, LoginMutationVariables>(LoginDocument)

    const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
            try {
                const {data: response} = await login({
                    variables: {
                        input: {
                        email: data.email,
                        password: data.password,
                        }
                    }
                })

                if(response?.login){
                    console.log(response);
                    Router.push("/dashboard")
                    toast.success("User creation successfull")
                }else{
                    toast.error("User creation failed")
                }
            } catch (error) {
                
            }
    };

    return (
        <div className="flex flex-row items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-slate-300 to-black px-4 md:px-0">
            <div className="hidden md:block max-w-lg md:text-3xl text-white mb-6 lg:mb-0 lg:mr-6">
                <p>
                    Unlock your voice and connect with readers around the world. Whether you're a seasoned blogger or just starting your journey, our platform empowers you to share your thoughts, stories, and experiences with an engaged audience. Create your account now and start writing today. It's free, simple, and your words have the power to inspire!
                </p>
            </div>

            <motion.div
                className="w-full max-w-md p-6 md:p-8 space-y-6 bg-white rounded-lg shadow-md"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <h2 className="text-2xl font-bold text-black text-center">Sign Up</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-black">Email</FormLabel>
                                    <FormControl>
                                        <Input className="bg-white text-black placeholder-black" type="email" placeholder="petergriffin@gmail.com" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-black">Password</FormLabel>
                                    <FormControl>
                                        <Input className="bg-white text-black placeholder-black" type="password" placeholder="*****" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full bg-black hover:bg-gray-700 text-white">
                            {loading ? "Login..." : "login"}
                        </Button>
                    </form>
                </Form>
            </motion.div>
        </div>
    );
};

export default SignupForm;
