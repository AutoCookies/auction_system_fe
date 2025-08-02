"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import styles from "@/styles/page.module.css";

export default function Home() {
  const router = useRouter();

  const members = [
    { name: "Văn Hà Minh Quân", role: "Fullstack Developer, Business Analyst" },
    { name: "Đinh Thái Sơn", role: "Database Designer, Documentation Maker" },
    { name: "Lê Đào Tấn Tài", role: "Backend Developer, Presentation Slide Maker" },
  ];

  const handleStart = () => {
    router.push("/register"); // chuyển đến trang chính
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Chào mừng đến với dự án của chúng tôi!</h1>
      <p className={styles.subtitle}>Nhóm gồm 3 thành viên cùng hợp tác phát triển ứng dụng.</p>

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
          src="/hutech-university-logo.jpg"
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
