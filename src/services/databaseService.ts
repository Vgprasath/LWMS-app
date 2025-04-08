
// Mock database service for the AI assistant to reference

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  categoryId: string;
  categoryName: string;
  warehouseId: string;
  warehouseName: string;
  location: string;
  lastUpdated: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Warehouse {
  id: string;
  capacity: number;
  name: string;
}

export interface MaintenanceTask {
  id: string;
  equipmentId: string;
  equipmentName: string;
  type: string;
  description: string;
  assignedTo: string;
  scheduledDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  location: string;
  lastMaintenance: string;
  status: 'operational' | 'maintenance' | 'broken';
}

export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  items: { itemId: string; itemName: string; quantity: number }[];
  status: 'pending' | 'in_transit' | 'delivered';
  carrier: string;
  trackingNumber: string;
  departureDate: string;
  estimatedArrival: string;
  priority: 'standard' | 'express' | 'rush';
}

// Mock data providers
let inventoryItems: InventoryItem[] = [
  {
    id: "1",
    name: "Smartphone X500",
    quantity: 150,
    categoryId: "1",
    categoryName: "Electronics",
    warehouseId: "1",
    warehouseName: "Main Storage",
    location: "Rack A-123",
    lastUpdated: "2023-09-15 14:30:22",
  },
  {
    id: "2",
    name: "Office Chair",
    quantity: 30,
    categoryId: "2",
    categoryName: "Furniture",
    warehouseId: "1",
    warehouseName: "Main Storage",
    location: "Floor B-Zone 3",
    lastUpdated: "2023-08-20 09:15:10",
  },
  {
    id: "3",
    name: "Summer T-Shirt",
    quantity: 500,
    categoryId: "3",
    categoryName: "Clothing",
    warehouseId: "2",
    warehouseName: "Fashion Warehouse",
    location: "Shelf C-78",
    lastUpdated: "2023-09-10 16:45:30",
  },
  {
    id: "4",
    name: "USB-C Cable",
    quantity: 300,
    categoryId: "1",
    categoryName: "Electronics",
    warehouseId: "1",
    warehouseName: "Main Storage",
    location: "Rack A-45",
    lastUpdated: "2023-09-08 11:20:15",
  },
  {
    id: "5",
    name: "Organic Apples",
    quantity: 200,
    categoryId: "4",
    categoryName: "Food",
    warehouseId: "3",
    warehouseName: "Cold Storage",
    location: "Fridge 12",
    lastUpdated: "2023-09-18 08:30:00",
  },
];

let categories: Category[] = [
  { id: "1", name: "Electronics" },
  { id: "2", name: "Furniture" },
  { id: "3", name: "Clothing" },
  { id: "4", name: "Food" },
  { id: "5", name: "Other" },
];

let warehouses: Warehouse[] = [
  { id: "1", name: "Main Storage", capacity: 2000 },
  { id: "2", name: "Fashion Warehouse", capacity: 1500 },
  { id: "3", name: "Cold Storage", capacity: 1000 },
];

let equipment: Equipment[] = [
  {
    id: 'EQ-1001',
    name: 'Forklift 1',
    type: 'Forklift',
    location: 'Main Storage - Zone A',
    lastMaintenance: '2023-08-15',
    status: 'operational',
  },
  {
    id: 'EQ-1002',
    name: 'Conveyor Belt System',
    type: 'Conveyor',
    location: 'Main Storage - Loading Area',
    lastMaintenance: '2023-09-01',
    status: 'maintenance',
  },
  {
    id: 'EQ-1003',
    name: 'Pallet Jack 3',
    type: 'Pallet Jack',
    location: 'Fashion Warehouse',
    lastMaintenance: '2023-07-22',
    status: 'broken',
  },
];

let maintenanceTasks: MaintenanceTask[] = [
  {
    id: 'MT-1001',
    equipmentId: 'EQ-1002',
    equipmentName: 'Conveyor Belt System',
    type: 'Preventive',
    description: 'Regular inspection and belt adjustment',
    assignedTo: 'John Doe',
    scheduledDate: '2023-09-20',
    status: 'in_progress',
    priority: 'medium',
    createdAt: '2023-09-18',
  },
  {
    id: 'MT-1002',
    equipmentId: 'EQ-1003',
    equipmentName: 'Pallet Jack 3',
    type: 'Corrective',
    description: 'Repair hydraulic system',
    assignedTo: 'Mike Johnson',
    scheduledDate: '2023-09-22',
    status: 'pending',
    priority: 'high',
    createdAt: '2023-09-17',
  },
];

let shipments: Shipment[] = [
  {
    id: "SH-1001",
    origin: "Main Storage",
    destination: "Retail Store #123",
    items: [
      { itemId: "1", itemName: "Smartphone X500", quantity: 20 },
      { itemId: "4", itemName: "USB-C Cable", quantity: 50 }
    ],
    status: "in_transit",
    carrier: "FastShip Inc.",
    trackingNumber: "FS23945832",
    departureDate: "2023-09-15",
    estimatedArrival: "2023-09-18",
    priority: "standard"
  },
  {
    id: "SH-1002",
    origin: "Fashion Warehouse",
    destination: "Online Fulfillment Center",
    items: [
      { itemId: "3", itemName: "Summer T-Shirt", quantity: 100 }
    ],
    status: "pending",
    carrier: "QuickLogistics",
    trackingNumber: "QL77823164",
    departureDate: "2023-09-20",
    estimatedArrival: "2023-09-22",
    priority: "express"
  }
];

// API methods

// Inventory
export const fetchInventoryItems = async (): Promise<InventoryItem[]> => {
  return [...inventoryItems];
};

export const addInventoryItem = async (item: Omit<InventoryItem, 'id' | 'lastUpdated'>): Promise<InventoryItem> => {
  const now = new Date();
  const formattedDate = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`;
  
  const newItem: InventoryItem = {
    ...item,
    id: `${inventoryItems.length + 1}`,
    lastUpdated: formattedDate,
  };
  
  inventoryItems.push(newItem);
  return newItem;
};

export const updateInventoryItem = async (id: string, item: Partial<InventoryItem>): Promise<InventoryItem> => {
  const now = new Date();
  const formattedDate = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0]}`;
  
  const index = inventoryItems.findIndex(i => i.id === id);
  if (index === -1) throw new Error("Item not found");
  
  const updatedItem = {
    ...inventoryItems[index],
    ...item,
    lastUpdated: formattedDate
  };
  
  inventoryItems[index] = updatedItem;
  return updatedItem;
};

export const deleteInventoryItem = async (id: string): Promise<void> => {
  inventoryItems = inventoryItems.filter(item => item.id !== id);
};

// Categories
export const fetchCategories = async (): Promise<Category[]> => {
  return [...categories];
};

export const addCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
  const newCategory = {
    ...category,
    id: `${categories.length + 1}`,
  };
  
  categories.push(newCategory);
  return newCategory;
};

// Warehouses
export const fetchWarehouses = async (): Promise<Warehouse[]> => {
  return [...warehouses];
};

export const addWarehouse = async (warehouse: Omit<Warehouse, 'id'>): Promise<Warehouse> => {
  const newWarehouse = {
    ...warehouse,
    id: `${warehouses.length + 1}`,
  };
  
  warehouses.push(newWarehouse);
  return newWarehouse;
};

// Equipment
export const fetchEquipment = async (): Promise<Equipment[]> => {
  return [...equipment];
};

export const addEquipment = async (item: Omit<Equipment, 'id'>): Promise<Equipment> => {
  const newItem = {
    ...item,
    id: `EQ-${1000 + equipment.length + 1}`,
  };
  
  equipment.push(newItem);
  return newItem;
};

// Maintenance
export const fetchMaintenanceRecords = async (): Promise<MaintenanceTask[]> => {
  return [...maintenanceTasks];
};

export const addMaintenanceTask = async (task: Omit<MaintenanceTask, 'id' | 'createdAt'>): Promise<MaintenanceTask> => {
  const now = new Date();
  const formattedDate = now.toISOString().split('T')[0];
  
  const newTask = {
    ...task,
    id: `MT-${1000 + maintenanceTasks.length + 1}`,
    createdAt: formattedDate,
  };
  
  maintenanceTasks.push(newTask);
  return newTask;
};

// Shipments
export const fetchShipments = async (): Promise<Shipment[]> => {
  return [...shipments];
};

export const addShipment = async (shipment: Omit<Shipment, 'id'>): Promise<Shipment> => {
  const newShipment = {
    ...shipment,
    id: `SH-${1000 + shipments.length + 1}`,
  };
  
  shipments.push(newShipment);
  return newShipment;
};

// Search functionality
export const searchInventory = async (query: string): Promise<InventoryItem[]> => {
  const lowercaseQuery = query.toLowerCase();
  return inventoryItems.filter(item => 
    item.name.toLowerCase().includes(lowercaseQuery) ||
    item.categoryName.toLowerCase().includes(lowercaseQuery) ||
    item.warehouseName.toLowerCase().includes(lowercaseQuery) ||
    item.location.toLowerCase().includes(lowercaseQuery)
  );
};

export const searchEquipment = async (query: string): Promise<Equipment[]> => {
  const lowercaseQuery = query.toLowerCase();
  return equipment.filter(item => 
    item.name.toLowerCase().includes(lowercaseQuery) ||
    item.type.toLowerCase().includes(lowercaseQuery) ||
    item.location.toLowerCase().includes(lowercaseQuery)
  );
};

export const searchMaintenanceTasks = async (query: string): Promise<MaintenanceTask[]> => {
  const lowercaseQuery = query.toLowerCase();
  return maintenanceTasks.filter(task => 
    task.equipmentName.toLowerCase().includes(lowercaseQuery) ||
    task.description.toLowerCase().includes(lowercaseQuery) ||
    task.assignedTo.toLowerCase().includes(lowercaseQuery)
  );
};
