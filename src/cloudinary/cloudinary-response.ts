// src/cloudinary/cloudinary-response.ts
export interface CloudinaryResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string; // The primary URL for the asset
  secure_url: string; // HTTPS URL for the asset
  original_filename: string;
}
