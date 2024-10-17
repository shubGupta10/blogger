import { db } from "./firebaseConfig";
import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';

interface User {
  userId: string;
  firstName: string;
  lastName?: string;
  email: string;
}

interface Comment {
  id: string;
  userData: User;
  content: string;
  createdAt: Date;
}

export const addComment = async (postId: string, userData: User, content: string) => {
  try {
    const commentsRef = collection(db, 'comments');
    const docRef = await addDoc(commentsRef, {
      postId,
      userData,
      content,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error: any) {
    console.error("Error adding comment: ", error);
    throw error;
  }
};

export const fetchCommentsByPostId = async (postId: string): Promise<Comment[]> => {
  const commentsRef = collection(db, 'comments');
  const q = query(commentsRef, where('postId', '==', postId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      userData: data.userData,
      content: data.content,
      createdAt: data.createdAt.toDate(),
    } as Comment;
  });
};