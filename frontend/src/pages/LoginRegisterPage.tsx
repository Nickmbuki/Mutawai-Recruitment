import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { login, register } from "../api/auth";
import { PageTransition } from "../components/layout/PageTransition";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2),
  role: z.enum(["employer", "candidate"]),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export function LoginRegisterPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "candidate" },
  });
  const loginMutation = useMutation({ mutationFn: login });
  const registerMutation = useMutation({ mutationFn: register });

  return (
    <PageTransition>
      <section className="bg-white py-20">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Access</p>
            <h1 className="mt-3 font-display text-5xl font-extrabold text-ink">
              Secure access for candidates, employers, and administrators.
            </h1>
            <p className="mt-5 text-lg leading-8 text-graphite">
              JWT authentication powers protected routes and role-specific workflows in the API.
            </p>
          </div>

          <Card>
            <div className="mb-6 flex rounded-md bg-mist p-1">
              <button
                className={`h-10 flex-1 rounded-md text-sm font-bold ${
                  mode === "login" ? "bg-white text-ink shadow-sm" : "text-graphite"
                }`}
                onClick={() => setMode("login")}
              >
                Login
              </button>
              <button
                className={`h-10 flex-1 rounded-md text-sm font-bold ${
                  mode === "register" ? "bg-white text-ink shadow-sm" : "text-graphite"
                }`}
                onClick={() => setMode("register")}
              >
                Register
              </button>
            </div>

            {mode === "login" ? (
              <form
                className="grid gap-4"
                onSubmit={loginForm.handleSubmit((values) => loginMutation.mutate(values))}
              >
                <Input placeholder="Email" {...loginForm.register("email")} />
                <Input placeholder="Password" type="password" {...loginForm.register("password")} />
                <Button disabled={loginMutation.isPending}>
                  <LogIn size={18} />
                  Login
                </Button>
              </form>
            ) : (
              <form
                className="grid gap-4"
                onSubmit={registerForm.handleSubmit((values) => registerMutation.mutate(values))}
              >
                <Input placeholder="Name" {...registerForm.register("name")} />
                <Input placeholder="Email" {...registerForm.register("email")} />
                <Input
                  placeholder="Password"
                  type="password"
                  {...registerForm.register("password")}
                />
                <select
                  className="h-11 rounded-md border border-ink/15 bg-white px-3 text-sm outline-none focus:border-teal"
                  {...registerForm.register("role")}
                >
                  <option value="candidate">Candidate</option>
                  <option value="employer">Employer</option>
                </select>
                <Button disabled={registerMutation.isPending}>
                  <UserPlus size={18} />
                  Register
                </Button>
              </form>
            )}

            {(loginMutation.isSuccess || registerMutation.isSuccess) && (
              <p className="mt-4 text-sm font-semibold text-teal">Authenticated successfully.</p>
            )}
            {(loginMutation.isError || registerMutation.isError) && (
              <p className="mt-4 text-sm font-semibold text-coral">
                Authentication failed. Check API availability and credentials.
              </p>
            )}
          </Card>
        </div>
      </section>
    </PageTransition>
  );
}
