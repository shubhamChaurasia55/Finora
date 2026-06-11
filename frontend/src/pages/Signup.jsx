import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
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
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">
                        Create Account
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Start managing your finances with Finora
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >

                    {/* Name */}
                    <div>
                        <input
                            type="text"
                            placeholder="Full Name"
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register("name", {
                                required: "Name is required",
                            })}
                        />

                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value:
                                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message:
                                        "Enter a valid email",
                                },
                            })}
                        />

                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message:
                                        "Password must be at least 6 characters",
                                },
                            })}
                        />

                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            {...register("confirmPassword", {
                                required:
                                    "Please confirm your password",
                                validate: (value) =>
                                    value === password ||
                                    "Passwords do not match",
                            })}
                        />

                        {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">
                                {
                                    errors.confirmPassword
                                        .message
                                }
                            </p>
                        )}
                    </div>

                    {/* Server Error */}
                    {serverError && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                            {serverError}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {isLoading
                            ? "Creating Account..."
                            : "Sign Up"}
                    </button>

                    {/* Login Link */}
                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-blue-600 hover:underline"
                        >
                            Login
                        </Link>
                    </p>

                </form>
            </div>
        </div>
    );
};

export default Signup;