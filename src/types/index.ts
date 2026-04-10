export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
};

export type CreateUserData = Omit<User, 'id'>;
export type UpdateUserData = Partial<CreateUserData>;
export type InvoiceStatus = 'PEDENTE' | 'PAGO';

export interface Invoice {
    id: string;
    customer_id: string;
    amount: number;
    date: Date;
    status: InvoiceStatus;
};

export type CreateInvoiceData = Omit<Invoice, 'id'>;
export type UpdateInvoiceData = Partial<CreateInvoiceData>;

export interface revenue {
    month: string;
    revenue: number;
};

//Generics
export interface ApiResponse <T>{
    data: T;
    message?: string;
};

export interface ApiError {
    error: string;
    details: unknown;
};