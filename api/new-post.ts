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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    try {
        const { title, category, content } = req.body;
        if (!title || !category || !content) {
            res.status(400).json({ error: 'Missing fields' });
            return;
        }
        const docRef = await db.collection('posts').add({
            title,
            category,
            content,
            createdAt: new Date().toISOString(),
        });
        res.status(200).json({ id: docRef.id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save post', details: String(err) });
    }
}
