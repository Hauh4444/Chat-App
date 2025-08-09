import 'dotenv/config';

export default {
    expo: {
        name: 'ChatApp',
        slug: 'chat',
        version: '1.0.0',
        extra: {
            BACKEND_API_URL: process.env.BACKEND_API_URL,
        },
    },
};
