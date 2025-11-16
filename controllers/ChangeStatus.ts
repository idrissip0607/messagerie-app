// a revoir explicitement
import axios from "axios";

async function ChangeStatus(me: string, status: { status: string }) {
    try {
        await axios.patch(`/api/update-status/${me}`, status );
    } catch (error) {
        console.error("Erreur lors de la mise à jour du statut :", error);
    }
}

export default ChangeStatus
