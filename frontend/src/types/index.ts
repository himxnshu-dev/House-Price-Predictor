// ──────────────────────────────────────────────
// User
// ──────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// ──────────────────────────────────────────────
// Prediction
// ──────────────────────────────────────────────

export interface Prediction {
  id: string;
  userId: string;
  location: string;
  bhk: number;
  bath: number;
  total_sqft: number;
  predictedPrice: number;
  isFavorite: boolean;
  createdAt: string;
}

export interface PredictionInput {
  location: string;
  bhk: number;
  bath: number;
  total_sqft: number;
}

export interface PredictionResult {
  success: boolean;
  price_lakhs?: number;
  error?: string;
}

// ──────────────────────────────────────────────
// Pagination
// ──────────────────────────────────────────────

export interface PaginationMeta {
  totalRecords: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface HistoryResponse {
  success: boolean;
  history: Prediction[];
  meta?: PaginationMeta;
  message?: string;
}

export interface FavoritesResponse {
  success: boolean;
  favorites: Prediction[];
  message?: string;
}

// ──────────────────────────────────────────────
// Auth
// ──────────────────────────────────────────────

export interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  message: string;
  userID: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface UserResponse {
  user: User;
}

export interface UpdateUserResponse {
  message: string;
  user: Omit<User, 'email'>;
}

// ──────────────────────────────────────────────
// Errors
// ──────────────────────────────────────────────

export interface ApiValidationError {
  message: string;
  errors?: string;
}

export interface ApiError {
  message?: string;
  error?: string;
  success?: boolean;
}

// ──────────────────────────────────────────────
// Locations
// ──────────────────────────────────────────────

export interface LocationsResponse {
  success: boolean;
  locations: string[];
}
