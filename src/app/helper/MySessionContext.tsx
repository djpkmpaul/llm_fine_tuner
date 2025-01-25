"use client"
// helper/MySessionContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

// Define the context and its default value
const MySessionContext = createContext<any>(null);

// Create a provider component
export const MySessionProvider = ({ children }: { children: ReactNode }) => {
  const [userSessionDetails, setUserSessionDetails] = useState({
    username: '',
    email: ''
  });

  const [sessionLoaded, setSessionLoaded] = useState<Boolean>(false);

  return (
    <MySessionContext.Provider value={{ userSessionDetails, setUserSessionDetails, sessionLoaded, setSessionLoaded }}>
      {children}
    </MySessionContext.Provider>
  );
};

// Create a custom hook to use the context
// you dont have to pass the context provider insider useContextHook
export const useMySession = () => useContext(MySessionContext);
