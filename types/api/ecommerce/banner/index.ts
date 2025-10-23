export interface ECM_Banner {
  id: string;
  name: string;
  type: string;
  file?: {
    id: number;
    url: string;
    name: string;
    mime_type: string;
    type: string;
  };
  is_active: "active" | "inActive";
}
