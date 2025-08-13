from pinecone import Pinecone
from langchain_pinecone import PineconeVectorStore
from langchain.chains.question_answering import load_qa_chain
from Config.dataBaseConfig import PineconeConfig

class databaseVectormodel (PineconeConfig):
    def __init__(self):
        self.pipecone = Pinecone(api_key=self.PINECONE_API_KEY)
        self.record = "taller"
        # self.index = self.pipecone.Index(self.record)

    def agregarRecords(self, chunks: str):
        resultado = PineconeVectorStore.from_documents(
        chunks,
        embedding=self.Modelo,
        index_name=self.record)
        return resultado
    
    def eliminarRecords(self):
        self.pipecone.delete(delete_all=True)
    
    def consultarRecords(self, pregunta: str):
        vstore = PineconeVectorStore.from_existing_index(index_name=self.record, embedding=self.Modelo)
        context = vstore.similarity_search(pregunta, 5)
        return context 
    
    def imprimirVariableDeEntorno(self):
        return self.PINECONE_API_KEY

# cargar el documento SQL

# print(len(chunks))
# crear embeddings

#cambiar modelo
# embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
# model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')
# sentence_embeddings = model.encode("De que trata los servicios virtuales de la base de datos?")
#conuslta pinecone
# vstore = PineconeVectorStore.from_existing_index(self.record, embeddings)

# chain = load_qa_chain(llm, chain_type="map_reduce")
# # Pregunta del usuario
# pregunta = input("Pregunta: ")

# # Busqueda de párrafos similares

# print(sentence_embeddings)
# print(len(sentence_embeddings))
# PineconeVectorStore.from_documents(
#     chunks,
#     embedding=embeddings,
#     index_name=INDEX_NAME
# )
# index.delete(delete_all=True)
# upsert_response = index.upsert(
#    vectors=[
#        {'id': "vec1", "values":vector1, "metadata": {'genero': 'cine'}},
#        {'id': "vec2", "values":vector2, "metadata": {'genero': 'teatro'}},
#    ]
# )
# print(upsert_response)

# print(result)