# AR Studio

AR Studio is a web-based platform for uploading, converting, and viewing 3D models in augmented reality. It provides a seamless experience for users to bring their digital creations into the real world through their mobile devices.

## Features

- **3D Model Upload**: Supports `.glb`, `.gltf`, and `.usdz` file formats.
- **Automatic Conversion**: Converts uploaded models to ensure compatibility across different devices.
- **Interactive Gallery**: Browse, search, and manage your uploaded 3D models.
- **AR Viewer**: View models in augmented reality on supported iOS and Android devices.
- **3D Preview**: Inspect models in a 3D viewer directly in your browser.

## Tech Stack

- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **3D & AR**: three.js, @react-three/fiber, @react-three/drei, @google/model-viewer

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm
- MongoDB instance (local or cloud)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd AR-WEB
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up environment variables**:
    Create a `.env` file in the `server` directory and add the following:
    ```
    MONGODB_URI=your_mongodb_connection_string
    ```

### Running the Application

To start both the client and server concurrently, run:

```bash
npm run dev
```

- The client will be available at `http://localhost:3000`
- The server will run on `http://localhost:5001`

## Usage

1.  **Upload a Model**: Navigate to the "Upload" page and either drag and drop your 3D model file or click to browse.
2.  **View in Gallery**: Once uploaded, your model will appear in the "Models" gallery.
3.  **View in AR**:
    - Access the application from a compatible mobile device.
    - Navigate to the model's page.
    - Tap the "View in AR" button to launch the augmented reality experience.
