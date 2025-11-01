"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "@/styles/page.module.css";

export default function Home() {
  const router = useRouter();

  const members = [
    { name: "QTech", role: "Nhóm phát triển dự án phần mềm" },
  ];

  const handleStart = () => {
    router.push("/register"); // chuyển đến trang chính
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Đây là trang bắt đầu của dự án Website đấu giá trực tuyến</h1>
      <p className={styles.subtitle}>QTech thành lập bởi QUan Van - AutoCookie</p>

      <div className={styles.cardContainer}>
        {members.map((member, index) => (
          <div key={index} className={styles.card}>
            <h2>{member.name}</h2>
            <p>{member.role}</p>
          </div>
        ))}
      </div>

      <div className={styles.imageWrapper}>
        <Image
          src="/Gemini_Generated_Image_owm83gowm83gowm8.png"
          alt="Team Image"
          width={600}
          height={400}
        />
      </div>

      <button className={styles.startButton} onClick={handleStart}>
        Bắt đầu
      </button>
    </main>
  );
}
