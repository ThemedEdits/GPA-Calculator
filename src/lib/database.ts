import { ref, set, get, remove, child } from 'firebase/database';
import { database } from './firebase';
import { Semester, UserProfile } from './types';

export const saveUserProfile = async (userProfile: UserProfile): Promise<void> => {
  if (!database) throw new Error("Firebase database not initialized");
  const userRef = ref(database, `users/${userProfile.uid}/profile`);
  await set(userRef, userProfile);
};

export const saveSemester = async (uid: string, semester: Semester): Promise<void> => {
  if (!database) throw new Error("Firebase database not initialized");
  const semesterRef = ref(database, `users/${uid}/semesters/${semester.id}`);
  await set(semesterRef, semester);
};

export const getSemesters = async (uid: string): Promise<Semester[]> => {
  if (!database) throw new Error("Firebase database not initialized");
  const dbRef = ref(database);
  const snapshot = await get(child(dbRef, `users/${uid}/semesters`));
  
  if (snapshot.exists()) {
    const data = snapshot.val();
    // Convert object to array
    return Object.values(data) as Semester[];
  } else {
    return [];
  }
};

export const deleteSemester = async (uid: string, semesterId: string): Promise<void> => {
  if (!database) throw new Error("Firebase database not initialized");
  const semesterRef = ref(database, `users/${uid}/semesters/${semesterId}`);
  await remove(semesterRef);
};
