import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Save, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['user', 'admin']).optional(),
  avatar: z
    .instanceof(FileList)
    .optional()
    .transform((files) => (files && files.length > 0 ? files[0] : undefined))
    .refine((file) => !file || file.size < 5 * 1024 * 1024, 'Max file size is 5MB')
    .refine((file) => !file || file.type.startsWith('image/'), 'Only image files allowed'),
}).refine((data) => data.name.trim().length > 0, { message: 'Name is required', path: ['name'] });

type FormData = z.infer<typeof schema>;

interface UserFormProps {
  defaultValues?: Partial<FormData>;
  onSubmit: (data: FormData & { avatar_url?: string }) => Promise<void>;
  isAdmin?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ defaultValues, onSubmit, isAdmin = false }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview] = useState<string>(defaultValues?.avatar_url || '');
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isValid }, setValue, watch, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: defaultValues?.name,
      email: defaultValues?.email,
      role: defaultValues?.role,
    } as any,
    mode: 'onChange', // Real-time validation
  });

  const file = watch('avatar');

  React.useEffect(() => {
    if (file && file[0]) {
      const url = URL.createObjectURL(file[0]);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  const uploadAvatar = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);
    setError(null);

    // Simulate progress (Supabase doesn't provide native progress; use interval for demo)
    const interval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 10, 90));
    }, 100);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true,
          contentType: file.type,
        });

      clearInterval(interval);
      setUploadProgress(100);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(data.path);
      return publicUrl;
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      throw err;
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const onFormSubmit = async (data: FormData) => {
    try {
      let avatarUrl = preview;
      if (data.avatar) {
        avatarUrl = await uploadAvatar(data.avatar);
      }
      await onSubmit({ ...data, avatar_url: avatarUrl });
      reset(); // Clear form on success
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    }
  };

  return (
    <motion.form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6 glass rounded-xl p-6" initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.2 }}>
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
          Name *
        </label>
        <input
          id="name"
          {...register('name')}
          className={`w-full px-3 py-2 border rounded-md bg-white/5 text-foreground placeholder:text-muted-foreground focus:ring-2 transition-all backdrop-blur-sm ${
            errors.name
              ? 'border-destructive focus:ring-destructive ring-1'
              : isValid && watch('name')
              ? 'focus:ring-primary-500/50 border-primary-500/50'
              : 'border-border focus:ring-primary-500'
          }`}
          placeholder="Enter your name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        <AnimatePresence>
          {errors.name && (
            <motion.p
              id="name-error"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-1 text-destructive text-sm mt-1"
            >
              <AlertCircle className="h-4 w-4" />
              <span>{errors.name.message}</span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
          Email *
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={`w-full px-3 py-2 border rounded-md bg-white/5 text-foreground placeholder:text-muted-foreground focus:ring-2 transition-all backdrop-blur-sm ${
            errors.email
              ? 'border-destructive focus:ring-destructive ring-1'
              : isValid && watch('email')
              ? 'focus:ring-primary-500/50 border-primary-500/50'
              : 'border-border focus:ring-primary-500'
          }`}
          placeholder="Enter your email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        <AnimatePresence>
          {errors.email && (
            <motion.p
              id="email-error"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-1 text-destructive text-sm mt-1"
            >
              <AlertCircle className="h-4 w-4" />
              <span>{errors.email.message}</span>
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Role Field (Admin Only) */}
      {isAdmin && (
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-foreground mb-2">
            Role
          </label>
          <select
            id="role"
            {...register('role')}
            className={`w-full px-3 py-2 border rounded-md bg-white/5 text-foreground focus:ring-2 transition-all backdrop-blur-sm ${
              errors.role
                ? 'border-destructive focus:ring-destructive ring-1'
                : 'border-border focus:ring-primary-500'
            }`}
            aria-invalid={!!errors.role}
            aria-describedby={errors.role ? 'role-error' : undefined}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <AnimatePresence>
            {errors.role && (
              <motion.p
                id="role-error"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-1 text-destructive text-sm mt-1"
              >
                <AlertCircle className="h-4 w-4" />
                <span>{errors.role.message}</span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Avatar Field */}
      <div>
        <label htmlFor="avatar" className="block text-sm font-medium text-foreground mb-2">
          Avatar (Optional)
        </label>
        <input
          id="avatar"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
              setValue('avatar', files as any); // FileList for schema transform
              setPreview(URL.createObjectURL(files[0]));
            } else {
              setValue('avatar', undefined as any);
              setPreview('');
            }
          }}
          className="hidden"
        />
        <label htmlFor="avatar" className="cursor-pointer flex items-center gap-2 p-3 border border-dashed border-border bg-white/5 rounded-md hover:border-primary-500/50 transition-colors">
          <Upload className="h-5 w-5 text-muted-foreground" />
          <span className="text-foreground">Choose Image (Max 5MB)</span>
        </label>
        <AnimatePresence>
          {errors.avatar && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-1 text-destructive text-sm mt-1"
            >
              <AlertCircle className="h-4 w-4" />
              <span>{errors.avatar.message}</span>
            </motion.p>
          )}
        </AnimatePresence>
        {preview && (
          <div className="mt-2 flex items-center gap-3">
            <img src={preview} alt="Avatar Preview" className="h-12 w-12 rounded-full object-cover ring-2 ring-primary-500/20" loading="lazy" />
            <button
              type="button"
              onClick={() => {
                setPreview('');
                setValue('avatar', undefined as any);
              }}
              className="text-destructive hover:text-red-500 transition-colors"
            >
              Remove
            </button>
          </div>
        )}
        {/* Upload Progress */}
        <AnimatePresence>
          {uploading && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ duration: 0.3 }}
              className="h-1 bg-primary-500/50 rounded-full mt-2 overflow-hidden"
            >
              <motion.div
                className="h-full bg-primary-500 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: uploadProgress / 100 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Submit Button */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-destructive/10 border border-destructive/30 rounded-md flex items-center gap-2 text-destructive"
          >
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
            <button type="button" onClick={() => setError(null)} className="ml-auto text-destructive/70 hover:text-destructive">Dismiss</button>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        type="submit"
        disabled={uploading || !isValid}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium transition-all ${
          uploading || !isValid
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : 'bg-gradient-to-r from-primary-500 to-secondary-500 text-background hover:from-primary-600 hover:to-secondary-600'
        }`}
        whileHover={uploading || !isValid ? {} : { scale: 1.02 }}
        whileTap={uploading || !isValid ? {} : { scale: 0.98 }}
      >
        <Save className="h-4 w-4" />
        <span>{uploading ? 'Uploading...' : 'Save Changes'}</span>
      </motion.button>
    </motion.form>
  );
};

export default UserForm;