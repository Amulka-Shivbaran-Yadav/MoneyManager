import {useState} from "react";
import {LoaderCircle} from "lucide-react";

const DeleteAlert = ({content,onDelete}) => {
    const [loading,setLoading]=useState(false);
    const handleDelete= async () => {
        setLoading(true);
        try{
            await onDelete();

        }finally {
            setLoading(false);
        }
    }

    return(
        <div>
            <p className="text-sm">{content}</p>
            <div className="flex justify-end mt-6">
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    type="button"
                    className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors duration-200">
                    {loading ? (
                        <>
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                            Deleting...
                        </>
                    ):(
                        <>
                            Delete
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

export default DeleteAlert;