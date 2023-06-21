import { pinecone } from '@/utils/pinecone-client';
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from '@/config/pinecone';

(async () => {
    try {
        const index = pinecone.Index(PINECONE_INDEX_NAME);
        await index.delete1({
            deleteAll: true,
            namespace: PINECONE_NAME_SPACE,
        });
        console.log("Successfully deleted the namespace");
    } catch (e) {
        console.error("Something went wrong deleting the namespace", e);
    }
})();
