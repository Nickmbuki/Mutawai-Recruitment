import { v2 as cloudinary } from "cloudinary";

type UploadedFile = {
  url: string;
  publicId: string;
  originalName: string;
  mimeType: string;
};

function configureCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return false;
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });

  return true;
}

export async function uploadDocument(file: Express.Multer.File): Promise<UploadedFile> {
  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  const cloudinaryConfigured = configureCloudinary();

  if (!cloudinaryConfigured) {
    return {
      url: dataUri,
      publicId: `local-${Date.now()}-${file.originalname}`,
      originalName: file.originalname,
      mimeType: file.mimetype,
    };
  }

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "mutawai/applications",
    resource_type: "auto",
    use_filename: true,
    unique_filename: true,
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    originalName: file.originalname,
    mimeType: file.mimetype,
  };
}
