import { db } from "./firebaseConfig";
import {collection, addDoc} from 'firebase/firestore'
import { storage } from "@/Firebase/firebaseConfig"
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface Contact {
    name: string;
    email: string;
    Image: string;
    message: string;
}

export const AddContactData = async (userData: Contact) => {
    try {
        const dataRef = collection(db, 'contactData');
        const docRef = await addDoc(dataRef, {
            userData
        });
        return docRef.id;
    } catch (error: any) {
        console.error("Error adding comment: ", error);
        throw error;
    }
}


export const uploadImage = async (file: File): Promise<string> => {
    const storageRef = ref(storage, `ContactImages/${file.name}`);
    await uploadBytes(storageRef, file); 

    
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
};