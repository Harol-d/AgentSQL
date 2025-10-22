from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
class DocService:

    def crearCunks(doc: str):
        documents = TextLoader(doc, encoding='utf-16').load()
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=8000,
            chunk_overlap=500,
            length_function=len
        )
        chunks = text_splitter.split_documents(documents)
        return chunks

    def crearEmbeddings(chunks: list[str]):
        model = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            model_kwargs = {'device': 'cpu'},
            encode_kwargs = {'normalize_embeddings': False}
            )
        embbedings = model.embed_documents(chunks)
        return embbedings
    
    def subirEmbbedings(embbedings: list[str]):
        blob = self.bucket.blob(f"{os.getenv('BLOB_NAME')}/{embbedings}")
        blob.upload_from_string(embbedings)
        return blob