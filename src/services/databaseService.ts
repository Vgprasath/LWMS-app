
import { supabase } from "@/integrations/supabase/client";

export interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
}

export interface Warehouse {
  id: number;
  name: string;
  capacity: number;
  location: string;
  usedSpace: number;
  availableSpace: number;
}

export interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  categoryId: number;
  categoryName: string;
  warehouseId: number;
  warehouseName: string;
  location: string;
  lastUpdated: Date;
}

export interface Shipment {
  id: number;
  itemId: number;
  itemName: string;
  quantity: number;
  origin: string;
  destination: string;
  status: 'dispatched' | 'pending' | 'delivered';
  departureDate: Date;
  estimatedArrival: Date;
}

export interface Equipment {
  id: number;
  name: string;
  type: string;
  status: 'operational' | 'maintenance' | 'out-of-service';
  lastMaintenanceDate: Date;
  nextMaintenanceDate: Date;
}

export interface MaintenanceRecord {
  id: number;
  equipmentId: number;
  equipmentName: string;
  type: 'routine' | 'repair' | 'inspection';
  status: 'pending' | 'in-progress' | 'completed';
  startDate: Date;
  endDate: Date | null;
  notes: string;
}

export interface PerformanceMetric {
  id: number;
  name: string;
  value: number;
  target: number;
  unit: string;
  period: string;
  trend: 'up' | 'down' | 'stable';
  date: Date;
}

// Simulated data fetching functions with Supabase integration
export const fetchInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    // In a real app, this would be a real Supabase query
    // const { data, error } = await supabase.from('inventory').select('*');
    // if (error) throw error;
    // return data;
    
    // For now, we'll return mock data
    return mockInventoryItems;
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    return mockInventoryItems;
  }
};

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    // In a real app, this would be a real Supabase query
    // const { data, error } = await supabase.from('categories').select('*');
    // if (error) throw error;
    // return data;
    
    return mockCategories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return mockCategories;
  }
};

export const fetchWarehouses = async (): Promise<Warehouse[]> => {
  try {
    // In a real app, this would be a real Supabase query
    // const { data, error } = await supabase.from('warehouses').select('*');
    // if (error) throw error;
    // return data;
    
    return mockWarehouses;
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    return mockWarehouses;
  }
};

export const fetchShipments = async (): Promise<Shipment[]> => {
  try {
    // In a real app, this would be a real Supabase query
    // const { data, error } = await supabase.from('shipments').select('*');
    // if (error) throw error;
    // return data;
    
    return mockShipments;
  } catch (error) {
    console.error('Error fetching shipments:', error);
    return mockShipments;
  }
};

export const fetchEquipment = async (): Promise<Equipment[]> => {
  try {
    // In a real app, this would be a real Supabase query
    // const { data, error } = await supabase.from('equipment').select('*');
    // if (error) throw error;
    // return data;
    
    return mockEquipment;
  } catch (error) {
    console.error('Error fetching equipment:', error);
    return mockEquipment;
  }
};

export const fetchMaintenanceRecords = async (): Promise<MaintenanceRecord[]> => {
  try {
    // In a real app, this would be a real Supabase query
    // const { data, error } = await supabase.from('maintenance_records').select('*');
    // if (error) throw error;
    // return data;
    
    return mockMaintenanceRecords;
  } catch (error) {
    console.error('Error fetching maintenance records:', error);
    return mockMaintenanceRecords;
  }
};

export const fetchPerformanceMetrics = async (): Promise<PerformanceMetric[]> => {
  try {
    // In a real app, this would be a real Supabase query
    // const { data, error } = await supabase.from('performance_metrics').select('*');
    // if (error) throw error;
    // return data;
    
    return mockPerformanceMetrics;
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    return mockPerformanceMetrics;
  }
};

// Mock data
const mockCategories: Category[] = [
  { id: 1, name: 'Electronics', description: 'Electronic devices and components', createdAt: new Date('2023-01-15') },
  { id: 2, name: 'Furniture', description: 'Office and home furniture', createdAt: new Date('2023-02-10') },
  { id: 3, name: 'Clothing', description: 'Apparel and accessories', createdAt: new Date('2023-03-05') },
  { id: 4, name: 'Food & Beverage', description: 'Consumable products', createdAt: new Date('2023-04-20') },
  { id: 5, name: 'Automotive', description: 'Vehicle parts and accessories', createdAt: new Date('2023-05-12') },
];

const mockWarehouses: Warehouse[] = [
  { id: 1, name: 'North Distribution Center', capacity: 10000, location: 'Seattle, WA', usedSpace: 7500, availableSpace: 2500 },
  { id: 2, name: 'East Regional Warehouse', capacity: 15000, location: 'Boston, MA', usedSpace: 10000, availableSpace: 5000 },
  { id: 3, name: 'Central Storage Facility', capacity: 20000, location: 'Chicago, IL', usedSpace: 18000, availableSpace: 2000 },
  { id: 4, name: 'South Fulfillment Center', capacity: 12000, location: 'Atlanta, GA', usedSpace: 6000, availableSpace: 6000 },
  { id: 5, name: 'West Coast Storage', capacity: 18000, location: 'Los Angeles, CA', usedSpace: 15000, availableSpace: 3000 },
];

const mockInventoryItems: InventoryItem[] = [
  { id: 1, name: 'Laptop', quantity: 150, categoryId: 1, categoryName: 'Electronics', warehouseId: 1, warehouseName: 'North Distribution Center', location: 'Rack A-1', lastUpdated: new Date('2023-10-15') },
  { id: 2, name: 'Office Chair', quantity: 75, categoryId: 2, categoryName: 'Furniture', warehouseId: 3, warehouseName: 'Central Storage Facility', location: 'Section B-2', lastUpdated: new Date('2023-10-12') },
  { id: 3, name: 'T-shirt', quantity: 500, categoryId: 3, categoryName: 'Clothing', warehouseId: 4, warehouseName: 'South Fulfillment Center', location: 'Zone C-3', lastUpdated: new Date('2023-10-10') },
  { id: 4, name: 'Coffee Beans', quantity: 200, categoryId: 4, categoryName: 'Food & Beverage', warehouseId: 2, warehouseName: 'East Regional Warehouse', location: 'Shelf D-4', lastUpdated: new Date('2023-10-05') },
  { id: 5, name: 'Brake Pads', quantity: 300, categoryId: 5, categoryName: 'Automotive', warehouseId: 5, warehouseName: 'West Coast Storage', location: 'Bin E-5', lastUpdated: new Date('2023-09-30') },
  { id: 6, name: 'Smartphone', quantity: 100, categoryId: 1, categoryName: 'Electronics', warehouseId: 1, warehouseName: 'North Distribution Center', location: 'Rack A-2', lastUpdated: new Date('2023-10-14') },
  { id: 7, name: 'Desk', quantity: 50, categoryId: 2, categoryName: 'Furniture', warehouseId: 3, warehouseName: 'Central Storage Facility', location: 'Section B-3', lastUpdated: new Date('2023-10-11') },
  { id: 8, name: 'Jeans', quantity: 350, categoryId: 3, categoryName: 'Clothing', warehouseId: 4, warehouseName: 'South Fulfillment Center', location: 'Zone C-4', lastUpdated: new Date('2023-10-09') },
];

const mockShipments: Shipment[] = [
  { id: 1, itemId: 1, itemName: 'Laptop', quantity: 30, origin: 'North Distribution Center', destination: 'TechStore NYC', status: 'dispatched', departureDate: new Date('2023-10-10'), estimatedArrival: new Date('2023-10-15') },
  { id: 2, itemId: 3, itemName: 'T-shirt', quantity: 100, origin: 'South Fulfillment Center', destination: 'Fashion Outlet Miami', status: 'pending', departureDate: new Date('2023-10-18'), estimatedArrival: new Date('2023-10-22') },
  { id: 3, itemId: 5, itemName: 'Brake Pads', quantity: 50, origin: 'West Coast Storage', destination: 'AutoShop LA', status: 'delivered', departureDate: new Date('2023-10-05'), estimatedArrival: new Date('2023-10-08') },
  { id: 4, itemId: 4, itemName: 'Coffee Beans', quantity: 20, origin: 'East Regional Warehouse', destination: 'CoffeeHouse Boston', status: 'dispatched', departureDate: new Date('2023-10-12'), estimatedArrival: new Date('2023-10-14') },
  { id: 5, itemId: 2, itemName: 'Office Chair', quantity: 15, origin: 'Central Storage Facility', destination: 'Corporate Office Chicago', status: 'pending', departureDate: new Date('2023-10-20'), estimatedArrival: new Date('2023-10-21') },
];

const mockEquipment: Equipment[] = [
  { id: 1, name: 'Forklift A', type: 'Heavy Equipment', status: 'operational', lastMaintenanceDate: new Date('2023-09-15'), nextMaintenanceDate: new Date('2023-12-15') },
  { id: 2, name: 'Conveyor Belt 1', type: 'Conveyor System', status: 'maintenance', lastMaintenanceDate: new Date('2023-10-01'), nextMaintenanceDate: new Date('2023-10-15') },
  { id: 3, name: 'Pallet Jack B', type: 'Manual Equipment', status: 'operational', lastMaintenanceDate: new Date('2023-09-20'), nextMaintenanceDate: new Date('2023-11-20') },
  { id: 4, name: 'Scanner System', type: 'Electronic Equipment', status: 'out-of-service', lastMaintenanceDate: new Date('2023-08-10'), nextMaintenanceDate: new Date('2023-10-10') },
  { id: 5, name: 'Forklift B', type: 'Heavy Equipment', status: 'operational', lastMaintenanceDate: new Date('2023-09-25'), nextMaintenanceDate: new Date('2023-12-25') },
];

const mockMaintenanceRecords: MaintenanceRecord[] = [
  { id: 1, equipmentId: 2, equipmentName: 'Conveyor Belt 1', type: 'repair', status: 'in-progress', startDate: new Date('2023-10-01'), endDate: null, notes: 'Belt motor replacement' },
  { id: 2, equipmentId: 4, equipmentName: 'Scanner System', type: 'repair', status: 'pending', startDate: new Date('2023-10-10'), endDate: null, notes: 'System calibration required' },
  { id: 3, equipmentId: 1, equipmentName: 'Forklift A', type: 'routine', status: 'completed', startDate: new Date('2023-09-15'), endDate: new Date('2023-09-15'), notes: 'Regular oil change and inspection' },
  { id: 4, equipmentId: 3, equipmentName: 'Pallet Jack B', type: 'inspection', status: 'completed', startDate: new Date('2023-09-20'), endDate: new Date('2023-09-20'), notes: 'Annual safety inspection' },
  { id: 5, equipmentId: 5, equipmentName: 'Forklift B', type: 'routine', status: 'completed', startDate: new Date('2023-09-25'), endDate: new Date('2023-09-25'), notes: 'Regular oil change and inspection' },
];

const mockPerformanceMetrics: PerformanceMetric[] = [
  { id: 1, name: 'Inventory Turnover Rate', value: 4.3, target: 5.0, unit: 'ratio', period: 'Q3 2023', trend: 'up', date: new Date('2023-10-01') },
  { id: 2, name: 'Warehouse Utilization', value: 78, target: 85, unit: '%', period: 'Q3 2023', trend: 'stable', date: new Date('2023-10-01') },
  { id: 3, name: 'Order Fulfillment Rate', value: 94, target: 98, unit: '%', period: 'Q3 2023', trend: 'up', date: new Date('2023-10-01') },
  { id: 4, name: 'Shipment On-Time Rate', value: 87, target: 95, unit: '%', period: 'Q3 2023', trend: 'down', date: new Date('2023-10-01') },
  { id: 5, name: 'Equipment Downtime', value: 3.5, target: 2.0, unit: '%', period: 'Q3 2023', trend: 'down', date: new Date('2023-10-01') },
  { id: 6, name: 'Inventory Accuracy', value: 96, target: 99, unit: '%', period: 'Q3 2023', trend: 'stable', date: new Date('2023-10-01') },
];
