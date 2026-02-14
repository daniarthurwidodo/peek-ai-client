export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface DatabaseConfig {
  path: string;
  maxConnections?: number;
}
