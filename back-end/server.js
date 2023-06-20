import { Router } from "express";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore/lite";
import express from "express";
import multer from "multer"
import cors from "cors"
import bcrypt from "bcrypt";

const app = express();
const router = Router();
// Configurar o armazenamento do multer
const storageMulter = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../front-end/images'); // Pasta onde os arquivos serão armazenados
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Nome original do arquivo
  }
});

// Inicializar o middleware do multer
const upload = multer({ storage: storageMulter });

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
    if (!user.password) {
      return res.status(400).json({ error: 'A senha é obrigatória' });
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    user.password = hashedPassword;
    const newUserRef = await addDoc(collection(db, 'users'), user);
    res.json({ id: newUserRef.id, ...user });
  } catch (error) {
    console.error('Erro ao criar usuário: ', error);
    res.status(500).json({ error: 'Ocorreu um erro ao criar usuário' });
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    await deleteDoc(doc(db, 'users', id));
    res.json({ id: userId });
  } catch (error) {
    console.error('Erro ao deletar usuário: ', error);
    res.status(500).json({ error: 'Ocorreu um erro ao deletar o usuário' });
  }
})


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


app.post('/products', upload.single('product-image'), async (req, res) => {
  try {
    const product = req.body;
    const newProductRef = await addDoc(collection(db, 'products'), product);
    res.json({ id: newProductRef.id, ...product });
  } catch (error) {
    console.error('Erro ao criar produto: ', error);
    res.status(500).json({ error: 'Ocorreu um erro ao criar o produto' });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    await deleteDoc(doc(db, 'products', id));
    res.json({ id: productId });
  } catch (error) {
    console.error('Erro ao deletar produto: ', error);
    res.status(500).json({ error: 'Ocorreu um erro ao deletar o produto' });
  }
})





