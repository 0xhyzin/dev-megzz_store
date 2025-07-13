-- CreateTable
CREATE TABLE "Order" (
    "order_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "address_id" UUID NOT NULL,
    "invoice_id" UUID,
    "payment_id" UUID,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "another_phone" VARCHAR(20),
    "discountcode_id" UUID,
    "totalbeforediscount" DECIMAL(10,2),
    "discountamount" DECIMAL(10,2),
    "totalafterdiscount" DECIMAL(10,2),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "User" (
    "user_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "hash_password" VARCHAR(200) NOT NULL,
    "create_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "address" (
    "address_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "governorate" VARCHAR(100),
    "city" VARCHAR(100),
    "street" VARCHAR(200),
    "building_name_number" VARCHAR(20),
    "apartment_number" VARCHAR(10),
    "additional_details" TEXT,

    CONSTRAINT "address_pkey" PRIMARY KEY ("address_id")
);

-- CreateTable
CREATE TABLE "brandtype" (
    "brandtype_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "image_url" VARCHAR(255),

    CONSTRAINT "brandtype_pkey" PRIMARY KEY ("brandtype_id")
);

-- CreateTable
CREATE TABLE "cart" (
    "cart_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "discountcode_id" UUID,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("cart_id")
);

-- CreateTable
CREATE TABLE "cartitem" (
    "cartitem_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cart_id" UUID NOT NULL,
    "productvariant_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL,
    "added_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cartitem_pkey" PRIMARY KEY ("cartitem_id")
);

-- CreateTable
CREATE TABLE "categorytype" (
    "categorytype_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "image_url" VARCHAR(255),

    CONSTRAINT "categorytype_pkey" PRIMARY KEY ("categorytype_id")
);

-- CreateTable
CREATE TABLE "color" (
    "color_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(50) NOT NULL,
    "slug" VARCHAR(50) NOT NULL,
    "hexcode" VARCHAR(7) NOT NULL,

    CONSTRAINT "color_pkey" PRIMARY KEY ("color_id")
);

-- CreateTable
CREATE TABLE "discountcode" (
    "discountcode_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "code" VARCHAR(50) NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "value" DECIMAL(10,2) NOT NULL,
    "maxdiscountamount" DECIMAL(10,2),
    "minorderamount" DECIMAL(10,2),
    "usagelimit" INTEGER DEFAULT 0,
    "usagelimitperuser" INTEGER DEFAULT 0,
    "isactive" BOOLEAN DEFAULT true,
    "ispublic" BOOLEAN DEFAULT true,
    "startdate" TIMESTAMPTZ(6),
    "enddate" TIMESTAMPTZ(6),
    "createdat" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discountcode_pkey" PRIMARY KEY ("discountcode_id")
);

-- CreateTable
CREATE TABLE "discountcodeusage" (
    "discountcodeusage_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "discountcode_id" UUID NOT NULL,

    CONSTRAINT "discountcodeusage_pkey" PRIMARY KEY ("discountcodeusage_id")
);

-- CreateTable
CREATE TABLE "image" (
    "image_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "url" VARCHAR(255) NOT NULL,
    "alttext" VARCHAR(255),
    "isprimary" BOOLEAN DEFAULT false,

    CONSTRAINT "image_pkey" PRIMARY KEY ("image_id")
);

-- CreateTable
CREATE TABLE "invoice" (
    "invoice_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "totalamount" DECIMAL(10,2),
    "subtotal" DECIMAL(10,2),
    "tax" DECIMAL(10,2),
    "discount" DECIMAL(10,2),
    "createdat" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(50),

    CONSTRAINT "invoice_pkey" PRIMARY KEY ("invoice_id")
);

-- CreateTable
CREATE TABLE "orderitem" (
    "orderitem_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "quantity" INTEGER NOT NULL,
    "unitprice" DECIMAL(10,2) NOT NULL,
    "discountperitem" DECIMAL(10,2) DEFAULT 0,
    "totalprice" DECIMAL(10,2) NOT NULL,
    "createdat" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "productvariant_id" UUID NOT NULL,
    "order_id" UUID NOT NULL,

    CONSTRAINT "orderitem_pkey" PRIMARY KEY ("orderitem_id")
);

-- CreateTable
CREATE TABLE "payment" (
    "payment_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "paymenttype_id" UUID NOT NULL,
    "amountpaid" DECIMAL(10,2) NOT NULL,
    "status" VARCHAR(50),
    "paymoborderid" VARCHAR(100),
    "transactionid" VARCHAR(100),
    "hmaxverified" BOOLEAN DEFAULT false,
    "paidat" TIMESTAMPTZ(6),
    "createdat" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "paymenttype" (
    "paymenttype_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "paymentname" VARCHAR(50) NOT NULL,
    "isactive" BOOLEAN DEFAULT true,

    CONSTRAINT "paymenttype_pkey" PRIMARY KEY ("paymenttype_id")
);

-- CreateTable
CREATE TABLE "product" (
    "product_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "categorytype_id" UUID NOT NULL,
    "brandtype_id" UUID NOT NULL,
    "producttype_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "isactive" BOOLEAN DEFAULT true,
    "createdat" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "producttype" (
    "producttype_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "image_url" VARCHAR(255),

    CONSTRAINT "producttype_pkey" PRIMARY KEY ("producttype_id")
);

-- CreateTable
CREATE TABLE "productvariant" (
    "productvariant_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "price" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL,
    "size_id" UUID NOT NULL,
    "color_id" UUID NOT NULL,
    "image_id" UUID NOT NULL,
    "product_id" UUID NOT NULL,

    CONSTRAINT "productvariant_pkey" PRIMARY KEY ("productvariant_id")
);

-- CreateTable
CREATE TABLE "review" (
    "review_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "product_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdat" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "role" (
    "role_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "roletype_id" UUID NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "roletype" (
    "roletype_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "rolename" VARCHAR(50) NOT NULL,

    CONSTRAINT "roletype_pkey" PRIMARY KEY ("roletype_id")
);

-- CreateTable
CREATE TABLE "size" (
    "size_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "value" VARCHAR(20) NOT NULL,

    CONSTRAINT "size_pkey" PRIMARY KEY ("size_id")
);

-- CreateTable
CREATE TABLE "token" (
    "token_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "tokentype_id" UUID NOT NULL,

    CONSTRAINT "token_pkey" PRIMARY KEY ("token_id")
);

-- CreateTable
CREATE TABLE "tokentype" (
    "tokentype_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "token_name" VARCHAR(50) NOT NULL,

    CONSTRAINT "tokentype_pkey" PRIMARY KEY ("tokentype_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "brandtype_slug_key" ON "brandtype"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "uc_cart_variant" ON "cartitem"("cart_id", "productvariant_id");

-- CreateIndex
CREATE UNIQUE INDEX "categorytype_slug_key" ON "categorytype"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "color_slug_key" ON "color"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "color_hexcode_key" ON "color"("hexcode");

-- CreateIndex
CREATE UNIQUE INDEX "discountcode_code_key" ON "discountcode"("code");

-- CreateIndex
CREATE UNIQUE INDEX "paymenttype_paymentname_key" ON "paymenttype"("paymentname");

-- CreateIndex
CREATE UNIQUE INDEX "product_slug_key" ON "product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "producttype_slug_key" ON "producttype"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "uc_user_product" ON "review"("user_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "roletype_rolename_key" ON "roletype"("rolename");

-- CreateIndex
CREATE UNIQUE INDEX "size_value_key" ON "size"("value");

-- CreateIndex
CREATE UNIQUE INDEX "tokentype_token_name_key" ON "tokentype"("token_name");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("address_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_discountcode_id_fkey" FOREIGN KEY ("discountcode_id") REFERENCES "discountcode"("discountcode_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("invoice_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payment"("payment_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_discountcode_id_fkey" FOREIGN KEY ("discountcode_id") REFERENCES "discountcode"("discountcode_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cartitem" ADD CONSTRAINT "cartitem_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "cart"("cart_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cartitem" ADD CONSTRAINT "cartitem_productvariant_id_fkey" FOREIGN KEY ("productvariant_id") REFERENCES "productvariant"("productvariant_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "discountcodeusage" ADD CONSTRAINT "discountcodeusage_discountcode_id_fkey" FOREIGN KEY ("discountcode_id") REFERENCES "discountcode"("discountcode_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "discountcodeusage" ADD CONSTRAINT "discountcodeusage_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orderitem" ADD CONSTRAINT "orderitem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("order_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "orderitem" ADD CONSTRAINT "orderitem_productvariant_id_fkey" FOREIGN KEY ("productvariant_id") REFERENCES "productvariant"("productvariant_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_paymenttype_id_fkey" FOREIGN KEY ("paymenttype_id") REFERENCES "paymenttype"("paymenttype_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_brandtype_id_fkey" FOREIGN KEY ("brandtype_id") REFERENCES "brandtype"("brandtype_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_categorytype_id_fkey" FOREIGN KEY ("categorytype_id") REFERENCES "categorytype"("categorytype_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_producttype_id_fkey" FOREIGN KEY ("producttype_id") REFERENCES "producttype"("producttype_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "productvariant" ADD CONSTRAINT "productvariant_color_id_fkey" FOREIGN KEY ("color_id") REFERENCES "color"("color_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "productvariant" ADD CONSTRAINT "productvariant_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "image"("image_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "productvariant" ADD CONSTRAINT "productvariant_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("product_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "productvariant" ADD CONSTRAINT "productvariant_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "size"("size_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("product_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role" ADD CONSTRAINT "role_roletype_id_fkey" FOREIGN KEY ("roletype_id") REFERENCES "roletype"("roletype_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role" ADD CONSTRAINT "role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "token_tokentype_id_fkey" FOREIGN KEY ("tokentype_id") REFERENCES "tokentype"("tokentype_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;
