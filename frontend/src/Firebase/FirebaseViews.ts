import { db } from "./firebaseConfig";
import { 
  collection, 
  addDoc, 
  setDoc,
  query, 
  getDocs, 
  where, 
  doc, 
  getDoc, 
  updateDoc, 
  increment, 
  orderBy,
  limit
} from 'firebase/firestore';

interface View {
  userId: string;
  postId: string;
}

interface ViewCounter {
  count: number;
}

export const addView = async (view: View) => {
  try {
    const dataRef = collection(db, 'views');
    const docRef = await addDoc(dataRef, {
      userId: view.userId,
      postId: view.postId,
      timestamp: new Date().toISOString()
    });

    const counterRef = doc(db, 'viewCounters', view.postId);
    
    try {
      await updateDoc(counterRef, {
        count: increment(1)
      });
    } catch (incrementError) {
      await setDoc(counterRef, { count: 1 });
    }

    return docRef.id;
  } catch (error) {
    console.error("Error adding view: ", error);
    throw error;
  }
};

export const fetchViewCount = async (postId: string) => {
  const counterRef = doc(db, 'viewCounters', postId);
  
  try {
    const counterDoc = await getDoc(counterRef);
    
    if (counterDoc.exists()) {
      const counterData = counterDoc.data() as ViewCounter;
      return counterData.count;
    }
    
    return 0;
  } catch (error) {
    console.error("Error fetching view count: ", error);
    throw error;
  }
};

export const getViewerList = async (postId: string) => {
  const viewsRef = collection(db, 'views');
  const q = query(viewsRef, where("postId", "==", postId));
  
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};


export const fetchMostViewedPosts = async (limitCount: number = 10) => {
  const viewCountersRef = collection(db, 'viewCounters');
  
  const q = query(viewCountersRef, orderBy('count', 'desc'), limit(limitCount));
  
  try {
    const querySnapshot = await getDocs(q);
    
    const mostViewedPosts = querySnapshot.docs.map(doc => ({
      postId: doc.id,
      ...(doc.data() as ViewCounter),
    }));
    
    
    return mostViewedPosts;
  } catch (error) {
    console.error("Error fetching most-viewed posts: ", error);
    throw error;
  }
};