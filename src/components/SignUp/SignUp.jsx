import React, { useState, useEffect } from "react";
import { arraysEqual } from "../../helper/ArrayEqual";

import Dropdown from "../Dropdown";
import ImageGrid from "../ImageGrid";

import styles from "./SignUp.module.css";

export const SignUp = () => {
  // const server = "http://127.0.0.1:5000";
  const server = "https://image-password-backend.herokuapp.com";

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [selectedNode, setSelectedNode] = useState(null);
  const [list, setList] = useState(null);
  const [imageList, setImageList] = useState(null);

  const [password, setPassword] = useState([]);
  const [confirmPassword, setConfirmPassword] = useState([]);

  const [isPasswordEntered, setIsPasswordEntered] = useState(false);

  const [passwordErr, setPasswordErr] = useState("");

  const lengthErr = "At least 3 images should be selected";
  const passwordDontMatch =
    "Entered password and confirm password do not match";

  const usernameErr = "Enter a valid username";
  const nodeErr = "Select a category";
  const emailErr = "Enter a valid email";

  const generateImages = () => {
    if (!username) {
      setPasswordErr(usernameErr);
      return;
    }

    if (!selectedNode) {
      setPasswordErr(nodeErr);
      return;
    }

    if (!email) {
      setPasswordErr(emailErr);
      return;
    }

    fetch(`${server}/images/${selectedNode[1].address}`)
      .then((res) => res.json())
      .then((data) => {
        setImageList(data);
      });
  };

  const handleNext = () => {
    if (password.length < 3) {
      setPasswordErr(lengthErr);
      return;
    }

    setIsPasswordEntered(true);

    setPasswordErr("");
  };

  useEffect(() => {
    fetch(`${server}/images2`)
      .then((res) => res.json())
      .then((data) => {
        setList(data);
      });
  }, []);

  const handleSubmit = () => {
    if (!arraysEqual(password, confirmPassword)) {
      setPasswordErr(passwordDontMatch);
      return;
    }
    const user = {
      username: username.trim(),
      email,
      password: password.join(" "),
    };
    console.log(user);

    fetch(`${server}/signup`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(user),
    }).then((res) => {
      if (res.ok) {
        setUsername("");
        setEmail('')
        setPassword([]);
        setConfirmPassword([]);
        setIsPasswordEntered(false)
        alert('Signup Successful')
      }
    });

    setPasswordErr("");
  };

  return (
    <div className={styles.form}>
      <div className={styles.inputGroup}>
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.currentTarget.value)}
        />
      </div>
      <div className={styles.inputGroup}>
        <label htmlFor="email">Email: </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
      </div>
      <div className={styles.selectGroup}>
        <label htmlFor="category">Category: </label>
        <Dropdown list={list} val={selectedNode} setVal={setSelectedNode} />
      </div>
      <div className={styles.surroundDiv}>
        <button onClick={generateImages} className={styles.passwordGen}>
          Generate Image Grid
        </button>
      </div>

      <span className={styles.error}>{passwordErr}</span>
      {!isPasswordEntered ? (
        <>
          <ImageGrid
            imageList={imageList}
            selectedImages={password}
            setSelectedImages={setPassword}
          />
          <div className={styles.surroundDiv}>
            <button onClick={handleNext} className={styles.button}>
              Next
            </button>
          </div>
        </>
      ) : (
        <>
          <ImageGrid
            imageList={imageList}
            selectedImages={confirmPassword}
            setSelectedImages={setConfirmPassword}
          />
          <div className={styles.surroundDiv}>
            <button
              onClick={() => {
                setIsPasswordEntered(false);
              }}
              className={styles.button}
            >
              Back
            </button>

            <button onClick={handleSubmit} className={styles.button}>
              Sign Up
            </button>
          </div>
        </>
      )}
    </div>
  );
};
