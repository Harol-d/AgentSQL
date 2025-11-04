from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.documents import Document 
import json
from io import StringIO

class DocService:
    def crearChunks(self,doc: str):
        documents = TextLoader(doc, encoding='utf-16').load()
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=8000,
            chunk_overlap=500,
            length_function=len
        )
        chunks = text_splitter.split_documents(documents)
        text_chunks = [chunk.page_content for chunk in chunks]
        return text_chunks

    def crearEmbeddings(self, entry):
        model = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs = {'device': 'cpu'},
            encode_kwargs = {'normalize_embeddings': False},
            show_progress=True
        )
        if isinstance(entry, list):
            embeddings = model.embed_documents(entry)
            return embeddings
        else:
            embeddings = model.embed_query(entry)
            return embeddings

    def embeddingsToJsonl(self, text_chunks: list[str], embeddings: list[str]):
       buffer = StringIO()
       for idx, (chunk, embedding) in enumerate(zip(text_chunks, embeddings)):
           data = {
               "id": idx,
               "text": chunk,
               "embedding": embedding
           }
           json.dump(data, buffer, separators=(',', ':'))
           buffer.write('\n')
       print(buffer.getvalue())  
       return buffer.getvalue()


    def fetch_text_chunks(self, ids: list[str], file_content: str):
    # ✅ Validar si file_content es None o vacío
        if not file_content:
            print("⚠️ ADVERTENCIA: No hay contenido en el archivo de embeddings")
            return []
    
        texts = {}
        for line in file_content.strip().split('\n'):
            if line.strip():
                data = json.loads(line)
            if str(data['id']) in ids:
                texts[str(data['id'])] = data['text']
    
        return [Document(page_content=texts[id]) for id in ids if id in texts]