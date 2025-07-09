import { Prisma } from "@prisma/client";

export type UserWithAddressAndPhone = Prisma.UserGetPayload<{
    include: {
        address: true;
        phone: true;
    };
}>;
