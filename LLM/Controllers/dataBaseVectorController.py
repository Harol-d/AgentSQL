from Models.databaseVectorModel import databaseVectormodel
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader

class dataBaseVectorController:
    def __init__(self):
        self.model = databaseVectormodel()
        self.doc = "Serviciosvirtuales.sql"
    def ObtenerDocumento(self, documento:str):
        loader = TextLoader(documento, encoding='utf16')
        doc = loader.load()
        return doc
    
    def crearChunks(self, doc: str):
        loader = TextLoader(doc, encoding='utf16')
        doc = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=2000,
            chunk_overlap=150,
            length_function=len
        )
        chunks = text_splitter.split_documents(doc)
        self.model.agregarRecords(chunks)

    def obtenerRecords(self, pregunta: str):
        return self.model.consultarRecords(pregunta)
