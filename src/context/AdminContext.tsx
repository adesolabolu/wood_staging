import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../data/products';
import { Project, projects as staticProjects } from '../data/portfolio';
import { db } from '../lib/firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';

const CURRENT_TENANT_ID = "wood_staging";

export interface GalleryItem {
  id: string;
  category: string;
  title: string;
  src: string;
}

export interface Newsletter {
  id: string;
  email: string;
  date: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  date: string;
}

export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  budget: string;
  timeline: string;
  details: string;
  image?: string;
  date: string;
}

interface AdminContextType {
  products: Product[];
  projects: Project[];
  galleries: GalleryItem[];
  newsletters: Newsletter[];
  contactMessages: ContactMessage[];
  quotes: QuoteRequest[];
  
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;

  addGalleryItem: (item: GalleryItem) => void;
  updateGalleryItem: (item: GalleryItem) => void;
  deleteGalleryItem: (id: string) => void;

  addNewsletter: (email: string) => void;
  addContactMessage: (msg: Omit<ContactMessage, 'id' | 'date'>) => void;
  addQuoteRequest: (quote: Omit<QuoteRequest, 'id' | 'date'>) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [projects, setProjects] = useState<Project[]>(staticProjects);
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);

  useEffect(() => {
    const unsubs = [
      onSnapshot(query(collection(db, 'products'), where('tenantId', '==', CURRENT_TENANT_ID)), (snapshot) => {
        setProducts(snapshot.docs.map(doc => doc.data() as Product));
      }),
      onSnapshot(query(collection(db, 'galleries'), where('tenantId', '==', CURRENT_TENANT_ID)), (snapshot) => {
        setGalleries(snapshot.docs.map(doc => doc.data() as GalleryItem));
      }),
      onSnapshot(query(collection(db, 'newsletters'), where('tenantId', '==', CURRENT_TENANT_ID)), (snapshot) => {
        setNewsletters(snapshot.docs.map(doc => doc.data() as Newsletter));
      }),
      onSnapshot(query(collection(db, 'contactMessages'), where('tenantId', '==', CURRENT_TENANT_ID)), (snapshot) => {
        setContactMessages(snapshot.docs.map(doc => doc.data() as ContactMessage));
      }),
      onSnapshot(query(collection(db, 'quotes'), where('tenantId', '==', CURRENT_TENANT_ID)), (snapshot) => {
        setQuotes(snapshot.docs.map(doc => doc.data() as QuoteRequest));
      })
    ];
    return () => unsubs.forEach(unsub => unsub());
  }, []);

  const addProduct = async (product: Product) => await setDoc(doc(db, 'products', product.id), { ...product, tenantId: CURRENT_TENANT_ID });
  const updateProduct = async (product: Product) => await setDoc(doc(db, 'products', product.id), { ...product, tenantId: CURRENT_TENANT_ID });
  const deleteProduct = async (id: string) => await deleteDoc(doc(db, 'products', id));

  const addProject = async (project: Project) => await setDoc(doc(db, 'portfolio', project.id), { ...project, tenantId: CURRENT_TENANT_ID });
  const updateProject = async (project: Project) => await setDoc(doc(db, 'portfolio', project.id), { ...project, tenantId: CURRENT_TENANT_ID });
  const deleteProject = async (id: string) => await deleteDoc(doc(db, 'portfolio', id));

  const addGalleryItem = async (item: GalleryItem) => await setDoc(doc(db, 'galleries', item.id), { ...item, tenantId: CURRENT_TENANT_ID });
  const updateGalleryItem = async (item: GalleryItem) => await setDoc(doc(db, 'galleries', item.id), { ...item, tenantId: CURRENT_TENANT_ID });
  const deleteGalleryItem = async (id: string) => await deleteDoc(doc(db, 'galleries', id));

  const addNewsletter = async (email: string) => {
    const newEntry = {
      id: Math.random().toString(36).substring(2, 9),
      email,
      date: new Date().toISOString(),
      tenantId: CURRENT_TENANT_ID
    };
    await setDoc(doc(db, 'newsletters', newEntry.id), newEntry);
  };

  const addContactMessage = async (msg: Omit<ContactMessage, 'id' | 'date'>) => {
    const newEntry = {
      ...msg,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString(),
      tenantId: CURRENT_TENANT_ID
    };
    await setDoc(doc(db, 'contactMessages', newEntry.id), newEntry);
  };

  const addQuoteRequest = async (quote: Omit<QuoteRequest, 'id' | 'date'>) => {
    const newEntry = {
      ...quote,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date().toISOString(),
      tenantId: CURRENT_TENANT_ID
    };
    await setDoc(doc(db, 'quotes', newEntry.id), newEntry);
  };

  return (
    <AdminContext.Provider value={{
      products, projects, galleries, newsletters, contactMessages, quotes,
      addProduct, updateProduct, deleteProduct,
      addProject, updateProject, deleteProject,
      addGalleryItem, updateGalleryItem, deleteGalleryItem,
      addNewsletter, addContactMessage, addQuoteRequest
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
