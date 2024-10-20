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
import { useRouter } from "next/navigation";
import { useMyContext } from "@/context/ContextProvider";

const LoginForm = () => {
    const form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const { setToken } = useMyContext();
    const [login, { loading }] = useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
    const router = useRouter(); 

    const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
        try {
            const { data: response } = await login({
                variables: {
                    input: {
                        email: data.email,
                        password: data.password,
                    }
                }
            });
    
            if (response?.login) {
                setToken(response.login.token);
                router.push('/pages/Dashboard');
                toast.success("Login successful");
                setTimeout(() => {
                    window.location.reload()    
                }, 2000);
                 
            } else {
                toast.error("Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("An error occurred during login.");
        }
    };
    
    
    

    return (
        <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100 p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full md:w-1/2 max-w-lg text-black mb-8 md:mb-0 md:mr-8"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome Back</h1>
                <p className="text-xl md:text-2xl text-gray-700">
                    Log in to continue your journey of sharing your thoughts, stories, and experiences with readers around the world. Your voice matters, and we're excited to have you back!
                </p>
            </motion.div>

            <motion.div
                className="w-full md:w-1/2 max-w-md p-8 space-y-6 bg-gray-200 rounded-lg shadow-xl"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <h2 className="text-3xl font-bold text-black text-center mb-6">Login</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Email</FormLabel>
                                    <FormControl>
                                        <Input className="bg-white text-black placeholder-gray-400 border-gray-300 rounded-md focus:border-black focus:ring-black" type="email" placeholder="petergriffin@gmail.com" {...field} />
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
                                    <FormLabel className="text-gray-700">Password</FormLabel>
                                    <FormControl>
                                        <Input className="bg-white text-black placeholder-gray-400 border-gray-300 rounded-md focus:border-black focus:ring-black" type="password" placeholder="*****" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />

                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded-md transition-colors duration-300 font-semibold">
                                {loading ? "Logging in..." : "Login"}
                            </Button>
                        </motion.div>
                        <p className="text-center text-gray-600 mt-4">
                            Don't have an account? <a href="/Auth/signUp" className="text-black font-semibold hover:underline">Sign up here</a>
                        </p>
                    </form>
                </Form>
            </motion.div>
        </div>
    );
};

export default LoginForm;