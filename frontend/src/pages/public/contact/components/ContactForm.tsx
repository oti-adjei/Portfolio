
import { useState, type FormEvent } from 'react';
import { useContent } from '@/public/contexts/PublicContentContext';
import { submitContact } from '@/public/services/publicApi';

export default function ContactForm() {
  const { content } = useContent();
  const { form } = content.contactPage;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await submitContact({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        source: 'contact_page_form',
      });
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Form submission error:', err);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 shadow-sm border border-gray-100 animate-pulse-subtle">
      <h2 className="font-serif text-xl sm:text-2xl text-gray-900 mb-6 sm:mb-8">{form.title}</h2>

      {submitStatus === 'success' && (
        <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-emerald-50 border border-emerald-100 rounded-xl sm:rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
              <i className="ri-check-line text-emerald-600 text-lg sm:text-xl"></i>
            </div>
            <p className="text-emerald-700 font-medium text-sm sm:text-base">{form.messages.success}</p>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-rose-50 border border-rose-100 rounded-xl sm:rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center">
              <i className="ri-error-warning-line text-rose-600 text-lg sm:text-xl"></i>
            </div>
            <p className="text-rose-700 font-medium text-sm sm:text-base">{form.messages.error}</p>
          </div>
        </div>
      )}

      <form
        id="contact-form"
        onSubmit={handleSubmit}
        className="space-y-4 sm:space-y-6"
      >
        <input type="text" name="hp" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {form.fields
            .filter((f) => f.type !== 'textarea')
            .slice(0, 2)
            .map((field) => (
              <div key={field.id}>
                <label htmlFor={field.name} className="block text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name as keyof typeof formData]}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  required={field.required}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50/50 border border-gray-200 rounded-lg sm:rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-all"
                  placeholder={field.placeholder}
                />
              </div>
            ))}
        </div>

        {form.fields
          .filter((f) => f.type === 'text' && f.name === 'subject')
          .map((field) => (
            <div key={field.id}>
              <label htmlFor={field.name} className="block text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2">
                {field.label}
              </label>
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name as keyof typeof formData]}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                required={field.required}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50/50 border border-gray-200 rounded-lg sm:rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-all"
                placeholder={field.placeholder}
              />
            </div>
          ))}

        {form.fields.filter((f) => f.type === 'textarea').map((field) => (
          <div key={field.id}>
            <label htmlFor={field.name} className="block text-xs sm:text-sm font-medium text-gray-600 mb-1.5 sm:mb-2">
              {field.label}
            </label>
            <textarea
              id={field.name}
              name={field.name}
              value={formData[field.name as keyof typeof formData]}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  [field.name]: e.target.value.slice(0, field.maxLength || 500),
                })
              }
              required={field.required}
              rows={4}
              maxLength={field.maxLength || 500}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50/50 border border-gray-200 rounded-lg sm:rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:bg-white transition-all resize-none"
              placeholder={field.placeholder}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">
              {formData.message.length}/{field.maxLength || 500}
            </p>
          </div>
        ))}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 sm:py-4 bg-gray-900 text-white text-sm font-medium rounded-lg sm:rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <i className="ri-loader-4-line animate-spin"></i>
              {form.submitButton.loadingLabel}
            </span>
          ) : (
            form.submitButton.label
          )}
        </button>
      </form>
    </div>
  );
}
