import { useState } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import type { TenantFormData } from '../../../types/tenant';

interface AddTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: TenantFormData) => void;
  loading: boolean;
}

export function AddTenantModal({ isOpen, onClose, onAdd, loading }: AddTenantModalProps) {
  const [formData, setFormData] = useState<TenantFormData>({ name: '', domain: '' });
  const [errors, setErrors] = useState<Partial<TenantFormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<TenantFormData> = {};
    if (!formData.name.trim()) newErrors.name = 'Restaurant name is required';
    if (!formData.domain.trim()) newErrors.domain = 'Domain is required';
    else if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.domain)) newErrors.domain = 'Enter a valid domain (e.g. siamauthentic.com)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onAdd(formData);
      setFormData({ name: '', domain: '' });
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Tenant">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Restaurant Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Siam Authentic"
          error={errors.name}
          autoFocus
        />
        <Input
          label="Domain"
          value={formData.domain}
          onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
          placeholder="e.g. siamauthentic.com"
          error={errors.domain}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            Add Tenant
          </Button>
        </div>
      </form>
    </Modal>
  );
}