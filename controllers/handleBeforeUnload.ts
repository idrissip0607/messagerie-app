// a revoir explicitement
// 🔹 Fonction exécutée avant la fermeture complète de la page
      export const handleBeforeUnload = (me: string) => {
        const data = JSON.stringify({ status: "hors-ligne" });
        navigator.sendBeacon(`/api/update-status/${me}`, data);
      };