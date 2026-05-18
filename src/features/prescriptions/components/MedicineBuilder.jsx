import React, { useEffect } from 'react';
import { useFieldArray, useWatch } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';

const MedicineBuilder = ({ control, register, errors }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'medicines',
  });

  // Watch medicines to save draft to sessionStorage
  const watchedMedicines = useWatch({
    control,
    name: 'medicines',
  });

  useEffect(() => {
    if (watchedMedicines && watchedMedicines.length > 0) {
      sessionStorage.setItem('prescription_medicines_draft', JSON.stringify(watchedMedicines));
    }
  }, [watchedMedicines]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-surface-border pb-2">
        <h4 className="text-sm font-bold text-slate-700">Medicines list</h4>
        <Button
          type="button"
          variant="secondary"
          className="py-1 px-3 text-xs"
          onClick={() => append({ name: '', dosage: '', frequency: 'Once Daily', duration: '', notes: '' })}
        >
          <Plus className="h-3.5 w-3.5" />
          Add Medicine
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-xs text-slate-400 italic">No medicines added yet. Click "+ Add Medicine" to start prescribing.</p>
      )}

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="p-4 border border-surface-border bg-slate-50/50 rounded-xl relative space-y-3 hover:shadow-sm transition-shadow">
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-4 right-4 text-slate-400 hover:text-medical-red transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-6">
              <Input
                label="Medicine Name"
                placeholder="Panadol 500mg"
                error={errors?.medicines?.[index]?.name}
                {...register(`medicines.${index}.name`)}
              />

              <Input
                label="Dosage"
                placeholder="1 Tablet / 5ml"
                error={errors?.medicines?.[index]?.dosage}
                {...register(`medicines.${index}.dosage`)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pr-6">
              <div>
                <label className="label">Frequency</label>
                <select
                  className="input-field"
                  {...register(`medicines.${index}.frequency`)}
                >
                  <option value="Once Daily">Once Daily</option>
                  <option value="Twice Daily">Twice Daily</option>
                  <option value="Three Times Daily">Three Times Daily</option>
                  <option value="Four Times Daily">Four Times Daily</option>
                  <option value="As Needed (PRN)">As Needed (PRN)</option>
                </select>
                {errors?.medicines?.[index]?.frequency && (
                  <p className="error-text">{errors.medicines[index].frequency.message}</p>
                )}
              </div>

              <Input
                label="Duration"
                placeholder="7 Days"
                error={errors?.medicines?.[index]?.duration}
                {...register(`medicines.${index}.duration`)}
              />

              <Input
                label="Special Notes"
                placeholder="After food"
                error={errors?.medicines?.[index]?.notes}
                {...register(`medicines.${index}.notes`)}
              />
            </div>
          </div>
        ))}
      </div>
      
      {errors?.medicines && !Array.isArray(errors.medicines) && (
        <p className="error-text">{errors.medicines.message}</p>
      )}
    </div>
  );
};

export default MedicineBuilder;
