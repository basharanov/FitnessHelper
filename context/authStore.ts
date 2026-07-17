import { deleteToken, getToken, saveToken } from "@/service/authToken";
import { deleteItemAsync, getItem, setItem } from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type User = {
  email: string;
  name: string;
  birthDate: Date;
  height: number;
  currentWeight: number;
  goalWeight: number;
};

type UserState = {
  isLoggedIn: boolean;
  logIn: (token: string, userData: User) => void;
  logOut: () => void;
  user: User;
  checkAuth: () => void;
};

export const useAuthStore = create(
  persist<UserState>(
    (set) => ({
      isLoggedIn: false,
      user: {
        email: "",
        name: "",
        birthDate: new Date(),
        height: 0,
        currentWeight: 0,
        goalWeight: 0,
      },
      logIn: async (token: string, userData: User) => {
        await saveToken(token);
        set((state) => {
          return {
            ...state,
            isLoggedIn: true,
            user: userData,
          };
        });
      },
      logOut: async () => {
        await deleteToken();
        set((state) => {
          return {
            ...state,
            isLoggedIn: false,
            user: {
              email: "",
              name: "",
              birthDate: new Date(),
              height: 0,
              currentWeight: 0,
              goalWeight: 0,
            },
          };
        });
      },
      checkAuth: async () => {
        const token = await getToken();

        if (!token) {
          set({
            isLoggedIn: false,
            user: {
              email: "",
              name: "",
              birthDate: new Date(),
              height: 0,
              currentWeight: 0,
              goalWeight: 0,
            },
          });

          return;
        }

        try {
          const decodedToken = jwtDecode(token);

          if (decodedToken.exp === undefined) {
            set({
              isLoggedIn: false,
              user: {
                email: "",
                name: "",
                birthDate: new Date(),
                height: 0,
                currentWeight: 0,
                goalWeight: 0,
              },
            });
            return;
          }

          const expirationTime = decodedToken.exp * 1000;
          const isExpired = expirationTime <= Date.now();

          if (isExpired) {
            await deleteToken();

            set({
              isLoggedIn: false,
              user: {
                email: "",
                name: "",
                birthDate: new Date(),
                height: 0,
                currentWeight: 0,
                goalWeight: 0,
              },
            });

            return;
          }

          set({
            isLoggedIn: true,
          });
        } catch (error) {
          console.error("Invalid token:", error);

          await deleteToken();

          set({
            isLoggedIn: false,
            user: {
              email: "",
              name: "",
              birthDate: new Date(),
              height: 0,
              currentWeight: 0,
              goalWeight: 0,
            },
          });
        }
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => ({
        setItem,
        getItem,
        removeItem: deleteItemAsync,
      })),
    },
  ),
);
