"use client";

import { useEffect } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  UserCredential,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "../firebaseConfig";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";

const checkTokenValidity = async (token: any) => {
  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const exp = decodedToken.exp; // Token expiration time
    // @ts-ignore
    if (exp < currentTime) {
      console.log("Token expired, refreshing...");
      return await auth?.currentUser?.getIdToken(true); // Force refresh
    } else {
      console.log("Token is valid");
      return token;
    }
  } catch (error) {
    console.error("Error decoding token:", error);
  }
};

const LoginPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/tasks");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result: UserCredential = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      const decodedToken = jwtDecode(token);
      checkTokenValidity(token);
      console.log("decodedToken", decodedToken);
      localStorage.setItem("token", token);
      router.push("/tasks");
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f0f0",
      }}
    >
      <Card
        style={{
          minWidth: 300,
          padding: 20,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <CardContent style={{ textAlign: "center" }}>
          <Typography variant="h5" component="div" gutterBottom>
            Login
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in to access your tasks.
          </Typography>
        </CardContent>
        <CardActions style={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            style={{ width: "100%" }}
          >
            Sign in with Google
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

export default LoginPage;
