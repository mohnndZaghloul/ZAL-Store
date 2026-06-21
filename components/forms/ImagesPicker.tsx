import { Dispatch, SetStateAction, useState } from "react";
import { Input } from "../ui/input";
import ImagesGrid from "./product/ImagesGrid";
import { Label } from "../ui/label";
import { Plus } from "lucide-react";

type imagesPicker_TP = {
  uploadingCount: number;
  setUploadingCount: Dispatch<SetStateAction<number>>;
  imageUrls: string[];
  setImageUrls: Dispatch<SetStateAction<string[]>>;
  error?: string;
};

const ImagesPicker = ({
  uploadingCount,
  setUploadingCount,
  imageUrls,
  setImageUrls,
  error,
}: imagesPicker_TP) => {
  const handleUpload = async (files: FileList) => {
    const filesArray = Array.from(files);
    setUploadingCount(filesArray.length);

    const uploadPromises = filesArray.map(async (file) => {
      const sigRes = await fetch("/api/cloudinary-sign", { method: "POST" });
      const { timestamp, signature, cloudName, apiKey } = await sigRes.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", "products");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData },
      );

      const data = await res.json();
      if (!data.secure_url)
        throw new Error(data.error?.message || "Upload failed");
      return data.secure_url as string;
    });

    try {
      const urls = await Promise.all(uploadPromises);
      setImageUrls((prev) => [...prev, ...urls]);
    } catch {
      console.error("One or more uploads failed");
    } finally {
      setUploadingCount(0);
    }
  };

  const handleRemove = (urlToRemove: string) => {
    setImageUrls((prev) => prev.filter((url) => url !== urlToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="uppercase ">Select Images</Label>
        <p className="text-destructive text-end text-xs">{error}</p>
      </div>
      <div className="flex gap-2">
        <div className="relative group">
          <div className="min-h-32 aspect-square bg-muted flex justify-center items-center border group-hover:bg-muted/70 transition">
            <Plus />
          </div>
          <Input
            type="file"
            accept="image/*"
            multiple
            className="absolute top-0 opacity-0 min-h-32 aspect-square cursor-pointer"
            onChange={(e) => {
              if (e.target.files?.[0]) handleUpload(e.target.files);
            }}
          />
          <input
            type="hidden"
            name="images"
            value={JSON.stringify(imageUrls ?? [])}
          />
        </div>

        {uploadingCount > 0 && (
          <p className="text-sm text-muted-foreground">
            Uploading {uploadingCount} image(s)...
          </p>
        )}

        <ImagesGrid imageUrls={imageUrls} handleRemove={handleRemove} />
      </div>
    </div>
  );
};

export default ImagesPicker;
