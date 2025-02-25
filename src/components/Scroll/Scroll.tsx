"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Scroll.module.css";

const assets = [
  {
    type: "image",
    src: "/Posters/poster1.jpg",
    text: "Say NO to Doping! Play Fair, Stay Clean!",
  },
  {
    type: "image",
    src: "/Posters/poster2.jpg",
    text: "Your Talent, Your Hard Work – No Shortcuts!",
  },
  {
    type: "image",
    src: "/Posters/poster3.jpg",
    text: "Doping Destroys Dreams. Stay True to the Game!",
  },
  {
    type: "image",
    src: "/Posters/poster4.jpg",
    text: "Rise Above, Play True: Ditch the Doping, Shine Through",
  },
  {
    type: "image",
    src: "/Posters/poster5.jpg",
    text: "The evidence is clear: invest in prevention",
  },
  {
    type: "gif",
    src: "/Gifs/gif1.gif",
    text: "Be a Champion – Play by the Rules!",
  },
  {
    type: "gif",
    src: "/Gifs/gif2.gif",
    text: "Fair Play is the Only Way to Play!",
  },
  {
    type: "gif",
    src: "/Gifs/gif3.gif",
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
        {/* Title */}
        <h1 className={styles.title}>Gamification of Anti-Doping Education</h1>

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
              // eslint-disable-next-line @next/next/no-img-element
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
