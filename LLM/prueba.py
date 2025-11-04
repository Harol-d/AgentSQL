# from tkinter import E
# from langchain_community.document_loaders import PyPDFLoader
from langchain_community.document_loaders import TextLoader
from google.cloud import aiplatform
from google.cloud import storage
from langchain_google_genai import ChatGoogleGenerativeAI
import json
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings

PROJECT_ID = "agentsql"
BUCKET = "embeddings-agent-us-central1"
client = storage.Client(project=PROJECT_ID)
bucket = client.bucket(BUCKET)
filename = "embeddings.json"
blob = bucket.blob(f"embeddings/{filename}")
embeddings_path = f"gs://{BUCKET}/embeddings/"
embeddings_dimensionality = 384
DEPLOYED_INDEX_ID = f"deployed_index_sql"
model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2",
    model_kwargs={'device': 'cpu'},
    encode_kwargs={'normalize_embeddings': False},
    show_progress=True
)
model_LLM = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    google_api_key="AIzaSyBkr0gbuRjnJ9ia6WDMYb-m5bKjlq-Lw6E",
    temperature=0.1,
    max_output_tokens=4096
)

# # Cargar PDF correctamente
# print("📄 Cargando SQL...")
# documents = TextLoader("db/Serviciosvirtuales.sql", 'utf-16').load()
# print(f"✅ Cargadas {len(documents)} páginas")

# text_splitter = RecursiveCharacterTextSplitter(
#     chunk_size=8000,
#     chunk_overlap=500,
#     length_function=len
# )
# text_chunks = text_splitter.split_documents(documents)
# print(f"✅ Creados {len(text_chunks)} chunks")



# Extraer solo el texto de los chunks para embeddings
# print("🔄 Generando embeddings...")
# text_contents = [chunk.page_content for chunk in text_chunks]
# embeddings = model.embed_documents(text_contents)
# print(f"✅ Generados {len(embeddings)} embeddings")

# # Crear estructura de datos para Vector Search
# print("💾 Creando archivo y subiendo...")

def create_embeddings_jsonl(text_chunks, embeddings, filename):
    with open(filename, 'w') as outfile:
        for idx, (chunk, embedding) in enumerate(zip(text_chunks, embeddings)):
            data = {
                "id": idx,  # Convertir a string para mejor compatibilidad
                "text": chunk.page_content,  # ✅ Extraer el contenido del Document
                "embedding": embedding
            }
            json.dump(data, outfile, separators=(',', ':'))  # ✅ dump no retorna nada
            outfile.write('\n')
    
    # ✅ Subir el archivo después de cerrarlo
    print(f"☁️ Subiendo {filename} a Google Cloud Storage...")
    
    blob.upload_from_filename(filename)  # ✅ Usar upload_from_filename en lugar de upload_from_string
        

# create_embeddings_jsonl(text_chunks, embeddings, filename)


def vector_search_create_index(
    project: str, display_name: str
):
    print(f"🔍 Creando índice de Vector Search: {display_name}...")
    aiplatform.init(project=project, location="us-central1")

    index = aiplatform.MatchingEngineIndex.create_tree_ah_index(
        display_name=display_name,
        contents_delta_uri=embeddings_path,
        description="RAG Index from PDF",
        dimensions=embeddings_dimensionality,
        approximate_neighbors_count=50,
        leaf_node_embedding_count=500,
        leaf_nodes_to_search_percent=7,
        index_update_method="batch_update",
        distance_measure_type="DOT_PRODUCT_DISTANCE",
    )
    print("✅ Índice creado correctamente")
    return index

# display_name = "RAG-index-sql"
# # vvs_index = vector_search_create_index(PROJECT_ID, display_name)
# print(f"\n📊 Índice creado:")
# print(f"   Nombre: {vvs_index.display_name}")
# print(f"   ID: {vvs_index.name}")

query = "creame un query para obtener todos los datos de un cliente con id especifico"

def embed_query(text: str):
    embeddings = model.embed_query(text)
    return embeddings

query_embeddings = embed_query(query)

# aiplatform.init(project=PROJECT_ID, location="us-central1")
# vvs_index_endpoint = aiplatform.MatchingEngineIndexEndpoint.create(
#     display_name = f"index-endpoint-sql",
#     public_endpoint_enabled = True
# )

# DEPLOYED_INDEX_ID = f"deployed_index_sql"

# vvs_index_endpoint.deploy_index(
#     index = vvs_index, deployed_index_id = DEPLOYED_INDEX_ID, deploy_request_timeout=2000
# )
# print(f"✅ Se esta desplegando el indice,espera a que se cree")

vvs_index_endpoint = aiplatform.MatchingEngineIndexEndpoint(index_endpoint_name=ENDPOINT_ID)
results = vvs_index_endpoint.find_neighbors(
    deployed_index_id = DEPLOYED_INDEX_ID,
    queries = [query_embeddings],
    num_neighbors = 3
)

neighbor_id = results[0][0].id
neighbor_embedding = vvs_index_endpoint.read_index_datapoints(deployed_index_id=DEPLOYED_INDEX_ID, ids= [neighbor_id])
# print(f"neighbor_embedding: {neighbor_embedding}")
# print(f"results: {results}")
# ... código existente hasta línea 129 ...

neighbor_ids = [neighbor.id for neighbor in results[0]]

# ✅ MEJOR: Solo descarga el archivo una vez (si es necesario mantenerlo así)
# Pero la lógica de filtrado está correcta
file_content = blob.download_as_text()

def fetch_text_chunks(ids, file_content):
    """
    Busca solo los chunks de texto que corresponden a los IDs retornados
    por Vector Search (los más relevantes)
    """
    texts = {}
    for line in file_content.strip().split('\n'):
        if line.strip():
            data = json.loads(line)
            # ✅ Solo guarda los textos de los IDs que Vector Search retornó
            if str(data['id']) in ids:
                texts[str(data['id'])] = data['text']
    
    # ✅ Retorna en el mismo orden que los IDs (por relevancia)
    return [texts[id] for id in ids if id in texts]

neighbor_texts = fetch_text_chunks([str(id) for id in neighbor_ids], file_content)

# print(neighbor_texts)
# Convierte la lista de textos en un solo string separado por líneas
context = "\n\n---\n\n".join(neighbor_texts)
response = model_LLM.invoke(query + "\n\n" + context)
print(response)