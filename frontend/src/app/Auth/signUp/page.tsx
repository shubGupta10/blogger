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
import { SignupSchema } from "@/Schema/SignUpSchema";
import { motion } from 'framer-motion';
import { SignUpMutation, SignUpMutationVariables, SignUpDocument } from "@/gql/graphql";
import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useMyContext } from "@/context/ContextProvider";
import Cookies from 'js-cookie';

const SignupForm = () => {
    const form = useForm<z.infer<typeof SignupSchema>>({
        resolver: zodResolver(SignupSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            gender: '',
            confirmPassword: '',
        }
    });
    const { setToken, setUser } = useMyContext();
    const [signup, { loading, error }] = useMutation<SignUpMutation, SignUpMutationVariables>(SignUpDocument);
    const router = useRouter();
    
    const onSubmit = async (data: z.infer<typeof SignupSchema>) => {
        try {
            const { data: response } = await signup({
                variables: {
                    input: {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        password: data.password,
                        gender: data.gender,
                    }
                }
            });


            if (response?.signUp) {
                const { token, user } = response.signUp;
                
                setToken(token);
                setUser(user); 
                localStorage.setItem('token', token);
                Cookies.set('token', token, { expires: 1 });

                toast.success("User creation successful");

                router.push('/Auth/login');
            } else {
                toast.error("User creation failed");
            }
        } catch (error) {
            console.error("Signup failed:", error);
            toast.error("Signup failed. Please try again.");
        }
    };

    return (
        <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-100 dark:bg-black p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full md:w-1/2 max-w-lg text-black dark:text-white mb-8 md:mb-0 md:mr-8"
            >
                <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Our Community</h1>
                <p className="text-xl md:text-2xl text-gray-700 dark:text-white">
                    Unlock your voice and connect with readers around the world. Create your account now and start writing today. It's free, simple, and your words have the power to inspire!
                </p>
            </motion.div>

            <motion.div
                className="w-full md:w-1/2 max-w-md p-8 space-y-6 border-2 bg-gray-200 rounded-lg shadow-xl"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <h2 className="text-3xl font-bold text-black text-center mb-6">Sign Up</h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormField
                                name="firstName"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-800">First Name</FormLabel>
                                        <FormControl>
                                            <Input className="bg-white text-black placeholder-gray-400 border-gray-300 rounded-md focus:border-black focus:ring-black" placeholder="Peter" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="lastName"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-800">Last Name</FormLabel>
                                        <FormControl>
                                            <Input className="bg-white text-black placeholder-gray-400 border-gray-300 rounded-md focus:border-black focus:ring-black" placeholder="Griffin" {...field} />
                                        </FormControl>
                                        <FormMessage className="text-red-500" />
                                    </FormItem>
                                )}
                            />
                        </div>

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

                        <FormField
                            name="confirmPassword"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input className="bg-white text-black placeholder-gray-400 border-gray-300 rounded-md focus:border-black focus:ring-black" type="password" placeholder="*****" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="gender"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Gender</FormLabel>
                                    <FormControl>
                                        <Input className="bg-white text-black placeholder-gray-400 border-gray-300 rounded-md focus:border-black focus:ring-black" placeholder="male or female" {...field} />
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
                                {loading ? "Signing Up..." : "Sign Up"}
                            </Button>
                        </motion.div>
                        <p className="text-center text-gray-600 mt-4">
                            Already have an account? <a href="/Auth/login" className="text-black font-semibold hover:underline">Login here</a>
                        </p>
                    </form>
                </Form>
            </motion.div>
        </div>
    );
};

export default SignupForm;
