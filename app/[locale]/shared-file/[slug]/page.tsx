import { getFile } from "./api";
import SharedFilePreview from "./SharedFilePreview";

interface PageProps {
  params: Promise<{
    slug: string;
    locale: string;
  }>;
}

export default async function SharedFilePage({ params }: PageProps) {
  const { slug } = await params;

  try {
    const file = await getFile(slug);
    const fileType = file?.file?.type;

    return (
      <div>
        {file && (
          <div className="w-full h-full p-6">
            <SharedFilePreview
              url={file.file?.url ?? ""}
              name={file.name ?? "Shared file"}
              fileType={fileType}
              mimeType={file.file?.mime_type}
            />
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error loading file:", error);
    return (
      <div>
        <h1>Error</h1>
        <p>Failed to load the shared file.</p>
      </div>
    );
  }
}
