import { createClient } from "@supabase/supabase-js";

// We mock the client or provide placeholder until env vars are set
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-url.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";

// Use service role key to bypass RLS since we manage RBAC in the application layer
export const supabaseStorage = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export const BUCKET_NAME = "nova-documents";

export async function uploadDocument(file: File, path: string): Promise<{ path: string; error: Error | null }> {
  try {
    const { data, error } = await supabaseStorage.storage
      .from(BUCKET_NAME)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("[STORAGE_UPLOAD_ERROR]", error);
      return { path: "", error };
    }

    return { path: data.path, error: null };
  } catch (error) {
    console.error("[STORAGE_UPLOAD_EXCEPTION]", error);
    return { path: "", error: error as Error };
  }
}

export async function deleteDocument(path: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabaseStorage.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) {
      console.error("[STORAGE_DELETE_ERROR]", error);
      return { error };
    }

    return { error: null };
  } catch (error) {
    console.error("[STORAGE_DELETE_EXCEPTION]", error);
    return { error: error as Error };
  }
}

export async function getSignedUrl(path: string, expiresIn = 3600): Promise<{ url: string | null; error: Error | null }> {
  try {
    const { data, error } = await supabaseStorage.storage
      .from(BUCKET_NAME)
      .createSignedUrl(path, expiresIn);

    if (error) {
      console.error("[STORAGE_SIGNED_URL_ERROR]", error);
      return { url: null, error };
    }

    return { url: data.signedUrl, error: null };
  } catch (error) {
    console.error("[STORAGE_SIGNED_URL_EXCEPTION]", error);
    return { url: null, error: error as Error };
  }
}
