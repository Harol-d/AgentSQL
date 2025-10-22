# 📦 Guía de Google Cloud Storage Buckets

## 📋 Tabla de Contenidos
1. [¿Qué es un Bucket?](#qué-es-un-bucket)
2. [Requisitos Previos](#requisitos-previos)
3. [Principales Funciones](#principales-funciones)
4. [Gestión de Buckets](#gestión-de-buckets)
5. [Operaciones con Objetos](#operaciones-con-objetos)
6. [Permisos y Seguridad](#permisos-y-seguridad)
7. [Ejemplos de Código](#ejemplos-de-código)

---

## 🎯 ¿Qué es un Bucket?

Un **bucket** en Google Cloud Storage (GCS) es un contenedor para almacenar objetos (archivos). Es similar a una carpeta o directorio, pero con características especiales:

- **Nombre único global**: El nombre debe ser único en todo Google Cloud
- **Ubicación geográfica**: Puedes elegir dónde se almacenan los datos
- **Control de acceso**: Permisos granulares para usuarios y aplicaciones
- **Versionado**: Mantener múltiples versiones de un archivo
- **Ciclo de vida**: Automatizar la eliminación o cambio de clase de almacenamiento

---

## 🔧 Requisitos Previos

### 1. Cuenta de Google Cloud Platform
- Crear una cuenta en [Google Cloud Console](https://console.cloud.google.com/)
- Crear un proyecto en GCP

### 2. Habilitar APIs
```bash
# Habilitar Cloud Storage API
gcloud services enable storage-api.googleapis.com
gcloud services enable storage-component.googleapis.com
```

### 3. Service Account (Cuenta de Servicio)
**Pasos para crear:**
1. Ve a **IAM & Admin** → **Service Accounts**
2. Clic en **Create Service Account**
3. Asigna un nombre (ej: "storage-admin")
4. Asigna roles necesarios (ver sección de permisos)
5. Crea una clave JSON y descárgala

### 4. Instalación de Bibliotecas Python
```bash
# Instalar cliente de Google Cloud Storage
pip install google-cloud-storage

# Opcional: CLI de Google Cloud
pip install gcloud
```

### 5. Configurar Credenciales
```python
import os
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "/ruta/a/tu/credenciales.json"
```

O usando gcloud CLI:
```bash
gcloud auth application-default login
```

---

## 🚀 Principales Funciones

### 1. **Crear un Bucket**

#### Usando Python:
```python
from google.cloud import storage

def crear_bucket(bucket_name, project_id, location="us-central1"):
    """
    Crea un nuevo bucket en Google Cloud Storage
    
    Args:
        bucket_name: Nombre único del bucket
        project_id: ID del proyecto en GCP
        location: Región donde se creará (us-central1, europe-west1, etc.)
    """
    storage_client = storage.Client(project=project_id)
    
    bucket = storage_client.bucket(bucket_name)
    bucket.storage_class = "STANDARD"  # STANDARD, NEARLINE, COLDLINE, ARCHIVE
    
    new_bucket = storage_client.create_bucket(bucket, location=location)
    
    print(f"✅ Bucket {new_bucket.name} creado en {new_bucket.location}")
    return new_bucket

# Ejemplo de uso
crear_bucket("mi-bucket-embeddings", "mi-proyecto-gcp")
```

#### Usando gsutil:
```bash
gsutil mb -p mi-proyecto-gcp -c STANDARD -l us-central1 gs://mi-bucket-embeddings/
```

**Requisitos:**
- ✅ Nombre único globalmente
- ✅ Permisos: `storage.buckets.create`
- ✅ Rol recomendado: `Storage Admin` o `Storage Object Admin`

---

### 2. **Listar Buckets**

#### Usando Python:
```python
def listar_buckets(project_id):
    """Lista todos los buckets en un proyecto"""
    storage_client = storage.Client(project=project_id)
    
    buckets = storage_client.list_buckets()
    
    print("📂 Buckets disponibles:")
    for bucket in buckets:
        print(f"  - {bucket.name}")
        print(f"    Ubicación: {bucket.location}")
        print(f"    Clase: {bucket.storage_class}")
        print(f"    Creado: {bucket.time_created}")
    
    return list(buckets)
```

#### Usando gsutil:
```bash
gsutil ls
```

**Requisitos:**
- ✅ Permisos: `storage.buckets.list`
- ✅ Rol recomendado: `Storage Object Viewer`

---

### 3. **Subir Archivos (Objetos)**

#### Usando Python:
```python
def subir_archivo(bucket_name, archivo_local, destino_blob):
    """
    Sube un archivo al bucket
    
    Args:
        bucket_name: Nombre del bucket
        archivo_local: Ruta del archivo local
        destino_blob: Ruta de destino en el bucket
    """
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destino_blob)
    
    # Subir desde archivo local
    blob.upload_from_filename(archivo_local)
    
    print(f"✅ Archivo {archivo_local} subido a {destino_blob}")
    return blob

# Subir desde string/memoria
def subir_desde_string(bucket_name, contenido, destino_blob):
    """Sube contenido directamente desde memoria"""
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destino_blob)
    
    blob.upload_from_string(contenido, content_type='text/plain')
    
    print(f"✅ Contenido subido a {destino_blob}")
    return blob

# Ejemplos
subir_archivo("mi-bucket", "/home/user/data.json", "datos/data.json")
subir_desde_string("mi-bucket", "Hola Mundo", "texto/saludo.txt")
```

#### Usando gsutil:
```bash
# Subir un archivo
gsutil cp archivo.json gs://mi-bucket/datos/

# Subir directorio completo
gsutil cp -r ./mi-directorio gs://mi-bucket/

# Subir con paralelismo (más rápido)
gsutil -m cp -r ./datos gs://mi-bucket/
```

**Requisitos:**
- ✅ Permisos: `storage.objects.create`
- ✅ Rol recomendado: `Storage Object Creator` o `Storage Object Admin`

---

### 4. **Descargar Archivos**

#### Usando Python:
```python
def descargar_archivo(bucket_name, blob_name, destino_local):
    """Descarga un archivo del bucket"""
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    
    blob.download_to_filename(destino_local)
    
    print(f"✅ Archivo {blob_name} descargado a {destino_local}")

# Descargar como string
def descargar_como_string(bucket_name, blob_name):
    """Descarga contenido como string"""
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    
    contenido = blob.download_as_string()
    return contenido.decode('utf-8')

# Ejemplos
descargar_archivo("mi-bucket", "datos/data.json", "/home/user/data.json")
contenido = descargar_como_string("mi-bucket", "texto/saludo.txt")
```

#### Usando gsutil:
```bash
# Descargar un archivo
gsutil cp gs://mi-bucket/datos/data.json ./

# Descargar directorio completo
gsutil cp -r gs://mi-bucket/datos ./
```

**Requisitos:**
- ✅ Permisos: `storage.objects.get`
- ✅ Rol recomendado: `Storage Object Viewer`

---

### 5. **Listar Archivos en un Bucket**

#### Usando Python:
```python
def listar_archivos(bucket_name, prefijo=None):
    """
    Lista todos los archivos en un bucket
    
    Args:
        bucket_name: Nombre del bucket
        prefijo: Filtrar por prefijo (ej: "embeddings/")
    """
    storage_client = storage.Client()
    
    # Listar con prefijo opcional
    blobs = storage_client.list_blobs(bucket_name, prefix=prefijo)
    
    print(f"📁 Archivos en gs://{bucket_name}/{prefijo or ''}:")
    for blob in blobs:
        print(f"  - {blob.name}")
        print(f"    Tamaño: {blob.size} bytes")
        print(f"    Tipo: {blob.content_type}")
        print(f"    Actualizado: {blob.updated}")
    
    return list(blobs)

# Ejemplo
listar_archivos("mi-bucket", prefijo="embeddings/")
```

#### Usando gsutil:
```bash
# Listar todos los archivos
gsutil ls gs://mi-bucket/

# Listar con detalles
gsutil ls -l gs://mi-bucket/

# Listar recursivamente
gsutil ls -r gs://mi-bucket/
```

**Requisitos:**
- ✅ Permisos: `storage.objects.list`
- ✅ Rol recomendado: `Storage Object Viewer`

---

### 6. **Eliminar Archivos**

#### Usando Python:
```python
def eliminar_archivo(bucket_name, blob_name):
    """Elimina un archivo del bucket"""
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    
    blob.delete()
    
    print(f"🗑️  Archivo {blob_name} eliminado")

# Eliminar múltiples archivos
def eliminar_archivos_con_prefijo(bucket_name, prefijo):
    """Elimina todos los archivos con un prefijo"""
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    
    blobs = bucket.list_blobs(prefix=prefijo)
    
    for blob in blobs:
        blob.delete()
        print(f"🗑️  {blob.name} eliminado")

# Ejemplos
eliminar_archivo("mi-bucket", "datos/viejo.json")
eliminar_archivos_con_prefijo("mi-bucket", "temp/")
```

#### Usando gsutil:
```bash
# Eliminar un archivo
gsutil rm gs://mi-bucket/datos/viejo.json

# Eliminar múltiples archivos
gsutil rm gs://mi-bucket/temp/*

# Eliminar recursivamente
gsutil rm -r gs://mi-bucket/directorio/
```

**Requisitos:**
- ✅ Permisos: `storage.objects.delete`
- ✅ Rol recomendado: `Storage Object Admin`

---

### 7. **Eliminar un Bucket**

#### Usando Python:
```python
def eliminar_bucket(bucket_name, forzar=False):
    """
    Elimina un bucket (debe estar vacío)
    
    Args:
        bucket_name: Nombre del bucket
        forzar: Si True, elimina todos los archivos primero
    """
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    
    if forzar:
        # Eliminar todos los archivos primero
        blobs = bucket.list_blobs()
        for blob in blobs:
            blob.delete()
        print("🗑️  Todos los archivos eliminados")
    
    bucket.delete()
    print(f"🗑️  Bucket {bucket_name} eliminado")

# Ejemplo
eliminar_bucket("mi-bucket-viejo", forzar=True)
```

#### Usando gsutil:
```bash
# Eliminar bucket vacío
gsutil rb gs://mi-bucket/

# Eliminar bucket con contenido
gsutil rm -r gs://mi-bucket/
gsutil rb gs://mi-bucket/
```

**Requisitos:**
- ✅ Permisos: `storage.buckets.delete`
- ✅ Rol recomendado: `Storage Admin`
- ⚠️  El bucket debe estar vacío (o usar forzar)

---

### 8. **Obtener Información del Bucket**

#### Usando Python:
```python
def obtener_info_bucket(bucket_name):
    """Obtiene información detallada del bucket"""
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    
    print(f"📊 Información de {bucket_name}:")
    print(f"  ID: {bucket.id}")
    print(f"  Ubicación: {bucket.location}")
    print(f"  Clase de almacenamiento: {bucket.storage_class}")
    print(f"  Creado: {bucket.time_created}")
    print(f"  Versionado: {bucket.versioning_enabled}")
    print(f"  Etiquetas: {bucket.labels}")
    
    return bucket
```

**Requisitos:**
- ✅ Permisos: `storage.buckets.get`
- ✅ Rol recomendado: `Storage Object Viewer`

---

### 9. **Copiar Archivos**

#### Usando Python:
```python
def copiar_archivo(bucket_origen, blob_origen, bucket_destino, blob_destino):
    """Copia un archivo entre buckets o dentro del mismo bucket"""
    storage_client = storage.Client()
    
    source_bucket = storage_client.bucket(bucket_origen)
    source_blob = source_bucket.blob(blob_origen)
    
    destination_bucket = storage_client.bucket(bucket_destino)
    
    # Copiar
    source_bucket.copy_blob(
        source_blob, 
        destination_bucket, 
        blob_destino
    )
    
    print(f"✅ Copiado de {bucket_origen}/{blob_origen} a {bucket_destino}/{blob_destino}")

# Ejemplo
copiar_archivo("bucket1", "datos/file.json", "bucket2", "backup/file.json")
```

#### Usando gsutil:
```bash
# Copiar archivo
gsutil cp gs://bucket1/file.json gs://bucket2/backup/

# Copiar entre buckets
gsutil cp -r gs://bucket1/datos gs://bucket2/
```

**Requisitos:**
- ✅ Permisos origen: `storage.objects.get`
- ✅ Permisos destino: `storage.objects.create`

---

### 10. **Mover/Renombrar Archivos**

#### Usando Python:
```python
def mover_archivo(bucket_name, blob_origen, blob_destino):
    """Mueve/renombra un archivo dentro del mismo bucket"""
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    
    # Copiar al nuevo nombre
    source_blob = bucket.blob(blob_origen)
    bucket.copy_blob(source_blob, bucket, blob_destino)
    
    # Eliminar el original
    source_blob.delete()
    
    print(f"✅ Movido de {blob_origen} a {blob_destino}")

# Ejemplo
mover_archivo("mi-bucket", "temp/file.json", "datos/file.json")
```

#### Usando gsutil:
```bash
# Mover archivo
gsutil mv gs://mi-bucket/temp/file.json gs://mi-bucket/datos/
```

**Requisitos:**
- ✅ Permisos: `storage.objects.create` y `storage.objects.delete`

---

## 🔐 Permisos y Seguridad

### Roles Principales de IAM

| Rol | Permisos | Uso Recomendado |
|-----|----------|-----------------|
| `Storage Admin` | Control total sobre buckets y objetos | Administración completa |
| `Storage Object Admin` | Control total sobre objetos | Gestión de archivos |
| `Storage Object Creator` | Crear objetos | Aplicaciones que solo suben |
| `Storage Object Viewer` | Ver y descargar objetos | Aplicaciones de solo lectura |
| `Storage Legacy Bucket Reader` | Listar objetos en bucket | Lectura básica |
| `Storage Legacy Bucket Writer` | Crear/eliminar objetos | Escritura básica |

### Asignar Roles a Service Account

#### Usando Console:
1. Ve a **IAM & Admin** → **IAM**
2. Busca tu Service Account
3. Clic en **Edit** (lápiz)
4. **Add Another Role**
5. Selecciona el rol necesario

#### Usando gcloud CLI:
```bash
# Asignar rol de Storage Admin
gcloud projects add-iam-policy-binding mi-proyecto-gcp \
    --member="serviceAccount:mi-sa@mi-proyecto-gcp.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

# Asignar rol de Object Admin
gcloud projects add-iam-policy-binding mi-proyecto-gcp \
    --member="serviceAccount:mi-sa@mi-proyecto-gcp.iam.gserviceaccount.com" \
    --role="roles/storage.objectAdmin"
```

### Permisos Granulares por Bucket

```python
from google.cloud import storage

def dar_permisos_bucket(bucket_name, email, rol):
    """
    Otorga permisos específicos a un usuario/SA en un bucket
    
    Roles disponibles:
    - 'roles/storage.legacyBucketReader'
    - 'roles/storage.legacyBucketWriter'
    - 'roles/storage.objectViewer'
    - 'roles/storage.objectAdmin'
    """
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    
    policy = bucket.get_iam_policy(requested_policy_version=3)
    policy.bindings.append({
        "role": rol,
        "members": {f"user:{email}"}  # o serviceAccount:{email}
    })
    
    bucket.set_iam_policy(policy)
    print(f"✅ Permisos otorgados a {email}")
```

---

## 💡 Ejemplos de Código Completos

### Ejemplo 1: Subir Embeddings en formato JSONL

```python
from google.cloud import storage
import json

def subir_embeddings(bucket_name, embeddings_data, archivo_destino):
    """
    Sube embeddings en formato JSONL al bucket
    
    Args:
        bucket_name: Nombre del bucket
        embeddings_data: Lista de diccionarios con embeddings
        archivo_destino: Ruta en el bucket (ej: "embeddings/data.jsonl")
    """
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(archivo_destino)
    
    # Convertir a JSONL (una línea JSON por embedding)
    jsonl_content = "\n".join([json.dumps(item) for item in embeddings_data])
    
    # Subir al bucket
    blob.upload_from_string(jsonl_content, content_type='application/jsonl')
    
    print(f"✅ {len(embeddings_data)} embeddings subidos a gs://{bucket_name}/{archivo_destino}")
    return f"gs://{bucket_name}/{archivo_destino}"

# Uso
embeddings = [
    {"id": "1", "embedding": [0.1, 0.2, 0.3], "restricts": []},
    {"id": "2", "embedding": [0.4, 0.5, 0.6], "restricts": []}
]

uri = subir_embeddings("mi-bucket", embeddings, "embeddings/data.jsonl")
```

### Ejemplo 2: Gestión Completa de Bucket

```python
from google.cloud import storage

class GestorBucket:
    def __init__(self, project_id, bucket_name):
        self.project_id = project_id
        self.bucket_name = bucket_name
        self.client = storage.Client(project=project_id)
        self.bucket = None
    
    def crear_si_no_existe(self, location="us-central1"):
        """Crea el bucket si no existe"""
        try:
            self.bucket = self.client.get_bucket(self.bucket_name)
            print(f"✅ Bucket {self.bucket_name} ya existe")
        except:
            self.bucket = self.client.create_bucket(
                self.bucket_name, 
                location=location
            )
            print(f"✅ Bucket {self.bucket_name} creado")
        return self.bucket
    
    def subir_archivo(self, archivo_local, destino):
        """Sube un archivo al bucket"""
        blob = self.bucket.blob(destino)
        blob.upload_from_filename(archivo_local)
        return f"gs://{self.bucket_name}/{destino}"
    
    def listar_archivos(self, prefijo=""):
        """Lista archivos con un prefijo"""
        blobs = self.client.list_blobs(self.bucket_name, prefix=prefijo)
        return [blob.name for blob in blobs]
    
    def eliminar_archivo(self, blob_name):
        """Elimina un archivo"""
        blob = self.bucket.blob(blob_name)
        blob.delete()
        print(f"🗑️  {blob_name} eliminado")
    
    def limpiar_bucket(self):
        """Elimina todos los archivos del bucket"""
        blobs = self.bucket.list_blobs()
        for blob in blobs:
            blob.delete()
        print(f"🗑️  Bucket {self.bucket_name} limpiado")

# Uso
gestor = GestorBucket("mi-proyecto", "mi-bucket")
gestor.crear_si_no_existe()
gestor.subir_archivo("data.json", "datos/data.json")
archivos = gestor.listar_archivos("datos/")
print(archivos)
```

---

## 🎓 Resumen de Requisitos por Operación

| Operación | Permisos Necesarios | Rol Mínimo |
|-----------|---------------------|------------|
| Crear bucket | `storage.buckets.create` | Storage Admin |
| Listar buckets | `storage.buckets.list` | Storage Object Viewer |
| Subir archivo | `storage.objects.create` | Storage Object Creator |
| Descargar archivo | `storage.objects.get` | Storage Object Viewer |
| Listar archivos | `storage.objects.list` | Storage Object Viewer |
| Eliminar archivo | `storage.objects.delete` | Storage Object Admin |
| Eliminar bucket | `storage.buckets.delete` | Storage Admin |
| Copiar archivo | `storage.objects.get` + `storage.objects.create` | Storage Object Admin |

---

## 📚 Recursos Adicionales

- [Documentación oficial de Google Cloud Storage](https://cloud.google.com/storage/docs)
- [Cliente Python de GCS](https://cloud.google.com/python/docs/reference/storage/latest)
- [gsutil Tool](https://cloud.google.com/storage/docs/gsutil)
- [Mejores prácticas de seguridad](https://cloud.google.com/storage/docs/best-practices)
- [Precios de Cloud Storage](https://cloud.google.com/storage/pricing)

---

## ⚠️ Notas Importantes

1. **Nombres de buckets**: Deben ser únicos globalmente y seguir reglas:
   - Solo minúsculas, números, guiones y guiones bajos
   - Entre 3 y 63 caracteres
   - No puede parecer una dirección IP

2. **Costos**: GCS cobra por:
   - Almacenamiento (por GB/mes)
   - Operaciones (lecturas, escrituras)
   - Transferencia de datos (salida de red)

3. **Límites**:
   - Tamaño máximo de objeto: 5 TB
   - No hay límite en número de objetos por bucket
   - Tasa de escritura: ~1000 escrituras/segundo por prefijo

4. **Seguridad**:
   - Nunca subas credenciales a repositorios públicos
   - Usa Service Accounts con permisos mínimos necesarios
   - Habilita versionado para datos críticos

---

**Creado para fines educativos - AgentSQL Project** 🚀

