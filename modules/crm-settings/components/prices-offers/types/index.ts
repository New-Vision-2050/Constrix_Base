
export interface PriceOffer {
    id: string;
    referenceNumber: string;
    offerName: string;
    clientName: string;
    department: string;
    financialResponsible: string;
    offerStatus: "accepted" | "pending" | "rejected" | "draft";
    mediator: string;
    hasAttachment: boolean;
  }