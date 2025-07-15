import { Prisma } from "@prisma/client";

export const productVariantWithIncludes = Prisma.validator<Prisma.productvariantDefaultArgs>()({
    include: {
        color: {
            select: {
                name: true
            }
        },
        size: {
            select: {
                value: true
            }
        },
        product: {
            select: {
                name: true
            }
        },
        images: {
            select: {
                url: true
            }
        }
    }
});

export type ProductVariantWithRelations = Prisma.productvariantGetPayload<typeof productVariantWithIncludes>; 