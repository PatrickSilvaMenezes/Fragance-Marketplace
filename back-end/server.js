import { Router } from "express";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, updateDoc } from "firebase/firestore/lite";
import express from "express";
import cors from "cors"

const app = express();
const router = Router();
app.listen(3000, () => console.log("server is running on port 3000"))
// Middleware para processar o corpo das solicitações
app.use(express.json());
app.use(cors())
app.use(router)

const firebaseConfig = {
  apiKey: "AIzaSyBc0q-kMgiBA4mvMzVuGhVv1JrdnLE8ol8",
  authDomain: "fragance-world.firebaseapp.com",
  projectId: "fragance-world",
  storageBucket: "fragance-world.appspot.com",
  messagingSenderId: "491455507593",
  appId: "1:491455507593:web:ceac4e920c62405c02aa58",
  measurementId: "G-H1MQ2CEX1Y"
};

// Inicialize o Firebase Client SDK
const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);

// Rota para criar um novo usuário
app.post('/users', async (req, res) => {
  try {
    const user = req.body;
    const newUserRef = await addDoc(collection(db, 'users'), user);
    res.json({ id: newUserRef.id, ...user });
  } catch (error) {
    console.error('Erro ao criar usuário: ', error);
    res.status(500).json({ error: 'Ocorreu um erro ao criar usuário' });
  }
});

// Rota para atualizar um usuário
app.put('/users:id', async (req, res) => {
  try {
    const user = req.body;
    const newUserRef = await updateDoc(collection(db, 'users'), user);
    res.json({ id: newUserRef.id, ...user });
  } catch (error) {
    console.error('Erro ao atualizar usuário: ', error);
    res.status(500).json({ error: 'Ocorreu um erro ao atualizar usuário' });
  }
});




