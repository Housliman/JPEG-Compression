# JPEG Compression Visualizer

![JPEG Visualizer Screenshot](Pasted%20image%2020260302160706.png)

[Français](#visualiseur-de-compression-jpeg-version-française) | [English](#jpeg-compression-visualizer)

An interactive web application designed to explain the inner workings of JPEG compression. This tool visualizes the step-by-step process of converting an image into the frequency domain, applying quantization, and reconstructing it, all while demonstrating the trade-offs between image quality and file size.

### 🎥 Video Explanation
<video src="[https://raw.githubusercontent.com/Housliman/JPEG-Compression/main/videos/JPEGCompression.mp4]" controls width="600"></video>

(https://raw.githubusercontent.com/Housliman/JPEG-Compression/main/videos/JPEGCompression.mp4)

## 🚀 Features

- **Step-by-Step Visualization**: Watch the image being processed block-by-block (8x8 pixels) in real-time.
- **Adjustable Quantization**: Change the Quality Factor (1-100) to see how it affects the quantization table and the final image.
- **Animation Speed Control**: Adjust the processing speed from x1 to x64.
- **Detailed Statistics**: Compare original file size vs. estimated JPEG size and see the compression ratio.
- **Interactive UI**: Side-by-side comparison of the original grayscale image and the DCT-processed result.
- **Technical Breakdown**: Educational summary of DCT, Quantization, and IDCT processes.

## 🛠 Tech Stack

- **Backend**: FastAPI (Python), OpenCV, SciPy, NumPy.
- **Frontend**: React (TypeScript), Vite, HTML5 Canvas.
- **Styling**: Vanilla CSS (Dark Mode).

## 📋 Prerequisites

- Python 3.9+
- Node.js 18+ & npm
- (Optional) Conda or virtualenv

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Housliman/JPEG-Compression.git
cd JPEG-Compression
```

### 2. Backend Setup

```bash
cd jpeg-back
pip install fastapi uvicorn python-multipart scipy opencv-python-headless numpy
cd ..
```

### 3. Frontend Setup

```bash
cd jpeg-front
npm install
cd ..
```

## 🏃 Usage

### Development Mode (Hot Reloading)

To run both the backend and frontend in development mode with live updates:

```bash
chmod +x run_app.sh
./run_app.sh
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend**: [http://localhost:8000](http://localhost:8000)

### Production Mode (Built & Optimized)

To build the frontend and serve it through the FastAPI backend as a single application:

```bash
# First, build the frontend
cd jpeg-front && npm run build && cd ..

# Then, run the production server
chmod +x run_prod.sh
./run_prod.sh
```

- **Access the App**: [http://localhost:8000](http://localhost:8000)

## 🧮 The Mathematics of JPEG

JPEG compression relies on converting spatial pixel data into frequency data. Here is the mathematical core of the process used in this app:

### 1. Level Shifting

Pixels are typically stored as unsigned 8-bit integers ($[0, 255]$). Before processing, we shift them to be centered around zero:

$$P_{shifted} = P_{original} - 128$$

This centers the dynamic range and improves the efficiency of the DCT.

### 2. Discrete Cosine Transform (DCT)

The 2D-DCT converts an $8 \times 8$ block of pixels $f(x, y)$ into an $8 \times 8$ block of frequency coefficients $F(u, v)$:

$$F(u, v) = \frac{1}{4} C(u) C(v) \sum_{x=0}^{7} \sum_{y=0}^{7} f(x, y) \cos \left[ \frac{(2x+1)u\pi}{16} \right] \cos \left[ \frac{(2y+1)v\pi}{16} \right]$$

where:

- $u, v$ are horizontal and vertical frequencies ($0 \leq u, v < 8$).
- $C(i) = \frac{1}{\sqrt{2}}$ if $i=0$, and $1$ otherwise.
- $F(0, 0)$ is the **DC Coefficient** (average brightness of the block).
- All other $F(u, v)$ are **AC Coefficients** (representing textures and patterns).

### 3. Quantization (The "Lossy" Step)

This is where compression actually happens. Each DCT coefficient is divided by a corresponding value from the **Quantization Table** ($Q$) and rounded:

$$F_{quantized}(u, v) = \text{round} \left( \frac{F(u, v)}{Q(u, v)} \right)$$
High-frequency components (bottom-right of the matrix) usually have large values in $Q$, forcing many $F_{quantized}$ values to zero. This "zeroing out" is why JPEG files are so small after entropy encoding (like Huffman coding).

### 4. Reconstruction (IDCT)

To display the image, we reverse the quantization:

$$F_{dequantized}(u, v) = F_{quantized}(u, v) \times Q(u, v)$$

And then apply the **Inverse DCT**:

$$f(x, y) = \frac{1}{4} \sum_{u=0}^{7} \sum_{v=0}^{7} C(u) C(v) F_{dequantized}(u, v) \cos \left[ \frac{(2x+1)u\pi}{16} \right] \cos \left[ \frac{(2y+1)v\pi}{16} \right]$$

## 📖 How JPEG Compression Works (As Visualized)

1. **Grayscale Conversion**: For simplicity, this tool processes images in grayscale (Luminance).
2. **8x8 Block Splitting**: The image is divided into 8x8 pixel blocks, which is the standard unit for JPEG processing.
3. **Discrete Cosine Transform (DCT)**: Each block is converted from the spatial domain (pixels) to the frequency domain. Low-frequency components (overall color/brightness) are moved to the top-left, while high-frequency components (sharp details) move to the bottom-right.
4. **Quantization**: This is the "lossy" part. Each frequency coefficient is divided by a value from a **Quantization Table** and rounded to the nearest integer. High-frequency details are usually quantized more aggressively because the human eye is less sensitive to them.
5. **Reconstruction (IDCT)**: To show the result, the process is reversed using the Inverse Discrete Cosine Transform (IDCT) to turn frequencies back into viewable pixels.

## 📄 License

MIT License - feel free to use this for educational purposes!

---

# Visualiseur de Compression JPEG (Version Française)

![JPEG Visualizer Screenshot](Pasted%20image%2020260302160706.png)

[English](#jpeg-compression-visualizer) | [Français](#visualiseur-de-compression-jpeg-version-française)

Une application web interactive conçue pour expliquer le fonctionnement interne de la compression JPEG. Cet outil visualise le processus étape par étape de la conversion d'une image dans le domaine fréquentiel, de l'application de la quantification et de sa reconstruction, tout en démontrant les compromis entre la qualité de l'image et la taille du fichier.

### 🎥 Explication Vidéo
https://github.com/Housliman/JPEG-Compression/raw/main/videos/CompressionJPEG.mp4

## 🚀 Caractéristiques

- **Visualisation Étape par Étape** : Observez le traitement de l'image bloc par bloc (8x8 pixels) en temps réel.
- **Quantification Ajustable** : Modifiez le facteur de qualité (1-100) pour voir comment il influence la table de quantification et l'image finale.
- **Contrôle de la Vitesse d'Animation** : Ajustez la vitesse de traitement de x1 à x64.
- **Statistiques Détaillées** : Comparez la taille du fichier original par rapport à la taille JPEG estimée et voyez le taux de compression.
- **Interface Utilisateur Interactive** : Comparaison côte à côte de l'image originale en niveaux de gris et du résultat traité par DCT.
- **Analyse Technique** : Résumé pédagogique des processus DCT, Quantification et IDCT.

## 🛠 Stack Technique

- **Backend** : FastAPI (Python), OpenCV, SciPy, NumPy.
- **Frontend** : React (TypeScript), Vite, HTML5 Canvas.
- **Styling** : Vanilla CSS (Mode Sombre).

## 📋 Prérequis

- Python 3.9+
- Node.js 18+ & npm
- (Optionnel) Conda ou virtualenv

## 🔧 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/Housliman/JPEG-Compression.git
cd JPEG-Compression
```

### 2. Configuration du Backend

```bash
cd jpeg-back
pip install fastapi uvicorn python-multipart scipy opencv-python-headless numpy
cd ..
```

### 3. Configuration du Frontend

```bash
cd jpeg-front
npm install
cd ..
```

## 🏃 Utilisation

### Mode Développement (Rechargement à chaud)

Pour exécuter à la fois le backend et le frontend en mode développement :

```bash
chmod +x run_app.sh
./run_app.sh
```

### Mode Production (Compilé & Optimisé)

Pour compiler le frontend et le servir via le backend FastAPI :

```bash
cd jpeg-front && npm run build && cd ..
chmod +x run_prod.sh
./run_prod.sh
```

## 🧮 Les Mathématiques du JPEG

La compression JPEG repose sur la conversion des données spatiales des pixels en données fréquentielles. Voici le cœur mathématique du processus :

### 1. Décalage de Niveau

Les pixels sont stockés sous forme d'entiers 8 bits non signés ($[0, 255]$). Nous les décalons pour les centrer autour de zéro :

$$P_{décalé} = P_{original} - 128$$

### 2. Transformée en Cosinus Discrète (DCT)

La DCT 2D convertit un bloc de $8 \times 8$ pixels $f(x, y)$ en un bloc de coefficients de fréquence $F(u, v)$ :

$$F(u, v) = \frac{1}{4} C(u) C(v) \sum_{x=0}^{7} \sum_{y=0}^{7} f(x, y) \cos \left[ \frac{(2x+1)u\pi}{16} \right] \cos \left[ \frac{(2y+1)v\pi}{16} \right]$$

### 3. Quantification (L'étape avec perte)

Chaque coefficient DCT est divisé par une valeur correspondante de la **Table de Quantification** ($Q$) et arrondi :

$$F_{quantifié}(u, v) = \text{round} \left( \frac{F(u, v)}{Q(u, v)} \right)$$

### 4. Reconstruction (IDCT)

Pour afficher l'image, nous inversons la quantification :

$$F_{déquantifié}(u, v) = F_{quantifié}(u, v) \times Q(u, v)$$

Appliquez ensuite la **DCT inverse** :

$$f(x, y) = \frac{1}{4} \sum_{u=0}^{7} \sum_{v=0}^{7} C(u) C(v) F_{déquantifié}(u, v) \cos \left[ \frac{(2x+1)u\pi}{16} \right] \cos \left[ \frac{(2y+1)v\pi}{16} \right]$$

## 📖 Comment fonctionne la compression JPEG (Visualisé)

1. **Conversion en Niveaux de Gris** : L'image est traitée en luminance pour plus de simplicité.
2. **Découpage en Blocs 8x8** : L'image est divisée en blocs standards de 8x8 pixels.
3. **DCT** : Conversion du domaine spatial au domaine fréquentiel.
4. **Quantification** : Réduction de la précision des hautes fréquences pour gagner de l'espace.
5. **Reconstruction** : Inversion du processus pour générer l'image finale visible.
