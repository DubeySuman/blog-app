import { NextApiRequest, NextApiResponse } from 'next';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);

if (!getApps().length) {
    initializeApp({
        credential: cert(serviceAccount),
    });
}

const db = getFirestore();

// Helper to parse JSON body in Vercel serverless functions
async function parseBody(req: NextApiRequest) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk: Buffer) => {
            body += chunk;
        });
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (e) {
                reject(e);
            }
        });
    });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    try {
        const body = await parseBody(req);
        const { title, category, content } = body as any;
        if (!title || !category || !content) {
            console.error('Missing fields:', { title, category, content });
            res.status(400).json({ error: 'Missing fields' });
            return;
        }
        const docRef = await db.collection('posts').add({
            title,
            category,
            content,
            createdAt: new Date().toISOString(),
        });
        console.log('Blog post saved:', docRef.id);
        res.status(200).json({ id: docRef.id });
    } catch (err) {
        console.error('API error:', err);
        res.status(500).json({ error: 'Failed to save post', details: String(err) });
    }
}
