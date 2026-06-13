import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Wallet, ArrowRight, ShieldAlert } from "lucide-react";
import useAuthStore from "../store/authStore";

const Login = () => {
    const navigate = useNavigate();

    const login = useAuthStore((state) => state.login);
    const isLoading = useAuthStore((state) => state.isLoading);

    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data) => {
        setServerError("");

        const result = await login(data);

        if (result.success) {
            navigate("/dashboard");
        } else {
            setServerError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
            {/* Background decorative blobs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse-subtle"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-float"></div>

            <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10 animate-fade-in-up">
                
                {/* Branding & Welcome */}
                <div className="text-center mb-8">
                    <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/20">
                        <Wallet size={24} />
                    </div>

                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        Welcome back
                    </h1>

                    <p className="text-slate-400 text-sm mt-2 font-medium">
                        Log in to resume your financial management
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                >
                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider pl-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="name@company.com"
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-sm font-medium"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Enter a valid email",
                                },
                            })}
                        />

                        {errors.email && (
                            <p className="text-rose-500 text-xs mt-1 pl-1 font-medium flex items-center gap-1">
                                <ShieldAlert size={12} />
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                Password
                            </label>
                            <a href="#" className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors">
                                Forgot?
                            </a>
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-sm"
                            {...register("password", {
                                required: "Password is required",
                            })}
                        />

                        {errors.password && (
                            <p className="text-rose-500 text-xs mt-1 pl-1 font-medium flex items-center gap-1">
                                <ShieldAlert size={12} />
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Server Error */}
                    {serverError && (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-xl text-xs font-medium flex items-start gap-2 animate-pulse-subtle">
                            <ShieldAlert size={16} className="mt-0.5 shrink-0" />
                            <span>{serverError}</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none hover:shadow-lg hover:shadow-blue-500/15 flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                        {isLoading ? (
                            "Verifying details..."
                        ) : (
                            <>
                                Sign In
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>

                    {/* Signup Link */}
                    <p className="text-center text-sm text-slate-400 mt-6 font-medium">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="text-blue-400 hover:text-blue-300 font-semibold hover:underline"
                        >
                            Create account
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;