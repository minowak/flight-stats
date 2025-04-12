import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { firebaseConfig } from "@/lib/firebase/config";
import { onAuthStateChanged } from "@/lib/firebase/auth";
import { User } from "firebase/auth";

export function useUserSession(initialUser: User | null | undefined) {
  const [user, setUser] = useState<User | null | undefined>(initialUser)
  const router = useRouter()

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      const serializedFirebaseConfig = encodeURIComponent(JSON.stringify(firebaseConfig))
      const serviceWorkerUrl = `/auth-service-worker.js?firebaseConfig=${serializedFirebaseConfig}`

      navigator.serviceWorker.register(serviceWorkerUrl).then((registration) => console.log("scope is: ", registration.scope))
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser) => {
      setUser(authUser)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    onAuthStateChanged((authUser) => {
      if (user === undefined) return

      if (user?.email !== authUser?.email) {
        router.refresh()
      }
    })
  }, [user, router])

  return user
}
