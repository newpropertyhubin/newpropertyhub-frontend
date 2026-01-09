import React from "react";

const MediaUploader = ({ media, setMedia }) => {
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setMedia({ ...media, images: files });
  };

  const handleVideoUpload = (e) => {
    const files = Array.from(e.target.files);
    setMedia({ ...media, videos: files });
  };

  return (
    <div className="media-uploader">
      <label>
        Upload Images:
        <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
      </label>
      <label>
        Upload Videos:
        <input type="file" accept="video/*" multiple onChange={handleVideoUpload} />
      </label>

      <div className="preview">
        {media.images.map((file, idx) => (
          <img key={idx} src={URL.createObjectURL(file)} alt="preview" width={100} />
        ))}
        {media.videos.map((file, idx) => (
          <video key={idx} width={150} controls>
            <source src={URL.createObjectURL(file)} type={file.type} />
          </video>
        ))}
      </div>
    </div>
  );
};

export default MediaUploader;