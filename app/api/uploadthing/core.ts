import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// এখানে আপনি চাইলে ইউজার লগইন করা আছে কিনা তা চেক করতে পারেন (Better Auth বা অন্য যেকোনোটি দিয়ে)
const auth = (req: Request) => ({ id: "user_123" }); 

export const ourFileRouter = {
  // ইমেজ এবং ভিডিওর জন্য আলাদা রাউট কনফিগারেশন
  mediaUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 4 },
    video: { maxFileSize: "16MB", maxFileCount: 1 }
  })
    .middleware(async ({ req }) => {
      const user = auth(req);
      if (!user) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;