import {NotionLoader} from 'langchain/document_loaders/fs/notion';
import {RecursiveCharacterTextSplitter} from 'langchain/text_splitter';
import {FaissStore} from 'langchain/vectorstores/faiss';
import {OpenAIEmbeddings} from 'langchain/embeddings/openai';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();
const openaiApiKey = process.env.OPENAI_API_KEY;


const app = express();


// Enable CORS for all routes
app.use(cors());

app.get('/loadNotionData', async (req, res) => {
  try {
    const directoryPath = req.query.directoryPath;
    const notionLoader = new NotionLoader(directoryPath);
    const documents = await notionLoader.load();

    const markdownSplitter = new RecursiveCharacterTextSplitter({
      separators: ['#', '##', '###', '\\n\\n', '\\n', '.'],
      chunkSize: 1500,
      chunkOverlap: 100,
    });
    const docs = await markdownSplitter.splitDocuments(documents);
    // Initialize OpenAI embedding model
    const embeddings = new OpenAIEmbeddings(openaiApiKey);

    // Convert all chunks into vectors embeddings using OpenAI embedding model
    // Store all vectors in FAISS index and save to local folder 'faissIndex'
    const db = await FaissStore.fromDocuments(docs, embeddings);
    db.save('blendleIndex');

    res.json(200, {message: 'success'});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Internal Server Error'});
  }
});

app.get('/search', async (req, res) => {
  try {
    const query = req.query.query;
    const loadedVectorStore = await FaissStore.load(
        'faissIndex',
        new OpenAIEmbeddings(openaiApiKey),
    );
    const results = await loadedVectorStore.similaritySearch(query, 4);
    log.console(results);
    res.status(200).json({results});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Internal Server Error'});
  }
});
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

