export interface User {
  displayName: string;
  bio: string;
  avatarUrl: string;
}

export const LOCAL_USERS: User[] = [
  {
    displayName: "Alex Rivera",
    bio: "Diseñador UX/UI | Minimalismo y funcionalidad",
    avatarUrl: "/placeholder-user.jpg",
  },
  {
    displayName: "Sam Morgan",
    bio: "Fotógrafo de paisajes | Capturando la esencia de la naturaleza",
    avatarUrl: "/placeholder-user.jpg",
  },
  {
    displayName: "Jordan Lee",
    bio: "Chef pastelero | Creaciones dulces con un toque de arte",
    avatarUrl: "/placeholder-user.jpg",
  },
  {
    displayName: "Casey Smith",
    bio: "Entrenador personal | Fitness y bienestar integral",
    avatarUrl: "/placeholder-user.jpg",
  },
  {
    displayName: "Taylor Reed",
    bio: "Músico y compositor | Melodías que inspiran el alma",
    avatarUrl: "/placeholder-user.jpg",
  },
];