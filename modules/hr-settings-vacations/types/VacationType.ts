export interface VacationType {
    id: string;
    name: string;
    is_payed: boolean | number;
    is_deduct_from_balance: boolean | number;
    requires_attachment: boolean | number;
}
