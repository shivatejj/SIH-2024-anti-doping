import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Learning.module.css";

const sportImages = {
  wrestling: "/images/wrestling.jpg",
  cycling: "/images/cycling.jpg",
  badminton: "/images/badminton.jpg",
  swimming: "/images/swimming.jpg",
};

const Learning = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [selectedSport, setSelectedSport] = useState<
    "" | keyof typeof sportImages
  >("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;
    setAge(value);
  };

  const handleAccessContent = () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    const numericAge = Number(age);
    if (!age || numericAge < 15 || numericAge > 70) {
      setError("Enter a valid age between 15 and 70.");
      return;
    }

    if (!selectedSport) {
      setError("Please select a sport.");
      return;
    }

    setError("");
    router.push(
      `/learning-content?name=${name}&age=${age}&sport=${selectedSport}`
    );
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
          type="text"
          placeholder="Enter Age (15-70)"
          value={age}
          onChange={handleAgeChange}
          className={`${styles.input} ${styles.ageInput}`}
          inputMode="numeric"
        />

        <select
          value={selectedSport}
          onChange={(e) =>
            setSelectedSport(e.target.value as keyof typeof sportImages)
          }
          className={styles.select}
        >
          <option value="">Select Sport</option>
          <option value="wrestling">Wrestling</option>
          <option value="cycling">Cycling</option>
          <option value="badminton">Badminton</option>
          <option value="swimming">Swimming</option>
        </select>

        <button className={styles.accessButton} onClick={handleAccessContent}>
          Access Content
        </button>
      </div>

      <div className={styles.imageBox}>
        {selectedSport ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={sportImages[selectedSport as keyof typeof sportImages]}
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
