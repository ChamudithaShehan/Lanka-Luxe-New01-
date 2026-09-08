/**
 * Helper to upload images directly to ImgBB via the Next.js /api/upload endpoint
 */
export async function uploadToImgBB(
  fileOrBase64: File | string,
  name?: string
): Promise<{ url: string; display_url: string; thumb?: string }> {
  if (typeof fileOrBase64 === "string") {
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: fileOrBase64, name }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to upload image");
    }
    return data;
  } else {
    const formData = new FormData();
    formData.append("image", fileOrBase64);
    if (name) formData.append("name", name);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to upload image");
    }
    return data;
  }
}
