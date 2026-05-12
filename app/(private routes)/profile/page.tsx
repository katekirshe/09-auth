import Image from "next/image";
import css from "./ProfilePage.module.css";
import { Metadata } from "next";
import { getServerMe } from "@/lib/api/serverApi";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
  const user = await getServerMe();
  
  return {
    title: user.username,
    description: user.username.slice(0, 30),
    openGraph: {
      title: user.username,
      description: user.username.slice(0, 30),
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: user.username,
        },
      ],
    },
  };
}

async function Profile() {
  const user = await getServerMe();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={user?.avatar || ""}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}

export default Profile;
