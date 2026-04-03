import { PrismaClient, InvoiceStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log('Iniciando população do banco de dados...');

    const password = await bcrypt.hash('password', 10);

    const user = await prisma.user.upsert({
        where: { email: 'admin@acme.com' },
        update: {},
        create: {
            name: 'Admin',
            email: 'admin@acme.com',
            password: password
        }
    });

    console.log('Usuário criado com sucesso.');

    const customer_data = [{
        name: 'Joana Nogueira',
        email: 'joana@email.com',
        imageUrl: 'https://ui-avatars.com/api/?nome=Joana+Nogueira&background=random',
    }, {
        name: 'Beatriz Nogueira',
        email: 'beatriz@email.com',
        imageUrl: 'https://ui-avatars.com/api/?nome=Beatriz+Nogueira&background=random',
    }, {
        name: 'Safira Nogueira',
        email: 'safira@email.com',
        imageUrl: 'https://ui-avatars.com/api/?nome=Safira+Nogueira&background=random',
    }];

    const customers = [];

    for (const data of customer_data) {
        const customer = await prisma.customer.upsert({
            where: { email: data.email },
            update: {},
            create: data
        });

        customers.push(customer);

        console.log(`Cliente criado: ${customer.name}`);
    };

    const invoicesData = [
        {
            amount: 15785,
            status: InvoiceStatus.PENDENTE,
            date: '2026-15-05',
            customer: customers[0]
        }, {
            amount: 15566,
            status: InvoiceStatus.PAGO,
            date: '2026-09-05',
            customer: customers[1]
        }, {
            amount: 18464,
            status: InvoiceStatus.PENDENTE,
            date: '2026-07-05',
            customer: customers[2]
        }, {
            amount: 14455,
            status: InvoiceStatus.PENDENTE,
            date: '2026-31-05',
            customer: customers[0]
        }, {
            amount: 238764,
            status: InvoiceStatus.PAGO,
            date: '2026-04-05',
            customer: customers[1]
        }, {
            amount: 89826,
            status: InvoiceStatus.PENDENTE,
            date: '2026-02-05',
            customer: customers[2]
        }, {
            amount: 45698,
            status: InvoiceStatus.PENDENTE,
            date: '2026-16-05',
            customer: customers[0]
        }, {
            amount: 85214,
            status: InvoiceStatus.PAGO,
            date: '2026-11-05',
            customer: customers[1]
        }, {
            amount: 7412356,
            status: InvoiceStatus.PENDENTE,
            date: '2026-13-05',
            customer: customers[2]
        }, {
            amount: 965874,
            status: InvoiceStatus.PAGO,
            date: '2026-24-05',
            customer: customers[0]
        }
    ];


    for (const data of invoicesData) {
        await prisma.invoice.create({
            data: {
                amount: data.amount,
                status: data.status,
                date: new Date(data.date),
                customerId: data.customer.id
            }
        });
    };

    console.log(`${invoicesData.length} faturas criadas.`);

    const revenueData = [{
        month: 'Jan',
        revenue: 155477
    }, {
        month: 'Fev',
        revenue: 155477
    }, {
        month: 'Mar',
        revenue: 74123
    }, {
        month: 'Abr',
        revenue: 526852
    }, {
        month: 'Mai',
        revenue: 3214569
    }, {
        month: 'Jun',
        revenue: 521478
    }, {
        month: 'Jul',
        revenue: 4523698
    }, {
        month: 'Ago',
        revenue: 654789
    }, {
        month: 'Set',
        revenue: 852147
    }, {
        month: 'Out',
        revenue: 325547
    }, {
        month: 'Nov',
        revenue: 744555
    }, {
        month: 'Dez',
        revenue: 222244
    }];

    for (const data of revenueData){
        await prisma.revenue.upsert({
            where: {month: data.month},
            update: {revenue: data.revenue},
            create: data
        });
    };

    console.log('Dados de receita mensal criados.');
    console.log('População concuída com sucesso.');
};

main()
.catch((erro) => {
    console.log('Erro ao popular o banco:', erro);
})
.finally( async () => {
    await prisma.$disconnect();
});