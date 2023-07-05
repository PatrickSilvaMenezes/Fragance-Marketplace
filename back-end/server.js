import { query, Router } from "express";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, updateDoc, doc, deleteDoc, setDoc, getDoc, getDocs } from "firebase/firestore/lite";
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
    const docId = user.email;
    const collectionRef = collection(db, 'users');
    const docRef = doc(collectionRef, docId);
    if (!user.password) {
      return res.status(400).json({ error: 'A senha é obrigatória' });
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    user.password = hashedPassword;
    await setDoc(docRef, user);
    res.json({ id: docId, ...user });
  } catch (error) {
    console.error('Erro ao criar usuário: ', error);
    res.status(500).json({ error: 'Ocorreu um erro ao criar usuário' });
  }
});

app.post('/products', upload.single('product-image'), async (req, res) => {
  try {
    const product = req.body;
    const docId = req.body.name
    const collectionRef = collection(db, 'products')
    const docRef = doc(collectionRef, docId)
    await setDoc(docRef, product)
    res.json(product);
  } catch (error) {
    console.error('Erro ao criar produto: ', error);
    res.status(500).json({ error: 'Ocorreu um erro ao criar o produto' });
  }
});

app.post('/category', async (req, res) => {
  try {
    console.log(req.body)
    const name = req.body
    const docId = req.body.name
    const collectionRef = collection(db, 'categories')
    const docRef = doc(collectionRef, docId)
    await setDoc(docRef, name)
    res.json({})
  } catch (error) {
    console.log(error)
  }
})

app.delete('/users/:id', async (req, res) => {
  console.log(req.params)
  try {
    const userId = req.params.id;
    await deleteDoc(doc(db, 'users', userId));
    res.json({ id: userId });
  } catch (error) {
    console.error('Erro ao deletar usuário: ', error);
    res.status(500).json({ error: 'Ocorreu um erro ao deletar o usuário' });
  }
})


// Rota para atualizar um usuário
app.put('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const userUpdated = req.body;
    await updateDoc(doc(db, 'users', userId), userUpdated);
    res.json({ id: userId, ...userUpdated });
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
    await deleteDoc(doc(db, 'products', productId));
    res.json({ id: productId });
  } catch (error) {
    console.error('Erro ao deletar produto: ', error);
    res.status(500).json({ error: 'Ocorreu um erro ao deletar o produto' });
  }
})

app.put('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const productUpdated = req.body;
    await updateDoc(doc(db, 'products', productId), productUpdated);
    res.json({ id: productId, ...productUpdated });
  } catch (error) {
    console.error('Erro ao atualizar produto: ', error);
    res.status(500).json({ error: 'Ocorreu um erro ao atualizar produto' });
  }
})





app.delete('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    await deleteDoc(doc(db, 'products', productId));
    res.json({ id: productId });
  } catch (error) {
    console.error('Erro ao deletar produto: ', error);
    res.status(500).json({ error: 'Ocorreu um erro ao deletar o produto' });
  }
})

app.put('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const productUpdated = req.body;
    await updateDoc(doc(db, 'products', productId), productUpdated);
    res.json({ id: productId, ...productUpdated });
  } catch (error) {
    console.error('Erro ao atualizar produto: ', error);
    res.status(500).json({ error: 'Ocorreu um erro ao atualizar produto' });
  }
})

app.put('/products/buy/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const productUpdated = req.body;
    const moneyDto = {
      enterpriseMoney: ""
    }
    const querySnapshotMoney = await getDocs(collection(db, 'cash'))
    querySnapshotMoney.forEach(async (doc) => {
      if (doc.id === "cash-admin") {
        moneyDto.enterpriseMoney = JSON.stringify(parseInt(doc.data().enterpriseMoney) + (parseInt(productUpdated.priceBuy) * parseInt(req.body.quantity)))
      }
    })
    const querySnapshot = await getDocs(collection(db, 'products'))
    querySnapshot.forEach((doc) => {
      if (doc.id === productId) {
        productUpdated.quantity = JSON.stringify(parseInt(doc.data().quantity) + parseInt(productUpdated.quantity))
      }
    })
    await updateDoc(doc(db, 'products', productId), productUpdated);
    await updateDoc(doc(db, 'cash', 'cash-admin'), moneyDto)
    res.json({ id: productId, ...productUpdated });
  } catch (error) {
    console.error('Erro ao atualizar produto: ', error);
    res.status(500).json({ error: 'Ocorreu um erro ao atualizar produto' });
  }
})

app.get('/money', async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'cash'))
    querySnapshot.forEach((doc) => {
      if (doc.id === "cash-admin") {
        res.json(doc.data())
      }
    })
  } catch (error) {
    console.log(error)
  }
})

// Rota para login
app.post('/login', async (req, res) => {
  try {
    const docRef = doc(db, 'users', req.body.email)
    const querySnapshot = await getDoc(docRef);
    console.log(querySnapshot.data())
    if (querySnapshot.data() !== undefined) {
      bcrypt.compare(req.body.password, querySnapshot.data().password, (err, result) => {
        if (err) {
          console.log("erro")
          return
        }
        if (result) {
          console.log("senhas batem")
          //verifica se é admin
          if (querySnapshot.data().admin === true) {
            res.json(querySnapshot.data())
          } else {
            res.json(querySnapshot.data())
          }

        } else {
          console.log("senhas não batem")
          res.json("erro")
        }
      })
    } else {
      res.json("erro")
    }
  } catch (error) {
    console.log(error)
    res.json("erro")
  }
})


app.get('/users', async (req, res) => {
  try {
    var dataFront = [] //dados para o front-end
    const querySnapshot = await getDocs(collection(db, 'users'))
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      dataFront.push(doc.data());
    })
    res.json(dataFront);
  } catch (error) {
    console.log(error);
    res.status(500).send('Erro ao listar itens.');
  }
});

app.get('/categories', async (req, res) => {
  try {
    var dataFront = [] //dados para o front-end
    const querySnapshot = await getDocs(collection(db, 'categories'))
    querySnapshot.forEach((doc) => {
      console.log(doc.data());
      dataFront.push(doc.data());
    })
    res.json(dataFront);
  } catch (error) {
    console.log(error);
    res.status(500).send('Erro ao listar itens.');
  }
})

app.get('/products', async (req, res) => {
  try {
    var dataFront = [] //dados para o front-end
    const querySnapshot = await getDocs(collection(db, 'products'))
    querySnapshot.forEach((doc) => {
      console.log(doc.data())
      dataFront.push(doc.data())
    })
    res.json(dataFront)
  } catch (error) {
    console.log(error)
  }
})





