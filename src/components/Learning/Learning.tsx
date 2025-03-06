"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Learning.module.css";

const sportImages: { [key: string]: string } = {
  Wrestling: "/images/wrestling.jpg",
  Cycling: "/images/cycling.jpg",
  Badminton: "/images/badminton.jpg",
  Swimming: "/images/swimming.jpg",
};

const Learning = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // eslint-disable-next-line prefer-const
    let value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    const numericAge = Number(value);

    if (value === "") {
      setAge("");
      setError("");
      return;
    }

    if (numericAge >= 15 && numericAge <= 70) {
      setAge(value);
      setError("");
    } else {
      setError("Age must be between 15 and 70.");
    }
  };

  const handleAccessContent = () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!age || Number(age) < 15 || Number(age) > 70) {
      setError("Enter a valid age between 15 and 70.");
      return;
    }

    if (!selectedSport) {
      setError("Please select a sport.");
      return;
    }

    setError("");
    router.push("/learning-content");
  };

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h2 className={styles.heading}>Enter Your Details</h2>
        {error && <p className={styles.error}>{error}</p>}

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />

        <input
          type="number"
          placeholder="Enter Age (15-70)"
          value={age}
          onChange={handleAgeChange}
          className={styles.input}
          min="15"
          max="70"
        />

        <select
          value={selectedSport}
          onChange={(e) => setSelectedSport(e.target.value)}
          className={styles.select}
        >
          <option value="">Select Sport</option>
          <option value="Wrestling">Wrestling</option>
          <option value="Cycling">Cycling</option>
          <option value="Badminton">Badminton</option>
          <option value="Swimming">Swimming</option>
        </select>

        <button className={styles.accessButton} onClick={handleAccessContent}>
          Access Content
        </button>
      </div>

      <div className={styles.imageBox}>
        {selectedSport ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={sportImages[selectedSport]}
            alt={selectedSport}
            className={styles.sportImage}
          />
        ) : (
          <p className={styles.selectSportText}>Select the Sport</p>
        )}
      </div>
    </div>
  );
};

export default Learning;
