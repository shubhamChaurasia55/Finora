import {create} from "zustand";
import api from "../api/axios.js"

const useAuthStore = create((set) => ({
    user: null,
    isAuthanticated: false,
    isLoading: false, 


    signUp: async (formData) => {
        try{
            set({isLoading: true});
            
            const response = await api.post("/auth/register", formData);

            set({
                user: response.data.user,
                isAuthanticated: true,
                isLoading: false,
            });

            return {
                success: true,
                message: "Registration successful",
            };
        }
        catch(error){
            set({
                isLoading: false,
            });

            return{
                success: false,
                message: error.response?.data?.message || "Registration failed",
            };
        }
    },

    login: async (formData) => {
        try{
            set({isLoading: true});

            const response = await api.post("/auth/login", formData);

            set({
                user: response.data.user,
                isAuthanticated: true,
                isLoading: false,
            });

            return{
                success: true,
                message: "Login successful",
            };
        }
        catch(error){
            set({
                isLoading: false,
            });

            return{
                success: false,
                message: error.response?.data?.message || "Login failed",
            };
        }
    },

    logout: async () => {
        try{
            await api.post("/auth/logout");
        } 
        catch (error){
            console.error("Logout failed", error);
        }
        finally{
            set({
                user: null,
                isAuthanticated: false,
            });
        }
    },

    getMe: async () => {
        try{
            set({isLoading: true});

            const response = await api.get("/auth/me");

            set({
                user: response.data.user,
                isAuthanticated: true,
                isLoading: false,
            })
        }
        catch(error){
            set({
                isLoading: false,
                isAuthanticated: false,
            })

            return{
                success: false,
                message: error.response?.data?.message || "Failed to fetch user data",
            };
        }
    }

    
}))


export default useAuthStore;
