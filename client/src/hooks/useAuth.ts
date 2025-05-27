import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  // Demo mode - giriş sayfalarını görmek için geçici olarak false döndürüyoruz
  return {
    user: null,
    isLoading: false,
    isAuthenticated: false,
  };
  
  /* Gerçek auth sistemi için:
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
  */
}