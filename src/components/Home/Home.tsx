import React from "react";
import ReactPlayer from "react-player";
import styles from "./Home.module.css";

const Home: React.FC = () => {
  return (
    <div className={styles.container}>
      {/* Video Section */}
      <div className={styles.videoBox}>
        <h2>Watch This Video</h2>
        <ReactPlayer
          url="https://www.youtube.com/embed/k0Sq29GgEEc"
          controls
          width="100%"
          height="300px"
        />
      </div>

      {/* Audio Section */}
      <div className={styles.audioBox}>
        <h2>Listen to This Audio</h2>
        <audio controls className={styles.audioPlayer}>
          <source src="/audio/Prohibited_Substances.mpeg" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
};

export default Home;
