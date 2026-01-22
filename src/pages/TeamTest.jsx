import React, { useEffect } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";

export default function TeamTest() {
  useEffect(() => {
    const fetchTeam = async () => {
  try {
    const snapshot = await getDocs(collection(db, "team_members"));

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log('snapshot it is', snapshot);
    console.log("✅ Firestore data loaded:", data);
  } catch (err) {
    console.error("❌ Firestore fetch failed:", err);
  }
};


    fetchTeam();
  }, []);

  return (
    <div style={{ color: "white", padding: 40 }}>
      Open DevTools → Console  
      <br />
      If Firestore works, data will be printed there.
    </div>
  );
}
