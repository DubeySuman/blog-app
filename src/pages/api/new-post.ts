import type { APIRoute } from 'astro';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Only initialize once
if (!getApps().length) {
    initializeApp({
        credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string)),
    });
}

const db = getFirestore();

export const post: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();
        const title = formData.get('title');
        const category = formData.get('category');
        const content = formData.get('content');
        // TODO: handle file uploads (image/attachment)

        if (!title || !category || !content) {
            return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
        }

        const docRef = await db.collection('posts').add({
            title,
            category,
            content,
            createdAt: new Date().toISOString(),
        });

        return new Response(JSON.stringify({ id: docRef.id }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ error: 'Failed to save post', details: String(err) }), { status: 500 });
    }
};
