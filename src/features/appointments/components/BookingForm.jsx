import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { appointmentSchema } from '../schemas/appointmentSchema.js';
import { useBookAppointment } from '../hooks/useBookAppointment.js';
import { patientApi } from '../../../api/patient.api.js';
import { userApi } from '../../../api/user.api.js';
import { useAuth } from '../../../hooks/useAuth.js';
import { useRole } from '../../../hooks/useRole.js';
import Input from '../../../components/ui/Input.jsx';
import Button from '../../../components/ui/Button.jsx';

const BookingForm = ({ onSuccess }) => {
  const { user } = useAuth();
  const { isDoctor } = useRole();
  const { mutate: bookAppointment, isPending } = useBookAppointment();

  // Load patients list
  const { data: patients = [], isLoading: isLoadingPatients } = useQuery({
    queryKey: ['patients', 'list-select'],
    queryFn: async () => {
      const res = await patientApi.getAll();
      return res.data?.data || [];
    },
  });

  // Load doctors list
  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users', 'doctors-select'],
    queryFn: async () => {
      const res = await userApi.getUsers();
      return res.data?.data || [];
    },
  });

  const doctors = users.filter((u) => u.role === 'doctor');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: '',
      doctorId: isDoctor ? user?._id : '',
      scheduledAt: '',
      type: 'in-person',
      duration: 30,
    },
  });

  const onSubmit = (data) => {
    bookAppointment(data, {
      onSuccess: () => {
        if (onSuccess) onSuccess();
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="label">Select Patient</label>
        <select
          className="input-field"
          disabled={isLoadingPatients}
          {...register('patientId')}
        >
          <option value="">-- Choose Patient --</option>
          {patients.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name} ({p.contact?.phone || 'No Phone'})
            </option>
          ))}
        </select>
        {errors.patientId && <p className="error-text">{errors.patientId.message}</p>}
      </div>

      {!isDoctor && (
        <div>
          <label className="label">Select Doctor</label>
          <select
            className="input-field"
            disabled={isLoadingUsers}
            {...register('doctorId')}
          >
            <option value="">-- Choose Doctor --</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.name}
              </option>
            ))}
          </select>
          {errors.doctorId && <p className="error-text">{errors.doctorId.message}</p>}
        </div>
      )}

      <Input
        label="Date & Time"
        type="datetime-local"
        error={errors.scheduledAt}
        {...register('scheduledAt')}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Appointment Type</label>
          <select className="input-field" {...register('type')}>
            <option value="in-person">In-Person</option>
            <option value="telemedicine">Telemedicine</option>
          </select>
          {errors.type && <p className="error-text">{errors.type.message}</p>}
        </div>

        <div>
          <label className="label">Duration</label>
          <select className="input-field" {...register('duration')}>
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
          </select>
          {errors.duration && <p className="error-text">{errors.duration.message}</p>}
        </div>
      </div>

      <Button type="submit" isLoading={isPending} className="w-full">
        Confirm Booking
      </Button>
    </form>
  );
};

export default BookingForm;
