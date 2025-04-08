
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface ShipmentItem {
  itemId: string;
  itemName: string;
  quantity: number;
}

interface ShipmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  inventory: any[];
}

const ShipmentForm: React.FC<ShipmentFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  inventory
}) => {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    carrier: '',
    departureDate: '',
    estimatedArrival: '',
    priority: 'standard',
    items: [{ itemId: '', itemName: '', quantity: 1 }]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // If changing itemId, also update the itemName
    if (field === 'itemId') {
      const selectedItem = inventory.find(item => item.id === value);
      if (selectedItem) {
        updatedItems[index].itemName = selectedItem.name;
      }
    }
    
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { itemId: '', itemName: '', quantity: 1 }]
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const updatedItems = [...formData.items];
      updatedItems.splice(index, 1);
      setFormData(prev => ({ ...prev, items: updatedItems }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.origin || !formData.destination || !formData.departureDate || !formData.estimatedArrival) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    // Check if any items are missing information
    const validItems = formData.items.filter(item => item.itemId && item.quantity > 0);
    if (validItems.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please add at least one item to the shipment",
        variant: "destructive"
      });
      return;
    }
    
    // Submit with valid items only
    onSubmit({
      ...formData,
      items: validItems,
      status: 'pending',
      trackingNumber: `TRK-${Math.floor(Math.random() * 10000000)}`
    });
    
    // Reset form
    setFormData({
      origin: '',
      destination: '',
      carrier: '',
      departureDate: '',
      estimatedArrival: '',
      priority: 'standard',
      items: [{ itemId: '', itemName: '', quantity: 1 }]
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Shipment</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="origin">Origin *</Label>
              <Input
                id="origin"
                name="origin"
                value={formData.origin}
                onChange={handleInputChange}
                placeholder="Warehouse or location"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="destination">Destination *</Label>
              <Input
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                placeholder="Delivery location"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="carrier">Carrier</Label>
              <Input
                id="carrier"
                name="carrier"
                value={formData.carrier}
                onChange={handleInputChange}
                placeholder="Shipping company"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="standard">Standard</option>
                <option value="express">Express</option>
                <option value="rush">Rush</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="departureDate">Departure Date *</Label>
              <Input
                id="departureDate"
                name="departureDate"
                type="date"
                value={formData.departureDate}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estimatedArrival">Estimated Arrival *</Label>
              <Input
                id="estimatedArrival"
                name="estimatedArrival"
                type="date"
                value={formData.estimatedArrival}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Shipment Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                Add Item
              </Button>
            </div>
            
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-8 gap-2 items-end border-b pb-2">
                <div className="col-span-4">
                  <Label htmlFor={`item-${index}`}>Item</Label>
                  <select
                    id={`item-${index}`}
                    value={item.itemId}
                    onChange={(e) => handleItemChange(index, 'itemId', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    required
                  >
                    <option value="">Select Item</option>
                    {inventory.map(invItem => (
                      <option key={invItem.id} value={invItem.id}>
                        {invItem.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                  <Input
                    id={`quantity-${index}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                    required
                  />
                </div>
                
                <div className="col-span-2 flex justify-end pb-1">
                  <Button 
                    type="button" 
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem(index)}
                    disabled={formData.items.length <= 1}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Shipment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ShipmentForm;
