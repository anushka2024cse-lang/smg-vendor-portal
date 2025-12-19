import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVendorSchema, insertComponentSchema, insertComponentHistorySchema, insertDocumentSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/vendors", async (req, res) => {
    try {
      const vendors = await storage.getVendors();
      res.json(vendors);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vendors" });
    }
  });

  app.get("/api/vendors/:id", async (req, res) => {
    try {
      const vendor = await storage.getVendor(req.params.id);
      if (!vendor) {
        return res.status(404).json({ error: "Vendor not found" });
      }
      res.json(vendor);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch vendor" });
    }
  });

  app.post("/api/vendors", async (req, res) => {
    try {
      const parseResult = insertVendorSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid vendor data", details: parseResult.error.errors });
      }
      const vendor = await storage.createVendor(parseResult.data);
      res.status(201).json(vendor);
    } catch (error) {
      res.status(500).json({ error: "Failed to create vendor" });
    }
  });

  app.patch("/api/vendors/:id", async (req, res) => {
    try {
      const parseResult = insertVendorSchema.partial().safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid vendor data", details: parseResult.error.errors });
      }
      const vendor = await storage.updateVendor(req.params.id, parseResult.data);
      if (!vendor) {
        return res.status(404).json({ error: "Vendor not found" });
      }
      res.json(vendor);
    } catch (error) {
      res.status(500).json({ error: "Failed to update vendor" });
    }
  });

  app.delete("/api/vendors/:id", async (req, res) => {
    try {
      const success = await storage.deleteVendor(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Vendor not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete vendor" });
    }
  });

  app.get("/api/vendors/:id/components", async (req, res) => {
    try {
      const components = await storage.getComponentsByVendor(req.params.id);
      res.json(components);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch components" });
    }
  });

  app.post("/api/vendors/:id/components", async (req, res) => {
    try {
      const componentData = { ...req.body, vendorId: req.params.id };
      const parseResult = insertComponentSchema.safeParse(componentData);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid component data", details: parseResult.error.errors });
      }
      const component = await storage.createComponent(parseResult.data);
      res.status(201).json(component);
    } catch (error) {
      res.status(500).json({ error: "Failed to create component" });
    }
  });

  app.get("/api/vendors/:id/history", async (req, res) => {
    try {
      const history = await storage.getComponentHistory(req.params.id);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch component history" });
    }
  });

  app.post("/api/vendors/:id/history", async (req, res) => {
    try {
      const historyData = { ...req.body, vendorId: req.params.id };
      const parseResult = insertComponentHistorySchema.safeParse(historyData);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid history data", details: parseResult.error.errors });
      }
      const history = await storage.createComponentHistory(parseResult.data);
      res.status(201).json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to create component history" });
    }
  });

  app.get("/api/vendors/:id/documents", async (req, res) => {
    try {
      const documents = await storage.getDocumentsByVendor(req.params.id);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  app.post("/api/vendors/:id/documents", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const docType = req.body.type as "nda" | "trademark";
      const vendor = await storage.getVendor(req.params.id);
      
      if (!vendor) {
        return res.status(404).json({ error: "Vendor not found" });
      }

      const documentData = {
        vendorId: req.params.id,
        documentType: docType,
        fileName: req.file.originalname,
        fileSize: `${(req.file.size / 1024).toFixed(1)} KB`,
      };

      const parseResult = insertDocumentSchema.safeParse(documentData);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid document data", details: parseResult.error.errors });
      }

      const document = await storage.createDocument(parseResult.data);

      if (docType === "nda") {
        await storage.updateVendor(req.params.id, {
          ndaUploaded: true,
          ndaFileName: req.file.originalname,
        });
      } else if (docType === "trademark") {
        await storage.updateVendor(req.params.id, {
          trademarkUploaded: true,
          trademarkFileName: req.file.originalname,
        });
      }

      res.status(201).json(document);
    } catch (error) {
      res.status(500).json({ error: "Failed to upload document" });
    }
  });

  return httpServer;
}
