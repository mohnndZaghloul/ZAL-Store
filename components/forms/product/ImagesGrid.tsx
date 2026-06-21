import { Button } from "@/components/ui/button";

type ImagesGrid_TP = {
  imageUrls: string[];
  handleRemove: (urlToRemove: string) => void;
};

export default function ImagesGrid({ imageUrls, handleRemove }: ImagesGrid_TP) {
  return (
    <>
      {imageUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mt-2">
          {imageUrls.map((url, index) => (
            <div key={`${url}-${index}`} className="relative">
              <img
                src={url}
                alt="image"
                className="w-full h-24 object-cover rounded-xl"
              />
              <Button
                onClick={() => handleRemove(url)}
                className="cursor-pointer absolute -top-2 -right-2 bg-destructive hover:bg-destructive/80 w-6 h-6 text-xs">
                ✕
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
