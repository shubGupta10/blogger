import { storage } from "@/Firebase/firebaseConfig"
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadImage = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `blogImages/${file.name}`);
    await uploadBytes(storageRef, file); 

    
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
};
