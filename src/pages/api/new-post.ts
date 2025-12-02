import type { APIRoute } from 'astro';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount),
    });
}

const db = getFirestore();

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.json();
        const { title, category, content } = data;

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
