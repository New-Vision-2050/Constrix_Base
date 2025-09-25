import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";
import InputDocName from "./InputDocName";
import { Pencil, Trash } from "lucide-react";

type DocType = { id: string; name: string };

export default function AddDocView() {
  // ** declare and define helper variables
  const [docs, setDocs] = useState<DocType[]>([]);
  const [documentName, setDocumentName] = useState("");
  const [document, setDocument] = useState<DocType>();

  const t = useTranslations("companyProfile.officialDocs.docsSettingsDialog");

  // handle save
  const handleSave = () => {
    if (documentName) {
      const _doc = { id: Date.now().toString(), name: documentName };
      setDocument(_doc);
      setDocumentName("");
      setDocs([...docs, _doc]);
    }
  };
  // handle delete
  const handleDelete = (id: string) => {
    setDocs(docs.filter((doc) => doc.id !== id));
  };

  return (
    <div className="flex flex-col gap-2 w-full p-4">
      {/* add new doc */}
      <div className="flex items-center gap-2">
        <InputDocName
          value={documentName}
          onChange={(str) => setDocumentName(str)}
          disabled={false}
          placeholder={t("docName")}
        />
        <Button onClick={handleSave}>{t("save")}</Button>
      </div>
      {/* docs list */}
      <div className="flex flex-col gap-2">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between gap-2 py-1 px-2 border border-gray-500 rounded-lg"
          >
            {/* doc name */}
            <span>{doc.name}</span>
            {/* actions */}
            <div className="flex items-center">
              <Button variant="ghost">
                <Pencil className="text-pink-700" />
              </Button>
              <Button variant="ghost" onClick={() => handleDelete(doc.id)}>
                <Trash className="text-red-700" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
