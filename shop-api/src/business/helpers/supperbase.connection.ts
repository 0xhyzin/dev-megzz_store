import { createClient } from '@supabase/supabase-js';
import { logger } from '../../utils/logger';

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export const SaveImageInSupabase = async (image: Express.Multer.File, fileName: string, bucket: string) => {
    const reuslt = await supabase.storage
        .from(bucket)
        .upload(fileName, image.buffer, {
            contentType: image.mimetype,
            cacheControl: '3600',
            upsert: false,
        });

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
    const imageUrl = publicUrlData.publicUrl;

    return { reuslt, imageUrl }
}

const GetImageName = (imageUrl: string) => {
    return imageUrl.split('/');
}

export const DeleteImageInSupabase = async (imageUrl: string, bucketName: string) => {
    logger.info("Delete Image From Supabase", { imageName: GetImageName(imageUrl) })
    return await supabase.storage
        .from(bucketName)
        .remove([GetImageName(imageUrl)[8]]);
}

export const ensureBucketExists = async (bucketName: string) => {

    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
        logger.error('Failed to fetch buckets: ' + error.message);
        return false;
    }
    return buckets.some((bucket) => bucket.name === bucketName);
};

export const createPublicBucket = async (bucketName: string) => {
    const { error: createError } = await supabase.storage.createBucket(bucketName, {
        public: true,
    });

    if (createError) {
        logger.error('Bucket creation failed:', createError.message);
        return;
    }

    console.log(`Bucket '${bucketName}' created and set to public`);
};