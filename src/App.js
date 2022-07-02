import './App.css';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
// import "firebase/compat/firestore"; 
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import firebaseConfig from './firebase.config';
import { useState } from 'react';

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: "",
    email: "",
    photo: "",
  });

  const signInHandle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
      const { displayName, email, photoURL } = result.user;
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedInUser);
      console.log(displayName, email, photoURL);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      });
  }; 

  const signOutHandle = () => {
    firebase.auth().signOut()
      .then(res =>{
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: '',
          password: '',
          error: '',
          isValid: false,
          existingUser: false,
        }
        setUser(signedOutUser);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
    })
  }
  
  const is_valid_email = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  const hasNumber = input => /\d/.test(input);

  const switchForm = e => {
    const createUser = { ...user };
    createUser.existingUser = e.target.checked;
    setUser(createUser);
    // console.log(e.target.checked);
  }
  const handleChange = e => {
    const newUserInfo = {
      ...user
    };

    //Perform Validation

    let isValid = true;
    if (e.target.name === 'email') {
      isValid = (is_valid_email(e.target.value));
    }
    if (e.target.name === 'password') {
      isValid = e.target.value.length > 8 && hasNumber(e.target.value);
    }

    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  }

  const createAccount = (event) => {
    if (user.isValid) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res);
          const createUser = { ...user };
          createUser.isSignedIn = true;
          createUser.error = '';
          setUser(createUser);
        })
        .catch(err => {
          console.log(err.message);
          const createUser = { ...user };
          createUser.isSignedIn = false;
          createUser.error = err.message;
          setUser(createUser);
        });
    }
    else {
      console.log('form is not valid');
    }
    event.preventDefault();
    event.target.reset();
  }
  
  const signInUser = (event) => {
     if (user.isValid) {
       firebase
         .auth()
         .signInWithEmailAndPassword(user.email, user.password)
         .then((res) => {
           console.log(res);
           const createUser = { ...user };
           createUser.isSignedIn = true;
           createUser.error = "";
           setUser(createUser);
         })
         .catch((err) => {
           console.log(err.message);
           const createUser = { ...user };
           createUser.isSignedIn = false;
           createUser.error = err.message;
           setUser(createUser);
         });
     } else {
       console.log("form is not valid");
     }
     event.preventDefault();
     event.target.reset();
  }

  return (
    <div className="App">
      {user.isSignedIn ? (
        <button onClick={signOutHandle}>Sign Out</button>
      ) : (
        <button onClick={signInHandle}>Sign in</button>
      )}
      {user.isSignedIn && (
        <div>
          <p>Welcome</p>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      )}
      <h1>Our Own Authentication</h1>
      <input
        type="checkbox"
        name="switchForm"
        onChange={switchForm}
        id="switchForm"
      />
      <label htmlFor="switchForm">Returning User</label>
      <form
        style={{ display: user.existingUser ? "block" : "none" }}
        onSubmit={signInUser}
      >
        <input
          type="text"
          onBlur={handleChange}
          name="email"
          placeholder="Enter your email"
          required
        />
        <br />
        <input
          type="password"
          onBlur={handleChange}
          name="password"
          placeholder="Enter your password"
          required
        />
        <br />
        <input type="submit" value="Sign In" />
      </form>
      <form
        style={{ display: user.existingUser ? "none" : "block" }}
        onSubmit={createAccount}
      >
        <input
          type="text"
          onBlur={handleChange}
          name="name"
          placeholder="Enter your Name"
          required
        />
        <br />
        <input
          type="text"
          onBlur={handleChange}
          name="email"
          placeholder="Enter your email"
          required
        />
        <br />
        <input
          type="password"
          onBlur={handleChange}
          name="password"
          placeholder="Enter your password"
          required
        />
        <br />
        <input type="submit" value="Create Account" />
      </form>
      {user.error && <p style={{ color: "red" }}>{user.error}</p>}
    </div>
  );
}

export default App;
