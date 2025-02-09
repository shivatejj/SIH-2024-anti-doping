"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Scroll.module.css";

const assets = [
  {
    type: "image",
    src: "/posters/poster1.jpg",
    text: "Say NO to Doping! Play Fair, Stay Clean!",
  },
  {
    type: "image",
    src: "/posters/poster2.jpg",
    text: "Your Talent, Your Hard Work – No Shortcuts!",
  },
  {
    type: "image",
    src: "/posters/poster3.jpg",
    text: "Doping Destroys Dreams. Stay True to the Game!",
  },
  {
    type: "gif",
    src: "/gifs/gif1.gif",
    text: "Be a Champion – Play by the Rules!",
  },
  {
    type: "gif",
    src: "/gifs/gif2.gif",
    text: "Fair Play is the Only Way to Play!",
  },
  {
    type: "gif",
    src: "/gifs/gif3.gif",
    text: "Stay Strong, Stay Clean, Stay Honest!",
  },
];

const Home = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % assets.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      {/* Left Section */}
      <div className={styles.leftSection}>
        <div className={styles.assetWrapper}>
          <div className={`${styles.assetContainer} ${styles.visible}`}>
            {assets[index].type === "image" ? (
              <Image
                src={assets[index].src}
                alt="Poster"
                width={400}
                height={300}
                className={styles.asset}
              />
            ) : (
              <img src={assets[index].src} alt="GIF" className={styles.asset} />
            )}
          </div>
        </div>

        {/* Content Below the Box */}
        <div className={styles.content}>{assets[index].text}</div>

        {/* Login Button */}
        <Link href="/login" className={styles.loginButton}>
          Click here to login
        </Link>
      </div>

      {/* Right Section with Background Image */}
      <div className={styles.rightSection}></div>
    </div>
  );
};

export default Home;
