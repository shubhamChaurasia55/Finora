import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Wallet, ArrowRight, ShieldAlert, User, Mail, Lock } from "lucide-react";
import useAuthStore from "../store/authStore";

const Signup = () => {
    const navigate = useNavigate();

    const signup = useAuthStore((state) => state.signup);
    const isLoading = useAuthStore((state) => state.isLoading);

    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const password = watch("password");

    const onSubmit = async (data) => {
        setServerError("");

        if (data.password !== data.confirmPassword) {
            setServerError("Passwords do not match");
            return;
        }

        const result = await signup({
            name: data.name,
            email: data.email,
            password: data.password,
        });

        if (result.success) {
            navigate("/dashboard");
        } else {
            setServerError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 relative overflow-hidden">
            {/* Background decorative blobs */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse-subtle"></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-float"></div>

            <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10 animate-fade-in-up">

                {/* Branding & Welcome */}
                <div className="text-center mb-6">
                    <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 items-center justify-center text-white mb-4 shadow-lg shadow-blue-500/20">
                        <Wallet size={24} />
                    </div>

                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        Create Account
                    </h1>

                    <p className="text-slate-400 text-sm mt-2 font-medium">
                        Start managing your finances with Finora
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4.5"
                >

                    {/* Name */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                            Full Name
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                                <User size={16} />
                            </span>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-sm font-medium"
                                {...register("name", {
                                    required: "Name is required",
                                })}
                            />
                        </div>

                        {errors.name && (
                            <p className="text-rose-500 text-xs mt-1 pl-1 font-medium flex items-center gap-1">
                                <ShieldAlert size={12} />
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                                <Mail size={16} />
                            </span>
                            <input
                                type="email"
                                placeholder="name@company.com"
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-sm font-medium"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                        message: "Enter a valid email",
                                    },
                                })}
                            />
                        </div>

                        {errors.email && (
                            <p className="text-rose-500 text-xs mt-1 pl-1 font-medium flex items-center gap-1">
                                <ShieldAlert size={12} />
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                            Password
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                                <Lock size={16} />
                            </span>
                            <input
                                type="password"
                                placeholder="Min 6 characters"
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-sm"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters",
                                    },
                                })}
                            />
                        </div>

                        {errors.password && (
                            <p className="text-rose-500 text-xs mt-1 pl-1 font-medium flex items-center gap-1">
                                <ShieldAlert size={12} />
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                                <Lock size={16} />
                            </span>
                            <input
                                type="password"
                                placeholder="Re-enter password"
                                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-sm"
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (value) =>
                                        value === password || "Passwords do not match",
                                })}
                            />
                        </div>

                        {errors.confirmPassword && (
                            <p className="text-rose-500 text-xs mt-1 pl-1 font-medium flex items-center gap-1">
                                <ShieldAlert size={12} />
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Server Error */}
                    {serverError && (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3.5 rounded-xl text-xs font-medium flex items-start gap-2 animate-pulse-subtle">
                            <ShieldAlert size={16} className="mt-0.5 flex-shrink-0" />
                            <span>{serverError}</span>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none hover:shadow-lg hover:shadow-blue-500/15 flex items-center justify-center gap-2 cursor-pointer mt-4"
                    >
                        {isLoading ? (
                            "Creating account..."
                        ) : (
                            <>
                                Get Started
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>

                    {/* Login Link */}
                    <p className="text-center text-sm text-slate-400 mt-6 font-medium">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-blue-400 hover:text-blue-300 font-semibold hover:underline"
                        >
                            Sign In
                        </Link>
                    </p>

                </form>
            </div>
        </div>
    );
};

export default Signup;