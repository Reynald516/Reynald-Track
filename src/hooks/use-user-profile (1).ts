export function useUserProfile(userId: string) {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (!userId) return

    supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => setProfile(data))
  }, [userId])

  return { profile }
}