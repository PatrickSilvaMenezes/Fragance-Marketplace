// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDatabase, ref, set, child, update, remove } from "http://www.gstatic.com/firebasejs/9.1.0/firebase-database.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBc0q-kMgiBA4mvMzVuGhVv1JrdnLE8ol8",
  authDomain: "fragance-world.firebaseapp.com",
  projectId: "fragance-world",
  storageBucket: "fragance-world.appspot.com",
  messagingSenderId: "491455507593",
  appId: "1:491455507593:web:ceac4e920c62405c02aa58",
  measurementId: "G-H1MQ2CEX1Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

// Inicializar o Firebase
const auth = getAuth();


// Referenciar o formulário HTML
const form = document.getElementById("signup-form");

// Lidar com o evento de envio do formulário
form.addEventListener("submit", (event) => {
  event.preventDefault(); // Impedir o envio padrão do formulário

  // Capturar os valores do formulário
  const email = form.email.value;
  const password = form.password.value;
  const name = form.name.value;
  const lastName = form.lastName.value;
  const phoneNumber = form.phoneNumber.value;

  // Criar um usuário com email e senha
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Usuário criado com sucesso
      const user = userCredential.user;

      // Salvar informações adicionais no banco de dados
      const userRef = ref(db, "users/" + user.uid);
      const userData = {
        name: name,
        lastName: lastName,
        phoneNumber: phoneNumber
      };
      set(userRef, userData)
        .then(() => {
          console.log("Usuário criado e informações adicionais salvas com sucesso!");
        })
        .catch((error) => {
          console.log("Erro ao salvar informações adicionais:", error.message);
        });
    })
    .catch((error) => {
      // Ocorreu um erro ao criar o usuário
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Erro ao criar usuário:", errorMessage);
    });
});
