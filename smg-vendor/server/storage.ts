import { type User, type InsertUser, type Vendor, type InsertVendor, type Component, type InsertComponent, type ComponentHistory, type InsertComponentHistory, type Document, type InsertDocument } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getVendors(): Promise<Vendor[]>;
  getVendor(id: string): Promise<Vendor | undefined>;
  createVendor(vendor: InsertVendor): Promise<Vendor>;
  updateVendor(id: string, vendor: Partial<InsertVendor>): Promise<Vendor | undefined>;
  deleteVendor(id: string): Promise<boolean>;
  
  getComponentsByVendor(vendorId: string): Promise<Component[]>;
  getComponent(id: string): Promise<Component | undefined>;
  createComponent(component: InsertComponent): Promise<Component>;
  
  getComponentHistory(vendorId: string): Promise<ComponentHistory[]>;
  createComponentHistory(history: InsertComponentHistory): Promise<ComponentHistory>;
  
  getDocumentsByVendor(vendorId: string): Promise<Document[]>;
  createDocument(doc: InsertDocument): Promise<Document>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private vendors: Map<string, Vendor>;
  private components: Map<string, Component>;
  private componentHistory: Map<string, ComponentHistory>;
  private documents: Map<string, Document>;

  constructor() {
    this.users = new Map();
    this.vendors = new Map();
    this.components = new Map();
    this.componentHistory = new Map();
    this.documents = new Map();
    this.seedData();
  }

  private seedData() {
    const vendorData: Vendor[] = [
      {
        id: "v1",
        vendorCode: "VND-001",
        companyName: "ABC Electronics Ltd.",
        contactPerson: "Rajesh Kumar",
        email: "rajesh@abcelectronics.com",
        phone: "+91 98765 43210",
        address: "123 Industrial Area, Phase 2",
        city: "Noida",
        state: "Uttar Pradesh",
        pincode: "201301",
        gstNumber: "09AAACA1234F1ZH",
        panNumber: "AAACA1234F",
        bankName: "HDFC Bank",
        accountNumber: "12345678901234",
        ifscCode: "HDFC0001234",
        status: "active",
        ndaUploaded: true,
        trademarkUploaded: false,
        ndaFileName: "ABC_NDA_2024.pdf",
        trademarkFileName: null,
        createdAt: new Date(),
      },
      {
        id: "v2",
        vendorCode: "VND-002",
        companyName: "Power Motors India Pvt. Ltd.",
        contactPerson: "Suresh Patel",
        email: "suresh@powermotors.in",
        phone: "+91 87654 32109",
        address: "456 MIDC Industrial Estate",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411057",
        gstNumber: "27AABCP5678F1ZG",
        panNumber: "AABCP5678F",
        bankName: "ICICI Bank",
        accountNumber: "98765432109876",
        ifscCode: "ICIC0005678",
        status: "active",
        ndaUploaded: true,
        trademarkUploaded: true,
        ndaFileName: "PowerMotors_NDA.pdf",
        trademarkFileName: "PowerMotors_TM.jpg",
        createdAt: new Date(),
      },
      {
        id: "v3",
        vendorCode: "VND-003",
        companyName: "Green Battery Solutions",
        contactPerson: "Amit Singh",
        email: "amit@greenbattery.com",
        phone: "+91 76543 21098",
        address: "789 SEZ Zone, Block C",
        city: "Chennai",
        state: "Tamil Nadu",
        pincode: "600032",
        gstNumber: "33AABCG9012F1ZF",
        panNumber: "AABCG9012F",
        bankName: "Axis Bank",
        accountNumber: "45678901234567",
        ifscCode: "UTIB0009012",
        status: "pending",
        ndaUploaded: false,
        trademarkUploaded: false,
        ndaFileName: null,
        trademarkFileName: null,
        createdAt: new Date(),
      },
      {
        id: "v4",
        vendorCode: "VND-004",
        companyName: "Smart Charger Technologies",
        contactPerson: "Priya Sharma",
        email: "priya@smartcharger.co.in",
        phone: "+91 65432 10987",
        address: "321 Tech Park, Tower B",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560100",
        gstNumber: "29AABCS3456F1ZE",
        panNumber: "AABCS3456F",
        bankName: "State Bank of India",
        accountNumber: "32109876543210",
        ifscCode: "SBIN0003456",
        status: "active",
        ndaUploaded: true,
        trademarkUploaded: true,
        ndaFileName: "SmartCharger_NDA.pdf",
        trademarkFileName: "SmartCharger_Logo.png",
        createdAt: new Date(),
      },
      {
        id: "v5",
        vendorCode: "VND-005",
        companyName: "Mirror Vision Auto Parts",
        contactPerson: "Vikram Reddy",
        email: "vikram@mirrorvision.com",
        phone: "+91 54321 09876",
        address: "654 Auto Hub, Sector 5",
        city: "Gurgaon",
        state: "Haryana",
        pincode: "122001",
        gstNumber: "06AABCM7890F1ZD",
        panNumber: "AABCM7890F",
        bankName: "Kotak Mahindra Bank",
        accountNumber: "21098765432109",
        ifscCode: "KKBK0007890",
        status: "inactive",
        ndaUploaded: true,
        trademarkUploaded: false,
        ndaFileName: "MirrorVision_NDA.pdf",
        trademarkFileName: null,
        createdAt: new Date(),
      },
    ];

    vendorData.forEach((v) => this.vendors.set(v.id, v));

    const componentData: Component[] = [
      { id: "c1", vendorId: "v1", componentName: "BLDC Motor 500W", category: "Motors", sorNumber: "SOR-MOT-001", specifications: "500W, 48V, 3000 RPM", status: "active", createdAt: new Date() },
      { id: "c2", vendorId: "v1", componentName: "Controller Unit 48V", category: "Electronics", sorNumber: "SOR-ELE-001", specifications: "48V, 30A max", status: "active", createdAt: new Date() },
      { id: "c3", vendorId: "v2", componentName: "Hub Motor 1000W", category: "Motors", sorNumber: "SOR-MOT-002", specifications: "1000W, 60V, 2500 RPM", status: "active", createdAt: new Date() },
      { id: "c4", vendorId: "v3", componentName: "Lithium Battery Pack 60V", category: "Battery", sorNumber: "SOR-BAT-001", specifications: "60V, 30Ah, LiFePO4", status: "pending", createdAt: new Date() },
      { id: "c5", vendorId: "v4", componentName: "Fast Charger 5A", category: "Chargers", sorNumber: "SOR-CHG-001", specifications: "60V, 5A output", status: "active", createdAt: new Date() },
      { id: "c6", vendorId: "v5", componentName: "Side Mirror Set", category: "Accessories", sorNumber: "SOR-ACC-001", specifications: "Convex, adjustable", status: "inactive", createdAt: new Date() },
    ];

    componentData.forEach((c) => this.components.set(c.id, c));

    const historyData: ComponentHistory[] = [
      { id: "h1", componentId: "c1", vendorId: "v1", tool: "CNC Machine Tool #12", allotment: "Production Line A", date: new Date("2024-11-15"), remarks: "Initial setup" },
      { id: "h2", componentId: "c1", vendorId: "v1", tool: "Testing Equipment T-45", allotment: "QC Department", date: new Date("2024-11-20"), remarks: "Quality testing" },
      { id: "h3", componentId: "c2", vendorId: "v1", tool: "Soldering Station S-8", allotment: "Assembly Line B", date: new Date("2024-12-01"), remarks: "Board assembly" },
      { id: "h4", componentId: "c3", vendorId: "v2", tool: "Motor Winding Machine", allotment: "Production Line C", date: new Date("2024-12-05"), remarks: "Motor winding process" },
    ];

    historyData.forEach((h) => this.componentHistory.set(h.id, h));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getVendors(): Promise<Vendor[]> {
    return Array.from(this.vendors.values());
  }

  async getVendor(id: string): Promise<Vendor | undefined> {
    return this.vendors.get(id);
  }

  async createVendor(insertVendor: InsertVendor): Promise<Vendor> {
    const id = randomUUID();
    const vendor: Vendor = { ...insertVendor, id, createdAt: new Date() };
    this.vendors.set(id, vendor);
    return vendor;
  }

  async updateVendor(id: string, updates: Partial<InsertVendor>): Promise<Vendor | undefined> {
    const vendor = this.vendors.get(id);
    if (!vendor) return undefined;
    const updated = { ...vendor, ...updates };
    this.vendors.set(id, updated);
    return updated;
  }

  async deleteVendor(id: string): Promise<boolean> {
    return this.vendors.delete(id);
  }

  async getComponentsByVendor(vendorId: string): Promise<Component[]> {
    return Array.from(this.components.values()).filter((c) => c.vendorId === vendorId);
  }

  async getComponent(id: string): Promise<Component | undefined> {
    return this.components.get(id);
  }

  async createComponent(insertComponent: InsertComponent): Promise<Component> {
    const id = randomUUID();
    const component: Component = { ...insertComponent, id, createdAt: new Date() };
    this.components.set(id, component);
    return component;
  }

  async getComponentHistory(vendorId: string): Promise<ComponentHistory[]> {
    return Array.from(this.componentHistory.values()).filter((h) => h.vendorId === vendorId);
  }

  async createComponentHistory(insertHistory: InsertComponentHistory): Promise<ComponentHistory> {
    const id = randomUUID();
    const history: ComponentHistory = { ...insertHistory, id, date: new Date() };
    this.componentHistory.set(id, history);
    return history;
  }

  async getDocumentsByVendor(vendorId: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter((d) => d.vendorId === vendorId);
  }

  async createDocument(insertDoc: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const doc: Document = { ...insertDoc, id, uploadedAt: new Date() };
    this.documents.set(id, doc);
    return doc;
  }
}

export const storage = new MemStorage();
