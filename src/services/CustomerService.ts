
import prisma from '@/lib/prisma';
import { Customer, CreateCustomerData, UpdateCustomerData } from '@/types';

interface FindAllParams {
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: 'asc' | 'desc';
};

interface FindAllResult {
    data: Customer[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasMore: boolean;
    };
};

export async function findAllCustomers(params: FindAllParams = {}): Promise<FindAllResult> {
    const { search, page = 1, limit = 10, sortBy = 'name', order = 'asc' } = params;

    const where = search ? {
        OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
        ]
    } : undefined;

    const [customers, total] = await Promise.all([
        prisma.customer.findMany({
            where,
            orderBy: { [sortBy]: order },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.customer.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        data: customers,
        meta: {
            total,
            page,
            limit,
            totalPages,
            hasMore: page < totalPages,
        }
    };
};

export async function findCustomerById(id: string): Promise<Customer | null> {
    const customer = await prisma.customer.findUnique({
        where: { id }
    });

    return customer;
};

export async function createCustomer(
    data: CreateCustomerData
): Promise<Customer> {
    const customer = await prisma.customer.create({
        data
    });

    return customer;
};

export async function updateCustomer(
    id: string,
    data: UpdateCustomerData
): Promise<Customer> {
    const customer = await prisma.customer.update({
        where: { id },
        data
    });

    return customer;
};

export async function deleteCustomer(
    id: string,
): Promise<void> {
    await prisma.customer.delete({
        where: { id }
    });
};