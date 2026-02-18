
import { siteContent } from '../../../mocks/siteContent';

export default function ContactInfo() {
  const { contactInfo } = siteContent.contactPage;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Contact Cards */}
      {contactInfo.cards.map((item, index) => (
        <div
          key={item.id}
          className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 animate-pulse-subtle hover:shadow-md transition-shadow"
          style={{ animationDelay: `${index * 0.2}s` }}
        >
          {item.link ? (
            <a href={item.link} className="flex items-center gap-3 sm:gap-4 cursor-pointer group">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gray-50 rounded-lg sm:rounded-xl group-hover:bg-gray-100 transition-colors flex-shrink-0">
                <i className={`${item.icon} text-lg sm:text-xl text-gray-600`}></i>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">
                  {item.label}
                </p>
                <p className="text-sm sm:text-base text-gray-900 font-medium group-hover:text-gray-600 transition-colors truncate">
                  {item.value}
                </p>
              </div>
            </a>
          ) : (
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-gray-50 rounded-lg sm:rounded-xl flex-shrink-0">
                <i className={`${item.icon} text-lg sm:text-xl text-gray-600`}></i>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">
                  {item.label}
                </p>
                <p className="text-sm sm:text-base text-gray-900 font-medium truncate">{item.value}</p>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Social Links */}
      <div
        className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 animate-pulse-subtle"
        style={{ animationDelay: '0.6s' }}
      >
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 sm:mb-4">Follow Me</p>
        <div className="flex items-center gap-2 sm:gap-3">
          {contactInfo.socialLinks.map((social) => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.platform}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gray-900 hover:text-white text-gray-600 transition-all cursor-pointer"
            >
              <i className={`${social.icon} text-base sm:text-lg`}></i>
            </a>
          ))}
        </div>
      </div>

      {/* Availability Status */}
      <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-100/50">
        <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
          <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-500"></span>
          </span>
          <p className="text-xs sm:text-sm font-medium text-emerald-700">{contactInfo.availability.label}</p>
        </div>
        <p className="text-xs sm:text-sm text-emerald-600/80 leading-relaxed">
          Currently accepting new projects. Response time is typically within 24 hours.
        </p>
      </div>
    </div>
  );
}
