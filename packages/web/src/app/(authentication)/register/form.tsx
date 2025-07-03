import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import { FormProps } from '@/types';

import { EyeIcon, EyeOffIcon } from 'lucide-react';

const registerFormSchema = z
  .object({
    username: z.string().min(1, 'Username is required'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type RegisterFormSchemaType = z.infer<typeof registerFormSchema>;

function RegisterForm(props: FormProps<RegisterFormSchemaType>) {
  const form = useForm<RegisterFormSchemaType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: props.defaultValues,
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState<boolean>(false);

  const togglePasswordVisibility = () =>
    setIsPasswordVisible((prevState) => !prevState);
  const toggleConfirmPasswordVisibility = () =>
    setIsConfirmPasswordVisible((prevState) => !prevState);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmit)}>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="username">Username</FormLabel>
                <FormControl>
                  <Input
                    id="username"
                    placeholder="Enter your username"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="password">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="password"
                      placeholder="••••••••"
                      {...field}
                      type={isPasswordVisible ? 'text' : 'password'}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-2 flex items-center text-sm text-muted-foreground"
                      onClick={togglePasswordVisibility}
                      aria-label={
                        isPasswordVisible ? 'Hide password' : 'Show password'
                      }
                      aria-pressed={isPasswordVisible}
                      aria-controls="password"
                    >
                      {isPasswordVisible ? (
                        <EyeOffIcon size={16} aria-hidden="true" />
                      ) : (
                        <EyeIcon size={16} aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="confirmPassword">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      placeholder="••••••••"
                      {...field}
                      type={isConfirmPasswordVisible ? 'text' : 'password'}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-2 flex items-center text-sm text-muted-foreground"
                      onClick={toggleConfirmPasswordVisibility}
                      aria-label={
                        isConfirmPasswordVisible
                          ? 'Hide confirm password'
                          : 'Show confirm password'
                      }
                      aria-pressed={isConfirmPasswordVisible}
                      aria-controls="confirmPassword"
                    >
                      {isConfirmPasswordVisible ? (
                        <EyeOffIcon size={16} aria-hidden="true" />
                      ) : (
                        <EyeIcon size={16} aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
        <CardFooter className="pt-5 w-full flex items-center justify-center">
          <Button type="submit">Create Account</Button>
        </CardFooter>
      </form>
    </Form>
  );
}
export default RegisterForm;
