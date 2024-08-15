import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCS77uOsTbvO_FqgIKM_7dPpWB3NEbXwDM",
  authDomain: "task-manager-21919.firebaseapp.com",
  projectId: "task-manager-21919",
  storageBucket: "task-manager-21919.appspot.com",
  messagingSenderId: "927776326746",
  appId: "1:927776326746:web:ecbb060eff8fc217164463",
  measurementId: "G-FR9E2ELFPF",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
