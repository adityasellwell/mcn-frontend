import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Image, AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  getSliderImages,
  uploadSliderImage,
  deleteSliderImage,
} from "../../services/sliderService";

const CMS = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const loadImages = async () => {
    try {
      setLoading(true);
      const res = await getSliderImages();
      setImages(res.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load slider images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select an image to upload");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);
    if (title.trim()) {
      formData.append("title", title.trim());
    }

    try {
      setUploading(true);
      await uploadSliderImage(formData);
      toast.success("Image uploaded successfully");
      setSelectedFile(null);
      setPreview(null);
      setTitle("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadImages();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this image from the slider?")) return;
    try {
      setDeletingId(id);
      await deleteSliderImage(id);
      toast.success("Image deleted");
      setImages((prev) => prev.filter((img) => img.id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete image");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Community Slider — CMS
        </h1>
        <p className="text-zinc-400 mt-1 text-sm">
          Upload images that appear in the community slider on the homepage.
          Images are shown only when at least one is uploaded.
        </p>
      </div>

      {/* Upload Form */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Upload size={18} className="text-green-500" />
          Upload New Image
        </h2>

        <form onSubmit={handleUpload} className="space-y-4">
          {/* File Input */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Select Image <span className="text-red-400">*</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="
                w-full text-zinc-300 text-sm
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:bg-green-700 file:text-white file:cursor-pointer
                file:hover:bg-green-600 file:transition-colors
                bg-zinc-950 border border-zinc-700 rounded-xl p-2
              "
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">
              Caption / Title <span className="text-zinc-500">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Annual Networking Event 2025"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="
                w-full bg-zinc-950 border border-zinc-700 rounded-xl
                px-4 py-2.5 text-white text-sm
                placeholder:text-zinc-600
                focus:outline-none focus:border-green-600
              "
            />
          </div>

          {/* Preview */}
          {preview && (
            <div className="mt-2">
              <p className="text-xs text-zinc-500 mb-2">Preview:</p>
              <img
                src={preview}
                alt="Preview"
                className="w-full max-w-sm h-48 object-cover rounded-xl border border-zinc-700"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className="
              flex items-center gap-2 px-6 py-2.5
              bg-green-700 hover:bg-green-600
              disabled:opacity-50 disabled:cursor-not-allowed
              text-white font-medium rounded-xl
              transition-colors
            "
          >
            {uploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} />
                Upload Image
              </>
            )}
          </button>
        </form>
      </div>

      {/* Divider */}
      <div className="border-t border-zinc-800" />

      {/* Image Gallery */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Image size={18} className="text-green-500" />
          Slider Images{" "}
          <span className="text-sm font-normal text-zinc-400">
            ({images.length} total)
          </span>
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-zinc-500" />
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-500">
            <AlertCircle size={36} />
            <p className="text-sm">
              No images uploaded yet. The slider will be hidden on the homepage
              until you add at least one image.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                className="relative group rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900"
              >
                <img
                  src={img.imageUrl}
                  alt={img.title || `Slider Image ${img.id}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    {img.title && (
                      <p className="text-white text-sm font-medium truncate">
                        {img.title}
                      </p>
                    )}
                    <p className="text-zinc-500 text-xs mt-0.5">
                      {new Date(img.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(img.id)}
                    disabled={deletingId === img.id}
                    className="
                      shrink-0 p-2 rounded-lg
                      bg-red-900/30 hover:bg-red-700/50
                      text-red-400 hover:text-red-300
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-colors
                    "
                    title="Delete image"
                  >
                    {deletingId === img.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CMS;
