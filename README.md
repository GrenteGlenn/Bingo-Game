#  Event Bingo

Event Bingo est une application web interactive conçue pour des événements en temps réel.  
Elle combine un **jeu de bingo**, une **cagnotte 3D**, une **page d’affichage live** et un **panel de contrôle administrateur**.

Le projet est conçu pour supporter **plusieurs centaines d’utilisateurs simultanés**, avec une communication temps réel basée sur **WebSocket (Socket.IO)**.

---

## 🔗 Accès rapides

[![Cagnotte](https://img.shields.io/badge/🎯-Cagnotte-blue)](https://cagnotte-bingo-production.up.railway.app/cagnotte)
[![Affichage](https://img.shields.io/badge/📺-Affichage-green)](https://cagnotte-bingo-production.up.railway.app/affichage)
[![Login](https://img.shields.io/badge/🔐-Login-orange)](https://cagnotte-bingo-production.up.railway.app/login)
[![Panel](https://img.shields.io/badge/⚙️-Panel-red)](https://cagnotte-bingo-production.up.railway.app/panel)

---

## 🚀 Fonctionnalités

- 🎰 Jeu de bingo interactif en temps réel
- 🎯 Cagnotte 3D animée
- 📺 Page d’affichage des numéros tirés
- 🕹️ Panel de contrôle administrateur
- 🔐 Accès sécurisé
- ⚡ Synchronisation temps réel multi-clients
- 📱 Responsive (desktop, écrans larges, projection)

---

## 🧩 Stack technique

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Three.js
- @react-three/fiber / drei

### Temps réel
- Node.js
- Express
- Socket.IO (WebSocket)

---

## 📦 Prérequis

- **Node.js ≥ 20**
- **npm ≥ 9**

---

### Installation 
- git clone https://github.com/your-username/humanthings-bingo.git
- cd humanthings-bingo/cagnotte
- npm install

### Lancement 
- cd Cagnotte (front) : npm run dev
- cd CagnotteBack : node server.js
