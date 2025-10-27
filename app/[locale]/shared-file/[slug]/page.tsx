import { getFile } from "./api";

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
    const isImg = fileType == "image";

    return (
      <div>
        {file && (
          <div className="w-full h-full p-6">
            {/* Display file information here */}
            {isImg ? (
              <img
                src={file?.file?.url}
                alt={file?.name}
                width={"100%"}
                height={"500px"}
              />
            ) : (
              <iframe src={file?.file?.url} width={"100%"} height={"500px"} />
            )}
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
