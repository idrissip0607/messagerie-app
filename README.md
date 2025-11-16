# Application de Messagerie - Documentation Technique

Ce document explique les composants clés de l'application de messagerie.

## Aperçu

Imaginez cette application comme un restaurant :

- Les **pages** ([app/](file://c:\GOMYCODE\COURS%20FULLSTACK\BACK-END\nextjs\atelier%20messagerie%20app\messagerie-app%20part%201\app)) sont comme les différentes pièces du restaurant (entrée, salle à manger)
- Les **contrôleurs** ([controllers/](file://c:\GOMYCODE\COURS%20FULLSTACK\BACK-END\nextjs\atelier%20messagerie%20app\messagerie-app%20part%201\controllers)) sont comme des gestionnaires qui s'occupent de tâches spécifiques
- Les **routes API** ([app/api/](file://c:\GOMYCODE\COURS%20FULLSTACK\BACK-END\nextjs\atelier%20messagerie%20app\messagerie-app%20part%201\app\api)) sont comme la cuisine où les commandes sont préparées
- Le **dossier Firebase** ([firebase/](file://c:\GOMYCODE\COURS%20FULLSTACK\BACK-END\nextjs\atelier%20messagerie%20app\messagerie-app%20part%201\firebase)) est comme un fournisseur qui fournit les ingrédients
- Les **types** ([types/](file://c:\GOMYCODE\COURS%20FULLSTACK\BACK-END\nextjs\atelier%20messagerie%20app\messagerie-app%20part%201\types)) sont comme des recettes standardisées que tout le monde doit suivre
- Le **fichier .env** est comme un livre de recettes secrètes avec des informations confidentielles

## Explications des Fichiers

### 1. [app/page.tsx](file://c:\GOMYCODE\COURS%20FULLSTACK\BACK-END\nextjs\atelier%20messagerie%20app\messagerie-app%20part%201\app\page.tsx) - La Porte d'Entrée

C'est la première page que les utilisateurs voient lorsqu'ils visitent votre site web (comme l'entrée d'un bâtiment).

Caractéristiques principales :

- Affiche un bouton "Se connecter avec Google"
- Vérifie si un utilisateur est déjà connecté
- Redirige les utilisateurs authentifiés vers la page de chat
- Affiche un écran de chargement pendant la vérification du statut d'authentification

Considérez-le comme le hall d'un hôtel - vous êtes soit dirigé vers l'enregistrement (connexion), soit vers votre chambre (chat) si vous êtes déjà enregistré.

### 2. Contrôleurs - L'Équipe de Direction

#### [controllers/Login.ts](file://c:\GOMYCODE\COURS%20FULLSTACK\BACK-END\nextjs\atelier%20messagerie%20app\messagerie-app%20part%201\controllers\Login.ts) - Le Responsable des Inscriptions

Gère le processus de connexion Google :

- Se connecte à l'authentification Google
- Récupère les informations de l'utilisateur (nom, ID)
- Enregistre les données utilisateur localement
- Appelle [SaveUser](file://c:\GOMYCODE\COURS%20FULLSTACK\BACK-END\nextjs\atelier%20messagerie%20app\messagerie-app%20part%201\controllers\SaveUser.ts#L4-L23) pour stocker l'utilisateur dans la base de données
- Redirige vers la page de chat après une connexion réussie

Comme un réceptionniste qui enregistre les nouveaux clients et leur donne la clé de leur chambre.

#### [controllers/LoginMidleware.ts](file://c:\GOMYCODE\COURS%20FULLSTACK\BACK-END\nextjs\atelier%20messagerie%20app\messagerie-app%20part%201\controllers\LoginMidleware.ts) - Le Gardien de Sécurité

Protège les pages en vérifiant le statut d'authentification :

- Vérifie si l'utilisateur est connecté
- Consulte le stockage local pour les données utilisateur
- Valide l'état d'authentification Firebase
- Redirige les utilisateurs non autorisés vers la page de connexion
- Autorise l'accès aux utilisateurs autorisés

Comme un agent de sécurité qui vérifie les identifiants aux différentes entrées.

#### [controllers/SaveUser.ts](file://c:\GOMYCODE\COURS%20FULLSTACK\BACK-END\nextjs\atelier%20messagerie%20app\messagerie-app%20part%201\controllers\SaveUser.ts) - Le Préposé aux Données

Enregistre les informations utilisateur dans la base de données :

- Stocke un marqueur de temporisation de session
- Envoie les données utilisateur au point de terminaison API
- Gère les réponses succès/erreur
- Redirige vers la page de chat après l'enregistrement

Comme un préposé qui enregistre les informations des clients dans le registre de l'hôtel.

### 3. [app/api/save-user/route.ts](file://c:\GOMYCODE\COURS%20FULLSTACK\BACK-END\nextjs\atelier%20messagerie%20app\messagerie-app%20part%201\app\api\save-user\route.ts) - Le Système de Commande de Cuisine

Ce point de terminaison API traite les demandes de stockage des données utilisateur :

- Reçoit les données utilisateur depuis le frontend
- Envoie les données à la base de données Firebase
- Retourne des réponses succès/échec

Considérez-le comme le système de commande de cuisine qui prend les demandes des serveurs et prépare la nourriture.

### 4. [app/chat/page.tsx](file://c:\GOMYCODE\COURS%20FULLSTACK\BACK-END\nextjs\atelier%20messagerie%20app\messagerie-app%20part%201\app\chat\page.tsx) - La Salle à Manger

L'interface principale de chat où les utilisateurs interagissent :

- Affiche la liste des contacts (barre latérale)
- Montre la conversation avec le contact sélectionné
- Implémente le middleware d'authentification
- Gère l'état du contact actuel

Comme la salle à manger principale où les clients profitent de leurs repas et conversations.

### 5. [firebase/config.ts](file://c:\GOMYCODE\COURS%20FULLSTACK\BACK-END\nextjs\atelier%20messagerie%20app\messagerie-app%20part%201\firebase\config.ts) - Le Fournisseur d'Ingrédients

Configure les services Firebase :

- Initialise l'application Firebase avec les variables d'environnement
- Configure le service d'authentification
- Exporte l'instance d'authentification pour utilisation dans toute l'application

Comme un fournisseur qui fournit tous les ingrédients nécessaires à la cuisine.

### 6. [types/index.ts](file://c:\GOMYCODE\COURS%20FULLSTACK\BACK-END\nextjs\atelier%20messagerie%20app\messagerie-app%20part%201\types\index.ts) - Les Normes du Livre de Recettes

Définit les structures de données utilisées dans toute l'application :

- [Message](file://c:\GOMYCODE\COURS%20FULLSTACK\BACK-END\nextjs\atelier%20messagerie%20app\messagerie-app%20part%201\types\index.ts#L0-L5) interface (id, texte, expéditeur, heure)
- [Contact](file://c:\GOMYCODE\COURS%20FULLSTACK\BACK-END\nextjs\atelier%20messagerie%20app\messagerie-app%20part%201\types\index.ts#L7-L12) interface (nom, statut, couleur, id)

Comme des fiches de recettes standardisées qui assurent la cohérence dans la préparation des plats.

### 7. [.env](file://c:\GOMYCODE\COURS%20FULLSTACK\BACK-END\nextjs\atelier%20messagerie%20app\messagerie-app%20part%201.env) - Le Livre de Recettes Secrètes

Contient les valeurs de configuration confidentielles (non inclus dans le contrôle de version) :

Variables d'environnement requises :

```env
NEXT_PUBLIC_apiKey=votre_clé_api_firebase
NEXT_PUBLIC_authDomain=votre_domaine_auth_firebase
NEXT_PUBLIC_projectId=votre_id_projet_firebase
NEXT_PUBLIC_storageBucket=votre_bucket_stockage_firebase
NEXT_PUBLIC_messagingSenderId=votre_id_expediteur_messages_firebase
NEXT_PUBLIC_appId=votre_id_application_firebase
database_url=votre_url_base_de_données_firebase
```

Comme le livre de recettes secrètes d'un chef qui contient des formules propriétaires jamais partagées publiquement.

## Fonctionnement Global

1. **L'utilisateur visite le site** → [app/page.tsx](file://c:\GOMYCODE\COURS%20FULLSTACK\BACK-END\nextjs\atelier%20messagerie%20app\messagerie-app%20part%201\app\page.tsx) affiche le bouton de connexion
2. **L'utilisateur clique sur connexion** → [Login.ts](file://c:\GOMYCODE\COURS%20FULLSTACK\BACK-END\nextjs\atelier%20messagerie%20app\messagerie-app%20part%201\controllers\Login.ts) gère l'authentification Google
3. **Utilisateur authentifié** → [SaveUser.ts](file://c:\GOMYCODE\COURS%20FULLSTACK\BACK-END\nextjs\atelier%20messagerie%20app\messagerie-app%20part%201\controllers\SaveUser.ts) stocke les données utilisateur via la route API
4. **Utilisateur redirigé** → [app/chat/page.tsx](file://c:\GOMYCODE\COURS%20FULLSTACK\BACK-END\nextjs\atelier%20messagerie%20app\messagerie-app%20part%201\app\chat\page.tsx) affiche l'interface de chat
5. **Protection d'accès** → [LoginMidleware.ts](file://c:\GOMYCODE\COURS%20FULLSTACK\BACK-END\nextjs\atelier%20messagerie%20app\messagerie-app%20part%201\controllers\LoginMidleware.ts) garantit que seuls les utilisateurs connectés accèdent au chat
6. **Structures de données** → [types/index.ts](file://c:\GOMYCODE\COURS%20FULLSTACK\BACK-END\nextjs\atelier%20messagerie%20app\messagerie-app%20part%201\types\index.ts) assure une gestion cohérente des données
7. **Configuration** → [firebase/config.ts](file://c:\GOMYCODE\COURS%20FULLSTACK\BACK-END\nextjs\atelier%20messagerie%20app\messagerie-app%20part%201\firebase\config.ts) se connecte aux services Firebase
8. **Secrets** → Le fichier [.env](file://c:\GOMYCODE\COURS%20FULLSTACK\BACK-END\nextjs\atelier%20messagerie%20app\messagerie-app%20part%201.env) fournit les valeurs de configuration confidentielles
