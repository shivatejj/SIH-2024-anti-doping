import React from "react";
import ReactPlayer from "react-player";
import Image from "next/image";
import styles from "./Home.module.css";

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Left Section */}
      <div className={styles.leftSection}>
        {/* Video on Top */}
        <div className={styles.videoBox}>
          <h2>Watch This Video</h2>
          <ReactPlayer
            url="https://www.youtube.com/embed/k0Sq29GgEEc"
            controls
            width="100%"
            height="200px"
          />
        </div>

        {/* Small Matter Below Video */}
        <div className={styles.textBox}>
          <h3>Why Anti-Doping Education is Important?</h3>
          <p>
            Anti-doping education ensures fair play, protects athletes&apos;
            health, and prevents accidental violations. Understanding these
            rules helps maintain integrity in sports and prevents
            career-threatening consequences.
          </p>
        </div>

        {/* Audio Below Matter */}
        <div className={styles.audioBox}>
          <h2>Listen to This Audio</h2>
          <audio controls className={styles.audioPlayer}>
            <source src="/audio/Prohibited_Substances.mpeg" type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>

      {/* Middle Section - Poster Completely Covering */}
      <div className={styles.middleSection}>
        <Image
          src="/Posters/homemain.png"
          alt="Anti-Doping Awareness"
          width={400}
          height={550}
          className={styles.poster}
        />
      </div>

      {/* Right Section */}
      <div className={styles.rightSection}>
        {/* Rules & Regulations Text */}
        <div className={styles.rulesBox}>
          <h3>Anti-Doping Rules & Regulations</h3>
          <p>Different sports have specific anti-doping regulations:</p>
          <ul>
            <li>
              <b>Wrestling:</b> Strict regulations against anabolic steroids and
              growth hormones due to their impact on muscle strength and
              endurance. Regular testing before and after competitions is
              mandatory.
            </li>
            <li>
              <b>Swimming:</b> Random and scheduled drug testing to prevent the
              use of stimulants and oxygen-boosting agents that enhance
              endurance and recovery speed.
            </li>
            <li>
              <b>Cycling:</b> The use of biological passports to monitor blood
              values over time, preventing the use of EPO (Erythropoietin) and
              blood transfusions that improve oxygen delivery.
            </li>
            <li>
              <b>Badminton:</b> Regular testing, especially in international
              tournaments, to detect the presence of beta-blockers that can
              provide an unfair advantage in precision and reaction-based
              sports.
            </li>
          </ul>
        </div>

        {/* Small Video Moved Completely Down */}
        <div className={styles.smallVideoBox}>
          <h2>More Insights on Anti-Doping</h2>
          <ReactPlayer
            url="https://youtu.be/XzOnQBK_YZo?si=dhh1eO1cqYX6psuN"
            controls
            width="100%"
            height="180px"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
