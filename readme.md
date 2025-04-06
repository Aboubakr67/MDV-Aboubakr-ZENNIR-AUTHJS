# Projet CiveLampus

Ce document explique les étapes de l'initialisation du projet ainsi que les technologies utilisées pour le développement d'une application web sécurisée pour CiveLampus.

## Structure du projet

Le projet est organisé en deux parties principales :

- **Backend** : Dossier contenant le serveur Node.js avec Express.
- **Frontend** : Dossier contenant l'application React.js.

### Dossier Backend

- **middlewares** : Contient les fichiers pour gérer l'authentification et la vérification OTP.
- **models** : Contient le modèle `User` pour la gestion des utilisateurs dans la base de données.
- **routes** : Contient les routes d'authentification et de gestion des utilisateurs.
- **services** : Contient les services pour l'authentification, la gestion des utilisateurs et la configuration de Passport.js.
- **index.js** : Fichier principal pour démarrer le serveur.
- **.env.exemple** : Fichier exemple pour les variables d'environnement (MONGO_URI, JWT_SECRET, etc.).
- **package.json** : Fichier de configuration des dépendances du backend.

### Dossier Frontend

Le frontend utilise React.js pour l'interface utilisateur et gère l'état d'authentification via un **Context API**.

- **context/AuthContext.jsx** : Gère l'état d'authentification de l'utilisateur.
- **pages** : Contient les pages de l'application (Login, Register, Home, etc.).
- **partials** : Contient des composants réutilisables comme le Header et le Footer.
- **App.jsx** : Le fichier principal de l'application React avec la gestion des routes.
- **main.jsx** : Fichier d'entrée pour initialiser l'application React avec le `AuthProvider`.
- **package.json** : Fichier de configuration des dépendances du frontend (React, TailwindCSS, etc.).

## Initialisation du Backend

1. **Installation des dépendances** :

   ```bash
   npm install
   ```

2. **Configuration de MongoDB** :
   - Créez un compte MongoDB et générez une URI de connexion.
   - Remplissez le fichier `.env` avec les informations nécessaires.
3. **Démarrer le serveur** :

   ```bash
   npm run dev
   ```

4. **Vérification de la connexion à MongoDB** :
   - Le serveur devrait afficher "✅ MongoDB connecté" si la connexion est réussie.

## Initialisation du Frontend

1. **Installation des dépendances** :

   ```bash
   npm install
   ```

2. **Démarrer l'application frontend** :

   ```bash
   npm run dev
   ```

3. **Accéder à l'application** :
   - L'application frontend sera disponible sur `http://localhost:5173`.

## Fonctionnement de l'authentification

### Backend

1. **Routes d'authentification** :

   - `POST /api/auth/login` : Permet à l'utilisateur de se connecter avec un nom d'utilisateur et un mot de passe.
   - `POST /api/auth/logout` : Permet à l'utilisateur de se déconnecter.

2. **Gestion des sessions avec Passport.js** :

   - Utilisation de `passport-google-oauth20` pour l'authentification via Google OAuth.
   - Utilisation des sessions et des cookies pour maintenir l'état d'authentification.

3. **OTP (One-Time Password)** :
   - Utilisation de `otpauth` pour générer des OTP compatibles avec Google Authenticator.
   - Implémentation de la vérification OTP lors de l'accès à certaines pages sécurisées (/intervenant-list).

### Frontend

1. **Gestion de l'état d'authentification** :
   - Le contexte `AuthContext` est utilisé pour gérer l'utilisateur authentifié et son état de connexion.
2. **Navigation conditionnelle** :

   - Utilisation de `react-router-dom` pour rediriger les utilisateurs en fonction de leur rôle (étudiant, intervenant, administrateur).

3. **Pages sécurisées** :

   - Certaines pages, comme `EtudiantDetails`, sont accessibles uniquement en fonction du rôle de l'utilisateur.

4. **OTP dans le frontend** :
   - L'utilisateur est invité à vérifier son OTP lors de l'accès à des pages sécurisées (comme la liste des intervenants).

# Rapport de Développement

## Justification des Choix Techniques

### 1. Sécurisation avec les Cookies

J'ai choisi l'utilisation des cookies pour stocker les informations d'authentification car les cookies offrent un niveau de sécurité plus élevé par rapport au stockage local (localStorage) pour des données sensibles telles que les tokens JWT. En effet, les cookies peuvent être configurés avec les attributs `HttpOnly` et `Secure`, empêchant l'accès via JavaScript et garantissant leur transmission uniquement via une connexion sécurisée (HTTPS). Cela protège contre les attaques XSS et garantit une meilleure confidentialité des données.

### 2. Connexion par Couple Nom d'Utilisateur/Mot de Passe

Egalement j'ai mis en place le système d'authentification basé sur le couple nom d'utilisateur/mot de passe comme mécanisme de base car il était simple à mettre en place et efficace pour des systèmes ne nécessitant pas de solutions plus complexes.

### 3. Authentification avec Google OAuth2

De plus j'ai choisi d'implémenter une connexion via OAuth2 (en particulier via Google) pour permettre aux utilisateurs de se connecter facilement sans avoir à créer un compte spécifique pour l'application car OAuth2 permet de déléguer la gestion de l'authentification à un fournisseur de confiance, ce qui minimise les risques liés à la gestion des mots de passe tout en garantissant un niveau élevé de sécurité. Il résout le problème des mots de passe faibles ou réutilisés en s'appuyant sur une authentification centralisée et sécurisée.

### 4. OTP (One-Time Password)

Pour finir j'ai utilisé l'authentification multifacteur (MFA) pour protéger l'accès à des sections sensibles de l'application, comme la liste des intervenants. L'OTP, couplé avec un authenticator type Google Authenticator, garantit que même si un attaquant parvient à obtenir un mot de passe, il devra également accéder à un code temporaire pour valider l'authentification. Cela rend l'accès à ces sections bien plus sécurisé.

## PostMortem

Le projet a été développé sans rencontrer de problèmes majeurs.

---

# Questionnaire

1. **Comment définiriez-vous l'authentification ? (Quels sont ses mécanismes, à quoi sert-elle ?)**
   L'authentification est le processus permettant de vérifier l'identité d'un utilisateur ou d'un système. Elle repose généralement sur des mécanismes comme les mots de passe, les empreintes digitales, ou les tokens. L'objectif est de s'assurer que l'entité accédant à un service est bien celle qu'elle prétend être.

2. **Quelles sont les différences avec l'autorisation ?**
   L'authentification permet de vérifier l'identité d'un utilisateur, tandis que l'autorisation détermine quels droits ou ressources un utilisateur authentifié peut accéder ou modifier. L'authentification précède l'autorisation dans le flux de sécurité.

3. **Qu'est-ce qu'un facteur d'authentification ?**
   Un facteur d'authentification est un élément utilisé pour prouver l'identité d'un utilisateur. Il existe trois principaux types : ce que l'utilisateur sait (mot de passe), ce que l'utilisateur possède (carte à puce, téléphone), et ce que l'utilisateur est (empreinte digitale, reconnaissance faciale).

4. **Citez 3 méthodes d'authentification**

   - Authentification par mot de passe
   - Authentification biométrique (empreintes digitales, reconnaissance faciale)
   - Authentification par OTP (One-Time Password)

5. **Qu'est-ce que le hashage ?**
   Le hashage est une fonction qui transforme des données (comme un mot de passe) en une chaîne de caractères fixe, de longueur déterminée. Le processus est irréversible (unidirectionnelle), ce qui signifie qu'il est impossible de retrouver les données d'origine à partir du hash.

6. **À quoi sert le sel dans le hashage ?**
   Le sel est un élément aléatoire ajouté au mot de passe avant de le hasher. Cela permet de rendre les hashages uniques, même si deux utilisateurs ont le même mot de passe. Le sel protège contre les attaques par tables arc-en-ciel.

7. **Qu'est-ce que le chiffrement ?**
   Le chiffrement est un processus qui transforme des données lisibles en un format illisible à l'aide d'un algorithme et d'une clé secrète. Contrairement au hashage, le chiffrement est réversible et permet de récupérer les données originales avec la bonne clé.

8. **Qu'est-ce que l'attaque par force brute ? Et comment s'en prémunir ?**
   L'attaque par force brute consiste à essayer toutes les combinaisons possibles pour deviner un mot de passe. Pour se prémunir, on peut utiliser des politiques de mot de passe complexes (12-14 caractères minimum avec chiffre(s), lettre(s) et caractères spéciaux), une limitation des tentatives de connexion (par IP par exemple) et l'usage de CAPTCHA.

9. **Quels sont les points d'attentions lors d'un développement d'un système d'authentification ?**
   Il faut prêter attention à la gestion sécurisée des mots de passe (utiliser des algorithmes de hashage robustes comme bcrypt), à la validation des entrées pour éviter les injections SQL, à la mise en place de la gestion des sessions et des cookies, et à la protection contre les attaques comme le CSRF et XSS.

10. **Expliquer le principe d'authentification multifacteur ?**
    L'authentification multifacteur (MFA) repose sur l'utilisation de plusieurs éléments d'authentification pour renforcer la sécurité. Par exemple, un mot de passe (quelque chose que l'utilisateur connaît) et un code OTP envoyé sur son téléphone (quelque chose que l'utilisateur possède).

11. **Qu'est-ce qu'une attaque CSRF ? Comment peut-on s'en protéger ?**
    Une attaque CSRF (Cross-Site Request Forgery) force un utilisateur authentifié à réaliser des actions non désirées sur un site. Pour se protéger, on utilise des tokens CSRF qui vérifient que la requête provient bien du site légitime. On peut aussi vérifier l'origine des requêtes. (avec cors par exemple)

12. **Expliquez ce que représente pour vous le principe de session, de cookies et de headers.**
    La session permet de maintenir l'état entre les requêtes, tandis que les cookies sont utilisés pour stocker des informations sur l'utilisateur, comme un token d'authentification. Les headers HTTP servent à transmettre des informations supplémentaires sur la requête ou la réponse, comme des informations de sécurité.

13. **Par quel protocole est sécurisé l'échange d'information entre un client web et un serveur web ? Expliquez les grands principes**
    Le protocole HTTPS (HyperText Transfer Protocol Secure) utilise SSL/TLS pour sécuriser l'échange d'informations entre un client web et un serveur. Il chiffre les données pour les protéger contre l'interception et garantit l'authenticité du serveur via un certificat SSL.

14. **Qu'est-ce qu'un token JWT ? De quoi est-il composé ?**
    Un token JWT (JSON Web Token) est un standard ouvert permettant de sécuriser les échanges d'informations entre un client et un serveur. Il est composé de trois parties : un header, un payload et une signature.

15. **Qu'est-ce que l'OAuth 2 ? Qu'est-ce qu'il résout ?**
    OAuth 2 est un protocole d'autorisation qui permet à un utilisateur de donner à une application un accès limité à ses ressources sans partager ses identifiants. Il résout le problème de la gestion des mots de passe et permet une délégation de l'authentification à des fournisseurs tiers (comme Google).
