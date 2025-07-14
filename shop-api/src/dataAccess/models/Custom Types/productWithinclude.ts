import { Prisma } from "@prisma/client";

const productWithIncludes = Prisma.validator<Prisma.productDefaultArgs>()({
    include: {
        brandtype: {
            select: {
                name: true
            }
        },
        producttype: {
            select: {
                name: true
            }
        },
        categorytype: {
            select: {
                name: true
            }
        }
    }
});

export type ProductWithRelations = Prisma.productGetPayload<typeof productWithIncludes>