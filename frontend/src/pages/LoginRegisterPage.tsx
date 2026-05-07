import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LogIn, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
  phone: z.string().min(7),
  nationalIdOrPassport: z.string().min(4),
  paymentMethod: z.enum(["mpesa", "paypal"]),
  paymentReference: z.string().min(4),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

export function LoginRegisterPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const navigate = useNavigate();
  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { paymentMethod: "mpesa" },
  });
  const loginMutation = useMutation({ mutationFn: login });
  const registerMutation = useMutation({ mutationFn: register });

  useEffect(() => {
    const user = loginMutation.data?.user ?? registerMutation.data?.user;
    if (!user) {
      return;
    }

    navigate(user.role === "admin" ? "/admin" : "/candidates");
  }, [loginMutation.data, navigate, registerMutation.data]);

  return (
    <PageTransition>
      <section className="bg-white py-20">
        <div className="section-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="eyebrow">Access</p>
            <h1 className="mt-3 font-display text-4xl font-extrabold text-ink md:text-5xl">
              Secure access for candidates and Mutawai HR administrators.
            </h1>
            <p className="mt-5 text-lg leading-8 text-graphite">
              Candidate accounts require payment confirmation details before the profile is created.
              Administrators use the same login area to review candidate records.
            </p>
          </div>

          <Card>
            <div className="mb-6 flex rounded-md bg-mist p-1">
              <button
                type="button"
                className={`h-10 flex-1 rounded-md text-sm font-bold ${
                  mode === "login" ? "bg-white text-ink shadow-sm" : "text-graphite"
                }`}
                onClick={() => setMode("login")}
              >
                Login
              </button>
              <button
                type="button"
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
                <Button type="submit" disabled={loginMutation.isPending}>
                  <LogIn size={18} />
                  {loginMutation.isPending ? "Opening..." : "Login"}
                </Button>
              </form>
            ) : (
              <form
                className="grid gap-4"
                onSubmit={registerForm.handleSubmit((values) => registerMutation.mutate(values))}
              >
                <Input placeholder="Name" {...registerForm.register("name")} />
                <Input placeholder="Email" {...registerForm.register("email")} />
                <Input placeholder="Phone number" {...registerForm.register("phone")} />
                <Input
                  placeholder="National ID or passport number"
                  {...registerForm.register("nationalIdOrPassport")}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  {...registerForm.register("password")}
                />
                <div className="rounded-md border border-brass/30 bg-brass/10 p-4 text-sm leading-6 text-ink">
                  <p className="font-bold">Registration payment</p>
                  <p className="mt-1 text-graphite">
                    Pay using M-Pesa or PayPal, then enter the transaction/reference code below.
                    Your payment will be reviewed by Mutawai HR Consultants Limited.
                  </p>
                </div>
                <select
                  className="h-11 rounded-md border border-ink/15 bg-white px-3 text-sm outline-none focus:border-teal"
                  {...registerForm.register("paymentMethod")}
                >
                  <option value="mpesa">M-Pesa</option>
                  <option value="paypal">PayPal</option>
                </select>
                <Input
                  placeholder="M-Pesa code or PayPal transaction ID"
                  {...registerForm.register("paymentReference")}
                />
                <Button type="submit" disabled={registerMutation.isPending}>
                  <UserPlus size={18} />
                  {registerMutation.isPending ? "Creating..." : "Register Candidate Account"}
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
