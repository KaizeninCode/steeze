import { firestore } from "@/firebaseCofig";
import { Room } from "@/types";
import { doc, onSnapshot } from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";

/*
Subscribes to a room doc in real time. Pass null (for local rooms) to skip subscribing entirely - the screen falls back to useLocalRoomStore inthat case instead
*/
export function useRoom(roomId: string | null) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(roomId !== null);

  useEffect(() => {
    if (!roomId) {
      setRoom(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      doc(firestore, "rooms", roomId),
      (snap) => {
        setRoom(snap.exists() ? (snap.data() as Room) : null);
        setLoading(false);
      },
      (error) => {
        console.error("useRoom subscription error:", error);
        setLoading(false);
      },
    );
    return () => unsubscribe();
  }, [roomId]);

  return {room, loading}
}
